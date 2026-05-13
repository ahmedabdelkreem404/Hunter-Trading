export const PAYMENT_METHOD_TYPES = [
  { value: 'instapay', label: 'InstaPay' },
  { value: 'vodafone_cash', label: 'Vodafone Cash' },
  { value: 'bank_transfer', label: 'تحويل بنكي' },
  { value: 'wallet', label: 'محفظة إلكترونية' },
  { value: 'card', label: 'بطاقة بنكية' },
  { value: 'custom', label: 'طريقة مخصصة' },
]

const fallbackLabels = {
  instapay: {
    label_ar: 'InstaPay',
    label_en: 'InstaPay',
    helper_ar: 'حوّل على حساب InstaPay',
    helper_en: 'Transfer to InstaPay account',
    primary_label_ar: 'الحساب أو الرقم',
    primary_label_en: 'Account or number',
    secondary_label_ar: 'اسم الحساب',
    secondary_label_en: 'Account name',
  },
  vodafone_cash: {
    label_ar: 'Vodafone Cash',
    label_en: 'Vodafone Cash',
    helper_ar: 'حوّل على رقم محفظة Vodafone Cash',
    helper_en: 'Transfer to Vodafone Cash wallet',
    primary_label_ar: 'رقم المحفظة',
    primary_label_en: 'Wallet number',
    secondary_label_ar: 'اسم الحساب',
    secondary_label_en: 'Account name',
  },
  bank_transfer: {
    label_ar: 'تحويل بنكي / طرق إضافية',
    label_en: 'Bank transfer / extra method',
    helper_ar: 'استخدم بيانات التحويل التالية',
    helper_en: 'Use the following transfer details',
    primary_label_ar: 'بيانات التحويل',
    primary_label_en: 'Transfer details',
    secondary_label_ar: '',
    secondary_label_en: '',
  },
  custom: {
    label_ar: 'طريقة دفع جديدة',
    label_en: 'New payment method',
    helper_ar: 'استخدم بيانات الدفع التالية',
    helper_en: 'Use the following payment details',
    primary_label_ar: 'بيانات الدفع',
    primary_label_en: 'Payment details',
    secondary_label_ar: 'اسم الحساب',
    secondary_label_en: 'Account name',
  },
}

export function readSetting(settings = {}, key) {
  if (settings?.general?.[key]?.value !== undefined) return settings.general[key].value ?? ''
  if (settings?.[key]?.value !== undefined) return settings[key].value ?? ''
  return settings?.[key] ?? ''
}

export function parsePaymentMethods(value) {
  if (!value || typeof value !== 'string') return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getBase(type = 'custom') {
  return fallbackLabels[type] || fallbackLabels.custom
}

export function normalizePaymentMethod(method = {}, index = 0) {
  const type = method.type || method.method_type || method.id || 'custom'
  const base = getBase(type)

  return {
    id: String(method.id || method.value || `${type}_${index + 1}`).trim(),
    type,
    label_ar: method.label_ar ?? method.label ?? base.label_ar,
    label_en: method.label_en ?? method.label ?? base.label_en,
    helper_ar: method.helper_ar ?? method.helper ?? base.helper_ar,
    helper_en: method.helper_en ?? method.helper ?? base.helper_en,
    primary_label_ar: method.primary_label_ar ?? method.primaryLabelAr ?? base.primary_label_ar,
    primary_label_en: method.primary_label_en ?? method.primaryLabelEn ?? base.primary_label_en,
    primary_value: method.primary_value ?? method.primary ?? method.account_value ?? '',
    secondary_label_ar: method.secondary_label_ar ?? method.secondaryLabelAr ?? base.secondary_label_ar,
    secondary_label_en: method.secondary_label_en ?? method.secondaryLabelEn ?? base.secondary_label_en,
    secondary_value: method.secondary_value ?? method.secondary ?? method.account_name ?? '',
    instructions_ar: method.instructions_ar ?? '',
    instructions_en: method.instructions_en ?? '',
    is_enabled: method.is_enabled === undefined ? true : Boolean(method.is_enabled),
    sort_order: Number(method.sort_order ?? index + 1),
  }
}

export function getLegacyPaymentMethods(settings = {}, includeEmpty = false) {
  const methods = [
    normalizePaymentMethod(
      {
        id: 'instapay',
        type: 'instapay',
        primary_value: readSetting(settings, 'instapay_number'),
        secondary_value: readSetting(settings, 'instapay_account_name'),
        is_enabled: true,
        sort_order: 1,
      },
      0,
    ),
    normalizePaymentMethod(
      {
        id: 'vodafone_cash',
        type: 'vodafone_cash',
        primary_value: readSetting(settings, 'vodafone_cash_number'),
        secondary_value: readSetting(settings, 'vodafone_cash_account_name'),
        is_enabled: true,
        sort_order: 2,
      },
      1,
    ),
    normalizePaymentMethod(
      {
        id: 'bank_transfer',
        type: 'bank_transfer',
        primary_value: readSetting(settings, 'bank_transfer_details'),
        is_enabled: true,
        sort_order: 3,
      },
      2,
    ),
  ]

  return includeEmpty ? methods : methods.filter((method) => method.primary_value || method.secondary_value)
}

export function getStoredPaymentMethods(settings = {}) {
  return parsePaymentMethods(readSetting(settings, 'payment_methods_json'))
    .map(normalizePaymentMethod)
    .sort((a, b) => a.sort_order - b.sort_order)
}

export function getAdminPaymentMethods(settings = {}) {
  const stored = getStoredPaymentMethods(settings)
  return stored.length > 0 ? stored : getLegacyPaymentMethods(settings, true)
}

export function getCheckoutPaymentMethods(settings = {}, isArabic = true) {
  const hasStoredMethods = Boolean(readSetting(settings, 'payment_methods_json'))
  const source = hasStoredMethods ? getStoredPaymentMethods(settings) : getLegacyPaymentMethods(settings, false)
  const methods = source.filter((method) => method.is_enabled)

  if (!hasStoredMethods && methods.length === 0) {
    return getLegacyPaymentMethods(settings, true)
      .slice(0, 2)
      .map((method) => localizePaymentMethod(method, isArabic))
  }

  return methods.map((method) => localizePaymentMethod(method, isArabic))
}

export function localizePaymentMethod(method, isArabic = true) {
  return {
    ...method,
    value: method.id,
    label: isArabic ? method.label_ar || method.label_en : method.label_en || method.label_ar,
    helper: isArabic ? method.helper_ar || method.helper_en : method.helper_en || method.helper_ar,
    primaryLabel: isArabic ? method.primary_label_ar || method.primary_label_en : method.primary_label_en || method.primary_label_ar,
    primary: method.primary_value,
    secondaryLabel: isArabic ? method.secondary_label_ar || method.secondary_label_en : method.secondary_label_en || method.secondary_label_ar,
    secondary: method.secondary_value,
    instructions: isArabic ? method.instructions_ar || method.instructions_en : method.instructions_en || method.instructions_ar,
  }
}

export function createPaymentMethod(index = 0) {
  return normalizePaymentMethod(
    {
      id: `custom_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`,
      type: 'custom',
      sort_order: index + 1,
    },
    index,
  )
}

export function serializePaymentMethods(methods = []) {
  return JSON.stringify(
    methods.map((method, index) => ({
      ...normalizePaymentMethod(method, index),
      sort_order: index + 1,
    })),
  )
}
