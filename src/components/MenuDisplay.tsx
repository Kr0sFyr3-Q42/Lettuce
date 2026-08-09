'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import type { PlannerDay, Meal } from '@/lib/types'

type Props = { days: PlannerDay[] }

function copyMeal(meal: Meal) {
  const text = [meal.name, ...meal.recipe_steps.map((s, i) => `${i + 1}. ${s}`)].join('\n')
  navigator.clipboard.writeText(text)
}

export default function MenuDisplay({ days }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  function handleCopy(key: string, meal: Meal) {
    copyMeal(meal)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Weekmenu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {days.map(day => (
          <Card key={day.day} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">{day.day}</h3>
              <span className="text-xs text-muted-foreground">{day.persons} personen</span>
            </div>
            {day.meals.map((meal, i) => {
              const key = `${day.day}-${i}`
              const isCopied = copied === key
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{meal.name}</p>
                    <button
                      onClick={() => handleCopy(key, meal)}
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={`Kopieer recept ${meal.name}`}
                    >
                      {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {meal.recipe_steps.length > 0 && (
                    <ol className="space-y-1 list-decimal list-inside">
                      {meal.recipe_steps.map((step, j) => (
                        <li key={j} className="text-xs text-muted-foreground leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  )}
                </div>
              )
            })}
          </Card>
        ))}
      </div>
    </div>
  )
}
