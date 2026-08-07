interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  id?: string
}

export default function Toggle({ checked, onChange, label, id }: ToggleProps) {
  const uid = id ?? `toggle-${Math.random().toString(36).slice(2)}`
  return (
    <label htmlFor={uid} className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="relative inline-flex">
        <input
          type="checkbox"
          id={uid}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className={`block w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-border'}`} />
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </span>
      {label && <span className="text-sm font-sans font-medium text-foreground">{label}</span>}
    </label>
  )
}

interface CheckboxProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  id?: string
}

export function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  const uid = id ?? `cb-${Math.random().toString(36).slice(2)}`
  return (
    <label htmlFor={uid} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <span
        className="relative flex items-center justify-center w-5 h-5 rounded border transition-colors duration-150 flex-shrink-0"
        style={{
          borderColor: checked ? 'var(--color-primary)' : 'var(--color-border)',
          backgroundColor: checked ? 'var(--color-primary)' : 'transparent',
        }}
      >
        <input
          type="checkbox"
          id={uid}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        {checked && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label && <span className="text-sm font-sans text-foreground">{label}</span>}
    </label>
  )
}
