'use client'

import { useEffect, useState, useCallback } from 'react'
import MenuDisplay from '@/components/MenuDisplay'
import ShoppingList from '@/components/ShoppingList'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { rescaleShoppingList, avgPersons } from '@/lib/rescale'
import type { PlannerOutput, ShoppingDepartment } from '@/lib/types'

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

type SavedMenuSummary = { id: number; name: string; created_at: string; is_autosaved: boolean }

type DetailView = {
  id: number
  name: string
  output: PlannerOutput
  personsPerDay: Record<string, number>
  scaledList: ShoppingDepartment[]
  newPersons: number
}

export default function SavedPage() {
  const [list, setList]     = useState<SavedMenuSummary[]>([])
  const [detail, setDetail] = useState<DetailView | null>(null)
  const [shareLabel, setShareLabel] = useState('Delen')

  const handleShare = useCallback(async (output: PlannerOutput) => {
    const text = formatAsText(output)
    if (navigator.share) {
      await navigator.share({ title: '🥬 Mijn weekmenu', text })
    } else {
      await navigator.clipboard.writeText(text)
      setShareLabel('✓ Gekopieerd!')
      setTimeout(() => setShareLabel('Delen'), 2000)
    }
  }, [])

  async function loadList() {
    const res = await fetch('/api/saved-menus')
    setList(await res.json())
  }

  useEffect(() => { loadList() }, [])

  async function openMenu(summary: SavedMenuSummary) {
    const res = await fetch(`/api/saved-menus/${summary.id}`)
    const row = await res.json()
    const output: PlannerOutput = JSON.parse(row.menu_data)
    const personsPerDay: Record<string, number> = JSON.parse(row.persons_per_day)
    const original = avgPersons(personsPerDay)
    setDetail({
      id: summary.id,
      name: summary.name,
      output,
      personsPerDay,
      scaledList: output.shopping_list,
      newPersons: original,
    })
  }

  async function deleteMenu(id: number) {
    await fetch(`/api/saved-menus/${id}`, { method: 'DELETE' })
    loadList()
  }

  async function deleteAllAutosaved() {
    await fetch('/api/saved-menus', { method: 'DELETE' })
    loadList()
  }

  function rescale() {
    if (!detail) return
    const original = avgPersons(detail.personsPerDay)
    setDetail({
      ...detail,
      scaledList: rescaleShoppingList(detail.output.shopping_list, original, detail.newPersons),
    })
  }

  function resetScale() {
    if (!detail) return
    setDetail({ ...detail, scaledList: detail.output.shopping_list })
  }

  // ── Detail view ──────────────────────────────────────────────────────────
  if (detail) {
    const original = avgPersons(detail.personsPerDay)
    const isScaled = detail.newPersons !== original

    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setDetail(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Terug naar lijst
          </button>
          <h1 className="text-xl font-bold text-foreground flex-1">{detail.name}</h1>

          {/* Share / Print */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleShare(detail.output)}>
              {shareLabel}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => window.print()}>
              Afdrukken / PDF
            </Button>
          </div>

          {/* Rescale controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Herschalen naar</span>
            <input
              type="number"
              min={1}
              max={30}
              value={detail.newPersons}
              onChange={e => setDetail({ ...detail, newPersons: Number(e.target.value) })}
              className="w-16 border border-border rounded-lg px-2 py-1.5 text-sm bg-card text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-muted-foreground">personen</span>
            <Button size="sm" variant="secondary" onClick={rescale}>Herschalen</Button>
            {isScaled && (
              <Button size="sm" variant="ghost" onClick={resetScale}>Origineel herstellen</Button>
            )}
          </div>
        </div>

        {isScaled && (
          <p className="text-xs text-primary font-medium">
            Boodschappenlijst herschaald van {original} naar {detail.newPersons} personen.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MenuDisplay days={detail.output.days} />
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ShoppingList departments={detail.scaledList} />
          </div>
        </div>
      </div>
    )
  }

  // ── List view ─────────────────────────────────────────────────────────────
  const saved    = list.filter(m => !m.is_autosaved)
  const autosaved = list.filter(m => m.is_autosaved)

  const MenuRow = ({ item }: { item: SavedMenuSummary }) => (
    <Card key={item.id} className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="font-medium text-sm text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(item.created_at).toLocaleString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => openMenu(item)}>Laden</Button>
        <Button size="sm" variant="ghost" onClick={() => deleteMenu(item.id)}>
          <span className="text-red-500">Verwijder</span>
        </Button>
      </div>
    </Card>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      {/* Manually saved */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-foreground">Opgeslagen menu&apos;s</h1>
        {saved.length === 0 ? (
          <Card className="p-8 text-center space-y-2">
            <p className="text-3xl">📋</p>
            <p className="font-medium text-foreground">Nog geen opgeslagen menu&apos;s</p>
            <p className="text-sm text-muted-foreground">
              Genereer een weekmenu en sla het op via de resultaatpagina.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {saved.map(item => <MenuRow key={item.id} item={item} />)}
          </div>
        )}
      </div>

      {/* Auto-saved */}
      {autosaved.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Automatisch opgeslagen</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Elk gegenereerd menu wordt automatisch bewaard zodat je het nooit kwijtraakt.
            </p>
            <Button size="sm" variant="ghost" onClick={deleteAllAutosaved} className="mt-2 -ml-2">
              <span className="text-red-500">Alles verwijderen</span>
            </Button>
          </div>
          <div className="space-y-3">
            {autosaved.map(item => <MenuRow key={item.id} item={item} />)}
          </div>
        </div>
      )}
    </div>
  )
}
