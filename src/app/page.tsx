'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PeoplePicker, { DAYS } from '@/components/PeoplePicker'
import TagSelector, { EMPTY_TAG_ASSIGNMENTS } from '@/components/TagSelector'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { TagAssignments, LettuceSession } from '@/lib/types'

const DEFAULT_PERSONS = Object.fromEntries(DAYS.map(d => [d.key, 2]))

export default function Home() {
  const router = useRouter()
  const [personsPerDay, setPersonsPerDay]   = useState<Record<string, number>>(DEFAULT_PERSONS)
  const [tagAssignments, setTagAssignments] = useState<TagAssignments>(EMPTY_TAG_ASSIGNMENTS)

  const anyPersons    = Object.values(personsPerDay).some(n => n > 0)
  const totalPersons  = Object.values(personsPerDay).reduce((a, b) => a + b, 0)
  const avgPersons    = (totalPersons / 7).toFixed(1)
  const activeTagCount = tagAssignments.allDays.length +
    Object.values(tagAssignments.perDay).flat().filter(Boolean).length

  function handleNext() {
    const session: LettuceSession = { personsPerDay, tagAssignments }
    sessionStorage.setItem('lettuce_session', JSON.stringify(session))
    router.push('/planning')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT: People picker */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Hoeveel mensen eten er mee?</h1>
            <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Selecteer per dag het aantal personen.
            </p>
            <PeoplePicker value={personsPerDay} onChange={setPersonsPerDay} />
            <Card className="mt-4 p-4">
              <p className="text-xs font-medium text-muted-foreground">Gemiddeld per avond</p>
              <p className="text-2xl font-bold mt-0.5">{avgPersons} <span className="text-base font-normal text-muted-foreground">personen</span></p>
            </Card>
          </div>

          {/* RIGHT: Tags + CTA */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Dieetwensen & voorkeuren</h2>
            <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Schakel tags in voor de hele week of per dag.
            </p>

            <TagSelector value={tagAssignments} onChange={setTagAssignments} />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Actieve filters</p>
                <p className="text-2xl font-bold mt-0.5">{activeTagCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeTagCount === 0 ? 'Geen beperkingen' : 'ingesteld'}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Maaltijden te plannen</p>
                <p className="text-2xl font-bold mt-0.5">7</p>
                <p className="text-xs text-muted-foreground mt-1">ma t/m zo</p>
              </Card>
            </div>

            <div className="mt-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!anyPersons}
                onClick={handleNext}
              >
                Volgende stap →
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                De AI controleert je vriezer & eetgeschiedenis voor je bevestigt.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
