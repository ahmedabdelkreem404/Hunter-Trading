import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { settingsAPI } from '../api'
import useApiData from '../hooks/useApiData'

const pageConfig = {
  '/privacy-policy': {
    titleKey: 'privacy_policy_title',
    contentKey: 'privacy_policy_content',
    fallbackTitleAr: 'سياسة الخصوصية',
    fallbackTitleEn: 'Privacy Policy',
    fallbackContentAr:
      'نحترم خصوصيتك ونتعامل مع بياناتك بحرص. قد نقوم بجمع بيانات مثل الاسم والبريد الإلكتروني ووسائل التواصل عند التسجيل أو التواصل معنا، ويتم استخدام هذه البيانات لتحسين الخدمة والتواصل معك وتقديم المحتوى المناسب. نحن لا نبيع بياناتك لأي طرف ثالث، وقد نستخدم مزودي خدمات موثوقين للمساعدة في تشغيل الموقع. باستخدامك للموقع فإنك توافق على هذه السياسة.',
    fallbackContentEn:
      'We respect your privacy and handle your data carefully. We may collect details such as your name, email address, and contact information when you register or contact us. This information is used to improve the service, communicate with you, and provide relevant content. We do not sell your data to third parties.',
  },
  '/terms-and-conditions': {
    titleKey: 'terms_title',
    contentKey: 'terms_content',
    fallbackTitleAr: 'الشروط والأحكام',
    fallbackTitleEn: 'Terms and Conditions',
    fallbackContentAr:
      'باستخدامك لهذا الموقع فأنت توافق على الالتزام بشروط الاستخدام. جميع المواد التعليمية والمعلومات المنشورة لأغراض تعليمية وإعلامية فقط، ولا تمثل نصيحة استثمارية مباشرة. يمنع إعادة نشر المحتوى أو نسخه دون إذن. يحق لإدارة الموقع تحديث المحتوى أو الخدمات أو الشروط في أي وقت.',
    fallbackContentEn:
      'By using this website, you agree to follow these terms. All educational materials and published information are provided for educational and informational purposes only and do not represent direct investment advice. Content may not be copied or republished without permission.',
  },
  '/risk-disclaimer': {
    titleKey: 'risk_disclaimer_title',
    contentKey: 'risk_disclaimer_content',
    fallbackTitleAr: 'تحذير المخاطر',
    fallbackTitleEn: 'Risk Disclaimer',
    fallbackContentAr:
      'التداول في الفوركس والأسهم والسلع والأدوات المالية ينطوي على مخاطر مرتفعة وقد لا يكون مناسبًا لجميع المستثمرين. يمكن أن تعمل الرافعة المالية لصالحك أو ضدك. يجب أن تتأكد من فهمك الكامل للمخاطر قبل اتخاذ أي قرار مالي، ولا تستثمر أموالًا لا يمكنك تحمل خسارتها.',
    fallbackContentEn:
      'Trading forex, stocks, commodities, and financial instruments involves significant risk and may not be suitable for all investors. Leverage can work for or against you. Make sure you fully understand the risks before making any financial decision.',
  },
}

function getLocalizedSetting(general, key, isArabic, fallback) {
  if (isArabic) {
    return general[`${key}_ar`]?.value || general[key]?.value || general[`${key}_en`]?.value || fallback
  }

  return general[`${key}_en`]?.value || fallback
}

export default function LegalPage() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const { data: settings } = useApiData(settingsAPI.getPublic, {}, (response) => response.data ?? {})
  const general = settings.general ?? {}

  const page = useMemo(() => pageConfig[location.pathname] ?? pageConfig['/privacy-policy'], [location.pathname])
  const title = getLocalizedSetting(general, page.titleKey, isArabic, isArabic ? page.fallbackTitleAr : page.fallbackTitleEn)
  const content = getLocalizedSetting(general, page.contentKey, isArabic, isArabic ? page.fallbackContentAr : page.fallbackContentEn)
  const websiteName = general.website_name?.value || 'Hunter Trading'

  return (
    <div className="min-h-screen bg-hunter-bg text-hunter-text" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 text-sm text-hunter-text-muted hover:text-hunter-green">
          {isArabic ? 'العودة إلى الرئيسية' : 'Back to home'}
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
