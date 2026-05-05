import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import AdminApp from './pages/admin/AdminApp'
import AdminLogin from './pages/admin/Login'
import LegalPage from './pages/LegalPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import CheckoutPage from './pages/CheckoutPage'
import './index.css'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Main website routes */}
        <Route path="/privacy-policy" element={<LegalPage />} />
        <Route path="/terms-and-conditions" element={<LegalPage />} />
        <Route path="/risk-disclaimer" element={<LegalPage />} />
        <Route path="/checkout/:slug" element={<CheckoutPage />} />
        <Route path="/offers" element={<BlogPage />} />
        <Route path="/offers/:slug" element={<BlogPostPage />} />
        <Route path="/*" element={<App />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
