'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PeoplePicker, { DAYS } from '@/components/PeoplePicker'
import TagSelector, { EMPTY_TAG_ASSIGNMENTS } from '@/components/TagSelector'
import type { TagAssignments, LettuceSession } from '@/lib/types'

const DEFAULT_PERSONS = Object.fromEntries(DAYS.map(d => [d.key, 2]))

export default function Home() {
  const router = useRouter()
  const [personsPerDay, setPersonsPerDay] = useState<Record<string, number>>(DEFAULT_PERSONS)
  const [tagAssignments, setTagAssignments] = useState<TagAssignments>(EMPTY_TAG_ASSIGNMENTS)

  const anyPersons = Object.values(personsPerDay).some(n => n > 0)

  function handleNext() {
    const session: LettuceSession = { personsPerDay, tagAssignments }
    sessionStorage.setItem('lettuce_session', JSON.stringify(session))
    router.push('/planning')
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Weekmenu plannen</h1>
        <p className="text-sm text-gray-500 mt-1">
          Stap 1 van 3 — Vul in hoeveel personen er eten en kies eventuele dieetwensen.
        </p>
      </div>

      {/* People picker */}
      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <PeoplePicker value={personsPerDay} onChange={setPersonsPerDay} />
      </section>

      {/* Tag selector */}
      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <TagSelector value={tagAssignments} onChange={setTagAssignments} />
      </section>

      {/* Next step */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          De AI controleert daarna je vriezer en eetgeschiedenis voor je bevestigt.
        </p>
        <button
          onClick={handleNext}
          disabled={!anyPersons}
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Volgende stap →
        </button>
      </div>
    </div>
  )
}
