import axios from 'axios'

const API_BASE = '/api'
let csrfToken = ''
const publicGetCache = new Map()
export const PUBLIC_CONTENT_CHANGED_EVENT = 'hunter:public-content-changed'
const PUBLIC_CACHE_PREFIX = 'hunter:public-api-cache:v3:'
const PUBLIC_DATA_TTL = 15 * 60 * 1000

function withCachedData(promise, cachedData = null) {
  if (cachedData !== null && cachedData !== undefined) {
    promise.__hunterCachedData = cachedData
  }
  return promise
}

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
    clearPersistentPublicCache()
    return
  }

  for (const key of publicGetCache.keys()) {
    if (key.startsWith(prefix)) {
      publicGetCache.delete(key)
    }
  }
  clearPersistentPublicCache(prefix)
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

function readPersistentPublicCache(key, ttl) {
  if (typeof window === 'undefined' || ttl <= 0) return null

  try {
    const raw = window.localStorage.getItem(`${PUBLIC_CACHE_PREFIX}${key}`)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (!cached?.data || Date.now() - Number(cached.timestamp || 0) > ttl) {
      return null
    }
    return cached
  } catch {
    return null
  }
}

function writePersistentPublicCache(key, data) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(`${PUBLIC_CACHE_PREFIX}${key}`, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // Ignore cache write failures. Public data still works from the live request.
  }
}

function clearPersistentPublicCache(prefix = '') {
  if (typeof window === 'undefined') return

  try {
    const storagePrefix = `${PUBLIC_CACHE_PREFIX}${prefix}`
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(storagePrefix))
      .forEach((key) => window.localStorage.removeItem(key))
  } catch {
    // localStorage can be unavailable in private or locked-down browser contexts.
  }
}

function cachedGet(url, options = {}, ttl = 60000) {
  const key = `${url}:${JSON.stringify(options.params || {})}`
  const cached = publicGetCache.get(key)
  const now = Date.now()

  if (cached?.data && now - cached.timestamp < ttl) {
    return withCachedData(Promise.resolve(cached.data), cached.data)
  }

  if (cached?.promise) {
    return cached.promise
  }

  const persistentCached = readPersistentPublicCache(key, ttl)
  if (persistentCached?.data) {
    publicGetCache.set(key, { data: persistentCached.data, timestamp: persistentCached.timestamp, promise: null })
    return withCachedData(Promise.resolve(persistentCached.data), persistentCached.data)
  }

  const promise = api.get(url, options).then((data) => {
    publicGetCache.set(key, { data, timestamp: Date.now(), promise: null })
    if (ttl > 0) {
      writePersistentPublicCache(key, data)
    }
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
  getPublic: () => cachedGet('/settings/public', {}, PUBLIC_DATA_TTL),
}

export const sectionSettingsAPI = {
  getPublic: () => cachedGet('/sections', {}, PUBLIC_DATA_TTL),
}

export const coachAPI = {
  getProfile: () => cachedGet('/coach', {}, PUBLIC_DATA_TTL),
}

export const servicesAPI = {
  getAll: (type) => cachedGet('/services', { params: { type } }, PUBLIC_DATA_TTL),
  getBySlug: (slug) => cachedGet(`/services/${slug}`, {}, PUBLIC_DATA_TTL),
}

export const checkoutAPI = {
  submitOrder: (formData) =>
    api.post('/checkout/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const marketAPI = {
  getPublic: () => cachedGet('/market/updates', {}, PUBLIC_DATA_TTL),
}

// Testimonials API
export const testimonialsAPI = {
  getAll: () => cachedGet('/testimonials', {}, PUBLIC_DATA_TTL),
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
