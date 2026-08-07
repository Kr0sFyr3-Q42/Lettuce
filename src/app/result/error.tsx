'use client'

import ErrorScreen from '@/components/ErrorScreen'

export default function ResultError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorScreen message={error.message} reset={reset} />
}
