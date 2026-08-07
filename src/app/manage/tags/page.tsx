'use client'

import { useEffect, useState } from 'react'
import Toggle, { Checkbox } from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Tag } from '@/lib/types'

const DAY_LABELS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const DAY_SHORT  = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

export default function TagsPage() {
  const [tagList, setTagList] = useState<Tag[]>([])
  const [name, setName]       = useState('')
  const [snippet, setSnippet] = useState('')
  const [error, setError]     = useState('')

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
    setName(''); setSnippet('')
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
          return (
            <div key={tag.id} className="px-4 py-4 space-y-3">
              {/* Top row: name + delete */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm text-foreground">{tag.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">{tag.prompt_snippet}</p>
                </div>
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="text-xs text-red-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  Verwijder
                </button>
              </div>

              {/* Default controls */}
              <div className="space-y-2 pl-0">
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
        <Button type="submit" size="sm" onClick={createTag as never}>Toevoegen</Button>
      </Card>
    </div>
  )
}
