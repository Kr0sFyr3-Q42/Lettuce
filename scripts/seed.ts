import { db } from '../src/lib/db'
import { tags, pantry_inventory } from '../src/lib/db/schema'
import { eq, and } from 'drizzle-orm'

const SYSTEM_TAGS = [
  { name: 'Vegetarisch',  prompt_snippet: 'Geen vlees of vis.' },
  { name: 'Veganistisch', prompt_snippet: 'Geen dierlijke producten, inclusief zuivel en eieren.' },
  { name: 'Glutenvrij',   prompt_snippet: 'Geen tarwe, rogge, gerst of spelt.' },
  { name: 'Lactosevrij',  prompt_snippet: 'Geen zuivelproducten. Gebruik plantaardige alternatieven.' },
  { name: 'Simpel',       prompt_snippet: 'Maak een snelle, eenvoudige doordeweekse maaltijd. Maximaal 30 minuten bereidingstijd.' },
  { name: 'Culinair',    prompt_snippet: 'Maak een sophistisch, restaurant-waardig gerecht. Gebruik bijzondere technieken, hoogwaardige ingrediënten en complexe smaken. Denk aan gerechten zoals confit, osso buco, beef wellington of een klassieke bisque.' },
]

for (const tag of SYSTEM_TAGS) {
  // Also match the old lowercase variant for renaming
  const existing = db.select().from(tags)
    .where(eq(tags.name, tag.name))
    .get()
    ?? db.select().from(tags)
    .where(eq(tags.name, tag.name.toLowerCase()))
    .get()

  if (!existing) {
    db.insert(tags).values({ ...tag, is_system: false, is_active: true }).run()
    console.log(`Inserted tag: ${tag.name}`)
  } else {
    db.update(tags).set({ name: tag.name, prompt_snippet: tag.prompt_snippet, is_system: false }).where(eq(tags.id, existing.id)).run()
    console.log(`Updated tag: ${existing.name} → ${tag.name}`)
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
