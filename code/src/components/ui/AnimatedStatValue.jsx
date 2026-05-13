import { useEffect, useMemo, useRef, useState } from 'react'

function parseValue(value, suffix = '') {
  const raw = `${value ?? ''}${suffix ?? ''}`.trim()
  const match = raw.match(/[+-]?\d[\d,]*(?:\.\d+)?/)

  if (!match) {
    return { raw, canAnimate: false }
  }

  const numericText = match[0]
  const start = match.index ?? 0
  const end = start + numericText.length
  const hasExplicitPlus = numericText.startsWith('+')
  const numericValue = Number(numericText.replace(/[+,]/g, ''))
  const decimalPart = numericText.split('.')[1] || ''

  if (!Number.isFinite(numericValue)) {
    return { raw, canAnimate: false }
  }

  return {
    raw,
    canAnimate: true,
    prefix: raw.slice(0, start),
    suffixText: raw.slice(end),
    hasExplicitPlus,
    decimals: decimalPart.length,
    target: numericValue,
    useGrouping: numericText.includes(',') || Math.abs(numericValue) >= 1000,
  }
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3)
}

function formatNumber(value, parsed) {
  const sign = parsed.hasExplicitPlus && value >= 0 ? '+' : ''
  const absoluteValue = parsed.hasExplicitPlus ? Math.abs(value) : value

  return new Intl.NumberFormat('en-US', {
    useGrouping: parsed.useGrouping,
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  }).format(absoluteValue).replace(/^/, sign)
}

export default function AnimatedStatValue({ value, suffix = '', className = '', duration = 1200 }) {
  const ref = useRef(null)
  const frameRef = useRef(null)
  const hasAnimatedRef = useRef(false)
  const parsed = useMemo(() => parseValue(value, suffix), [value, suffix])
  const [displayValue, setDisplayValue] = useState(parsed.canAnimate ? `${parsed.prefix}${formatNumber(0, parsed)}${parsed.suffixText}` : parsed.raw)

  useEffect(() => {
    hasAnimatedRef.current = false
    setDisplayValue(parsed.canAnimate ? `${parsed.prefix}${formatNumber(0, parsed)}${parsed.suffixText}` : parsed.raw)
  }, [parsed])

  useEffect(() => {
    const element = ref.current
    if (!element || !parsed.canAnimate) return undefined

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const showFinalValue = () => {
      setDisplayValue(`${parsed.prefix}${formatNumber(parsed.target, parsed)}${parsed.suffixText}`)
      hasAnimatedRef.current = true
    }

    if (prefersReducedMotion) {
      showFinalValue()
      return undefined
    }

    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true
      const startedAt = performance.now()

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = easeOutCubic(progress)
        const current = parsed.target * eased
        setDisplayValue(`${parsed.prefix}${formatNumber(current, parsed)}${parsed.suffixText}`)

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick)
        } else {
          showFinalValue()
        }
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    const isElementInView = () => {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08
    }

    const handleVisibilityCheck = () => {
      if (isElementInView()) {
        startAnimation()
        window.removeEventListener('scroll', handleVisibilityCheck)
        window.removeEventListener('resize', handleVisibilityCheck)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation()
          observer.disconnect()
          window.removeEventListener('scroll', handleVisibilityCheck)
          window.removeEventListener('resize', handleVisibilityCheck)
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(element)
    window.addEventListener('scroll', handleVisibilityCheck, { passive: true })
    window.addEventListener('resize', handleVisibilityCheck)
    const fallbackTimeout = window.setTimeout(handleVisibilityCheck, 120)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallbackTimeout)
      window.removeEventListener('scroll', handleVisibilityCheck)
      window.removeEventListener('resize', handleVisibilityCheck)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [duration, parsed])

  return (
    <span ref={ref} className={className} aria-label={parsed.raw}>
      {displayValue}
    </span>
  )
}
