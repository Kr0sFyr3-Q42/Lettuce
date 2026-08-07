'use client'

import { useState } from 'react'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { AuditorProposal } from '@/lib/types'

type Props = {
  proposals: AuditorProposal[]
  onConfirm: (accepted: AuditorProposal[]) => void
}

export default function AuditorReview({ proposals, onConfirm }: Props) {
  const [accepted, setAccepted] = useState<Set<string>>(
    () => new Set(proposals.map(p => p.id))
  )

  function toggle(id: string) {
    setAccepted(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleConfirm() {
    onConfirm(proposals.filter(p => accepted.has(p.id)))
  }

  if (proposals.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center space-y-2">
          <p className="text-2xl">🧊</p>
          <p className="font-medium text-foreground">Geen kliekjes gevonden</p>
          <p className="text-sm text-muted-foreground">
            Voeg kliekjes toe via het Kliekjes-menu om ze in te plannen.
          </p>
        </Card>
        <Button variant="primary" size="lg" className="w-full" onClick={() => onConfirm([])}>
          Genereer weekmenu →
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Kliekjes inplannen</h2>
        <p className="text-sm text-muted-foreground">
          De AI heeft deze kliekjes gevonden. Selecteer wat je deze week wil gebruiken.
        </p>
      </div>

      <Card className="divide-y divide-border overflow-hidden">
        {proposals.map(proposal => (
          <div key={proposal.id} className="flex items-center gap-4 px-4 py-4">
            <Toggle
              checked={accepted.has(proposal.id)}
              onChange={() => toggle(proposal.id)}
              id={`proposal-${proposal.id}`}
            />
            <div className="flex-1">
              <p className="text-sm text-foreground">{proposal.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Voorgesteld voor: {proposal.suggested_day}
              </p>
            </div>
          </div>
        ))}
      </Card>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {accepted.size} van {proposals.length} geselecteerd
        </p>
        <Button variant="primary" size="lg" onClick={handleConfirm}>
          Genereer weekmenu →
        </Button>
      </div>
    </div>
  )
}
