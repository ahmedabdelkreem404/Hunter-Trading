import { useEffect, useMemo, useState } from 'react'
import {
  CreditCard,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  TrendingUp,
  UserSquare2,
  Users,
  X,
} from 'lucide-react'
import { adminAPI, authAPI } from '../../api'
import DashboardOverviewModule from './modules/DashboardOverviewModule'
import WebsiteContentModule from './modules/WebsiteContentModule'
import ServicesModule from './modules/ServicesModule'
import PaymentOrdersModule from './modules/PaymentOrdersModule'
import TestimonialsModule from './modules/TestimonialsModule'
import MarketModule from './modules/MarketModule'
import CoachSocialModule from './modules/CoachSocialModule'
import SettingsModule from './modules/SettingsModule'
import MediaLibraryModule from './modules/MediaLibraryModule'
import LeadsModule from './modules/LeadsModule'

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
  cta_label_en: 'Buy Now',
  cta_label_ar: 'اشتر الآن',
  cta_url: '',
  badge_text_en: '',
  badge_text_ar: '',
  thumbnail_url: '',
  cover_url: '',
  offer_starts_at: '',
  offer_ends_at: '',
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

const emptyCoachSocial = {
  platform: 'telegram',
  label: '',
  url: '',
  sort_order: 0,
  is_enabled: true,
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
  website_name: 'Hunter Trading',
  support_email: '',
  telegram_url: '',
  whatsapp_url: '',
  instapay_number: '',
  vodafone_cash_number: '',
  instagram_url: '',
  youtube_url: '',
  facebook_url: '',
  twitter_url: '',
  tiktok_url: '',
  location: '',
  footer_description: '',
  privacy_policy_title: '',
  privacy_policy_content: '',
  terms_title: '',
  terms_content: '',
  risk_warning_title: '',
  risk_warning_content: '',
  site_logo: '',
  primary_color: '#00ff88',
  primary_color_strong: '#00cc6a',
  accent_blue: '#0066ff',
  background_dark: '#0a0a0f',
  card_dark: '#12121a',
  text_dark: '#ffffff',
}

const tabs = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, description: 'KPIs, latest leads, and latest payment orders.' },
  { id: 'website', label: 'Website Content', icon: Package, description: 'Hero content, homepage sections, navbar, and footer.' },
  { id: 'services', label: 'Services & Products', icon: Package, description: 'Funded, VIP, Scalp, Courses, and Offers in one source.' },
  { id: 'orders', label: 'Payment Orders', icon: CreditCard, description: 'Manual payment verification and routing.' },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, description: 'Moderation, ordering, visibility, and relation to services.' },
  { id: 'market', label: 'Market Follow-up', icon: TrendingUp, description: 'Managed market updates with ordering, visibility, and pinning.' },
  { id: 'media', label: 'Media Library', icon: Image, description: 'Reusable uploaded media across the platform.' },
  { id: 'coach', label: 'Coach & Social', icon: UserSquare2, description: 'Coach profile and coach social links.' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Branding, contact, payment numbers, and legal content.' },
  { id: 'leads', label: 'Leads / Customers', icon: Users, description: 'Lead list collected from the website.' },
]

function toDateTimeLocal(value) {
  if (!value) return ''
  return String(value).replace(' ', 'T').slice(0, 16)
}

