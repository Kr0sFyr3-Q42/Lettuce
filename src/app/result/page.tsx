'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MenuDisplay from '@/components/MenuDisplay'
import ShoppingList from '@/components/ShoppingList'
import Button from '@/components/ui/Button'
import type { LettuceSession, PlannerOutput } from '@/lib/types'

type State =
  | { status: 'loading' }
  | { status: 'done'; output: PlannerOutput; personsPerDay: Record<string, number> }
  | { status: 'error'; message: string }

type SaveState = 'idle' | 'saving' | 'saved'

export default function ResultPage() {
  const router = useRouter()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveName, setSaveName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)

  useEffect(() => {
    async function run() {
      const raw = sessionStorage.getItem('lettuce_session')
      if (!raw) { router.replace('/'); return }

      const session: LettuceSession = JSON.parse(raw)

      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persons_per_day:    session.personsPerDay,
          tag_assignments:    session.tagAssignments,
          accepted_proposals: session.acceptedProposals ?? [],
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        setState({ status: 'error', message: error ?? `HTTP ${res.status}` })
        return
      }

      const output: PlannerOutput = await res.json()
      setState({ status: 'done', output, personsPerDay: session.personsPerDay })
    }

    run()
  }, [router])

  async function handleSave() {
    if (state.status !== 'done' || !saveName.trim()) return
    setSaveState('saving')
    await fetch('/api/saved-menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:           saveName.trim(),
        menu_data:      state.output,
        persons_per_day: state.personsPerDay,
      }),
    })
    setSaveState('saved')
    setShowSaveForm(false)
    setSaveName('')
  }

  function handleRestart() {
    sessionStorage.removeItem('lettuce_session')
    router.push('/')
  }

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-4xl animate-pulse">🥬</p>
          <p className="font-medium text-foreground">Weekmenu wordt gegenereerd...</p>
          <p className="text-sm text-muted-foreground">Even geduld, dit duurt 15–30 seconden</p>
        </div>
      </div>
    )
  }

  if (state.status === 'error') throw new Error(state.message)

  const { output } = state

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jouw weekmenu</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gegenereerd door Claude</p>
        </div>
        <div className="flex items-center gap-3">
          {!showSaveForm ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => setShowSaveForm(true)}>
                {saveState === 'saved' ? '✓ Opgeslagen' : 'Opslaan'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRestart}>
                Opnieuw beginnen
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <input
                className="border border-border rounded-lg px-3 py-1.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-44"
                placeholder="Naam voor dit menu"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!saveName.trim() || saveState === 'saving'}
              >
                {saveState === 'saving' ? 'Bezig...' : 'Opslaan'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSaveForm(false)}>
                Annuleer
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content: menu left, shopping list right on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MenuDisplay days={output.days} />
        <div className="lg:sticky lg:top-6 lg:self-start">
          <ShoppingList departments={output.shopping_list} />
        </div>
      </div>
    </div>
  )
}
