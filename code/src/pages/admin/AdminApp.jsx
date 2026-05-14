import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CreditCard,
  Image,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Languages,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  TrendingUp,
  UserSquare2,
  Users,
  X,
} from 'lucide-react'
import { adminAPI, authAPI, notifyPublicContentChanged, setCsrfToken } from '../../api'
import DashboardOverviewModule from './modules/DashboardOverviewModule'
import SectionOrderModule from './modules/SectionOrderModule'
import WebsiteContentModule from './modules/WebsiteContentModule'
import ServicesModule from './modules/ServicesModule'
import ServiceSectionModule from './modules/ServiceSectionModule'
import PaymentOrdersModule from './modules/PaymentOrdersModule'
import PaymentSettingsModule from './modules/PaymentSettingsModule'
import TestimonialsModule from './modules/TestimonialsModule'
import MarketModule from './modules/MarketModule'
import CoachSocialModule from './modules/CoachSocialModule'
import SettingsModule from './modules/SettingsModule'
import MediaLibraryModule from './modules/MediaLibraryModule'
import LeadsModule from './modules/LeadsModule'
import TranslationsModule from './modules/TranslationsModule'
import { AdminFieldLanguageProvider, DeleteConfirmDialog, confirmDelete } from './modules/shared/AdminUI'

const emptyService = {
  type: 'vip',
  slug: '',
  title_en: '',
  title_ar: '',
  subtitle_en: '',
  subtitle_ar: '',
  short_description_en: '',
  short_description_ar: '',
  full_description_en: '',
  full_description_ar: '',
  price: 0,
  compare_price: '',
  currency: 'USD',
  cta_label_en: '',
  cta_label_ar: 'اشتر الآن',
  cta_url: '',
  cta_action: 'checkout',
  referral_url: '',
  broker_name: '',
  broker_url: '',
  badge_text_en: '',
  badge_text_ar: '',
  thumbnail_url: '',
  cover_url: '',
  cover_media_type: 'image',
  cover_video_poster_url: '',
  cover_video_autoplay: true,
  cover_video_muted: true,
  cover_video_loop: true,
  cover_video_controls: false,
  card_media_type: 'image',
  card_media_url: '',
  card_video_poster_url: '',
  card_video_autoplay: true,
  card_video_muted: true,
  card_video_loop: true,
  card_video_controls: false,
  offer_starts_at: '',
  offer_ends_at: '',
  terms_title_en: '',
  terms_title_ar: '',
  terms_content_en: '',
  terms_content_ar: '',
  risk_warning_en: '',
  risk_warning_ar: '',
  important_links: [{ label_en: '', label_ar: '', url: '', is_visible: true, new_tab: true, sort_order: 1 }],
  details_button_label_en: '',
  details_button_label_ar: 'التفاصيل',
  final_cta_label_en: '',
  final_cta_label_ar: 'متابعة',
  sort_order: 0,
  is_visible: true,
  is_featured: false,
  features: [{ label_en: '', label_ar: '' }],
  steps: [{ title_en: '', title_ar: '', description_en: '', description_ar: '' }],
  faqs: [{ question_en: '', question_ar: '', answer_en: '', answer_ar: '' }],
  media: [{ media_url: '', media_type: 'image', alt_text_en: '', alt_text_ar: '' }],
}

const emptyTestimonial = {
  name: '',
  location: '',
  image_url: '',
  video_url: '',
  content_en: '',
  content_ar: '',
  rating: 5,
  service_type: '',
  service_id: '',
  order_index: 0,
  is_visible: true,
  is_approved: true,
  is_featured: false,
}

const emptyMarketUpdate = {
  title_en: '',
  title_ar: '',
  summary_en: '',
  summary_ar: '',
  content_en: '',
  content_ar: '',
  category: 'analysis',
  image_url: '',
  author_name: '',
  published_at: '',
  sort_order: 0,
  is_pinned: false,
  is_visible: true,
  is_featured: false,
}

const defaultCoach = {
  name_en: '',
  name_ar: '',
  title_en: '',
  title_ar: '',
  bio_en: '',
  bio_ar: '',
  image_url: '',
  experience_years: 0,
  students_count: 0,
  profit_shared: '',
}

