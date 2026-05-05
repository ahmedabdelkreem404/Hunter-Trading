export const HOMEPAGE_SECTION_DEFINITIONS = [
  { id: 'hero', sectionKey: 'hero', label: 'الرئيسية', anchor: 'home', showInNav: true },
  { id: 'funded', sectionKey: 'funded', label: 'الحسابات الممولة', anchor: 'funded', showInNav: true },
  { id: 'vip', sectionKey: 'vip', label: 'VIP', anchor: 'vip', showInNav: true },
  { id: 'coach', sectionKey: 'coach', label: 'المدرب', anchor: 'coach', showInNav: false },
  { id: 'testimonials', sectionKey: 'testimonials', label: 'آراء الطلاب', anchor: 'testimonials', showInNav: false },
  { id: 'market', sectionKey: 'market', label: 'تابع السوق', anchor: 'market', showInNav: false },
  { id: 'scalp', sectionKey: 'scalp', label: 'Scalp', anchor: 'scalp', showInNav: true },
  { id: 'courses', sectionKey: 'courses', label: 'كورسات تعليمية', anchor: 'courses', showInNav: true },
  { id: 'offers', sectionKey: 'offers', label: 'العروض', anchor: 'offers', showInNav: true },
]

export const DEFAULT_HOMEPAGE_LAYOUT = HOMEPAGE_SECTION_DEFINITIONS.map((section, index) => ({
  id: section.id,
  enabled: true,
  order: index + 1,
}))

const definitionById = Object.fromEntries(HOMEPAGE_SECTION_DEFINITIONS.map((section) => [section.id, section]))

function hasLegacyLayoutItems(layout) {
  const ids = new Set((Array.isArray(layout) ? layout : []).map((item) => item?.id).filter(Boolean))
  return !ids.has('funded') || !ids.has('courses') || !ids.has('vip')
}

export function parseHomepageLayout(rawValue) {
  if (!rawValue) return DEFAULT_HOMEPAGE_LAYOUT

  try {
    const parsed = typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue
    return normalizeHomepageLayout(parsed)
  } catch {
    return DEFAULT_HOMEPAGE_LAYOUT
  }
}

export function normalizeHomepageLayout(layout) {
  const incoming = Array.isArray(layout) ? layout : []

  if (hasLegacyLayoutItems(incoming)) {
    const enabledById = Object.fromEntries(
      incoming.filter((item) => item && definitionById[item.id]).map((item) => [item.id, item.enabled !== false])
    )

    return DEFAULT_HOMEPAGE_LAYOUT.map((item) => ({
      ...item,
      enabled: enabledById[item.id] ?? true,
    }))
  }

  const seen = new Set()
  const normalized = incoming
    .filter((item) => item && definitionById[item.id] && !seen.has(item.id))
    .map((item, index) => {
      seen.add(item.id)
      return {
        id: item.id,
        enabled: item.enabled !== false,
        order: Number.isFinite(Number(item.order)) ? Number(item.order) : index + 1,
      }
    })

  for (const section of HOMEPAGE_SECTION_DEFINITIONS) {
    if (!seen.has(section.id)) {
      normalized.push({ id: section.id, enabled: true, order: normalized.length + 1 })
    }
  }

  return normalized.sort((a, b) => a.order - b.order).map((item, index) => ({ ...item, order: index + 1 }))
}

export function getHomepageSections(layout) {
  return normalizeHomepageLayout(layout).map((item) => ({ ...item, ...definitionById[item.id] }))
}

export function getVisibleHomepageSections(layout) {
  return getHomepageSections(layout).filter((section) => section.enabled)
}

export function buildHomepageSectionsFromSettings(sectionSettings = []) {
  const settingsByKey = Object.fromEntries((Array.isArray(sectionSettings) ? sectionSettings : []).map((item) => [item.section_key, item]))

  return HOMEPAGE_SECTION_DEFINITIONS
    .map((definition, index) => {
      const setting = settingsByKey[definition.sectionKey] ?? {}
      return {
        ...definition,
        enabled: setting.is_visible !== false && setting.is_visible !== 0,
        order: Number.isFinite(Number(setting.sort_order)) ? Number(setting.sort_order) : index + 1,
      }
    })
    .sort((a, b) => a.order - b.order)
}
