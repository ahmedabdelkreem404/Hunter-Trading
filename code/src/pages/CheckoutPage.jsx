import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CreditCard, Smartphone, Upload, CheckCircle2 } from 'lucide-react'
import { checkoutAPI, servicesAPI, settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'

const selectProduct = (response) => response.data ?? null

export default function CheckoutPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: product } = useApiData(() => servicesAPI.getBySlug(slug), null, selectProduct)
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    payment_method: 'instapay',
  })
  const [screenshot, setScreenshot] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')

  const getSetting = (key) => settings.general?.[key]?.value || ''
  const instapayNumber = getSetting('instapay_number')
  const instapayAccountName = getSetting('instapay_account_name')
  const vodafoneCashNumber = getSetting('vodafone_cash_number')
  const vodafoneCashAccountName = getSetting('vodafone_cash_account_name')
  const bankTransferDetails = getSetting('bank_transfer_details')
  const paymentInstructions = isArabic
    ? getSetting('payment_instructions_ar') || getSetting('payment_instructions_en')
    : getSetting('payment_instructions_en') || getSetting('payment_instructions_ar')

  const submitOrder = async (event) => {
    event.preventDefault()
    if (!product) return

    setSubmitting(true)
    setError('')

    try {
      const payload = new FormData()
      payload.append('service_id', String(product.id))
      payload.append('customer_name', form.customer_name)
      payload.append('customer_email', form.customer_email)
      payload.append('customer_phone', form.customer_phone)
      payload.append('payment_method', form.payment_method)
      if (screenshot) {
        payload.append('screenshot', screenshot)
      }

      const response = await checkoutAPI.submitOrder(payload)
      setSuccess(response.data)

      if (response.data?.redirect_url) {
        window.setTimeout(() => {
          window.location.href = response.data.redirect_url
        }, 2500)
      }
    } catch (err) {
      setError(err.message || 'Failed to submit order')
    } finally {
      setSubmitting(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
            <ArrowLeft className="h-4 w-4" />
            {isArabic ? 'العودة للرئيسية' : 'Back to home'}
          </Link>
        </div>
      </div>
    )
  }

  if (product.type === 'scalp') {
    return <Navigate to={`/services/${product.slug}`} replace />
  }

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          <ArrowLeft className="h-4 w-4" />
          {isArabic ? 'العودة للرئيسية' : 'Back to home'}
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-hunter-card p-6 shadow-2xl shadow-black/20 sm:p-8">
            {(product.cover_url || product.thumbnail_url) && (
              <img src={product.cover_url || product.thumbnail_url} alt={product.title_en} className="mb-6 h-72 w-full rounded-2xl object-cover" />
            )}
            <h1 className="font-heading text-3xl font-bold">
              {isArabic ? product.title_ar || product.title_en : product.title_en}
            </h1>
            <p className="mt-4 text-lg leading-8 text-hunter-text-muted">
              {isArabic ? product.full_description_ar || product.short_description_ar || product.full_description_en : product.full_description_en || product.short_description_en}
            </p>
            <div className="mt-6 text-3xl font-heading font-bold text-hunter-green">
              ${Number(product.price ?? 0).toFixed(0)}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-hunter-green">
                  <Smartphone className="h-5 w-5" />
                  <span className="font-semibold">InstaPay</span>
                </div>
                <div className="text-hunter-text-muted">{instapayNumber || '-'}</div>
                {instapayAccountName ? <div className="mt-1 text-sm text-hunter-text-muted">{instapayAccountName}</div> : null}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-hunter-green">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-semibold">Vodafone Cash</span>
                </div>
                <div className="text-hunter-text-muted">{vodafoneCashNumber || '-'}</div>
                {vodafoneCashAccountName ? <div className="mt-1 text-sm text-hunter-text-muted">{vodafoneCashAccountName}</div> : null}
              </div>
              {bankTransferDetails ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-hunter-green">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">{isArabic ? 'تحويل بنكي / طرق إضافية' : 'Bank transfer / extra methods'}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-hunter-text-muted">{bankTransferDetails}</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-hunter-card p-6 shadow-2xl shadow-black/20 sm:p-8">
            {success ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-hunter-green" />
                <h2 className="mt-4 text-2xl font-heading font-bold">
                  {isArabic ? 'تم استلام طلبك بنجاح' : 'Your order was received successfully'}
                </h2>
                <p className="mt-3 leading-7 text-hunter-text-muted">
                  {isArabic
                    ? 'تم إرسال إشعار على بريدك الإداري. سيتم تحويلك الآن إلى وسيلة التواصل المحددة لمتابعة الطلب.'
                    : 'An admin email notification was sent. You will now be redirected to your configured contact link.'}
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={submitOrder}>
                <h2 className="text-2xl font-heading font-bold">
                  {isArabic ? 'إكمال الدفع' : 'Complete Payment'}
                </h2>
                <p className="text-hunter-text-muted">
                  {paymentInstructions || (isArabic
                    ? 'حوّل المبلغ، ارفع الاسكرين شوت، وسنراجع الطلب يدويًا.'
                    : 'Send the payment, upload the screenshot, and we will review the order manually.')}
                </p>

                <input
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder={isArabic ? 'الاسم' : 'Name'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  required
                />
                <input
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  placeholder={isArabic ? 'البريد الإلكتروني' : 'Email'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  required
                />
                <input
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  placeholder={isArabic ? 'رقم الهاتف أو واتساب' : 'Phone or WhatsApp'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                />

                <select
                  value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <option value="instapay">InstaPay</option>
                  <option value="vodafone_cash">Vodafone Cash</option>
                  {bankTransferDetails ? <option value="bank_transfer">{isArabic ? 'تحويل بنكي / طريقة إضافية' : 'Bank transfer / extra method'}</option> : null}
                </select>

                <label className="block rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-hunter-text-muted">
                  <div className="mb-3 flex items-center gap-2 text-hunter-green">
                    <Upload className="h-4 w-4" />
                    <span>{isArabic ? 'ارفع اسكرين شوت التحويل' : 'Upload payment screenshot'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
                </label>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-hunter-green px-5 py-3 font-semibold text-hunter-bg transition hover:bg-hunter-green/90 disabled:opacity-60"
                >
                  {submitting
                    ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting...')
                    : (isArabic ? 'إرسال الطلب' : 'Submit Order')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
