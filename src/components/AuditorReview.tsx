'use client'

import { useState } from 'react'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { type Locale, t } from '@/lib/i18n'
import type { AuditorProposal } from '@/lib/types'

type Props = {
  proposals: AuditorProposal[]
  onConfirm: (accepted: AuditorProposal[]) => void
  locale?: Locale
}

export default function AuditorReview({ proposals, onConfirm, locale = 'nl' }: Props) {
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
          <p className="text-2xl">{t(locale, 'auditor_empty_icon')}</p>
          <p className="font-medium text-foreground">{t(locale, 'auditor_empty_title')}</p>
          <p className="text-sm text-muted-foreground">{t(locale, 'auditor_empty_sub')}</p>
        </Card>
        <Button variant="primary" size="lg" className="w-full" onClick={() => onConfirm([])}>
          {t(locale, 'auditor_generate')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">{t(locale, 'auditor_heading')}</h2>
        <p className="text-sm text-muted-foreground">{t(locale, 'auditor_sub')}</p>
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
                {t(locale, 'auditor_suggested')} {proposal.suggested_day}
              </p>
            </div>
          </div>
        ))}
      </Card>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {accepted.size} {t(locale, 'auditor_of')} {proposals.length} {t(locale, 'auditor_selected')}
        </p>
        <Button variant="primary" size="lg" onClick={handleConfirm}>
          {t(locale, 'auditor_generate')}
        </Button>
      </div>
    </div>
  )
}
