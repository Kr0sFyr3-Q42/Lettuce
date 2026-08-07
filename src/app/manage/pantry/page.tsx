'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { PantryItem } from '@/lib/types'

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([])
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')

  async function load() {
    const res = await fetch('/api/pantry')
    setItems(await res.json())
  }

  useEffect(() => { load() }, [])

  async function deleteItem(id: number) {
    await fetch(`/api/pantry/${id}`, { method: 'DELETE' })
    load()
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/pantry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_name: name, unit: unit || null }),
    })
    setName('')
    setUnit('')
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-xl font-semibold text-foreground">Basisvoorraad</h1>
      <p className="text-sm text-muted-foreground">
        Items hier worden nooit op de boodschappenlijst gezet — de AI gaat ervan uit dat je ze altijd in huis hebt.
      </p>

      <Card className="overflow-hidden divide-y divide-border">
        {items.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nog geen items.</p>
        )}
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-sm text-foreground">{item.item_name}</p>
              {item.unit && <p className="text-xs text-muted-foreground">{item.unit}</p>}
            </div>
            <button onClick={() => deleteItem(item.id)} className="text-xs text-red-500 hover:text-red-400 transition-colors">
              Verwijder
            </button>
          </div>
        ))}
      </Card>

      <Card className="p-4 space-y-3 bg-secondary">
        <h2 className="font-medium text-sm text-foreground">Toevoegen</h2>
        <div className="flex gap-3">
          <input
            className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Naam (bijv. Olijfolie)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="w-28 border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Eenheid"
            value={unit}
            onChange={e => setUnit(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm" onClick={addItem as never}>Toevoegen</Button>
      </Card>
    </div>
  )
}
