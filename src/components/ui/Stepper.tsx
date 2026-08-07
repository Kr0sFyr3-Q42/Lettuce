interface StepperProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  label?: string
}

export default function Stepper({ value, onChange, min = 0, max = 99, label }: StepperProps) {
  return (
    <div
      className="inline-flex items-center rounded-lg border border-border overflow-hidden"
      role="group"
      aria-label={label}
    >
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-10 h-9 flex items-center justify-center font-sans font-semibold text-sm text-foreground border-x border-border tabular-nums">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  )
}
