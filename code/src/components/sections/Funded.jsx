import { useTranslation } from 'react-i18next'
import PremiumProductSection from './PremiumProductSection'

export default function Funded() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <PremiumProductSection
      sectionId="funded"
      category="funded"
      badgeLabel={isArabic ? 'الحسابات الممولة' : 'Funded Accounts'}
      title={isArabic ? 'اشترِ الحسابات الممولة الجاهزة من شركات التمويل' : 'Buy funded-account offers from prop firms'}
      subtitle={
        isArabic
          ? 'اعرض باقات الحسابات الممولة التي تبيعها كوكيل، مع حجم الحساب، الشركة، الشروط، والسعر في بطاقات واضحة ومباشرة.'
          : 'Present the funded-account packages you sell as an agent with company, account size, key terms, and pricing in clear premium cards.'
      }
      emptyText={isArabic ? 'لا توجد حسابات ممولة متاحة الآن.' : 'No funded accounts are available right now.'}
    />
  )
}
