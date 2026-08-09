'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import MenuDisplay from '@/components/MenuDisplay'
import ShoppingList from '@/components/ShoppingList'
import Button from '@/components/ui/Button'
import LoadingScreen from '@/components/LoadingScreen'
import type { LettuceSession, PlannerOutput } from '@/lib/types'

type State =
  | { status: 'loading' }
  | { status: 'done'; output: PlannerOutput; personsPerDay: Record<string, number> }
  | { status: 'error'; message: string }

type SaveState = 'idle' | 'saving' | 'saved'

function formatAsText(output: PlannerOutput): string {
  const menu = output.days.map(day => {
    const meals = day.meals.map(meal => {
      const steps = meal.recipe_steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')
      return `${meal.name}\n${steps}`
    }).join('\n\n')
    return `── ${day.day} (${day.persons} personen) ──\n${meals}`
  }).join('\n\n')

  const shopping = output.shopping_list.map(dept => {
    const items = dept.items.map(i => `  - ${i.name} ${i.quantity} ${i.unit}`).join('\n')
    return `${dept.department}\n${items}`
  }).join('\n\n')

  return `🥬 Lettuce Weekmenu\n${'─'.repeat(40)}\n\n${menu}\n\n${'─'.repeat(40)}\nBOODSCHAPPENLIJST\n${'─'.repeat(40)}\n\n${shopping}`
}

export default function ResultPage() {
  const router = useRouter()
  const hasFetched = useRef(false)
  const [state, setState] = useState<State>({ status: 'loading' })
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveName, setSaveName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [shareLabel, setShareLabel] = useState('Delen')

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

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

      // Auto-save silently so the user never loses a generated plan
      const label = new Date().toLocaleString('nl-NL', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
      fetch('/api/saved-menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Gegenereerd op ${label}`,
          menu_data: output,
          persons_per_day: session.personsPerDay,
          is_autosaved: true,
        }),
      }).catch(() => { /* silently ignore auto-save failures */ })
    }
    run()
  }, [router])

  async function handleShare() {
    if (state.status !== 'done') return
    const text = formatAsText(state.output)
    if (navigator.share) {
      await navigator.share({ title: '🥬 Mijn weekmenu', text })
    } else {
      await navigator.clipboard.writeText(text)
      setShareLabel('✓ Gekopieerd!')
      setTimeout(() => setShareLabel('Delen'), 2000)
    }
  }

  function handlePrint() {
    window.print()
  }

  async function handleSave() {
    if (state.status !== 'done' || !saveName.trim()) return
    setSaveState('saving')
    await fetch('/api/saved-menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:            saveName.trim(),
        menu_data:       state.output,
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

  if (state.status === 'loading') return <LoadingScreen />

  if (state.status === 'error') throw new Error(state.message)

  const { output } = state

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 print:py-4 print:space-y-6">
      {/* Actions — hidden when printing */}
      <div className="flex items-center justify-between gap-4 flex-wrap print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jouw weekmenu</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gegenereerd door Claude</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={handleShare}>
            {shareLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            Afdrukken / PDF
          </Button>
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
              <Button size="sm" onClick={handleSave} disabled={!saveName.trim() || saveState === 'saving'}>
                {saveState === 'saving' ? 'Bezig...' : 'Opslaan'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSaveForm(false)}>
                Annuleer
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Print header — only visible when printing */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">🥬 Weekmenu</h1>
        <p className="text-sm text-muted-foreground">Gegenereerd door Lettuce</p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2 print:gap-6">
        <MenuDisplay days={output.days} />
        <div className="lg:sticky lg:top-6 lg:self-start print:static">
          <ShoppingList departments={output.shopping_list} />
        </div>
      </div>
    </div>
  )
}
