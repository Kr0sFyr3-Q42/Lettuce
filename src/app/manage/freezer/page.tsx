'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { FreezerItem } from '@/lib/types'

export default function FreezerPage() {
  const [items, setItems] = useState<FreezerItem[]>([])
  const [name, setName] = useState('')
  const [portions, setPortions] = useState(1)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  async function load() {
    const res = await fetch('/api/freezer')
    setItems(await res.json())
  }

  useEffect(() => { load() }, [])

  async function updatePortions(item: FreezerItem, value: number) {
    await fetch(`/api/freezer/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portions: value }),
    })
    load()
  }

  async function deleteItem(id: number) {
    await fetch(`/api/freezer/${id}`, { method: 'DELETE' })
    load()
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/freezer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_name: name, portions, date_added: date }),
    })
    setName('')
    setPortions(1)
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-xl font-semibold text-foreground">Kliekjes</h1>

      <Card className="overflow-hidden divide-y divide-border">
        {items.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">Geen kliekjes gevonden.</p>
        )}
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-sm text-foreground">{item.item_name}</p>
              <p className="text-xs text-muted-foreground">Toegevoegd: {item.date_added}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => updatePortions(item, Math.max(1, item.portions - 1))}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors text-base leading-none"
                >−</button>
                <span className="w-8 text-center text-sm font-semibold text-foreground border-x border-border">{item.portions}</span>
                <button
                  onClick={() => updatePortions(item, item.portions + 1)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors text-base leading-none"
                >+</button>
              </div>
              <span className="text-xs text-muted-foreground">port.</span>
              <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 hover:text-red-400 transition-colors">
                Verwijder
              </button>
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-4 space-y-3 bg-secondary">
        <h2 className="font-medium text-sm text-foreground">Kliekje toevoegen</h2>
        <input
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Naam (bijv. Stoofvlees)"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Porties</label>
            <input
              type="number"
              min={1}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={portions}
              onChange={e => setPortions(Number(e.target.value))}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Datum ingevroren</label>
            <input
              type="date"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" size="sm" onClick={addItem as never}>Toevoegen</Button>
      </Card>
    </div>
  )
}
