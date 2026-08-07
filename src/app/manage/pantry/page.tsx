'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { PantryItem } from '@/lib/types'

type Location = 'standaard' | 'koelkast' | 'vriezer' | 'voorraadkast'

const SECTIONS: { location: Location; title: string; placeholder: string; emoji: string }[] = [
  { location: 'standaard',   title: 'Standaardvoorraad', placeholder: 'bijv. Kokosmelk',    emoji: '🧂' },
  { location: 'koelkast',   title: 'Koelkast',          placeholder: 'bijv. Boter, Eieren', emoji: '🧊' },
  { location: 'vriezer',    title: 'Vriezer',            placeholder: 'bijv. Diepvries erwten', emoji: '❄️' },
  { location: 'voorraadkast', title: 'Voorraadkast',    placeholder: 'bijv. Pasta, Blikjes', emoji: '🗄️' },
]

function PantrySection({
  title, emoji, placeholder, location, items, onAdd, onDelete,
}: {
  title: string; emoji: string; placeholder: string; location: Location
  items: PantryItem[]; onAdd: (name: string, unit: string, loc: Location) => void; onDelete: (id: number) => void
}) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), unit.trim(), location)
    setName('')
    setUnit('')
  }

  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <span>{emoji}</span>{title}
      </h2>

      <Card className="overflow-hidden divide-y divide-border">
        {items.length === 0 && (
          <p className="px-4 py-4 text-sm text-muted-foreground text-center">Nog geen items.</p>
        )}
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-sm text-foreground">{item.item_name}</p>
              {item.unit && <p className="text-xs text-muted-foreground">{item.unit}</p>}
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-xs text-red-500 hover:text-red-400 transition-colors"
            >
              Verwijder
            </button>
          </div>
        ))}
      </Card>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder={placeholder}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="w-24 border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Eenheid"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        />
        <Button type="submit" size="sm" variant="secondary">+</Button>
      </form>
    </div>
  )
}

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([])

  async function load() {
    const res = await fetch('/api/pantry')
    setItems(await res.json())
  }

  useEffect(() => { load() }, [])

  async function addItem(item_name: string, unit: string, location: Location) {
    await fetch('/api/pantry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_name, unit: unit || null, location }),
    })
    load()
  }

  async function deleteItem(id: number) {
    await fetch(`/api/pantry/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Basisvoorraad</h1>
        <p className="text-sm text-muted-foreground mt-1">
          De AI gaat ervan uit dat alles wat je hier toevoegt al in huis is. Het wordt gebruikt in recepten maar staat niet op je boodschappenlijst. Handig voor basisspullen zoals olie, zout en specerijen, maar ook voor koelkast- en vriezeringrediënten die je nog op voorraad hebt.
          <br /><br />
          Tip: Als je wilt dat de AI een volledige boodschappenlijst genereert, laat deze velden leeg. Voeg alleen toe wat je echt in huis hebt, of waarvan je wilt dat de AI het gebruikt, en houdt het actief bij. Zo voorkom je dat de AI dingen toevoegt die je niet in huis hebt.
        </p>
      </div>

      {SECTIONS.map(section => (
        <PantrySection
          key={section.location}
          {...section}
          items={items.filter(i => (i.location ?? 'voorraadkast') === section.location)}
          onAdd={addItem}
          onDelete={deleteItem}
        />
      ))}
    </div>
  )
}
