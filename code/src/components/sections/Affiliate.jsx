import { useTranslation } from 'react-i18next'
import PremiumProductSection from './PremiumProductSection'

export default function ScalpSection() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <PremiumProductSection
      sectionId="scalp"
      category="scalp"
      badgeLabel={isArabic ? 'سكالب' : 'Scalp'}
      title={isArabic ? 'خدمات السكالب والربط السريع' : 'Scalp services and fast onboarding'}
      subtitle={
        isArabic
          ? 'اعرض خدمات السكالب أو الربط مع الوسطاء أو أي باقات تنفيذ سريع من نفس نظام الخدمات الموحد.'
          : 'Show scalp services, broker onboarding, or any fast-execution packages from the same unified services system.'
      }
      emptyText={isArabic ? 'لا توجد خدمات سكالب متاحة الآن.' : 'No scalp services are available right now.'}
    />
  )
}
