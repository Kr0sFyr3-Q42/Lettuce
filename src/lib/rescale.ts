import type { ShoppingDepartment } from '@/lib/types'

function roundToPackSize(value: number): number {
  if (value <= 0) return 0
  // Use progressively coarser rounding based on quantity size
  if (value <= 50)  return Math.round(value / 5) * 5
  if (value <= 250) return Math.round(value / 25) * 25
  if (value <= 1000) return Math.round(value / 50) * 50
  return Math.round(value / 100) * 100
}

export function rescaleShoppingList(
  departments: ShoppingDepartment[],
  originalPersons: number,
  newPersons: number
): ShoppingDepartment[] {
  if (originalPersons <= 0) return departments
  const ratio = newPersons / originalPersons

  return departments.map(dept => ({
    ...dept,
    items: dept.items.map(item => {
      const original = parseFloat(item.quantity)
      if (isNaN(original)) return item
      const scaled = roundToPackSize(original * ratio)
      return { ...item, quantity: String(scaled) }
    }),
  }))
}

export function avgPersons(personsPerDay: Record<string, number>): number {
  const values = Object.values(personsPerDay).filter(n => n > 0)
  if (values.length === 0) return 1
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}
