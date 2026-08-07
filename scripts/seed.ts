import { db } from '../src/lib/db'
import { tags } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

const SYSTEM_TAGS = [
  {
    name: 'vegetarisch',
    prompt_snippet: 'Geen vlees of vis.',
  },
  {
    name: 'veganistisch',
    prompt_snippet: 'Geen dierlijke producten, inclusief zuivel en eieren.',
  },
  {
    name: 'glutenvrij',
    prompt_snippet: 'Geen tarwe, rogge, gerst of spelt.',
  },
  {
    name: 'lactosevrij',
    prompt_snippet: 'Geen zuivelproducten. Gebruik plantaardige alternatieven.',
  },
]

for (const tag of SYSTEM_TAGS) {
  const existing = db.select().from(tags).where(eq(tags.name, tag.name)).get()
  if (!existing) {
    db.insert(tags).values({ ...tag, is_system: true, is_active: true }).run()
    console.log(`Inserted: ${tag.name}`)
  } else {
    db.update(tags).set({ prompt_snippet: tag.prompt_snippet }).where(eq(tags.name, tag.name)).run()
    console.log(`Updated: ${tag.name}`)
  }
}

console.log('Seed complete.')
