import axios from 'axios'

const API_BASE = '/api'
let csrfToken = ''
const publicGetCache = new Map()
export const PUBLIC_CONTENT_CHANGED_EVENT = 'hunter:public-content-changed'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setCsrfToken(token) {
  csrfToken = token || ''
}

export function invalidatePublicCache(prefix = '') {
  if (!prefix) {
    publicGetCache.clear()
    return
  }

  for (const key of publicGetCache.keys()) {
    if (key.startsWith(prefix)) {
      publicGetCache.delete(key)
    }
  }
}

export function notifyPublicContentChanged(detail = {}) {
  invalidatePublicCache()

  if (typeof window === 'undefined') {
    return
  }

  const payload = { ...detail, timestamp: Date.now() }
  window.dispatchEvent(new CustomEvent(PUBLIC_CONTENT_CHANGED_EVENT, { detail: payload }))

  try {
    window.localStorage.setItem(PUBLIC_CONTENT_CHANGED_EVENT, JSON.stringify(payload))
  } catch {
    // localStorage can be unavailable in private or locked-down browser contexts.
  }

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(PUBLIC_CONTENT_CHANGED_EVENT)
    channel.postMessage(payload)
    window.setTimeout(() => channel.close(), 0)
  }
}

function cachedGet(url, options = {}, ttl = 60000) {
  const key = `${url}:${JSON.stringify(options.params || {})}`
  const cached = publicGetCache.get(key)
  const now = Date.now()

  if (cached?.data && now - cached.timestamp < ttl) {
    return Promise.resolve(cached.data)
  }

  if (cached?.promise) {
    return cached.promise
  }

  const promise = api.get(url, options).then((data) => {
    publicGetCache.set(key, { data, timestamp: Date.now(), promise: null })
    return data
  }).catch((error) => {
    publicGetCache.delete(key)
    throw error
  })

  publicGetCache.set(key, { data: cached?.data, timestamp: cached?.timestamp || 0, promise })
  return promise
}

api.interceptors.request.use((config) => {
  const method = String(config.method || 'get').toLowerCase()
  if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(method)) {
    config.headers = config.headers || {}
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const settingsAPI = {
  getPublic: () => cachedGet('/settings/public', {}, 60000),
}

export const sectionSettingsAPI = {
  getPublic: () => cachedGet('/sections', {}, 0),
}

export const coachAPI = {
  getProfile: () => cachedGet('/coach', {}, 60000),
}

export const servicesAPI = {
  getAll: (type) => cachedGet('/services', { params: { type } }, 30000),
  getBySlug: (slug) => cachedGet(`/services/${slug}`, {}, 30000),
}

export const checkoutAPI = {
  submitOrder: (formData) =>
    api.post('/checkout/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const marketAPI = {
  getPublic: () => cachedGet('/market/updates', {}, 15000),
}

// Testimonials API
export const testimonialsAPI = {
  getAll: () => cachedGet('/testimonials', {}, 60000),
}

// Leads API
export const leadsAPI = {
  create: (data) => api.post('/leads', data),
}

// Analytics API
export const analyticsAPI = {
  track: (data) => api.post('/analytics/track', data),
}

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  check: () => api.get('/auth/check'),
  csrf: () => api.get('/auth/csrf'),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getTestimonials: () => api.get('/admin/testimonials'),
  createTestimonial: (data) => api.post('/admin/testimonials', data),
  updateTestimonial: (data) => api.put('/admin/testimonials', data),
  deleteTestimonial: (id) => api.delete('/admin/testimonials', { params: { id } }),
  getLeads: () => api.get('/admin/leads'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', { settings }),
  getCoach: () => api.get('/admin/coach'),
  updateCoach: (data) => api.put('/admin/coach', data),
  getServices: () => api.get('/admin/services'),
  createService: (data) => api.post('/admin/services', data),
  updateService: (data) => api.put('/admin/services', data),
  deleteService: (id) => api.delete('/admin/services', { params: { id } }),
  getOrders: () => api.get('/admin/orders'),
  updateOrder: (data) => api.put('/admin/orders', data),
  getSectionSettings: () => api.get('/admin/sections'),
  updateSectionSettings: (sections) => api.put('/admin/sections', { sections }),
  getMarketUpdates: () => api.get('/admin/market'),
  createMarketUpdate: (data) => api.post('/admin/market', data),
  updateMarketUpdate: (data) => api.put('/admin/market', data),
  deleteMarketUpdate: (id) => api.delete('/admin/market', { params: { id } }),
  getCoachSocialLinks: () => api.get('/admin/coach/social-links'),
  createCoachSocialLink: (data) => api.post('/admin/coach/social-links', data),
  updateCoachSocialLink: (data) => api.put('/admin/coach/social-links', data),
  deleteCoachSocialLink: (id) => api.delete('/admin/coach/social-links/delete', { params: { id } }),
  uploadCoachImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/admin/coach/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadMedia: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getMedia: () => api.get('/admin/media'),
  deleteMedia: (id) => api.delete('/admin/media/delete', { params: { id } }),
}

export default api
