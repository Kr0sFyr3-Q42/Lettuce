'use client'

import { useLocale } from '@/hooks/useLocale'

type Props = { message: string; reset: () => void }

export default function ErrorScreen({ message, reset }: Props) {
  const { t } = useLocale()
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 p-8 text-center">
      <p className="text-5xl">🥬💀</p>
      <p className="text-2xl font-bold text-foreground tracking-tight">
        {t('error_title')}
      </p>
      <code className="text-sm text-muted-foreground bg-secondary border border-border px-4 py-2 rounded-lg max-w-lg break-all">
        {message}
      </code>
      <button
        onClick={reset}
        className="text-sm text-primary underline hover:opacity-70 transition-opacity"
      >
        {t('error_retry')}
      </button>
    </div>
  )
}
