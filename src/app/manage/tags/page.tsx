'use client'

import { useEffect, useState } from 'react'
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
      const data = await res.json()
      setError(data.error)
      return
    }
    setName('')
    setSnippet('')
    load()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-xl font-semibold">Tags</h1>

      <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {tagList.map(tag => (
          <li key={tag.id} className="flex items-center justify-between px-4 py-3 bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(tag)}
                className={`w-10 h-5 rounded-full transition-colors ${tag.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                title={tag.is_active ? 'Actief' : 'Inactief'}
              >
                <span className={`block w-4 h-4 bg-white rounded-full mx-0.5 transition-transform ${tag.is_active ? 'translate-x-5' : ''}`} />
              </button>
              <div>
                <p className="font-medium text-sm">{tag.name}</p>
                <p className="text-xs text-gray-400 truncate max-w-xs">{tag.prompt_snippet}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tag.is_system && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">systeem</span>
              )}
              {!tag.is_system && (
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Verwijder
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={createTag} className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h2 className="font-medium text-sm">Nieuwe tag</h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="Naam"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-20 resize-none"
          placeholder="Prompt instructie (bijv. Alle maaltijden zijn halal.)"
          value={snippet}
          onChange={e => setSnippet(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
        >
          Toevoegen
        </button>
      </form>
    </div>
  )
}
