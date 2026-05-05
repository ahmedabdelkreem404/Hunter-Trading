import { useTranslation } from 'react-i18next'
import PremiumProductSection from './PremiumProductSection'

export default function OffersSection() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <PremiumProductSection
      sectionId="offers"
      category="offers"
      badgeLabel={isArabic ? 'العروض المحدودة' : 'Limited Offers'}
      title={isArabic ? 'عروض خاصة ولفترة محدودة' : 'Special offers for a limited time'}
      subtitle={
        isArabic
          ? 'أضف عروضك على باقات VIP أو أي منتج رقمي مع عداد تنازلي مباشر، وعند انتهاء الوقت يختفي العرض تلقائيًا حتى تعيد تفعيله.'
          : 'Create limited-time offers for VIP plans or any digital product with a live countdown. Once time expires, the offer disappears automatically until you reactivate it.'
      }
      emptyText={isArabic ? 'لا توجد عروض مفعلة حاليًا.' : 'No active offers are available right now.'}
      showExpandToggle
      expandLabel={isArabic ? 'كل العروض' : 'View All Offers'}
      collapseLabel={isArabic ? 'عرض أقل' : 'Show Less'}
    />
  )
}