const defaultSettings = {
  website_name: '',
  default_language: 'ar',
  support_email: '',
  telegram_url: '',
  whatsapp_url: '',
  instapay_number: '',
  instapay_account_name: '',
  vodafone_cash_number: '',
  vodafone_cash_account_name: '',
  bank_transfer_details: '',
  payment_methods_json: '',
  payment_instructions_ar: '',
  payment_instructions_en: '',
  instagram_url: '',
  youtube_url: '',
  facebook_url: '',
  twitter_url: '',
  tiktok_url: '',
  linkedin_url: '',
  telegram_enabled: '',
  whatsapp_enabled: '',
  instagram_enabled: '',
  youtube_enabled: '',
  tiktok_enabled: '',
  facebook_enabled: '',
  twitter_enabled: '',
  linkedin_enabled: '',
  location: '',
  footer_description: '',
  footer_description_ar: '',
  footer_description_en: '',
  privacy_policy_title: '',
  privacy_policy_content: '',
  privacy_policy_title_ar: '',
  privacy_policy_title_en: '',
  privacy_policy_content_ar: '',
  privacy_policy_content_en: '',
  terms_title: '',
  terms_content: '',
  terms_title_ar: '',
  terms_title_en: '',
  terms_content_ar: '',
  terms_content_en: '',
  risk_disclaimer_title_ar: '',
  risk_disclaimer_title_en: '',
  risk_disclaimer_content_ar: '',
  risk_disclaimer_content_en: '',
  risk_warning_title: '',
  risk_warning_content: '',
  risk_warning_title_ar: '',
  risk_warning_title_en: '',
  risk_warning_content_ar: '',
  risk_warning_content_en: '',
  site_logo: '',
  primary_color: '#00ff88',
  primary_color_strong: '#00cc6a',
  accent_blue: '#0066ff',
  accent_orange: '#ff6b35',
  accent_orange_strong: '#ff8c42',
  background_dark: '#0a0a0f',
  card_dark: '#12121a',
  text_dark: '#ffffff',
  text_muted_dark: '#8a8a9a',
  product_card_shell_bg: '#0a0a0f',
  product_card_surface_bg: '#12121a',
  product_card_border_color: '#2a2a36',
  product_card_title_color: '#ffffff',
  product_card_body_color: '#9ca3af',
  product_card_button_text_color: '#050509',
}

const serviceTabConfigs = [
  {
    id: 'funded',
    type: 'funded',
    label: 'الحسابات الممولة',
    description: 'تحكم في سكشن الحسابات الممولة والكروت والأسعار والمميزات وصفحة التفاصيل.',
  },
  {
    id: 'vip',
    type: 'vip',
    label: 'VIP',
    description: 'تحكم في سكشن VIP والباقات والوسائط والأسعار وروابط الشراء.',
  },
  {
    id: 'scalp',
    type: 'scalp',
    label: 'السكالب',
    description: 'تحكم في شرح السكالب ومنصات GTC وValtex والريفيرال والشروط بدون دفع داخلي إلا إذا اخترت ذلك.',
  },
  {
    id: 'courses',
    type: 'courses',
    label: 'الدورات',
    description: 'تحكم في سكشن الدورات والكورسات ومحتوى كل دورة ووسائطها.',
  },
  {
    id: 'offers',
    type: 'offers',
    label: 'العروض',
    description: 'تحكم في العروض ومواعيد البداية والنهاية والكروت والصفحات التفصيلية.',
  },
]

const tabs = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, group: 'عام', description: 'ملخص سريع للطلبات والعملاء والخدمات.' },
  { id: 'section-order', label: 'ترتيب السكشنات', icon: ListOrdered, group: 'الموقع', description: 'ترتيب كل سكشن وإظهاره أو إخفاؤه من مكان واحد.' },
  { id: 'home', label: 'الرئيسية', icon: Package, group: 'الموقع', description: 'الهيرو، فيديو الخلفية، الإحصائيات، النافبار والفوتر.' },
  ...serviceTabConfigs.map((tab) => ({ ...tab, icon: Package, group: 'سكشنات الخدمات' })),
  { id: 'payment-settings', label: 'إعدادات الدفع', icon: CreditCard, group: 'الدفع والعملاء', description: 'أرقام التحويل ورسائل وتعليمات الدفع التي تظهر للعميل.' },
  { id: 'orders', label: 'طلبات الدفع', icon: CreditCard, group: 'الدفع والعملاء', description: 'مراجعة من دفع، حالة الطلب، الإيصال، ورابط التحويل بعد الموافقة.' },
  { id: 'leads', label: 'العملاء المحتملون', icon: Users, group: 'الدفع والعملاء', description: 'كل بيانات العملاء المرسلة من الموقع.' },
  { id: 'settings', label: 'إعدادات الموقع', icon: Settings, group: 'إعدادات وإضافات', description: 'اللوجو، الألوان، السوشيال، القانوني والفوتر.' },
  { id: 'translations', label: 'الترجمات', icon: Languages, group: 'إعدادات وإضافات', description: 'ترجمة كل المحتوى العربي إلى الإنجليزية من مكان واحد.' },
  { id: 'media', label: 'مكتبة الوسائط', icon: Image, group: 'إعدادات وإضافات', description: 'رفع الصور والفيديوهات واستخدامها في أي سكشن.' },
  { id: 'coach', label: 'المدرب', icon: UserSquare2, group: 'إعدادات وإضافات', description: 'بيانات المدرب وصورته ومحتوى سكشن الكوتش.' },
  { id: 'testimonials', label: 'آراء العملاء', icon: MessageSquareQuote, group: 'إعدادات وإضافات', description: 'إضافة وتعديل آراء العملاء المرتبطة بالخدمات.' },
  { id: 'market', label: 'متابعة السوق', icon: TrendingUp, group: 'إعدادات وإضافات', description: 'تحديثات وتحليلات السوق الظاهرة في الموقع.' },
]

