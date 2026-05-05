import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'

const pageConfig = {
  '/privacy-policy': {
    titleKey: 'privacy_policy_title',
    contentKey: 'privacy_policy_content',
    fallbackTitle: 'سياسة الخصوصية',
    fallbackContent:
      'نحترم خصوصيتك ونتعامل مع بياناتك بحرص. قد نقوم بجمع بيانات مثل الاسم والبريد الإلكتروني ووسائل التواصل عند التسجيل أو التواصل معنا، ويتم استخدام هذه البيانات لتحسين الخدمة والتواصل معك وتقديم المحتوى المناسب. نحن لا نبيع بياناتك لأي طرف ثالث، وقد نستخدم مزودي خدمات موثوقين للمساعدة في تشغيل الموقع. باستخدامك للموقع فإنك توافق على هذه السياسة.',
  },
  '/terms-and-conditions': {
    titleKey: 'terms_title',
    contentKey: 'terms_content',
    fallbackTitle: 'الشروط والأحكام',
    fallbackContent:
      'باستخدامك لهذا الموقع فأنت توافق على الالتزام بشروط الاستخدام. جميع المواد التعليمية والمعلومات المنشورة لأغراض تعليمية وإعلامية فقط، ولا تمثل نصيحة استثمارية مباشرة. يمنع إعادة نشر المحتوى أو نسخه دون إذن. يحق لإدارة الموقع تحديث المحتوى أو الخدمات أو الشروط في أي وقت.',
  },
  '/risk-disclaimer': {
    titleKey: 'risk_disclaimer_title',
    contentKey: 'risk_disclaimer_content',
    fallbackTitle: 'تحذير المخاطر',
    fallbackContent:
      'التداول في الفوركس والأسهم والسلع والأدوات المالية ينطوي على مخاطر مرتفعة وقد لا يكون مناسبًا لجميع المستثمرين. يمكن أن تعمل الرافعة المالية لصالحك أو ضدك. يجب أن تتأكد من فهمك الكامل للمخاطر قبل اتخاذ أي قرار مالي، ولا تستثمر أموالًا لا يمكنك تحمل خسارتها.',
  },
}

export default function LegalPage() {
  const location = useLocation()
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const general = settings.general ?? {}

  const page = useMemo(() => pageConfig[location.pathname] ?? pageConfig['/privacy-policy'], [location.pathname])
  const title = general[page.titleKey]?.value || page.fallbackTitle
  const content = general[page.contentKey]?.value || page.fallbackContent
  const websiteName = general.website_name?.value || 'Hunter Trading'

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          العودة إلى الرئيسية
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-hunter-card p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-6">
            <div className="text-sm text-hunter-green">{websiteName}</div>
            <h1 className="mt-2 font-heading text-3xl font-bold text-hunter-text">{title}</h1>
          </div>

          <div className="whitespace-pre-wrap leading-8 text-hunter-text-muted">{content}</div>
        </div>
      </div>
    </div>
  )
}
