interface LogoProps {
  variant?: 'mark' | 'horizontal' | 'stacked'
  size?: number
  className?: string
}

export default function Logo({ variant = 'horizontal', size = 32, className = '' }: LogoProps) {
  const Mark = () => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Lettuce logo mark">
      <path d="M16 4 C10.5 4 6 8.5 6 14 C6 19.5 10.5 24 16 24 C21.5 24 26 19.5 26 14 C26 8.5 21.5 4 16 4 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7 C12 7 9 10 9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 7 C20 7 23 10 23 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 10 C13.5 10 11.5 11.8 11.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 10 C18.5 10 20.5 11.8 20.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" />
      <path d="M16 24 L16 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 28 L19 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )

  const wordmarkStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: size * 0.625,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    color: 'currentColor',
  }

  if (variant === 'mark') return <span className={className}><Mark /></span>

  if (variant === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-center gap-1 ${className}`}>
        <Mark />
        <span style={wordmarkStyle}>lettuce</span>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark />
      <span style={wordmarkStyle}>lettuce</span>
    </span>
  )
}