function fromDateTimeLocal(value) {
  if (!value) return null
  return value.includes('T') ? `${value.replace('T', ' ')}:00` : value
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
  const [booting, setBooting] = useState(true)
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
  const [coachSocialLinks, setCoachSocialLinks] = useState([])
  const [coachSocialDraft, setCoachSocialDraft] = useState(emptyCoachSocial)
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
  const pendingOrders = useMemo(() => orders.filter((order) => String(order.status || 'pending') === 'pending').length, [orders])

  const redirectToLogin = () => {
    window.location.href = '/admin/login'
  }

  const setFlash = (text) => {
    setMessage(text)
    window.clearTimeout(window.__hunterAdminFlash)
    window.__hunterAdminFlash = window.setTimeout(() => setMessage(''), 2500)
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

  const refreshCoachSocialLinks = async () => {
    const response = await adminAPI.getCoachSocialLinks()
    setCoachSocialLinks(response.data ?? [])
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

    const [
      dashboardRes,
      sectionsRes,
      servicesRes,
      ordersRes,
      testimonialsRes,
      marketRes,
      coachRes,
      coachSocialRes,
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
      adminAPI.getCoachSocialLinks(),
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
    setCoachSocialLinks(coachSocialRes.data ?? [])
    setSiteSettings(mapSettings(settingsRes))
    setMedia(mediaRes.data ?? [])
    setLeads(leadsRes.data?.leads ?? [])
  }

  useEffect(() => {
    loadData()
      .catch((error) => handleError(error, 'Failed to load dashboard'))
      .finally(() => setBooting(false))
  }, [])

  const saveSections = async () => {
    setSaving('sections-save')
    try {
      await adminAPI.updateSectionSettings(sections)
      setFlash('Website content saved')
    } catch (error) {
      handleError(error, 'Failed to save website content')
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
      setFlash('Settings saved')
    } catch (error) {
      handleError(error, 'Failed to save settings')
    } finally {
      setSaving('')
    }
  }

  const createService = async () => {
    setSaving('service-create')
    try {
      let payload = {
        ...serviceDraft,
        offer_starts_at: fromDateTimeLocal(serviceDraft.offer_starts_at),
        offer_ends_at: fromDateTimeLocal(serviceDraft.offer_ends_at),
      }

      if (serviceImageFile) {
        const upload = await adminAPI.uploadMedia(serviceImageFile)
        payload = { ...payload, thumbnail_url: upload.data?.url, cover_url: upload.data?.url }
      }

      await adminAPI.createService(payload)
      setServiceDraft(emptyService)
      setServiceImageFile(null)
      await refreshServices()
      await refreshMedia()
      setFlash('Service created')
    } catch (error) {
      handleError(error, 'Failed to create service')
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
      setFlash('Service saved')
    } catch (error) {
      handleError(error, 'Failed to save service')
    } finally {
      setSaving('')
    }
  }

  const deleteService = async (id) => {
    setSaving(`service-delete-${id}`)
    try {
      await adminAPI.deleteService(id)
      setServices((current) => current.filter((item) => item.id !== id))
      setFlash('Service deleted')
    } catch (error) {
      handleError(error, 'Failed to delete service')
    } finally {
      setSaving('')
    }
  }

  const uploadServiceImage = async (service, file) => {
    if (!file) return
    setSaving(`service-image-${service.id}`)
    try {
      const upload = await adminAPI.uploadMedia(file)
      setServices((current) =>
        current.map((item) => (item.id === service.id ? { ...item, thumbnail_url: upload.data?.url, cover_url: upload.data?.url } : item))
      )
      await refreshMedia()
      setFlash('Image uploaded. Save the service to keep the change.')
    } catch (error) {
      handleError(error, 'Failed to upload image')
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
      setFlash('Order updated')
    } catch (error) {
      handleError(error, 'Failed to update order')
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
      setFlash('Testimonial created')
    } catch (error) {
      handleError(error, 'Failed to create testimonial')
    } finally {
      setSaving('')
    }
  }

  const updateTestimonial = async (testimonial) => {
    setSaving(`testimonial-${testimonial.id}`)
    try {
      await adminAPI.updateTestimonial(testimonial)
      await refreshTestimonials()
      setFlash('Testimonial saved')
    } catch (error) {
      handleError(error, 'Failed to save testimonial')
    } finally {
      setSaving('')
    }
  }

  const deleteTestimonial = async (id) => {
    setSaving(`testimonial-delete-${id}`)
    try {
      await adminAPI.deleteTestimonial(id)
      setTestimonials((current) => current.filter((item) => item.id !== id))
      setFlash('Testimonial deleted')
    } catch (error) {
      handleError(error, 'Failed to delete testimonial')
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
      setFlash('Image uploaded. Save the testimonial to keep the change.')
    } catch (error) {
      handleError(error, 'Failed to upload image')
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
      setFlash('Market update created')
    } catch (error) {
      handleError(error, 'Failed to create market update')
    } finally {
      setSaving('')
    }
  }

  const updateMarketUpdate = async (update) => {
    setSaving(`market-${update.id}`)
    try {
      await adminAPI.updateMarketUpdate({ ...update, published_at: fromDateTimeLocal(update.published_at) })
      await refreshMarketUpdates()
      setFlash('Market update saved')
    } catch (error) {
      handleError(error, 'Failed to save market update')
    } finally {
      setSaving('')
    }
  }

  const deleteMarketUpdate = async (id) => {
    setSaving(`market-delete-${id}`)
    try {
      await adminAPI.deleteMarketUpdate(id)
      setMarketUpdates((current) => current.filter((item) => item.id !== id))
      setFlash('Market update deleted')
    } catch (error) {
      handleError(error, 'Failed to delete market update')
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
      setFlash('Image uploaded. Save the market update to keep the change.')
    } catch (error) {
      handleError(error, 'Failed to upload image')
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
      setFlash('Coach profile saved')
    } catch (error) {
      handleError(error, 'Failed to save coach profile')
    } finally {
      setSaving('')
    }
  }

  const createCoachSocial = async () => {
    setSaving('social-create')
    try {
      await adminAPI.createCoachSocialLink(coachSocialDraft)
      setCoachSocialDraft(emptyCoachSocial)
      await refreshCoachSocialLinks()
      setFlash('Social link created')
    } catch (error) {
      handleError(error, 'Failed to create social link')
    } finally {
      setSaving('')
    }
  }

  const updateCoachSocial = async (link) => {
    setSaving(`social-${link.id}`)
    try {
      await adminAPI.updateCoachSocialLink(link)
      await refreshCoachSocialLinks()
      setFlash('Social link saved')
    } catch (error) {
      handleError(error, 'Failed to save social link')
    } finally {
      setSaving('')
    }
  }

  const deleteCoachSocial = async (id) => {
    setSaving(`social-delete-${id}`)
    try {
      await adminAPI.deleteCoachSocialLink(id)
      setCoachSocialLinks((current) => current.filter((item) => item.id !== id))
      setFlash('Social link deleted')
    } catch (error) {
      handleError(error, 'Failed to delete social link')
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
      setFlash('Media uploaded')
    } catch (error) {
      handleError(error, 'Failed to upload media')
    } finally {
      setSaving('')
    }
  }

  const deleteMedia = async (id) => {
    setSaving(`media-delete-${id}`)
    try {
      await adminAPI.deleteMedia(id)
      setMedia((current) => current.filter((item) => item.id !== id))
      setFlash('Media deleted')
    } catch (error) {
      handleError(error, 'Failed to delete media')
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
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading admin...</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      <div className="flex min-h-screen overflow-x-clip">
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity xl:hidden ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[88vw] overflow-y-auto border-l border-white/10 bg-slate-900/95 p-4 backdrop-blur transition-transform xl:sticky xl:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between px-2 py-4">
            <div>
              <div className="font-bold text-white">Admin Dashboard</div>
              <div className="text-xs text-slate-400">Unified control for services, content, and operations</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 text-slate-300 hover:bg-white/5 xl:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSidebarOpen(false)
                  }}
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

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </aside>

        <main className="min-w-0 flex-1 space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="sticky top-0 z-30 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-lg font-bold text-white">{activeTabMeta.label}</div>
              <div className="text-sm text-slate-400">{activeTabMeta.description}</div>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="self-start rounded-2xl border border-white/10 p-3 text-slate-200 xl:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {message ? <div className="rounded-2xl border border-hunter-green/20 bg-hunter-green/15 px-4 py-3 text-hunter-green">{message}</div> : null}

          {activeTab === 'overview' ? <DashboardOverviewModule dashboard={dashboard} servicesCount={services.length} pendingOrders={pendingOrders} /> : null}
          {activeTab === 'website' ? <WebsiteContentModule sections={sections} setSections={setSections} onSave={saveSections} saving={saving === 'sections-save'} /> : null}
          {activeTab === 'services' ? (
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
              saving={saving}
              media={media}
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
              socialLinks={coachSocialLinks}
              setSocialLinks={setCoachSocialLinks}
              socialDraft={coachSocialDraft}
              setSocialDraft={setCoachSocialDraft}
              onSaveCoach={saveCoach}
              onCreateSocial={createCoachSocial}
              onUpdateSocial={updateCoachSocial}
              onDeleteSocial={deleteCoachSocial}
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
          {activeTab === 'leads' ? <LeadsModule leads={leads} /> : null}
        </main>
      </div>
    </div>
  )
}
