'use client'

const DAYS = [
  { key: 'Maandag', label: 'Ma' },
  { key: 'Dinsdag', label: 'Di' },
  { key: 'Woensdag', label: 'Wo' },
  { key: 'Donderdag', label: 'Do' },
  { key: 'Vrijdag', label: 'Vr' },
  { key: 'Zaterdag', label: 'Za' },
  { key: 'Zondag', label: 'Zo' },
]

type Props = {
  value: Record<string, number>
  onChange: (personsPerDay: Record<string, number>) => void
}

export default function PeoplePicker({ value, onChange }: Props) {
  function update(day: string, persons: number) {
    onChange({ ...value, [day]: Math.max(0, Math.min(20, persons)) })
  }

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-700 mb-3">Aantal personen per dag</h2>
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <input
              type="number"
              min={0}
              max={20}
              value={value[key] ?? 2}
              onChange={e => update(key, Number(e.target.value))}
              className="w-full text-center border border-gray-300 rounded py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export { DAYS }
