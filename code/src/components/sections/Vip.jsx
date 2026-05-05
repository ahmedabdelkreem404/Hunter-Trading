import { useTranslation } from 'react-i18next'
import PremiumProductSection from './PremiumProductSection'

export default function Vip() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <PremiumProductSection
      sectionId="vip"
      category="vip"
      badgeLabel="VIP"
      title={isArabic ? 'احصل على توصياتنا الخاصة عبر اشتراك VIP' : 'Get our private trade ideas through VIP access'}
      subtitle={
        isArabic
          ? 'باقات خاصة للتوصيات المدفوعة مع متابعة مستمرة، فلترة قوية للفرص، وتنظيم واضح للدخول والخروج.'
          : 'Premium paid trade-idea plans with continuous follow-up, strong filtering, and a clear structure for entries and exits.'
      }
      emptyText={isArabic ? 'لا توجد باقات VIP متاحة الآن.' : 'No VIP plans are available right now.'}
    />
  )
}
