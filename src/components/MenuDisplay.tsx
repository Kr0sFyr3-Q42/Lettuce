'use client'

import Card from '@/components/ui/Card'
import { type Locale, t } from '@/lib/i18n'
import type { PlannerDay } from '@/lib/types'

type Props = { days: PlannerDay[]; locale?: Locale }

export default function MenuDisplay({ days, locale = 'nl' }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">{t(locale, 'result_menu_heading')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {days.map(day => (
          <Card key={day.day} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">{day.day}</h3>
              <span className="text-xs text-muted-foreground">{day.persons} {t(locale, 'shop_persons')}</span>
            </div>
            {day.meals.map((meal, i) => (
              <div key={i} className="space-y-2">
                <p className="text-sm font-medium text-foreground">{meal.name}</p>
                {meal.recipe_steps.length > 0 && (
                  <ol className="space-y-1 list-decimal list-inside">
                    {meal.recipe_steps.map((step, j) => (
                      <li key={j} className="text-xs text-muted-foreground leading-relaxed">{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  )
}
