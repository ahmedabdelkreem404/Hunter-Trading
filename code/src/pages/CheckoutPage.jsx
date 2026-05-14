import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, CheckCircle2, ChevronDown, CreditCard, ExternalLink, ShieldAlert, Smartphone, Upload } from 'lucide-react'
import { checkoutAPI, servicesAPI, settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'
import { getCheckoutPaymentMethods, readSetting } from '../utils/paymentMethods'
import SmartMedia from '../components/ui/SmartMedia'
import { getSafePosterUrl, resolveMediaType } from '../utils/media'

const selectProduct = (response) => response.data ?? null

function textValue(item = {}, isArabic, arKey, enKey) {
  return isArabic ? item[arKey] || item[enKey] : item[enKey] || item[arKey]
}

function hasText(value) {
  return String(value || '').trim().length > 0
}

function normalizeExternalUrl(url = '') {
  const trimmed = String(url || '').trim()
  if (!trimmed) return '#'
  if (/^(https?:|mailto:|tel:|sms:|whatsapp:|tg:|#|\/)/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function sortedLinks(links = []) {
  return [...links].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function visibleLinks(links = []) {
  return sortedLinks(links).filter((link) => link && link.is_visible !== false && hasText(link.url))
}

function uniqueGalleryItems(items = []) {
  const seen = new Set()
  return items.filter((item) => {
    const url = String(item?.media_url || '').trim()
    if (!url || seen.has(url)) return false
    seen.add(url)
    return true
  })
}

function uniqueMediaCandidates(candidates = []) {
  const seen = new Set()
  return candidates.filter((candidate) => {
    const src = String(candidate?.src || '').trim()
    if (!src || seen.has(src)) return false
    seen.add(src)
    return true
  })
}

function CheckoutMedia({ product, title }) {
  const posterUrl = getSafePosterUrl(product.cover_video_poster_url, product.card_video_poster_url, product.thumbnail_url)
  const galleryCandidates = Array.isArray(product.media)
    ? product.media.map((item) => ({
        src: item.media_url,
        type: item.media_type || 'image',
        poster: posterUrl,
      }))
    : []
  const candidates = uniqueMediaCandidates([
    {
      src: product.cover_url,
      type: product.cover_media_type || 'image',
      poster: posterUrl,
    },
    {
      src: product.card_media_url,
      type: product.card_media_type || 'image',
      poster: getSafePosterUrl(product.card_video_poster_url, product.cover_video_poster_url, product.thumbnail_url),
    },
    {
      src: product.thumbnail_url,
      type: 'image',
      poster: '',
    },
    ...galleryCandidates,
    {
      src: posterUrl,
      type: 'image',
      poster: '',
    },
  ])

  if (!candidates.length) return null

  const renderCandidate = (index = 0) => {
    const candidate = candidates[index]
    if (!candidate) return null

    return (
      <SmartMedia
        src={candidate.src}
        type={resolveMediaType(candidate.src, candidate.type)}
        alt={title}
        poster={candidate.poster}
        className="mb-6 aspect-[16/9] w-full rounded-[1.5rem] border border-white/10 bg-black/20 object-contain p-2"
        iframeClassName="mb-6 aspect-[16/9] w-full rounded-[1.5rem] border border-white/10 bg-black/20"
        autoPlay
        muted
        loop
        controls={false}
        fallback={renderCandidate(index + 1)}
      />
    )
  }

  return renderCandidate()
}

function buildCheckoutGalleryItems(product) {
  if (!product) return []

  const posterUrl = getSafePosterUrl(product.cover_video_poster_url, product.card_video_poster_url, product.thumbnail_url)
  const items = []
  const pushItem = (item, source, index = 0) => {
    const mediaUrl = String(item?.media_url || item?.src || '').trim()
    if (!mediaUrl) return

    items.push({
      id: item.id || `${source}-${index}`,
      media_url: mediaUrl,
      media_type: resolveMediaType(mediaUrl, item.media_type || item.type || 'image'),
      alt_text_en: item.alt_text_en || item.alt || product.title_en || '',
      alt_text_ar: item.alt_text_ar || item.alt || product.title_ar || '',
      sort_order: Number(item.sort_order ?? index),
      poster_url: item.poster_url || posterUrl,
      source,
    })
  }

  if (Array.isArray(product.media)) {
    product.media.forEach((item, index) => pushItem(item, 'gallery', index))
  }

  pushItem(
    {
      media_url: product.cover_url,
      media_type: product.cover_media_type || 'image',
      poster_url: getSafePosterUrl(product.cover_video_poster_url, product.card_video_poster_url, product.thumbnail_url),
      alt_text_en: product.title_en,
      alt_text_ar: product.title_ar,
      sort_order: 1000,
    },
    'cover',
  )
  pushItem(
    {
      media_url: product.card_media_url,
      media_type: product.card_media_type || 'image',
      poster_url: getSafePosterUrl(product.card_video_poster_url, product.cover_video_poster_url, product.thumbnail_url),
      alt_text_en: product.title_en,
      alt_text_ar: product.title_ar,
      sort_order: 1001,
    },
    'card',
  )
  pushItem(
    {
      media_url: product.thumbnail_url,
      media_type: 'image',
      alt_text_en: product.title_en,
      alt_text_ar: product.title_ar,
      sort_order: 1002,
    },
    'thumbnail',
  )

  return items.sort((a, b) => a.sort_order - b.sort_order)
}

function CheckoutInfoBlock({ title, children }) {
  if (!children) return null

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-[0_16px_42px_rgba(0,0,0,0.16)] transition hover:border-white/15 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <h2 className="font-heading text-lg font-bold leading-tight text-hunter-text sm:text-xl">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function CheckoutGallery({ items, title, isArabic }) {
  const uniqueItems = uniqueGalleryItems(items)
  if (!uniqueItems.length) return null

  return (
    <CheckoutInfoBlock title={title}>
      <div className={`grid gap-3 ${uniqueItems.length === 1 ? 'mx-auto max-w-sm' : 'grid-cols-2 xl:grid-cols-3'}`}>
        {uniqueItems.map((item) => (
          <SmartMedia
            key={item.id || item.media_url}
            src={item.media_url}
            type={resolveMediaType(item.media_url, item.media_type || 'image')}
            alt={textValue(item, isArabic, 'alt_text_ar', 'alt_text_en') || title}
            poster={item.poster_url}
            className="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-black/20 object-contain p-2"
            iframeClassName="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-black/20"
            autoPlay
            muted
            loop
            controls={false}
          />
        ))}
      </div>
    </CheckoutInfoBlock>
  )
}

function CheckoutImportantLinks({ links, isArabic }) {
  if (!links.length) return null

  return (
    <CheckoutInfoBlock title={isArabic ? 'أزرار وروابط مهمة' : 'Important buttons and links'}>
      <div className="grid gap-3">
        {links.map((link, index) => {
          const label = textValue(link, isArabic, 'label_ar', 'label_en') || link.url
          const href = normalizeExternalUrl(link.url)
          const isExternal = /^(https?:|mailto:|tel:|sms:|whatsapp:|tg:)/i.test(href)

          return (
            <a
              key={`${link.url}-${index}`}
              href={href}
              target={link.new_tab === false || !isExternal ? undefined : '_blank'}
              rel={link.new_tab === false || !isExternal ? undefined : 'noreferrer'}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-hunter-green/20 bg-hunter-green/10 px-4 py-3 text-center font-bold text-hunter-green transition hover:border-hunter-green/45 hover:bg-hunter-green/15"
            >
              <span className="min-w-0 break-words leading-6">{label}</span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          )
        })}
      </div>
    </CheckoutInfoBlock>
  )
}

export default function CheckoutPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: product } = useApiData(
    () => servicesAPI.getBySlug(slug),
    null,
    selectProduct,
    [slug],
    { peek: () => servicesAPI.peekBySlug(slug) }
  )
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    payment_method: 'instapay',
  })
  const [screenshot, setScreenshot] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [methodOpen, setMethodOpen] = useState(false)
  const [acceptedDetails, setAcceptedDetails] = useState(false)

  const getSetting = (key) => readSetting(settings, key)
  const paymentInstructions = isArabic
    ? getSetting('payment_instructions_ar') || getSetting('payment_instructions_en')
    : getSetting('payment_instructions_en') || getSetting('payment_instructions_ar')
  const paymentMethods = useMemo(() => {
    const icons = {
      instapay: Smartphone,
      vodafone_cash: CreditCard,
      bank_transfer: CreditCard,
      wallet: Smartphone,
      card: CreditCard,
      custom: CreditCard,
    }

    return getCheckoutPaymentMethods(settings, isArabic).map((method) => ({
      ...method,
      Icon: icons[method.type] || CreditCard,
    }))
  }, [isArabic, settings])
  const selectedPaymentMethod = paymentMethods.find((method) => method.value === form.payment_method) || paymentMethods[0]
  const productTitle = product ? textValue(product, isArabic, 'title_ar', 'title_en') : ''
  const productDescription = product
    ? (isArabic
      ? product.full_description_ar || product.short_description_ar || product.full_description_en || product.short_description_en
      : product.full_description_en || product.short_description_en || product.full_description_ar || product.short_description_ar)
    : ''
  const features = Array.isArray(product?.features)
    ? product.features.filter((feature) => hasText(textValue(feature, isArabic, 'label_ar', 'label_en')))
    : []
  const steps = Array.isArray(product?.steps)
    ? product.steps.filter((step) => (
      hasText(textValue(step, isArabic, 'title_ar', 'title_en')) ||
      hasText(textValue(step, isArabic, 'description_ar', 'description_en'))
    ))
    : []
  const faqs = Array.isArray(product?.faqs)
    ? product.faqs.filter((faq) => hasText(textValue(faq, isArabic, 'question_ar', 'question_en')))
    : []
  const gallery = buildCheckoutGalleryItems(product)
  const termsTitle = product ? textValue(product, isArabic, 'terms_title_ar', 'terms_title_en') : ''
  const termsContent = product ? textValue(product, isArabic, 'terms_content_ar', 'terms_content_en') : ''
  const riskWarning = product ? textValue(product, isArabic, 'risk_warning_ar', 'risk_warning_en') : ''
  const importantLinks = Array.isArray(product?.important_links) ? visibleLinks(product.important_links) : []
  const hasPrePaymentDetails = Boolean(productDescription || features.length || steps.length || faqs.length || gallery.length || termsContent || riskWarning || importantLinks.length)

  useEffect(() => {
    if (selectedPaymentMethod && selectedPaymentMethod.value !== form.payment_method) {
      setForm((current) => ({ ...current, payment_method: selectedPaymentMethod.value }))
    }
  }, [form.payment_method, selectedPaymentMethod])

  const submitOrder = async (event) => {
    event.preventDefault()
    if (!product) return
    if (!selectedPaymentMethod) {
      setError(isArabic ? 'من فضلك فعّل طريقة دفع واحدة على الأقل من لوحة التحكم.' : 'Please enable at least one payment method from the dashboard.')
      return
    }
    if (hasPrePaymentDetails && !acceptedDetails) {
      setError(isArabic ? 'من فضلك اقرأ تفاصيل المنتج والشروط ثم فعّل مربع التأكيد قبل إرسال الطلب.' : 'Please review the product details and terms, then confirm before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const payload = new FormData()
      payload.append('service_id', String(product.id))
      payload.append('customer_name', form.customer_name)
      payload.append('customer_email', form.customer_email)
      payload.append('customer_phone', form.customer_phone)
      payload.append('payment_method', form.payment_method)
      if (screenshot) {
        payload.append('screenshot', screenshot)
      }

      const response = await checkoutAPI.submitOrder(payload)
      setSuccess(response.data)

      if (response.data?.redirect_url) {
        window.setTimeout(() => {
          window.location.href = response.data.redirect_url
        }, 2500)
      }
    } catch (err) {
      setError(err.message || 'Failed to submit order')
    } finally {
      setSubmitting(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
            <ArrowLeft className="h-4 w-4" />
            {isArabic ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </div>
      </div>
    )
  }

  if (product.type === 'scalp') {
    return <Navigate to={`/services/${product.slug}`} replace />
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(186,36,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex justify-start">
        <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-hunter-text-muted transition hover:border-hunter-green/35 hover:bg-white/[0.06] hover:text-hunter-green">
          <ArrowLeft className="h-4 w-4" />
          {isArabic ? 'العودة للرئيسية' : 'Back to home'}
        </Link>
        </div>

        <div className="grid w-full min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.82fr)] xl:grid-cols-[minmax(0,1.12fr)_minmax(24rem,0.78fr)]">
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-hunter-card/95 p-4 shadow-2xl shadow-black/20 sm:p-6 xl:p-7">
            <CheckoutMedia product={product} title={productTitle} />
            <div className="text-center">
              <h1 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">
                {productTitle}
              </h1>
              {productDescription ? (
                <p className="mx-auto mt-4 max-w-2xl whitespace-pre-wrap text-base leading-8 text-hunter-text-muted sm:text-lg">
                  {productDescription}
                </p>
              ) : null}
              <div className="mt-5 text-3xl font-heading font-bold text-hunter-green sm:text-4xl">
                {product.currency === 'USD' ? '$' : `${product.currency || ''} `}{Number(product.price ?? 0).toFixed(0)}
              </div>
            </div>

            <div className="mt-7 space-y-4 sm:space-y-5">
              {features.length > 0 ? (
                <CheckoutInfoBlock title={isArabic ? 'المميزات' : 'Features'}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {features.map((feature) => (
                      <div key={feature.id || feature.label_ar || feature.label_en} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-hunter-green" />
                        <span className="leading-7 text-hunter-text-muted">{textValue(feature, isArabic, 'label_ar', 'label_en')}</span>
                      </div>
                    ))}
                  </div>
                </CheckoutInfoBlock>
              ) : null}

              <CheckoutGallery items={gallery} title={isArabic ? 'معرض المنتج' : 'Product media'} isArabic={isArabic} />

              {steps.length > 0 ? (
                <CheckoutInfoBlock title={isArabic ? 'خطوات التنفيذ' : 'Steps'}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {steps.map((step, index) => (
                      <div key={step.id || index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                        <div className="text-sm font-bold text-hunter-green">{String(index + 1).padStart(2, '0')}</div>
                        {textValue(step, isArabic, 'title_ar', 'title_en') ? (
                          <h3 className="mt-1 font-bold text-hunter-text">{textValue(step, isArabic, 'title_ar', 'title_en')}</h3>
                        ) : null}
                        {textValue(step, isArabic, 'description_ar', 'description_en') ? (
                          <p className="mt-1 whitespace-pre-wrap leading-7 text-hunter-text-muted">{textValue(step, isArabic, 'description_ar', 'description_en')}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CheckoutInfoBlock>
              ) : null}

              {termsContent || riskWarning ? (
                <CheckoutInfoBlock title={termsTitle || (isArabic ? 'الشروط والتنبيهات قبل الدفع' : 'Terms before payment')}>
                  {termsContent ? <p className="whitespace-pre-wrap leading-8 text-hunter-text-muted">{termsContent}</p> : null}
                  {riskWarning ? (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 text-amber-100 sm:p-4">
                      <ShieldAlert className="mt-1 h-5 w-5 shrink-0" />
                      <span className="whitespace-pre-wrap leading-7">{riskWarning}</span>
                    </div>
                  ) : null}
                </CheckoutInfoBlock>
              ) : null}

              <CheckoutImportantLinks links={importantLinks} isArabic={isArabic} />

              {faqs.length > 0 ? (
                <CheckoutInfoBlock title={isArabic ? 'الأسئلة الشائعة' : 'FAQs'}>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <details key={faq.id || faq.question_ar || faq.question_en} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-hunter-green/25 sm:p-4">
                        <summary className="cursor-pointer list-none font-bold leading-7 text-hunter-text">
                          {textValue(faq, isArabic, 'question_ar', 'question_en')}
                        </summary>
                        {textValue(faq, isArabic, 'answer_ar', 'answer_en') ? (
                          <p className="mt-2 whitespace-pre-wrap leading-7 text-hunter-text-muted">
                            {textValue(faq, isArabic, 'answer_ar', 'answer_en')}
                          </p>
                        ) : null}
                      </details>
                    ))}
                  </div>
                </CheckoutInfoBlock>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-hunter-card/95 p-4 shadow-2xl shadow-black/20 sm:p-6 lg:sticky lg:top-28 xl:p-7">
            {success ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-hunter-green" />
                <h2 className="mt-4 text-2xl font-heading font-bold">
                  {isArabic ? 'تم استلام طلبك بنجاح' : 'Your order was received successfully'}
                </h2>
                <p className="mt-3 leading-7 text-hunter-text-muted">
                  {isArabic
                    ? 'تم إرسال إشعار على بريدك الإداري. سيتم تحويلك الآن إلى وسيلة التواصل المحددة لمتابعة الطلب.'
                    : 'An admin email notification was sent. You will now be redirected to your configured contact link.'}
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={submitOrder}>
                <h2 className="text-2xl font-heading font-bold">
                  {isArabic ? 'إكمال الدفع' : 'Complete Payment'}
                </h2>
                <p className="text-hunter-text-muted">
                  {paymentInstructions || (isArabic
                    ? 'حوّل المبلغ، ارفع الاسكرين شوت، وسنراجع الطلب يدويًا.'
                    : 'Send the payment, upload the screenshot, and we will review the order manually.')}
                </p>

                <input
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder={isArabic ? 'الاسم' : 'Name'}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-hunter-text outline-none transition placeholder:text-hunter-text-muted/70 hover:border-hunter-green/25 hover:bg-white/[0.07] focus:border-hunter-green/55 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(186,36,255,0.12)]"
                  required
                />
                <input
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  placeholder={isArabic ? 'البريد الإلكتروني' : 'Email'}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-hunter-text outline-none transition placeholder:text-hunter-text-muted/70 hover:border-hunter-green/25 hover:bg-white/[0.07] focus:border-hunter-green/55 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(186,36,255,0.12)]"
                  required
                />
                <input
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  placeholder={isArabic ? 'رقم الهاتف أو واتساب' : 'Phone or WhatsApp'}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-hunter-text outline-none transition placeholder:text-hunter-text-muted/70 hover:border-hunter-green/25 hover:bg-white/[0.07] focus:border-hunter-green/55 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(186,36,255,0.12)]"
                />

                <div className="space-y-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMethodOpen((current) => !current)}
                      disabled={paymentMethods.length === 0}
                      className="flex w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-2xl border border-hunter-green/45 bg-white/5 px-3 py-3 text-start shadow-[0_0_0_1px_rgba(186,36,255,0.2)] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                      aria-expanded={methodOpen}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        {selectedPaymentMethod?.Icon ? <selectedPaymentMethod.Icon className="h-5 w-5 shrink-0 text-hunter-green" /> : null}
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-hunter-text">
                            {selectedPaymentMethod?.label || (isArabic ? 'لا توجد طريقة دفع مفعلة' : 'No active payment method')}
                          </span>
                          <span className="block truncate text-xs text-hunter-text-muted">
                            {selectedPaymentMethod?.helper || (isArabic ? 'فعّل أو أضف طريقة دفع من لوحة التحكم' : 'Enable or add a payment method from the dashboard')}
                          </span>
                        </span>
                      </span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-hunter-text-muted transition ${methodOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {methodOpen ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#151520] shadow-2xl shadow-black/40">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, payment_method: method.value })
                              setMethodOpen(false)
                            }}
                            className={`flex w-full min-w-0 items-center justify-between gap-3 px-3 py-3 text-start transition hover:bg-white/[0.08] sm:px-4 ${
                              method.value === form.payment_method ? 'bg-hunter-green/10 text-hunter-green' : 'text-hunter-text'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <method.Icon className="h-5 w-5 shrink-0" />
                              <span className="min-w-0">
                                <span className="block truncate font-semibold">{method.label}</span>
                                <span className="block truncate text-xs text-hunter-text-muted">{method.helper}</span>
                              </span>
                            </span>
                            {method.value === form.payment_method ? <Check className="h-4 w-4 shrink-0" /> : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {selectedPaymentMethod ? (
                    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-hunter-green/20 bg-hunter-green/10 p-3 text-start sm:p-4">
                      <div className="flex min-w-0 items-start gap-3 text-hunter-green">
                        <selectedPaymentMethod.Icon className="mt-0.5 h-5 w-5 shrink-0" />
                        <div className="min-w-0">
                          <div className="break-words text-sm font-semibold leading-6 [overflow-wrap:anywhere] sm:text-base" dir="auto">{selectedPaymentMethod.helper}</div>
                          {selectedPaymentMethod.instructions ? (
                            <div className="mt-1 break-words text-xs leading-5 text-hunter-text-muted [overflow-wrap:anywhere] sm:text-sm">{selectedPaymentMethod.instructions}</div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-3 min-w-0 overflow-hidden rounded-xl border border-white/10 bg-hunter-bg/70 p-3">
                        {selectedPaymentMethod.primaryLabel ? (
                          <div className="mb-1 break-words text-[11px] font-medium text-hunter-text-muted [overflow-wrap:anywhere] sm:text-xs">{selectedPaymentMethod.primaryLabel}</div>
                        ) : null}
                        <div className="whitespace-pre-wrap break-words text-sm font-bold leading-7 text-hunter-text [overflow-wrap:anywhere] sm:text-base">
                          {selectedPaymentMethod.primary || (isArabic ? 'لم يتم ضبط بيانات الدفع بعد' : 'Payment details are not configured yet')}
                        </div>
                      </div>

                      {selectedPaymentMethod.secondary ? (
                        <div className="mt-2 min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3">
                          <div className="mb-1 break-words text-[11px] font-medium text-hunter-text-muted [overflow-wrap:anywhere] sm:text-xs">
                            {selectedPaymentMethod.secondaryLabel || (isArabic ? 'اسم الحساب' : 'Account name')}
                          </div>
                          <div className="break-words text-sm font-semibold text-hunter-text [overflow-wrap:anywhere] sm:text-base">{selectedPaymentMethod.secondary}</div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
                      {isArabic ? 'لا توجد طرق دفع مفعلة حالياً. أضف أو فعّل طريقة دفع من لوحة التحكم.' : 'No payment methods are active. Add or enable a payment method from the dashboard.'}
                    </div>
                  )}
                </div>

                <label htmlFor="payment-screenshot" className="block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-hunter-text-muted transition hover:border-hunter-green/45 hover:bg-white/[0.08]">
                  <div className="mb-3 flex items-center gap-2 text-hunter-green">
                    <Upload className="h-4 w-4" />
                    <span>{isArabic ? 'ارفع اسكرين شوت التحويل' : 'Upload payment screenshot'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-hunter-bg/70 px-3 py-2">
                    <span className="min-w-0 truncate text-sm text-hunter-text-muted">
                      {screenshot?.name || (isArabic ? 'لم يتم اختيار صورة بعد' : 'No screenshot selected')}
                    </span>
                    <span className="shrink-0 rounded-lg bg-hunter-green px-3 py-1.5 text-xs font-semibold text-hunter-bg">
                      {isArabic ? 'اختيار صورة' : 'Choose image'}
                    </span>
                  </div>
                  <input id="payment-screenshot" type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} className="sr-only" />
                </label>

                {hasPrePaymentDetails ? (
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-hunter-text-muted transition hover:border-hunter-green/35 hover:bg-white/[0.07]">
                    <input
                      type="checkbox"
                      checked={acceptedDetails}
                      onChange={(event) => setAcceptedDetails(event.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-hunter-green"
                    />
                    <span>
                      {isArabic
                        ? 'قرأت تفاصيل المنتج والشروط والتنبيهات الظاهرة قبل الدفع، وأوافق على إرسال الطلب بناءً عليها.'
                        : 'I reviewed the product details, terms, and warnings shown before payment, and I agree to submit the order based on them.'}
                    </span>
                  </label>
                ) : null}

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || paymentMethods.length === 0}
                  className="min-h-12 w-full rounded-2xl bg-gradient-to-l from-fuchsia-600 via-violet-500 to-blue-500 px-5 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5 hover:shadow-fuchsia-500/30 disabled:translate-y-0 disabled:opacity-60"
                >
                  {submitting
                    ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting...')
                    : (isArabic ? 'إرسال الطلب' : 'Submit Order')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
