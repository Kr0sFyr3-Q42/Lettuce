'use client'

import { useEffect, useState } from 'react'
import Toggle, { Checkbox } from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Tag } from '@/lib/types'

const DAY_LABELS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const DAY_SHORT  = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

export default function TagsPage() {
  const [tagList, setTagList]   = useState<Tag[]>([])
  const [name, setName]         = useState('')
  const [snippet, setSnippet]   = useState('')
  const [error, setError]       = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName]   = useState('')
  const [editSnippet, setEditSnippet] = useState('')
  const [newAllDays, setNewAllDays]   = useState(false)
  const [newDays, setNewDays]         = useState<string[]>([])

  async function load() {
    const res = await fetch('/api/tags')
    setTagList(await res.json())
  }

  useEffect(() => { load() }, [])

  async function update(id: number, patch: Partial<Tag>) {
    await fetch(`/api/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    load()
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id)
    setEditName(tag.name)
    setEditSnippet(tag.prompt_snippet)
  }

  async function saveEdit(id: number) {
    await update(id, { name: editName.trim(), prompt_snippet: editSnippet.trim() })
    setEditingId(null)
  }

  function getDefaultDays(tag: Tag): string[] {
    try { return JSON.parse(tag.default_days ?? '[]') } catch { return [] }
  }

  async function toggleDefaultDay(tag: Tag, day: string) {
    const days = getDefaultDays(tag)
    const next = days.includes(day) ? days.filter(d => d !== day) : [...days, day]
    await update(tag.id, { default_days: JSON.stringify(next) })
  }

  async function deleteTag(id: number) {
    await fetch(`/api/tags/${id}`, { method: 'DELETE' })
    load()
  }

  async function createTag(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, prompt_snippet: snippet }),
    })
    if (!res.ok) { setError((await res.json()).error); return }
    const created = await res.json()
    await update(created.id, {
      default_all_days: newAllDays,
      default_days: JSON.stringify(newDays),
    })
    setName(''); setSnippet(''); setNewAllDays(false); setNewDays([])
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Tags</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Stel in welke tags standaard actief zijn op het configureer scherm.
        </p>
      </div>

      <Card className="overflow-hidden divide-y divide-border">
        {tagList.map(tag => {
          const defaultDays = getDefaultDays(tag)
          const isEditing = editingId === tag.id
          return (
            <div key={tag.id} className="px-4 py-4 space-y-3">
              {/* Top row: name + actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        className="w-full border border-border rounded-lg px-3 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />
                      <textarea
                        className="w-full border border-border rounded-lg px-3 py-1.5 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
                        value={editSnippet}
                        onChange={e => setEditSnippet(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(tag.id)}>Opslaan</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Annuleer</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-sm text-foreground">{tag.name}</p>
                      <p className="text-xs text-muted-foreground break-words">{tag.prompt_snippet}</p>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => startEdit(tag)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Bewerk
                    </button>
                    <button
                      onClick={() => deleteTag(tag.id)}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors"
                    >
                      Verwijder
                    </button>
                  </div>
                )}
              </div>

              {/* Default controls — hidden while editing */}
              {!isEditing && (
                <div className="space-y-2">
                  <Toggle
                    checked={tag.default_all_days}
                    onChange={() => update(tag.id, { default_all_days: !tag.default_all_days })}
                    label="Standaard hele week"
                    id={`all-${tag.id}`}
                  />
                  {!tag.default_all_days && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Standaard actief op:</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {DAY_LABELS.map((day, i) => (
                          <label key={day} className="flex flex-col items-center gap-0.5 cursor-pointer">
                            <span className="text-[10px] text-muted-foreground">{DAY_SHORT[i]}</span>
                            <Checkbox
                              checked={defaultDays.includes(day)}
                              onChange={() => toggleDefaultDay(tag, day)}
                              id={`def-${tag.id}-${day}`}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </Card>

      <Card className="p-4 space-y-3 bg-secondary">
        <h2 className="font-medium text-sm text-foreground">Nieuwe tag</h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Naam"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring h-20 resize-none"
          placeholder="Prompt instructie (bijv. Gebruik niet de volgende ingrediënten: ...)"
          value={snippet}
          onChange={e => setSnippet(e.target.value)}
          required
        />
        <div className="space-y-2 pt-1">
          <Toggle
            checked={newAllDays}
            onChange={() => { setNewAllDays(v => !v); setNewDays([]) }}
            label="Standaard hele week"
            id="new-all-days"
          />
          {!newAllDays && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Standaard actief op:</p>
              <div className="flex items-center gap-2 flex-wrap">
                {DAY_LABELS.map((day, i) => (
                  <label key={day} className="flex flex-col items-center gap-0.5 cursor-pointer">
                    <span className="text-[10px] text-muted-foreground">{DAY_SHORT[i]}</span>
                    <Checkbox
                      checked={newDays.includes(day)}
                      onChange={() => setNewDays(prev =>
                        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                      )}
                      id={`new-day-${day}`}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button type="submit" size="sm" onClick={createTag as never}>Toevoegen</Button>
      </Card>
    </div>
  )
}
