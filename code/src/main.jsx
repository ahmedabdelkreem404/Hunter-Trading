import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import LanguageDirectionSync from './components/ui/LanguageDirectionSync'
import PublicPageLayout from './components/layout/PublicPageLayout'
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

function PublicPage({ children }) {
  return <PublicPageLayout>{children}</PublicPageLayout>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageDirectionSync />
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Main website routes */}
          <Route path="/privacy-policy" element={<PublicPage><LegalPage /></PublicPage>} />
          <Route path="/terms-and-conditions" element={<PublicPage><LegalPage /></PublicPage>} />
          <Route path="/risk-disclaimer" element={<PublicPage><LegalPage /></PublicPage>} />
          <Route path="/checkout/:slug" element={<PublicPage><CheckoutPage /></PublicPage>} />
          <Route path="/affiliate" element={<PublicPage><ServiceDetailsPage /></PublicPage>} />
          <Route path="/services/:slug" element={<PublicPage><ServiceDetailsPage /></PublicPage>} />
          <Route path="/funded/:slug" element={<PublicPage><ServiceDetailsPage /></PublicPage>} />
          <Route path="/vip/:slug" element={<PublicPage><ServiceDetailsPage /></PublicPage>} />
          <Route path="/scalp/:slug" element={<PublicPage><ServiceDetailsPage /></PublicPage>} />
          <Route path="/courses/:slug" element={<PublicPage><ServiceDetailsPage /></PublicPage>} />
          <Route path="/offers" element={<PublicPage><BlogPage /></PublicPage>} />
          <Route path="/offers/:slug" element={<PublicPage><ServiceDetailsPage /></PublicPage>} />
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
