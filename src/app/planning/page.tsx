'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuditorReview from '@/components/AuditorReview'
import AuditLoadingScreen from '@/components/AuditLoadingScreen'
import type { AuditorOutput, AuditorProposal, LettuceSession } from '@/lib/types'

const MIN_LOADING_MS = 3000

type State =
  | { status: 'loading' }
  | { status: 'done'; proposals: AuditorOutput['proposals'] }
  | { status: 'error'; message: string }

export default function PlanningPage() {
  const router = useRouter()
  const hasFetched = useRef(false)
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    async function run() {
      const raw = sessionStorage.getItem('lettuce_session')
      if (!raw) { router.replace('/'); return }

      const session: LettuceSession = JSON.parse(raw)

      const fetchPromise = fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persons_per_day: session.personsPerDay,
          tag_assignments: session.tagAssignments,
        }),
      })

      const [res] = await Promise.all([
        fetchPromise,
        new Promise(r => setTimeout(r, MIN_LOADING_MS)),
      ])

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
    sessionStorage.setItem(
      'lettuce_session',
      JSON.stringify({ ...session, acceptedProposals: accepted })
    )
    router.push('/result')
  }

  if (state.status === 'loading') return <AuditLoadingScreen />
  if (state.status === 'error') throw new Error(state.message)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <AuditorReview proposals={state.proposals} onConfirm={handleConfirm} />
    </div>
  )
}
