import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import LanguageDirectionSync from './components/ui/LanguageDirectionSync'
import './i18n'
import './index.css'

const AdminApp = lazy(() => import('./pages/admin/AdminApp'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ServiceDetailsPage = lazy(() => import('./pages/ServiceDetailsPage'))

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hunter-bg text-hunter-text">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-hunter-green border-t-transparent" />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageDirectionSync />
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Main website routes */}
          <Route path="/privacy-policy" element={<LegalPage />} />
          <Route path="/terms-and-conditions" element={<LegalPage />} />
          <Route path="/risk-disclaimer" element={<LegalPage />} />
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/affiliate" element={<ServiceDetailsPage />} />
          <Route path="/services/:slug" element={<ServiceDetailsPage />} />
          <Route path="/funded/:slug" element={<ServiceDetailsPage />} />
          <Route path="/vip/:slug" element={<ServiceDetailsPage />} />
          <Route path="/scalp/:slug" element={<ServiceDetailsPage />} />
          <Route path="/courses/:slug" element={<ServiceDetailsPage />} />
          <Route path="/offers" element={<BlogPage />} />
          <Route path="/offers/:slug" element={<ServiceDetailsPage />} />
          <Route path="/*" element={<App />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminApp />} />
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
)
