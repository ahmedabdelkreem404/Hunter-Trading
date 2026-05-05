import SocialBrandIcon, { SOCIAL_PLATFORMS, getSocialBrand } from '../../../../components/ui/SocialBrandIcon'
import { Field, Toggle } from './AdminUI'

function socialEnabled(settings, platform) {
  const raw = settings?.[platform.enabledKey]
  if (raw === undefined || raw === null || raw === '') {
    return Boolean(String(settings?.[platform.urlKey] || '').trim())
  }

  return raw === true || raw === 1 || ['1', 'true', 'yes', 'on'].includes(String(raw).toLowerCase())
}

export default function SocialSettingsControls({ settings, setSettings }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {SOCIAL_PLATFORMS.map((platform) => {
        const brand = getSocialBrand(platform.platform)
        const enabled = socialEnabled(settings, platform)

        return (
          <div key={platform.platform} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border"
                style={{
                  color: brand.color,
                  background: brand.background,
                  borderColor: brand.border,
                }}
              >
                <SocialBrandIcon platform={platform.platform} className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold text-white">{platform.name_ar || platform.name}</div>
                <div className="text-xs text-slate-400">يظهر في الفوتر وسكشن الكوتش</div>
              </div>
            </div>
            <div className="space-y-3">
              <Toggle
                label={`تفعيل ${platform.name_ar || platform.name}`}
                checked={enabled}
                onChange={(value) => setSettings((current) => ({ ...current, [platform.enabledKey]: value ? '1' : '0' }))}
              />
              <Field
                label={`رابط ${platform.name_ar || platform.name}`}
                value={settings?.[platform.urlKey] || ''}
                onChange={(event) => setSettings((current) => ({ ...current, [platform.urlKey]: event.target.value }))}
                placeholder={`https://${platform.platform}.com/...`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
