interface TagPillProps {
  label: string
  selected: boolean
  onToggle: () => void
  icon?: string
}

export default function TagPill({ label, selected, onToggle, icon }: TagPillProps) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-150 border cursor-pointer select-none ${
        selected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-secondary'
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  )
}
