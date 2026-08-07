interface StepIndicatorProps {
  current: number // 1-based
  steps: string[]
}

export default function StepIndicator({ current, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-bold border-2 transition-all duration-200 ${done || active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}>
                {done ? (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : num}
              </div>
              <span className={`text-xs font-sans whitespace-nowrap ${active ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-px w-10 mx-1 mb-4 transition-colors duration-200"
                style={{ backgroundColor: done ? 'var(--color-primary)' : 'var(--color-border)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
