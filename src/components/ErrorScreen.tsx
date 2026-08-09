'use client'

import Link from 'next/link'

type Props = { message: string; reset: () => void }

export default function ErrorScreen({ message, reset }: Props) {
  const isNoKeyError = message.includes('API-sleutel ingesteld')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 p-8 text-center">
      <p className="text-5xl">🥬💀</p>
      <p className="text-2xl font-bold text-foreground tracking-tight">
       Lettuce not do that.. <br></br>Something went wrong.
      </p>
      <code className="text-sm text-muted-foreground bg-secondary border border-border px-4 py-2 rounded-lg max-w-lg break-all">
        {message}
      </code>
      <div className="flex items-center gap-4">
        {isNoKeyError ? (
          <Link
            href="/settings"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-80 transition-opacity font-medium"
          >
            Naar Instellingen
          </Link>
        ) : (
          <button
            onClick={reset}
            className="text-sm text-primary underline hover:opacity-70 transition-opacity"
          >
            Try again
          </button>
        )}
        <Link
          href="/"
          className="text-sm text-muted-foreground underline hover:opacity-70 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
