import type { InferSelectModel } from 'drizzle-orm'
import type {
  tags,
  freezer_inventory,
  pantry_inventory,
  meal_history,
  saved_menus,
} from './db/schema'

// DB row types
export type Tag = InferSelectModel<typeof tags>
export type FreezerItem = InferSelectModel<typeof freezer_inventory>
export type PantryItem = InferSelectModel<typeof pantry_inventory>
export type MealHistory = InferSelectModel<typeof meal_history>
export type SavedMenu = InferSelectModel<typeof saved_menus>

// AI output types

export type AuditorProposal = {
  id: string
  description: string
  suggested_day: string
  freezer_item_id: number
}

export type AuditorOutput = {
  proposals: AuditorProposal[]
}

export type Meal = {
  name: string
  recipe_steps: string[]
}

export type PlannerDay = {
  day: string
  persons: number
  meals: Meal[]
}

export type ShoppingItem = {
  name: string
  quantity: string
  unit: string
}

export type ShoppingDepartment = {
  department: string
  items: ShoppingItem[]
}

export type PlannerOutput = {
  days: PlannerDay[]
  shopping_list: ShoppingDepartment[]
}

// Session storage shape
export type LettuceSession = {
  personsPerDay: Record<string, number>
  activeTagIds: number[]
  acceptedProposals?: AuditorProposal[]
}
