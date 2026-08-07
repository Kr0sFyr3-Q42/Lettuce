'use client'

import Stepper from '@/components/ui/Stepper'

const DAYS = [
  { key: 'Maandag',   label: 'Ma' },
  { key: 'Dinsdag',   label: 'Di' },
  { key: 'Woensdag',  label: 'Wo' },
  { key: 'Donderdag', label: 'Do' },
  { key: 'Vrijdag',   label: 'Vr' },
  { key: 'Zaterdag',  label: 'Za' },
  { key: 'Zondag',    label: 'Zo' },
]

const MAX_DOTS = 12

type Props = {
  value: Record<string, number>
  onChange: (personsPerDay: Record<string, number>) => void
}

export default function PeoplePicker({ value, onChange }: Props) {
  function set(day: string, n: number) {
    onChange({ ...value, [day]: Math.max(0, Math.min(20, n)) })
  }

  return (
    <div className="space-y-2">
      {DAYS.map(({ key, label }) => {
        const count = value[key] ?? 2
        return (
          <div key={key} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card">
            {/* Day label */}
            <div className="w-14 flex-shrink-0">
              <p className="text-sm font-bold leading-none">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{key}</p>
            </div>

            {/* Person dots */}
            <div className="flex-1 flex items-center gap-1.5">
              {Array.from({ length: MAX_DOTS }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => set(key, i + 1)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    i < count
                      ? 'border-primary bg-primary'
                      : 'border-border bg-transparent hover:border-primary/50'
                  }`}
                  aria-label={`${i + 1} personen op ${key}`}
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

            {/* Stepper */}
            <div className="flex-shrink-0">
              <Stepper value={count} onChange={n => set(key, n)} min={0} max={20} label={`Personen op ${key}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { DAYS }
