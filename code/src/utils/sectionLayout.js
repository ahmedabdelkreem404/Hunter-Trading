export const HOMEPAGE_SECTION_DEFINITIONS = [
  { id: 'hero', sectionKey: 'hero', label_en: 'Home', label_ar: 'الرئيسية', label: 'Home', anchor: 'home', showInNav: true },
  { id: 'funded', sectionKey: 'funded', label_en: 'Funded Accounts', label_ar: 'الحسابات الممولة', label: 'Funded Accounts', anchor: 'funded', showInNav: true },
  { id: 'vip', sectionKey: 'vip', label_en: 'VIP', label_ar: 'VIP', label: 'VIP', anchor: 'vip', showInNav: true },
  { id: 'coach', sectionKey: 'coach', label_en: 'Coach', label_ar: 'المدرب', label: 'Coach', anchor: 'coach', showInNav: false },
  { id: 'testimonials', sectionKey: 'testimonials', label_en: 'Testimonials', label_ar: 'آراء العملاء', label: 'Testimonials', anchor: 'testimonials', showInNav: false },
  { id: 'market', sectionKey: 'market', label_en: 'Market Watch', label_ar: 'تابع السوق', label: 'Market Watch', anchor: 'market', showInNav: false },
  { id: 'scalp', sectionKey: 'scalp', label_en: 'Scalp', label_ar: 'سكالب', label: 'Scalp', anchor: 'scalp', showInNav: true },
  { id: 'courses', sectionKey: 'courses', label_en: 'Courses', label_ar: 'الدورات', label: 'Courses', anchor: 'courses', showInNav: true },
  { id: 'offers', sectionKey: 'offers', label_en: 'Offers', label_ar: 'العروض', label: 'Offers', anchor: 'offers', showInNav: true },
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
