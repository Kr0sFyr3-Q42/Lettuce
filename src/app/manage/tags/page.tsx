'use client'

import { useEffect, useState } from 'react'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Tag } from '@/lib/types'

export default function TagsPage() {
  const [tagList, setTagList] = useState<Tag[]>([])
  const [name, setName] = useState('')
  const [snippet, setSnippet] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const res = await fetch('/api/tags')
    setTagList(await res.json())
  }

  useEffect(() => { load() }, [])

  async function toggleActive(tag: Tag) {
    await fetch(`/api/tags/${tag.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !tag.is_active }),
    })
    load()
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
    if (!res.ok) {
      setError((await res.json()).error)
      return
    }
    setName('')
    setSnippet('')
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-xl font-semibold text-foreground">Tags</h1>

      <Card className="overflow-hidden divide-y divide-border">
        {tagList.map(tag => (
          <div key={tag.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Toggle
                checked={tag.is_active}
                onChange={() => toggleActive(tag)}
                id={`active-${tag.id}`}
              />
              <div>
                <p className="font-medium text-sm text-foreground">{tag.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-xs">{tag.prompt_snippet}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tag.is_system && (
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">systeem</span>
              )}
              {!tag.is_system && (
                <button onClick={() => deleteTag(tag.id)} className="text-xs text-red-500 hover:text-red-400 transition-colors">
                  Verwijder
                </button>
              )}
            </div>
          </div>
        ))}
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
