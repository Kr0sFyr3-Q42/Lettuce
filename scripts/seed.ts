import { db } from '../src/lib/db'
import { tags, pantry_inventory } from '../src/lib/db/schema'
import { eq, and } from 'drizzle-orm'

const SYSTEM_TAGS = [
  { name: 'vegetarisch',  prompt_snippet: 'Geen vlees of vis.' },
  { name: 'veganistisch', prompt_snippet: 'Geen dierlijke producten, inclusief zuivel en eieren.' },
  { name: 'glutenvrij',   prompt_snippet: 'Geen tarwe, rogge, gerst of spelt.' },
  { name: 'lactosevrij',  prompt_snippet: 'Geen zuivelproducten. Gebruik plantaardige alternatieven.' },
  { name: 'simpel',       prompt_snippet: 'Maak een snelle, eenvoudige doordeweekse maaltijd. Maximaal 30 minuten bereidingstijd.' },
]

for (const tag of SYSTEM_TAGS) {
  const existing = db.select().from(tags).where(eq(tags.name, tag.name)).get()
  if (!existing) {
    db.insert(tags).values({ ...tag, is_system: true, is_active: true }).run()
    console.log(`Inserted tag: ${tag.name}`)
  } else {
    db.update(tags).set({ prompt_snippet: tag.prompt_snippet }).where(eq(tags.name, tag.name)).run()
    console.log(`Updated tag: ${tag.name}`)
  }
}

const STANDAARD = [
  'Zout', 'Peper', 'Olijfolie', 'Zonnebloemolie', 'Suiker',
  'Bloem', 'Azijn', 'Knoflook', 'Ui', 'Bouillonblokjes',
]

for (const item_name of STANDAARD) {
  const existing = db.select().from(pantry_inventory)
    .where(and(eq(pantry_inventory.item_name, item_name), eq(pantry_inventory.location, 'standaard')))
    .get()
  if (!existing) {
    db.insert(pantry_inventory).values({ item_name, location: 'standaard' }).run()
    console.log(`Inserted standaard: ${item_name}`)
  } else {
    console.log(`Skipped (exists): ${item_name}`)
  }
}

console.log('Seed complete.')
