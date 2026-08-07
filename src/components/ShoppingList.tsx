'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Toggle'
import type { ShoppingDepartment } from '@/lib/types'

type Props = { departments: ShoppingDepartment[] }

export default function ShoppingList({ departments }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  function toggle(key: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function copyToClipboard() {
    const text = departments.map(dept =>
      `${dept.department}\n${dept.items.map(i => `- ${i.name} ${i.quantity}${i.unit}`).join('\n')}`
    ).join('\n\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const totalItems = departments.reduce((n, d) => n + d.items.length, 0)
  const checkedCount = checked.size

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Boodschappenlijst
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {checkedCount}/{totalItems}
          </span>
        </h2>
        <Button variant="secondary" size="sm" onClick={copyToClipboard}>
          {copied ? '✓ Gekopieerd' : 'Kopieer'}
        </Button>
      </div>

      <div className="space-y-4">
        {departments.map(dept => (
          <Card key={dept.department} className="overflow-hidden">
            <div className="px-4 py-2 bg-secondary border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {dept.department}
              </p>
            </div>
            <div className="divide-y divide-border">
              {dept.items.map(item => {
                const key = `${dept.department}:${item.name}`
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      checked.has(key) ? 'opacity-50' : ''
                    }`}
                  >
                    <Checkbox
                      checked={checked.has(key)}
                      onChange={() => toggle(key)}
                      id={key}
                    />
                    <span className={`text-sm flex-1 text-foreground ${checked.has(key) ? 'line-through' : ''}`}>
                      {item.name}
                    </span>
                    <span className="text-sm text-muted-foreground tabular-nums flex-shrink-0">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
