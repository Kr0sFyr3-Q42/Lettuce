'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PeoplePicker, { DAYS } from '@/components/PeoplePicker'
import TagSelector, { EMPTY_TAG_ASSIGNMENTS } from '@/components/TagSelector'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useLocale } from '@/hooks/useLocale'
import type { Tag, TagAssignments, LettuceSession } from '@/lib/types'

const DEFAULT_PERSONS = Object.fromEntries(DAYS.map(d => [d.key, 2]))

export default function Home() {
  const router = useRouter()
  const { locale, t } = useLocale()
  const [personsPerDay, setPersonsPerDay]   = useState<Record<string, number>>(DEFAULT_PERSONS)
  const [tagAssignments, setTagAssignments] = useState<TagAssignments>(EMPTY_TAG_ASSIGNMENTS)

  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then((tags: Tag[]) => {
      const allDays = tags.filter(tg => tg.default_all_days).map(tg => tg.id)
      const perDay: Partial<Record<string, number[]>> = {}
      for (const tag of tags) {
        const days: string[] = JSON.parse(tag.default_days ?? '[]')
        for (const day of days) {
          perDay[day] = [...(perDay[day] ?? []), tag.id]
        }
      }
      if (allDays.length > 0 || Object.keys(perDay).length > 0) {
        setTagAssignments({ allDays, perDay })
      }
    })
  }, [])

  const anyPersons      = Object.values(personsPerDay).some(n => n > 0)
  const daysWithPersons = Object.values(personsPerDay).filter(n => n > 0).length
  const totalPersons    = Object.values(personsPerDay).reduce((a, b) => a + b, 0)
  const activeTagCount  = new Set([
    ...tagAssignments.allDays,
    ...Object.values(tagAssignments.perDay).flat(),
  ]).size

  function handleNext() {
    const session: LettuceSession = { personsPerDay, tagAssignments }
    sessionStorage.setItem('lettuce_session', JSON.stringify(session))
    router.push('/planning')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold tracking-tight mb-10 text-center">🥬 Lettuce plan your meals!</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: People picker */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">{t('home_heading_people')}</h2>
            <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              {t('home_sub_people')}
            </p>
            <PeoplePicker value={personsPerDay} onChange={setPersonsPerDay} locale={locale} />
            <Card className="mt-4 p-4">
              <p className="text-xs font-medium text-muted-foreground">{t('home_avg_label')}</p>
              <p className="text-2xl font-bold mt-0.5">{totalPersons} <span className="text-base font-normal text-muted-foreground">{t('home_avg_unit')}</span></p>
            </Card>
          </div>

          {/* RIGHT: Tags + CTA */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight mb-1">{t('home_heading_tags')}</h2>
            <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              {t('home_sub_tags')}
            </p>

            <TagSelector value={tagAssignments} onChange={setTagAssignments} locale={locale} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">{t('home_filters_label')}</p>
                <p className="text-2xl font-bold mt-0.5">{activeTagCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeTagCount === 0 ? t('home_filters_none') : t('home_filters_set')}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-medium text-muted-foreground">{t('home_meals_label')}</p>
                <p className="text-2xl font-bold mt-0.5">{daysWithPersons}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {daysWithPersons === 7 ? t('home_meals_full_week') : t('home_meals_unit')}
                </p>
              </Card>
            </div>

            <div className="mt-6">
              <Button variant="primary" size="lg" className="w-full" disabled={!anyPersons} onClick={handleNext}>
                {t('home_next_btn')}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('home_next_sub')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
