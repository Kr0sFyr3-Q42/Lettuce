import { db } from '../src/lib/db'
import { tags } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

const SYSTEM_TAGS = [
  {
    name: 'vegetarisch',
    prompt_snippet: 'Alle maaltijden zijn vegetarisch. Gebruik geen vlees of vis.',
  },
  {
    name: 'veganistisch',
    prompt_snippet:
      'Alle maaltijden zijn veganistisch. Gebruik geen dierlijke producten waaronder zuivel en eieren.',
  },
  {
    name: 'glutenvrij',
    prompt_snippet:
      'Alle maaltijden zijn glutenvrij. Gebruik geen tarwe, rogge, gerst of spelt.',
  },
  {
    name: 'lactosevrij',
    prompt_snippet: 'Vermijd alle zuivelproducten. Gebruik plantaardige alternatieven waar nodig.',
  },
]

for (const tag of SYSTEM_TAGS) {
  const existing = db.select().from(tags).where(eq(tags.name, tag.name)).get()
  if (!existing) {
    db.insert(tags).values({ ...tag, is_system: true, is_active: true }).run()
    console.log(`Inserted: ${tag.name}`)
  } else {
    console.log(`Skipped (exists): ${tag.name}`)
  }
}

console.log('Seed complete.')
