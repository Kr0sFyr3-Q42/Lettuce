import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'

export const tags = sqliteTable('tags', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  name:           text('name').notNull().unique(),
  prompt_snippet: text('prompt_snippet').notNull(),
  is_system:      integer('is_system', { mode: 'boolean' }).notNull().default(false),
  is_active:      integer('is_active', { mode: 'boolean' }).notNull().default(true),
})

export const freezer_inventory = sqliteTable('freezer_inventory', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  item_name:  text('item_name').notNull(),
  portions:   integer('portions').notNull().default(1),
  date_added: text('date_added').notNull(),
})

export const pantry_inventory = sqliteTable('pantry_inventory', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  item_name: text('item_name').notNull(),
  unit:      text('unit'),
  quantity:  real('quantity'),
  location:  text('location').notNull().default('voorraadkast'),
})

export const meal_history = sqliteTable('meal_history', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  meal_name:   text('meal_name').notNull(),
  date_served: text('date_served').notNull(),
  servings:    integer('servings').notNull(),
})

export const saved_menus = sqliteTable('saved_menus', {
  id:              integer('id').primaryKey({ autoIncrement: true }),
  name:            text('name').notNull(),
  menu_data:       text('menu_data').notNull(),
  persons_per_day: text('persons_per_day').notNull(),
  created_at:      text('created_at').notNull(),
})