const sidebarGroups = ['عام', 'الموقع', 'سكشنات الخدمات', 'الدفع والعملاء', 'إعدادات وإضافات']

function toDateTimeLocal(value) {
  if (!value) return ''
  return String(value).replace(' ', 'T').slice(0, 16)
}

function fromDateTimeLocal(value) {
  if (!value) return null
  return value.includes('T') ? `${value.replace('T', ' ')}:00` : value
}

function buildServiceMediaPatch(uploadedUrl, mediaType, target = 'card_media_url') {
  const mediaPatchByTarget = {
    card_media_url: {
      card_media_url: uploadedUrl,
      card_media_type: mediaType,
      ...(mediaType === 'image' ? { thumbnail_url: uploadedUrl } : {}),
    },
    card_video_poster_url: { card_video_poster_url: uploadedUrl },
    cover_url: {
      cover_url: uploadedUrl,
      cover_media_type: mediaType,
    },
    cover_video_poster_url: { cover_video_poster_url: uploadedUrl },
  }

  return mediaPatchByTarget[target] || mediaPatchByTarget.card_media_url
}

function updateRelationItem(list, index, changes) {
  const next = Array.isArray(list) ? [...list] : []
  while (next.length <= index) {
    next.push({})
  }
  next[index] = { ...next[index], ...changes }
  return next
}

