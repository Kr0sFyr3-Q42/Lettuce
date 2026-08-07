'use client'

import { useEffect, useState } from 'react'
import Toggle, { Checkbox } from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import { type Locale, t } from '@/lib/i18n'
import type { Tag, TagAssignments } from '@/lib/types'

// Always Dutch — keys must match tag assignments and AI prompt day names
const DAY_LABELS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
const DAY_SHORT_NL = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const DAY_SHORT_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export const EMPTY_TAG_ASSIGNMENTS: TagAssignments = { allDays: [], perDay: {} }

type Props = {
  value: TagAssignments
  onChange: (assignments: TagAssignments) => void
  locale?: Locale
}

export default function TagSelector({ value, onChange, locale = 'nl' }: Props) {
  const DAY_SHORT = locale === 'en' ? DAY_SHORT_EN : DAY_SHORT_NL
  const [tagList, setTagList]     = useState<Tag[]>([])
  const [newName, setNewName]     = useState('')
  const [newSnippet, setNewSnippet] = useState('')
  const [error, setError]         = useState('')
  const [showForm, setShowForm]   = useState(false)

  async function load() {
    const res = await fetch('/api/tags')
    setTagList(await res.json())
  }

  useEffect(() => { load() }, [])

  const isAllDays = (id: number) => value.allDays.includes(id)
  const isDayChecked = (id: number, day: string) => value.perDay[day]?.includes(id) ?? false

  function toggleAllDays(id: number) {
    const perDay = { ...value.perDay }
    DAY_LABELS.forEach(d => { if (perDay[d]) perDay[d] = perDay[d]!.filter(x => x !== id) })
    if (isAllDays(id)) {
      onChange({ allDays: value.allDays.filter(x => x !== id), perDay })
    } else {
      onChange({ allDays: [...value.allDays, id], perDay })
    }
  }

  function toggleDay(id: number, day: string) {
    const curr = value.perDay[day] ?? []
    const next = curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]
    onChange({ allDays: value.allDays, perDay: { ...value.perDay, [day]: next } })
  }

  async function createTag(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, prompt_snippet: newSnippet }),
    })
    if (!res.ok) { setError((await res.json()).error); return }
    setNewName(''); setNewSnippet(''); setShowForm(false)
    load()
  }

  return (
    <div>
      <div className="border border-border rounded-xl overflow-hidden">
        {tagList.length === 0 && (
          <p className="px-4 py-8 text-sm text-muted-foreground text-center">{t(locale, 'tag_loading')}</p>
        )}
        {tagList.map(tag => (
          <div key={tag.id} className="border-b border-border last:border-0 bg-card px-4 py-3">
            <div className="flex flex-col gap-2">
              {/* Top row: toggle + name + "hele week" label */}
              <div className="flex items-center gap-3">
                <Toggle
                  checked={isAllDays(tag.id)}
                  onChange={() => toggleAllDays(tag.id)}
                  id={`toggle-${tag.id}`}
                />
                <span className="text-sm font-medium flex-1 cursor-default" title={tag.prompt_snippet}>
                  {tag.name}
                </span>
                {isAllDays(tag.id) && (
                  <span className="text-xs text-muted-foreground italic">{t(locale, 'tag_whole_week')}</span>
                )}
              </div>

              {/* Day checkboxes — shown below when not "hele week" */}
              {!isAllDays(tag.id) && (
                <div className="flex items-center gap-2 flex-wrap pl-14">
                  {DAY_LABELS.map((day, i) => (
                    <label key={day} className="flex flex-col items-center gap-0.5 cursor-pointer">
                      <span className="text-[10px] text-muted-foreground">{DAY_SHORT[i]}</span>
                      <Checkbox
                        checked={isDayChecked(tag.id, day)}
                        onChange={() => toggleDay(tag.id, day)}
                        id={`cb-${tag.id}-${day}`}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            {t(locale, 'tag_new_btn')}
          </button>
        ) : (
          <div className="border border-border rounded-xl p-4 bg-secondary space-y-3">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t(locale, 'tag_name_ph')}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
            <textarea
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring h-16 resize-none"
              placeholder={t(locale, 'tag_snippet_ph')}
              value={newSnippet}
              onChange={e => setNewSnippet(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" onClick={createTag as never}>{t(locale, 'tag_add')}</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>{t(locale, 'tag_cancel')}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
