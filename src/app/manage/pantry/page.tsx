'use client'

import { useEffect, useState } from 'react'
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
      <h1 className="text-xl font-semibold">Basisvoorraad</h1>
      <p className="text-sm text-gray-500">
        Items hier worden nooit op de boodschappenlijst gezet — de AI gaat ervan uit dat je ze altijd in huis hebt.
      </p>

      <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {items.length === 0 && (
          <li className="px-4 py-6 text-sm text-gray-400 text-center bg-white">Nog geen items.</li>
        )}
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3 bg-white">
            <div>
              <p className="font-medium text-sm">{item.item_name}</p>
              {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-xs text-red-500 hover:text-red-700"
            >Verwijder</button>
          </li>
        ))}
      </ul>

      <form onSubmit={addItem} className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h2 className="font-medium text-sm">Toevoegen</h2>
        <div className="flex gap-3">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Naam (bijv. Olijfolie)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="w-28 border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Eenheid"
            value={unit}
            onChange={e => setUnit(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700">
          Toevoegen
        </button>
      </form>
    </div>
  )
}