function mapSettings(response) {
  const general = response.data?.general ?? {}
  return {
    ...defaultSettings,
    ...Object.fromEntries(Object.entries(general).map(([key, value]) => [key, value?.value ?? ''])),
  }
}

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainScrollRef = useRef(null)
  const mainContentRef = useRef(null)
  const [booting, setBooting] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState('')
  const [message, setMessage] = useState('')

  const [dashboard, setDashboard] = useState({ stats: {}, recent_leads: [], recent_orders: [] })
  const [sections, setSections] = useState([])
  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [marketUpdates, setMarketUpdates] = useState([])
  const [coach, setCoach] = useState(defaultCoach)
  const [coachImageFile, setCoachImageFile] = useState(null)
  const [siteSettings, setSiteSettings] = useState(defaultSettings)
  const [siteLogoFile, setSiteLogoFile] = useState(null)
  const [media, setMedia] = useState([])
  const [mediaUploadFile, setMediaUploadFile] = useState(null)
  const [leads, setLeads] = useState([])

  const [serviceDraft, setServiceDraft] = useState(emptyService)
  const [serviceImageFile, setServiceImageFile] = useState(null)
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all')
  const [testimonialDraft, setTestimonialDraft] = useState(emptyTestimonial)
  const [testimonialImageFile, setTestimonialImageFile] = useState(null)
  const [marketDraft, setMarketDraft] = useState(emptyMarketUpdate)
  const [marketImageFile, setMarketImageFile] = useState(null)

  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]
  const activeServiceTab = serviceTabConfigs.find((tab) => tab.id === activeTab)
  const pendingOrders = useMemo(() => orders.filter((order) => String(order.status || 'pending') === 'pending').length, [orders])

  const clampMainScroll = useCallback(() => {
    const main = mainScrollRef.current
    if (!main) return

    const maxScrollTop = Math.max(0, main.scrollHeight - main.clientHeight)
    if (main.scrollTop > maxScrollTop) {
      main.scrollTop = maxScrollTop
    }
  }, [])

  const scrollMainToTop = useCallback(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0
      mainScrollRef.current.scrollLeft = 0
    }

    window.requestAnimationFrame(() => {
      mainScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      window.requestAnimationFrame(clampMainScroll)
    })
  }, [clampMainScroll])

  useEffect(() => {
    scrollMainToTop()
  }, [activeTab, scrollMainToTop])

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(clampMainScroll)
    })
  })

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const main = mainScrollRef.current
    const content = mainContentRef.current
    if (!main || typeof ResizeObserver === 'undefined') {
      return () => {
        document.body.style.overflow = previousBodyOverflow
        document.documentElement.style.overflow = previousHtmlOverflow
      }
    }

    const scheduleClamp = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(clampMainScroll)
      })
    }

    const observer = new ResizeObserver(scheduleClamp)
    observer.observe(main)
    if (content) observer.observe(content)
    window.addEventListener('resize', scheduleClamp)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', scheduleClamp)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [clampMainScroll])

  const selectAdminTab = (tabId) => {
    setSidebarOpen(false)
    if (tabId === activeTab) {
      scrollMainToTop()
      return
    }
    setActiveTab(tabId)
  }

  const redirectToLogin = () => {
    window.location.href = '/admin/login'
  }

  const setFlash = (text) => {
    setMessage(text)
    window.clearTimeout(window.__hunterAdminFlash)
    window.__hunterAdminFlash = window.setTimeout(() => setMessage(''), 2500)
  }

  const publishPublicUpdate = (scope) => {
    notifyPublicContentChanged({ scope })
  }

  const handleError = (error, fallbackMessage) => {
    if (error?.message === 'Unauthorized') {
      redirectToLogin()
      return
    }
    setFlash(error?.message || fallbackMessage)
  }

  const refreshServices = async () => {
    const response = await adminAPI.getServices()
    setServices((response.data ?? []).map((service) => ({
      ...service,
      offer_starts_at: toDateTimeLocal(service.offer_starts_at),
      offer_ends_at: toDateTimeLocal(service.offer_ends_at),
    })))
  }

  const refreshOrders = async () => {
    const response = await adminAPI.getOrders()
    setOrders(response.data ?? [])
  }

  const refreshTestimonials = async () => {
    const response = await adminAPI.getTestimonials()
    setTestimonials(response.data ?? [])
  }

  const refreshMarketUpdates = async () => {
    const response = await adminAPI.getMarketUpdates()
    setMarketUpdates((response.data ?? []).map((item) => ({ ...item, published_at: toDateTimeLocal(item.published_at) })))
  }

  const refreshMedia = async () => {
    const response = await adminAPI.getMedia()
    setMedia(response.data ?? [])
  }

  const loadData = async () => {
    const auth = await authAPI.check()
    if (!auth.data?.authenticated) {
      redirectToLogin()
      return
    }

    const csrfRes = await authAPI.csrf()
    setCsrfToken(csrfRes.data?.csrf_token || '')

    const [
      dashboardRes,
      sectionsRes,
      servicesRes,
      ordersRes,
      testimonialsRes,
      marketRes,
      coachRes,
      settingsRes,
      mediaRes,
      leadsRes,
    ] = await Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getSectionSettings(),
      adminAPI.getServices(),
      adminAPI.getOrders(),
      adminAPI.getTestimonials(),
      adminAPI.getMarketUpdates(),
      adminAPI.getCoach(),
      adminAPI.getSettings(),
      adminAPI.getMedia(),
      adminAPI.getLeads(),
    ])

    setDashboard(dashboardRes.data ?? { stats: {}, recent_leads: [], recent_orders: [] })
    setSections(sectionsRes.data ?? [])
    setServices((servicesRes.data ?? []).map((service) => ({
      ...service,
      offer_starts_at: toDateTimeLocal(service.offer_starts_at),
      offer_ends_at: toDateTimeLocal(service.offer_ends_at),
    })))
    setOrders(ordersRes.data ?? [])
    setTestimonials(testimonialsRes.data ?? [])
    setMarketUpdates((marketRes.data ?? []).map((item) => ({ ...item, published_at: toDateTimeLocal(item.published_at) })))
    setCoach({ ...defaultCoach, ...(coachRes.data ?? {}) })
    setSiteSettings(mapSettings(settingsRes))
    setMedia(mediaRes.data ?? [])
    setLeads(leadsRes.data?.leads ?? [])
  }

  useEffect(() => {
    loadData()
      .catch((error) => {
        setLoadFailed(true)
        handleError(error, 'تعذر تحميل لوحة التحكم')
      })
      .finally(() => setBooting(false))
  }, [])

  const saveSections = async (nextSections, successMessage = 'تم حفظ محتوى الموقع') => {
    const sectionsToSave = Array.isArray(nextSections) ? nextSections : sections

    setSaving('sections-save')
    try {
      await adminAPI.updateSectionSettings(sectionsToSave)
      notifyPublicContentChanged({ scope: 'sections' })
      setFlash(successMessage)
    } catch (error) {
      handleError(error, 'تعذر حفظ محتوى الموقع')
    } finally {
      setSaving('')
    }
  }

  const saveSettings = async () => {
    setSaving('settings-save')
    try {
      let nextSettings = { ...siteSettings }
      if (siteLogoFile) {
        const upload = await adminAPI.uploadMedia(siteLogoFile)
        nextSettings = { ...nextSettings, site_logo: upload.data?.url ?? nextSettings.site_logo }
        setSiteLogoFile(null)
        setSiteSettings(nextSettings)
      }
      await adminAPI.updateSettings(nextSettings)
      publishPublicUpdate('settings')
      setFlash('تم حفظ الإعدادات')
    } catch (error) {
      handleError(error, 'تعذر حفظ الإعدادات')
    } finally {
      setSaving('')
    }
  }

  const createService = async (forcedType = '') => {
    setSaving('service-create')
    try {
      let payload = {
        ...serviceDraft,
        type: forcedType || serviceDraft.type,
        offer_starts_at: fromDateTimeLocal(serviceDraft.offer_starts_at),
        offer_ends_at: fromDateTimeLocal(serviceDraft.offer_ends_at),
      }

      if (serviceImageFile) {
        const upload = await adminAPI.uploadMedia(serviceImageFile)
        const mimetype = upload.data?.mimetype || serviceImageFile.type || ''
        const mediaType = mimetype.startsWith('video/') ? 'video' : 'image'
        payload = {
          ...payload,
          ...buildServiceMediaPatch(upload.data?.url, mediaType, 'card_media_url'),
          ...(mediaType === 'image' ? { cover_url: upload.data?.url } : {}),
        }
      }

      await adminAPI.createService(payload)
      setServiceDraft({ ...emptyService, type: forcedType || emptyService.type })
      setServiceImageFile(null)
      await refreshServices()
      await refreshMedia()
      publishPublicUpdate('services')
      setFlash('تم إنشاء الخدمة')
    } catch (error) {
      handleError(error, 'تعذر إنشاء الخدمة')
    } finally {
      setSaving('')
    }
  }

  const updateService = async (service) => {
    setSaving(`service-${service.id}`)
    try {
      await adminAPI.updateService({
        ...service,
        offer_starts_at: fromDateTimeLocal(service.offer_starts_at),
        offer_ends_at: fromDateTimeLocal(service.offer_ends_at),
      })
      await refreshServices()
      publishPublicUpdate('services')
      setFlash('تم حفظ الخدمة')
    } catch (error) {
      handleError(error, 'تعذر حفظ الخدمة')
    } finally {
      setSaving('')
    }
  }

  const deleteService = async (id) => {
    if (!(await confirmDelete('هل تريد حذف هذه الخدمة؟'))) {
      return
    }

    setSaving(`service-delete-${id}`)
    try {
      await adminAPI.deleteService(id)
      setServices((current) => current.filter((item) => item.id !== id))
      publishPublicUpdate('services')
      setFlash('تم حذف الخدمة')
    } catch (error) {
      handleError(error, 'تعذر حذف الخدمة')
    } finally {
      setSaving('')
    }
  }

  const uploadServiceImage = async (service, file, target = 'card_media_url') => {
    if (!file) return
    setSaving(`service-image-${service.id}`)
    try {
      const upload = await adminAPI.uploadMedia(file)
      const mimetype = upload.data?.mimetype || file.type || ''
      const mediaType = mimetype.startsWith('video/') ? 'video' : 'image'
      const uploadedUrl = upload.data?.url
      const patch = buildServiceMediaPatch(uploadedUrl, mediaType, target)

      setServices((current) =>
        current.map((item) =>
          item.id === service.id
            ? { ...item, ...patch }
            : item
        )
      )
      await refreshMedia()
      setFlash('تم رفع الوسائط. احفظ الخدمة لتثبيت التغيير.')
    } catch (error) {
      handleError(error, 'تعذر رفع الوسائط')
    } finally {
      setSaving('')
    }
  }

  const uploadServiceDraftMedia = async (file, target = 'card_media_url') => {
    if (!file) return
    setSaving(`service-draft-media-${target}`)
    try {
      const upload = await adminAPI.uploadMedia(file)
      const mimetype = upload.data?.mimetype || file.type || ''
      const mediaType = mimetype.startsWith('video/') ? 'video' : 'image'
      const uploadedUrl = upload.data?.url
      const patch = buildServiceMediaPatch(uploadedUrl, mediaType, target)

      setServiceDraft((current) => ({ ...current, ...patch }))
      await refreshMedia()
      setFlash('تم رفع الوسائط وربطها بنموذج الخدمة الجديدة.')
    } catch (error) {
      handleError(error, 'تعذر رفع الوسائط')
    } finally {
      setSaving('')
    }
  }

  const uploadServiceDraftGalleryMedia = async (index, file) => {
    if (!file) return
    setSaving(`service-draft-gallery-${index}`)
    try {
      const upload = await adminAPI.uploadMedia(file)
      const mimetype = upload.data?.mimetype || file.type || ''
      const mediaType = mimetype.startsWith('video/') ? 'video' : 'image'
      const uploadedUrl = upload.data?.url

      setServiceDraft((current) => ({
        ...current,
        media: updateRelationItem(current.media, index, { media_url: uploadedUrl, media_type: mediaType }),
      }))
      await refreshMedia()
      setFlash('تم رفع الوسائط وإضافتها لمعرض الخدمة الجديدة.')
    } catch (error) {
      handleError(error, 'تعذر رفع الوسائط')
    } finally {
      setSaving('')
    }
  }

  const uploadServiceGalleryMedia = async (service, index, file) => {
    if (!file) return
    setSaving(`service-gallery-${service.id}-${index}`)
    try {
      const upload = await adminAPI.uploadMedia(file)
      const mimetype = upload.data?.mimetype || file.type || ''
      const mediaType = mimetype.startsWith('video/') ? 'video' : 'image'
      const uploadedUrl = upload.data?.url

      setServices((current) =>
        current.map((item) =>
          item.id === service.id
            ? { ...item, media: updateRelationItem(item.media, index, { media_url: uploadedUrl, media_type: mediaType }) }
            : item
        )
      )
      await refreshMedia()
      setFlash('تم رفع الوسائط. احفظ الخدمة لتثبيت معرض الوسائط.')
    } catch (error) {
      handleError(error, 'تعذر رفع الوسائط')
    } finally {
      setSaving('')
    }
  }

  const updateOrder = async (order) => {
    setSaving(`order-${order.id}`)
    try {
      await adminAPI.updateOrder({
        id: order.id,
        status: order.status,
        redirect_url: order.redirect_url,
        admin_note: order.admin_note,
      })
      await refreshOrders()
      setFlash('تم تحديث الطلب')
    } catch (error) {
      handleError(error, 'تعذر تحديث الطلب')
    } finally {
      setSaving('')
    }
  }

  const createTestimonial = async () => {
    setSaving('testimonial-create')
    try {
      let payload = { ...testimonialDraft }
      if (testimonialImageFile) {
        const upload = await adminAPI.uploadMedia(testimonialImageFile)
        payload = { ...payload, image_url: upload.data?.url }
      }
      await adminAPI.createTestimonial(payload)
      setTestimonialDraft(emptyTestimonial)
      setTestimonialImageFile(null)
      await refreshTestimonials()
      await refreshMedia()
      publishPublicUpdate('testimonials')
      setFlash('تم إضافة رأي العميل')
    } catch (error) {
      handleError(error, 'تعذر إضافة رأي العميل')
    } finally {
      setSaving('')
    }
  }

  const updateTestimonial = async (testimonial) => {
    setSaving(`testimonial-${testimonial.id}`)
    try {
      await adminAPI.updateTestimonial(testimonial)
      await refreshTestimonials()
      publishPublicUpdate('testimonials')
      setFlash('تم حفظ رأي العميل')
    } catch (error) {
      handleError(error, 'تعذر حفظ رأي العميل')
    } finally {
      setSaving('')
    }
  }

  const deleteTestimonial = async (id) => {
    if (!(await confirmDelete('هل تريد حذف رأي العميل؟'))) {
      return
    }

    setSaving(`testimonial-delete-${id}`)
    try {
      await adminAPI.deleteTestimonial(id)
      setTestimonials((current) => current.filter((item) => item.id !== id))
      publishPublicUpdate('testimonials')
      setFlash('تم حذف رأي العميل')
    } catch (error) {
      handleError(error, 'تعذر حذف رأي العميل')
    } finally {
      setSaving('')
    }
  }

  const uploadTestimonialImage = async (testimonial, file) => {
    if (!file) return
    setSaving(`testimonial-image-${testimonial.id}`)
    try {
      const upload = await adminAPI.uploadMedia(file)
      setTestimonials((current) => current.map((item) => (item.id === testimonial.id ? { ...item, image_url: upload.data?.url } : item)))
      await refreshMedia()
      setFlash('تم رفع الصورة. احفظ رأي العميل لتثبيت التغيير.')
    } catch (error) {
      handleError(error, 'تعذر رفع الصورة')
    } finally {
      setSaving('')
    }
  }

  const createMarketUpdate = async () => {
    setSaving('market-create')
    try {
      let payload = { ...marketDraft, published_at: fromDateTimeLocal(marketDraft.published_at) }
      if (marketImageFile) {
        const upload = await adminAPI.uploadMedia(marketImageFile)
        payload = { ...payload, image_url: upload.data?.url }
      }
      await adminAPI.createMarketUpdate(payload)
      setMarketDraft(emptyMarketUpdate)
      setMarketImageFile(null)
      await refreshMarketUpdates()
      await refreshMedia()
      publishPublicUpdate('market')
      setFlash('تم إنشاء تحديث السوق')
    } catch (error) {
      handleError(error, 'تعذر إنشاء تحديث السوق')
    } finally {
      setSaving('')
    }
  }

  const updateMarketUpdate = async (update) => {
    setSaving(`market-${update.id}`)
    try {
      await adminAPI.updateMarketUpdate({ ...update, published_at: fromDateTimeLocal(update.published_at) })
      await refreshMarketUpdates()
      publishPublicUpdate('market')
      setFlash('تم حفظ تحديث السوق')
    } catch (error) {
      handleError(error, 'تعذر حفظ تحديث السوق')
    } finally {
      setSaving('')
    }
  }

  const deleteMarketUpdate = async (id) => {
    if (!(await confirmDelete('هل تريد حذف تحديث السوق؟'))) {
      return
    }

    setSaving(`market-delete-${id}`)
    try {
      await adminAPI.deleteMarketUpdate(id)
      setMarketUpdates((current) => current.filter((item) => item.id !== id))
      publishPublicUpdate('market')
      setFlash('تم حذف تحديث السوق')
    } catch (error) {
      handleError(error, 'تعذر حذف تحديث السوق')
    } finally {
      setSaving('')
    }
  }

  const uploadMarketImage = async (update, file) => {
    if (!file) return
    setSaving(`market-image-${update.id}`)
    try {
      const upload = await adminAPI.uploadMedia(file)
      setMarketUpdates((current) => current.map((item) => (item.id === update.id ? { ...item, image_url: upload.data?.url } : item)))
      await refreshMedia()
      setFlash('تم رفع الصورة. احفظ تحديث السوق لتثبيت التغيير.')
    } catch (error) {
      handleError(error, 'تعذر رفع الصورة')
    } finally {
      setSaving('')
    }
  }

  const saveCoach = async () => {
    setSaving('coach-save')
    try {
      let nextCoach = coach
      if (coachImageFile) {
        const upload = await adminAPI.uploadCoachImage(coachImageFile)
        nextCoach = { ...coach, image_url: upload.data?.image_url ?? coach.image_url }
        setCoach(nextCoach)
        setCoachImageFile(null)
      }
      await adminAPI.updateCoach(nextCoach)
      publishPublicUpdate('coach')
      setFlash('تم حفظ بيانات المدرب')
    } catch (error) {
      handleError(error, 'تعذر حفظ بيانات المدرب')
    } finally {
      setSaving('')
    }
  }

  const uploadMedia = async () => {
    if (!mediaUploadFile) return
    setSaving('media-upload')
    try {
      await adminAPI.uploadMedia(mediaUploadFile)
      setMediaUploadFile(null)
      await refreshMedia()
      setFlash('تم رفع الملف')
    } catch (error) {
      handleError(error, 'تعذر رفع الملف')
    } finally {
      setSaving('')
    }
  }

  const uploadMediaFromField = async (file) => {
    if (!file) return null
    setSaving('media-inline-upload')
    try {
      const upload = await adminAPI.uploadMedia(file)
      await refreshMedia()
      setFlash('تم رفع الملف وربطه بالحقل. اضغط حفظ لتثبيت التغيير.')
      return upload.data ?? null
    } catch (error) {
      handleError(error, 'تعذر رفع الملف')
      return null
    } finally {
      setSaving('')
    }
  }

  const deleteMedia = async (id) => {
    if (!(await confirmDelete('هل تريد حذف هذا الملف؟'))) {
      return
    }

    setSaving(`media-delete-${id}`)
    try {
      await adminAPI.deleteMedia(id)
      setMedia((current) => current.filter((item) => item.id !== id))
      setFlash('تم حذف الملف')
    } catch (error) {
      handleError(error, 'تعذر حذف الملف')
    } finally {
      setSaving('')
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } finally {
      redirectToLogin()
    }
  }

  if (booting) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">جاري تحميل لوحة التحكم...</div>
  }

  if (loadFailed) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-white">تعذر تحميل بيانات لوحة التحكم من قاعدة البيانات.</div>
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white" dir="rtl">
      <DeleteConfirmDialog />
      <div className="flex h-screen overflow-hidden">
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity xl:hidden ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`fixed right-0 top-0 z-50 h-screen w-80 max-w-[88vw] shrink-0 overflow-y-auto overscroll-contain border-l border-white/10 bg-slate-900/95 p-4 backdrop-blur transition-transform xl:sticky xl:top-0 xl:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-2 py-4">
            <div>
              <div className="font-bold text-white">لوحة التحكم</div>
              <div className="text-xs text-slate-400">تحكم موحد في محتوى الموقع</div>
            </div>
            <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 text-slate-300 hover:bg-white/5 xl:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-5">
            {sidebarGroups.map((group) => {
              const groupTabs = tabs.filter((tab) => tab.group === group)

              if (groupTabs.length === 0) {
                return null
              }

              return (
                <div key={group} className="space-y-2">
                  <div className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{group}</div>
                  {groupTabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => selectAdminTab(tab.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right transition-all ${
                          activeTab === tab.id
                            ? 'border border-hunter-green/30 bg-hunter-green/15 text-hunter-green'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </aside>

        <main
          ref={mainScrollRef}
          onClickCapture={() => {
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(clampMainScroll)
            })
          }}
          onChangeCapture={() => {
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(clampMainScroll)
            })
          }}
          onInputCapture={() => {
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(clampMainScroll)
            })
          }}
          className="h-screen min-w-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-3 sm:p-4 md:p-6 lg:p-8"
          style={{ overflowAnchor: 'none' }}
        >
          <div className="sticky top-0 z-30 min-h-[6.25rem] rounded-3xl border border-white/10 bg-slate-900 px-4 py-4 pr-20 shadow-2xl shadow-slate-950/55 sm:flex sm:min-h-0 sm:items-center sm:justify-between sm:gap-4 xl:pr-4">
            <div className="min-w-0">
              <div className="text-lg font-bold text-white">{activeTabMeta.label}</div>
              <div className="text-sm text-slate-400">{activeTabMeta.description}</div>
            </div>
            <button type="button" onClick={() => setSidebarOpen(true)} className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-slate-200 shadow-lg shadow-black/25 transition hover:border-hunter-green/40 hover:bg-slate-900 xl:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {message ? <div className="rounded-2xl border border-hunter-green/20 bg-hunter-green/15 px-4 py-3 text-hunter-green">{message}</div> : null}

          <div ref={mainContentRef} className="space-y-6">
            <AdminFieldLanguageProvider mode={activeTab === 'translations' ? 'all' : 'arabic'}>
            {activeTab === 'overview' ? <DashboardOverviewModule dashboard={dashboard} servicesCount={services.length} pendingOrders={pendingOrders} /> : null}
            {activeTab === 'section-order' ? (
              <SectionOrderModule
                sections={sections}
                setSections={setSections}
                onSave={saveSections}
                onAutoSave={(nextSections) => saveSections(nextSections, 'تم حفظ ترتيب وظهور السكشنات')}
                saving={saving === 'sections-save'}
              />
            ) : null}
            {activeTab === 'home' ? <WebsiteContentModule sections={sections} setSections={setSections} onSave={saveSections} saving={saving === 'sections-save'} media={media} contentSectionKeys={[]} onUploadMedia={uploadMediaFromField} /> : null}
            {activeServiceTab ? (
              <>
                <ServiceSectionModule
                  sectionKey={activeServiceTab.type}
                  title={activeServiceTab.label}
                  sections={sections}
                  setSections={setSections}
                  onSave={saveSections}
                  saving={saving === 'sections-save'}
                />
                <ServicesModule
                  services={services}
                  setServices={setServices}
                  serviceDraft={serviceDraft}
                  setServiceDraft={setServiceDraft}
                  serviceImageFile={serviceImageFile}
                  setServiceImageFile={setServiceImageFile}
                  filterType={serviceTypeFilter}
                  setFilterType={setServiceTypeFilter}
                  onCreate={createService}
                  onUpdate={updateService}
                  onDelete={deleteService}
                  onUploadImage={uploadServiceImage}
                  onUploadDraftMedia={uploadServiceDraftMedia}
                  onUploadDraftGalleryMedia={uploadServiceDraftGalleryMedia}
                  onUploadGalleryMedia={uploadServiceGalleryMedia}
                  saving={saving}
                  media={media}
                  lockedType={activeServiceTab.type}
                  moduleTitle={activeServiceTab.label}
                  moduleDescription={activeServiceTab.description}
                />
              </>
            ) : null}
            {activeTab === 'payment-settings' ? (
              <PaymentSettingsModule
                settings={siteSettings}
                setSettings={setSiteSettings}
                onSave={saveSettings}
                saving={saving === 'settings-save'}
              />
            ) : null}
            {activeTab === 'orders' ? <PaymentOrdersModule orders={orders} setOrders={setOrders} onSaveOrder={updateOrder} saving={saving} /> : null}
            {activeTab === 'testimonials' ? (
              <TestimonialsModule
                testimonials={testimonials}
                setTestimonials={setTestimonials}
                draft={testimonialDraft}
                setDraft={setTestimonialDraft}
                draftImageFile={testimonialImageFile}
                setDraftImageFile={setTestimonialImageFile}
                onCreate={createTestimonial}
                onUpdate={updateTestimonial}
                onDelete={deleteTestimonial}
                onUploadImage={uploadTestimonialImage}
                saving={saving}
                services={services}
                media={media}
              />
            ) : null}
            {activeTab === 'market' ? (
              <MarketModule
                updates={marketUpdates}
                setUpdates={setMarketUpdates}
                draft={marketDraft}
                setDraft={setMarketDraft}
                draftImageFile={marketImageFile}
                setDraftImageFile={setMarketImageFile}
                onCreate={createMarketUpdate}
                onUpdate={updateMarketUpdate}
                onDelete={deleteMarketUpdate}
                onUploadImage={uploadMarketImage}
                saving={saving}
                media={media}
              />
            ) : null}
            {activeTab === 'media' ? (
              <MediaLibraryModule
                media={media}
                uploadFile={mediaUploadFile}
                setUploadFile={setMediaUploadFile}
                onUpload={uploadMedia}
                onDelete={deleteMedia}
                saving={saving}
              />
            ) : null}
            {activeTab === 'coach' ? (
              <CoachSocialModule
                coach={coach}
                setCoach={setCoach}
                coachImageFile={coachImageFile}
                setCoachImageFile={setCoachImageFile}
                onSaveCoach={saveCoach}
                saving={saving}
              />
            ) : null}
            {activeTab === 'settings' ? (
              <SettingsModule
                settings={siteSettings}
                setSettings={setSiteSettings}
                siteLogoFile={siteLogoFile}
                setSiteLogoFile={setSiteLogoFile}
                onSave={saveSettings}
                saving={saving === 'settings-save'}
              />
            ) : null}
            {activeTab === 'translations' ? (
              <TranslationsModule
                sections={sections}
                setSections={setSections}
                onSaveSections={saveSections}
                services={services}
                setServices={setServices}
                onSaveService={updateService}
                coach={coach}
                setCoach={setCoach}
                onSaveCoach={saveCoach}
                testimonials={testimonials}
                setTestimonials={setTestimonials}
                onSaveTestimonial={updateTestimonial}
                marketUpdates={marketUpdates}
                setMarketUpdates={setMarketUpdates}
                onSaveMarketUpdate={updateMarketUpdate}
                settings={siteSettings}
                setSettings={setSiteSettings}
                onSaveSettings={saveSettings}
                saving={saving}
              />
            ) : null}
            {activeTab === 'leads' ? <LeadsModule leads={leads} /> : null}
            </AdminFieldLanguageProvider>
          </div>
        </main>
      </div>
    </div>
  )
}
