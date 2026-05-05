import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
  getPublic: () => api.get('/settings/public'),
}

export const sectionSettingsAPI = {
  getPublic: () => api.get('/sections'),
}

export const coachAPI = {
  getProfile: () => api.get('/coach'),
}

export const servicesAPI = {
  getAll: (type) => api.get('/services', { params: { type } }),
  getBySlug: (slug) => api.get(`/services/${slug}`),
}

export const checkoutAPI = {
  submitOrder: (formData) =>
    api.post('/checkout/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const marketAPI = {
  getPublic: () => api.get('/market/updates'),
}

// Testimonials API
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
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
