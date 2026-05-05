import { Plus, Trash2 } from 'lucide-react'
import { ActionButton, Field, SectionCard, TextArea, Toggle } from './shared/AdminUI'

function statsToText(stats = []) {
  return (stats || []).map((item) => `${item.value || ''}|${item.label_en || ''}|${item.label_ar || ''}`).join('\n')
}

function textToStats(text = '') {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value = '', labelEn = '', labelAr = ''] = line.split('|')
      return { value: value.trim(), label_en: labelEn.trim(), label_ar: labelAr.trim() }
    })
}

function sortMenuItems(items = []) {
  return [...items].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
}

function MenuManager({ title, items, onChange }) {
  const safeItems = sortMenuItems(items)

  const updateItem = (index, changes) => {
    onChange(safeItems.map((item, currentIndex) => (currentIndex === index ? { ...item, ...changes } : item)))
  }

  const removeItem = (index) => {
    onChange(safeItems.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <SectionCard
      title={title}
      action={
        <ActionButton
          onClick={() =>
            onChange([
              ...safeItems,
              { label_en: '', label_ar: '', href: '', is_visible: true, new_tab: false, sort_order: safeItems.length + 1 },
            ])
          }
          className="w-full bg-white/5 text-slate-200 sm:w-auto"
        >
          <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add item</span>
        </ActionButton>
      }
    >
      <div className="space-y-4">
        {safeItems.map((item, index) => (
          <div key={`${item.href}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Label EN" value={item.label_en || ''} onChange={(event) => updateItem(index, { label_en: event.target.value })} />
              <Field label="Label AR" value={item.label_ar || ''} onChange={(event) => updateItem(index, { label_ar: event.target.value })} />
              <Field label="Href" value={item.href || ''} onChange={(event) => updateItem(index, { href: event.target.value })} />
              <Field label="Sort order" type="number" value={item.sort_order || 0} onChange={(event) => updateItem(index, { sort_order: Number(event.target.value) })} />
              <Toggle label="Visible" checked={!!item.is_visible} onChange={(value) => updateItem(index, { is_visible: value })} />
              <Toggle label="Open in new tab" checked={!!item.new_tab} onChange={(value) => updateItem(index, { new_tab: value })} />
            </div>
            <div className="mt-4">
              <ActionButton onClick={() => removeItem(index)} className="bg-red-500/10 text-red-300">
                <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Remove</span>
              </ActionButton>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export default function WebsiteContentModule({ sections, setSections, onSave, saving }) {
  const updateSection = (sectionKey, changes) => {
    setSections((current) => current.map((section) => (section.section_key === sectionKey ? { ...section, ...changes } : section)))
  }

  const hero = sections.find((section) => section.section_key === 'hero')
  const navigation = sections.find((section) => section.section_key === 'navigation')
  const footer = sections.find((section) => section.section_key === 'footer')
  const contentSections = sections.filter((section) => !['coach', 'navigation', 'footer'].includes(section.section_key))

  return (
    <>
      {hero ? (
        <SectionCard
          title="Hero content and stats"
          action={
            <ActionButton onClick={onSave} className="w-full bg-green-600 text-white sm:w-auto">
              {saving ? 'Saving...' : 'Save website content'}
            </ActionButton>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title EN" value={hero.title_en || ''} onChange={(event) => updateSection('hero', { title_en: event.target.value })} />
            <Field label="Title AR" value={hero.title_ar || ''} onChange={(event) => updateSection('hero', { title_ar: event.target.value })} />
            <Field label="Subtitle EN" value={hero.subtitle_en || ''} onChange={(event) => updateSection('hero', { subtitle_en: event.target.value })} />
            <Field label="Subtitle AR" value={hero.subtitle_ar || ''} onChange={(event) => updateSection('hero', { subtitle_ar: event.target.value })} />
            <TextArea label="Body EN" className="md:col-span-2" value={hero.body_en || ''} onChange={(event) => updateSection('hero', { body_en: event.target.value })} />
            <TextArea label="Body AR" className="md:col-span-2" value={hero.body_ar || ''} onChange={(event) => updateSection('hero', { body_ar: event.target.value })} />
            <Field label="Primary CTA EN" value={hero.cta_label_en || ''} onChange={(event) => updateSection('hero', { cta_label_en: event.target.value })} />
            <Field label="Primary CTA AR" value={hero.cta_label_ar || ''} onChange={(event) => updateSection('hero', { cta_label_ar: event.target.value })} />
            <Field label="Primary CTA URL" value={hero.cta_url || ''} onChange={(event) => updateSection('hero', { cta_url: event.target.value })} />
            <Field label="Secondary CTA EN" value={hero.secondary_cta_label_en || ''} onChange={(event) => updateSection('hero', { secondary_cta_label_en: event.target.value })} />
            <Field label="Secondary CTA AR" value={hero.secondary_cta_label_ar || ''} onChange={(event) => updateSection('hero', { secondary_cta_label_ar: event.target.value })} />
            <Field label="Secondary CTA URL" value={hero.secondary_cta_url || ''} onChange={(event) => updateSection('hero', { secondary_cta_url: event.target.value })} />
            <TextArea label="Stats lines: value|label_en|label_ar" className="md:col-span-2" value={statsToText(hero.stats)} onChange={(event) => updateSection('hero', { stats: textToStats(event.target.value) })} />
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Homepage sections">
        <div className="space-y-4">
          {contentSections.map((section) => (
            <div key={section.section_key} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Section title EN" value={section.title_en || ''} onChange={(event) => updateSection(section.section_key, { title_en: event.target.value })} />
                <Field label="Section title AR" value={section.title_ar || ''} onChange={(event) => updateSection(section.section_key, { title_ar: event.target.value })} />
                <Field label="Sort order" type="number" value={section.sort_order || 0} onChange={(event) => updateSection(section.section_key, { sort_order: Number(event.target.value) })} />
                <Toggle label="Visible" checked={!!section.is_visible} onChange={(value) => updateSection(section.section_key, { is_visible: value ? 1 : 0 })} />
                <TextArea label="Subtitle EN" className="xl:col-span-2" value={section.subtitle_en || ''} onChange={(event) => updateSection(section.section_key, { subtitle_en: event.target.value })} />
                <TextArea label="Subtitle AR" className="xl:col-span-2" value={section.subtitle_ar || ''} onChange={(event) => updateSection(section.section_key, { subtitle_ar: event.target.value })} />
                <Field label="CTA EN" value={section.cta_label_en || ''} onChange={(event) => updateSection(section.section_key, { cta_label_en: event.target.value })} />
                <Field label="CTA AR" value={section.cta_label_ar || ''} onChange={(event) => updateSection(section.section_key, { cta_label_ar: event.target.value })} />
                <Field label="CTA URL" className="md:col-span-2" value={section.cta_url || ''} onChange={(event) => updateSection(section.section_key, { cta_url: event.target.value })} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {navigation ? (
        <MenuManager
          title="Navbar items"
          items={navigation.settings?.menu_items || []}
          onChange={(items) => updateSection('navigation', { settings: { ...(navigation.settings || {}), menu_items: items } })}
        />
      ) : null}

      {footer ? (
        <>
          <MenuManager
            title="Footer quick links"
            items={footer.settings?.quick_links || []}
            onChange={(items) => updateSection('footer', { settings: { ...(footer.settings || {}), quick_links: items } })}
          />
          <MenuManager
            title="Footer legal links"
            items={footer.settings?.legal_links || []}
            onChange={(items) => updateSection('footer', { settings: { ...(footer.settings || {}), legal_links: items } })}
          />
        </>
      ) : null}
    </>
  )
}
