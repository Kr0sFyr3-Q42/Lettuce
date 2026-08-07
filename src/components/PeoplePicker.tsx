'use client'

import Stepper from '@/components/ui/Stepper'
import { type Locale, t } from '@/lib/i18n'

// Dutch day keys are used throughout the app (session storage, AI prompts, tag assignments)
// — they never change regardless of UI language
const DAY_CONFIG = [
  { key: 'Maandag',   short_nl: 'Ma', short_en: 'Mo', full_nl: 'Maandag',   full_en: 'Monday'    },
  { key: 'Dinsdag',   short_nl: 'Di', short_en: 'Tu', full_nl: 'Dinsdag',   full_en: 'Tuesday'   },
  { key: 'Woensdag',  short_nl: 'Wo', short_en: 'We', full_nl: 'Woensdag',  full_en: 'Wednesday' },
  { key: 'Donderdag', short_nl: 'Do', short_en: 'Th', full_nl: 'Donderdag', full_en: 'Thursday'  },
  { key: 'Vrijdag',   short_nl: 'Vr', short_en: 'Fr', full_nl: 'Vrijdag',   full_en: 'Friday'    },
  { key: 'Zaterdag',  short_nl: 'Za', short_en: 'Sa', full_nl: 'Zaterdag',  full_en: 'Saturday'  },
  { key: 'Zondag',    short_nl: 'Zo', short_en: 'Su', full_nl: 'Zondag',    full_en: 'Sunday'    },
]

const MAX_DOTS = 8

type Props = {
  value: Record<string, number>
  onChange: (personsPerDay: Record<string, number>) => void
  locale?: Locale
}

export default function PeoplePicker({ value, onChange, locale = 'nl' }: Props) {
  function set(day: string, n: number) {
    onChange({ ...value, [day]: Math.max(0, Math.min(20, n)) })
  }

  return (
    <div className="space-y-2">
      {DAY_CONFIG.map(day => {
        const count = value[day.key] ?? 2
        const short = locale === 'en' ? day.short_en : day.short_nl
        const full  = locale === 'en' ? day.full_en  : day.full_nl

        return (
          <div key={day.key} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl border border-border bg-card">
            <div className="flex-shrink-0 sm:w-14">
              <p className="text-sm font-bold leading-none sm:hidden">{full}</p>
              <p className="hidden sm:block text-sm font-bold leading-none">{short}</p>
              <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">{full}</p>
            </div>

            <div className="hidden sm:flex flex-1 items-center gap-1.5">
              {Array.from({ length: MAX_DOTS }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => set(day.key, i + 1)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                    ${i < count ? 'border-primary bg-primary' : 'border-border bg-transparent hover:border-primary/50'}`}
                  aria-label={`${i + 1} ${t(locale, 'people_persons_label')} ${full}`}
                >
                  {i < count && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="3.5" r="1.8" fill="white" />
                      <path d="M1.5 9C1.5 7 3 5.5 5 5.5C7 5.5 8.5 7 8.5 9" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 sm:hidden" />

            <div className="flex-shrink-0">
              <Stepper value={count} onChange={n => set(day.key, n)} min={0} max={20} label={`${t(locale, 'people_persons_label')} ${full}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Exported for DEFAULT_PERSONS initialisation — always Dutch keys
export const DAYS = DAY_CONFIG.map(d => ({ key: d.key, label: d.short_nl }))
