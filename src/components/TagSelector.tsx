'use client'

import { useEffect, useState } from 'react'
import type { Tag, TagAssignments } from '@/lib/types'

const DAY_LABELS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const DAY_SHORT = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

const EMPTY: TagAssignments = { allDays: [], perDay: {} }

type Props = {
  value: TagAssignments
  onChange: (assignments: TagAssignments) => void
}

export default function TagSelector({ value, onChange }: Props) {
  const [tagList, setTagList] = useState<Tag[]>([])
  const [newName, setNewName] = useState('')
  const [newSnippet, setNewSnippet] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const res = await fetch('/api/tags')
    setTagList(await res.json())
  }

  useEffect(() => { load() }, [])

  function isAllDays(tagId: number) {
    return value.allDays.includes(tagId)
  }

  function isDayChecked(tagId: number, day: string) {
    return value.perDay[day]?.includes(tagId) ?? false
  }

  function toggleAllDays(tagId: number) {
    if (isAllDays(tagId)) {
      // turn off: remove from allDays and clear perDay entries
      const perDay = { ...value.perDay }
      for (const day of DAY_LABELS) {
        if (perDay[day]) perDay[day] = perDay[day]!.filter(id => id !== tagId)
      }
      onChange({ allDays: value.allDays.filter(id => id !== tagId), perDay })
    } else {
      onChange({ allDays: [...value.allDays, tagId], perDay: value.perDay })
    }
  }

  function toggleDay(tagId: number, day: string) {
    const current = value.perDay[day] ?? []
    const updated = current.includes(tagId)
      ? current.filter(id => id !== tagId)
      : [...current, tagId]
    onChange({ allDays: value.allDays, perDay: { ...value.perDay, [day]: updated } })
  }

  async function createTag(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, prompt_snippet: newSnippet }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      return
    }
    setNewName('')
    setNewSnippet('')
    setShowForm(false)
    load()
  }

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-700 mb-3">Dieetwensen & restricties</h2>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {tagList.length === 0 && (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">Tags laden...</p>
        )}
        {tagList.map(tag => (
          <div key={tag.id} className="border-b border-gray-100 last:border-0 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Hele week toggle */}
              <button
                onClick={() => toggleAllDays(tag.id)}
                title={isAllDays(tag.id) ? 'Hele week aan' : 'Hele week uit'}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  isAllDays(tag.id) ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isAllDays(tag.id) ? 'translate-x-5' : ''
                  }`}
                />
              </button>

              {/* Tag name + tooltip */}
              <span
                className="text-sm font-medium flex-1 cursor-default"
                title={tag.prompt_snippet}
              >
                {tag.name}
              </span>

              {/* Per-day checkboxes (hidden when hele week is on) */}
              {!isAllDays(tag.id) && (
                <div className="flex items-center gap-1.5">
                  {DAY_LABELS.map((day, i) => (
                    <label key={day} className="flex flex-col items-center gap-0.5 cursor-pointer">
                      <span className="text-[10px] text-gray-400">{DAY_SHORT[i]}</span>
                      <input
                        type="checkbox"
                        checked={isDayChecked(tag.id, day)}
                        onChange={() => toggleDay(tag.id, day)}
                        className="w-3.5 h-3.5 accent-gray-900"
                      />
                    </label>
                  ))}
                </div>
              )}

              {isAllDays(tag.id) && (
                <span className="text-xs text-gray-400 italic">hele week</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New tag form */}
      <div className="mt-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            + Nieuwe tag aanmaken
          </button>
        ) : (
          <form onSubmit={createTag} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <input
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              placeholder="Naam (bijv. Nootvrij)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
            <textarea
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none"
              placeholder="Prompt instructie (bijv. Geen noten of notenproducten.)"
              value={newSnippet}
              onChange={e => setNewSnippet(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded hover:bg-gray-700">
                Toevoegen
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:text-gray-800">
                Annuleer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export { EMPTY as EMPTY_TAG_ASSIGNMENTS }
