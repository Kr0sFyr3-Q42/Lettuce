import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card text-card-foreground border border-border rounded-xl ${onClick ? 'cursor-pointer hover:border-primary/30 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
