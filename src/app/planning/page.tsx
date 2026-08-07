'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuditorReview from '@/components/AuditorReview'
import { useLocale } from '@/hooks/useLocale'
import type { AuditorOutput, AuditorProposal, LettuceSession } from '@/lib/types'

type State =
  | { status: 'loading' }
  | { status: 'done'; proposals: AuditorOutput['proposals'] }
  | { status: 'error'; message: string }

export default function PlanningPage() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    async function run() {
      const raw = sessionStorage.getItem('lettuce_session')
      if (!raw) { router.replace('/'); return }
      const session: LettuceSession = JSON.parse(raw)
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persons_per_day: session.personsPerDay, tag_assignments: session.tagAssignments }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        setState({ status: 'error', message: error ?? `HTTP ${res.status}` })
        return
      }
      const output: AuditorOutput = await res.json()
      setState({ status: 'done', proposals: output.proposals })
    }
    run()
  }, [router])

  function handleConfirm(accepted: AuditorProposal[]) {
    const raw = sessionStorage.getItem('lettuce_session')
    if (!raw) { router.replace('/'); return }
    const session: LettuceSession = JSON.parse(raw)
    sessionStorage.setItem('lettuce_session', JSON.stringify({ ...session, acceptedProposals: accepted }))
    router.push('/result')
  }

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-4xl animate-pulse">🧠</p>
          <p className="font-medium text-foreground">{t('planning_loading_title')}</p>
          <p className="text-sm text-muted-foreground">{t('planning_loading_sub')}</p>
        </div>
      </div>
    )
  }

  if (state.status === 'error') throw new Error(state.message)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <AuditorReview proposals={state.proposals} onConfirm={handleConfirm} locale={locale} />
    </div>
  )
}
