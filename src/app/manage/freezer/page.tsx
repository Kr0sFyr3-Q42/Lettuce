'use client'

import { useEffect, useState } from 'react'
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
      <h1 className="text-xl font-semibold">Vriezer</h1>

      <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {items.length === 0 && (
          <li className="px-4 py-6 text-sm text-gray-400 text-center bg-white">Vriezer is leeg.</li>
        )}
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3 bg-white">
            <div>
              <p className="font-medium text-sm">{item.item_name}</p>
              <p className="text-xs text-gray-400">Toegevoegd: {item.date_added}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updatePortions(item, Math.max(1, item.portions - 1))}
                  className="w-6 h-6 rounded border border-gray-300 text-sm leading-none hover:bg-gray-100"
                >−</button>
                <span className="w-8 text-center text-sm font-medium">{item.portions}</span>
                <button
                  onClick={() => updatePortions(item, item.portions + 1)}
                  className="w-6 h-6 rounded border border-gray-300 text-sm leading-none hover:bg-gray-100"
                >+</button>
              </div>
              <span className="text-xs text-gray-400">port.</span>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >Verwijder</button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={addItem} className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h2 className="font-medium text-sm">Toevoegen</h2>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="Naam (bijv. Stoofvlees)"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Porties</label>
            <input
              type="number"
              min={1}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={portions}
              onChange={e => setPortions(Number(e.target.value))}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Datum ingevroren</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700">
          Toevoegen
        </button>
      </form>
    </div>
  )
}
