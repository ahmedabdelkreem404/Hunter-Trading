import { useTranslation } from 'react-i18next'
import PremiumProductSection from './PremiumProductSection'

export default function Courses() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <PremiumProductSection
      sectionId="courses"
      category="courses"
      badgeLabel={isArabic ? 'الدورات التعليمية' : 'Educational Courses'}
      title={isArabic ? 'اختر دورتك التعليمية المناسبة وابدأ فورًا' : 'Choose the right course and start immediately'}
      subtitle={
        isArabic
          ? 'اعرض الدورات التعليمية بنفس أسلوب بطاقات البيع الأنيقة، مع صورة، عنوان، مزايا واضحة، وسعر مباشر.'
          : 'Show your educational courses in elegant product cards with image, title, clear benefits, and direct pricing.'
      }
      emptyText={isArabic ? 'لا توجد دورات متاحة الآن.' : 'No courses are available right now.'}
      centerCardContent
    />
  )
}
