import { db } from '../src/lib/db'
import { tags, pantry_inventory } from '../src/lib/db/schema'
import { eq, and } from 'drizzle-orm'

const SYSTEM_TAGS = [
  { name: 'Vegetarisch',  prompt_snippet: 'Geen vlees of vis.' },
  { name: 'Veganistisch', prompt_snippet: 'Geen dierlijke producten, inclusief zuivel en eieren.' },
  { name: 'Glutenvrij',   prompt_snippet: 'Geen tarwe, rogge, gerst of spelt.' },
  { name: 'Lactosevrij',  prompt_snippet: 'Geen zuivelproducten. Gebruik plantaardige alternatieven.' },
  { name: 'Simpel',       prompt_snippet: 'Maak een snelle, eenvoudige doordeweekse maaltijd. Maximaal 30 minuten bereidingstijd.' },

  // Dieet / medisch
  { name: 'Diabetesvriendelijk', prompt_snippet: 'Kies maaltijden die laag zijn in snelle suikers en bewerkte koolhydraten. Gebruik volkoren varianten, peulvruchten en groenten met een lage glycemische index. Beperk witte rijst, wit brood en suikerhoudende sauzen.' },
  { name: 'Hartgezond',         prompt_snippet: 'Beperk verzadigd vet en zout. Kies voor onverzadigde vetten (olijfolie, avocado, noten) en vette vis rijk aan omega-3. Gebruik veel groenten, peulvruchten en volkoren granen.' },
  { name: 'Hoog-eiwit',         prompt_snippet: 'Elke maaltijd moet minimaal 30 gram eiwit bevatten. Gebruik eiwitrijke ingrediënten zoals kip, vis, eieren, Griekse yoghurt, kwark, tempeh of peulvruchten.' },

  // Praktisch
  { name: 'Meal prep',          prompt_snippet: 'Kies maaltijden die goed van tevoren te bereiden zijn en minstens 3 dagen in de koelkast of vriezer bewaard kunnen worden. Geef voorkeur aan gerechten die koud of opgewarmd even lekker zijn.' },
  { name: 'Eenpansgerecht',     prompt_snippet: 'Alle maaltijden moeten in één pan, pot of wokpan bereid kunnen worden. Minimale afwas, maximale smaak. Denk aan stoofpotten, wokgerechten, ovenschotels en soepen.' },
  { name: 'Kindvriendelijk',    prompt_snippet: 'Maak milde, vertrouwde maaltijden zonder sterke kruiden of pittige smaken. Vermijd rare texturen. Denk aan pasta, pannenkoeken, gehaktballen en ovenschotels die kinderen graag eten.' },
  { name: 'Culinair',           prompt_snippet: 'Maak een sophistisch, restaurant-waardig gerecht. Gebruik bijzondere technieken, hoogwaardige ingrediënten en complexe smaken. Denk aan gerechten zoals confit, osso buco, beef wellington of een klassieke bisque.' },
  { name: 'Budget',            prompt_snippet: 'Kies budget-vriendelijke maaltijden. Gebruik goedkope eiwitbronnen zoals eieren, peulvruchten, kip of gehakt. Vermijd dure ingrediënten zoals oesters, truffels, wagyu of zeevruchten. Prioriteer seizoensgroenten en bulkproducten zoals pasta, rijst en linzen.' },

  // Seizoen
  { name: 'Zomers',             prompt_snippet: 'Kies lichte, frisse maaltijden die passen bij warm weer. Gebruik veel salades, gegrilde groenten en vis, koude gerechten en mediterrane smaken. Vermijd zware stoofpotten en veel vet.' },
  { name: 'Winterkost',         prompt_snippet: 'Kies stevige, verwarmende maaltijden die passen bij koud weer. Denk aan stamppot, soep, stoofvlees, ovenschotels en gerechten met wortelgroenten en koolsoorten.' },

  // Wereldkeukens
  { name: 'Aziatisch',          prompt_snippet: 'Gebruik Aziatische ingrediënten en technieken: wokken, rijst of noedels, sojasaus, gember, sesam, knoflook en lente-ui. Denk aan Chinese, Japanse, Thaise of Vietnamese inspiratie.' },
  { name: 'Mediterraan',        prompt_snippet: 'Gebruik mediterrane ingrediënten: olijfolie, tomaat, courgette, aubergine, feta, olijven, citroen en verse kruiden zoals basilicum, oregano en tijm. Inspiratie uit Griekenland, Italië en Spanje.' },
  { name: 'Midden-Oosters',     prompt_snippet: 'Gebruik Midden-Oosterse smaken: komijn, koriander, kaneel, kurkuma, sumak, tahini, granaatappel en flatbread. Denk aan gerechten zoals shakshuka, falafel, kofta en pilav.' },
  { name: 'Latijns-Amerikaans', prompt_snippet: 'Gebruik Latijns-Amerikaanse ingrediënten: bonen, mais, avocado, koriander, limoensap en milde tot medium pittige kruiden. Denk aan gerechten zoals burrito bowls, chili, ceviche en arroz con pollo.' },
  { name: 'Noord-Afrikaans',    prompt_snippet: 'Gebruik Noord-Afrikaanse smaken: ras el hanout, couscous, kikkererwten, gedroogd fruit, amandelen en honing. Denk aan tajines, harira-soep en gegrild vlees met kruidige marinades.' },
  { name: 'Oost-Europees',      prompt_snippet: 'Gebruik Oost-Europese ingrediënten: kool, aardappel, rode biet, zure room, dille en gestoofde vleesgerechten. Denk aan borscht, goulash, pierogi en koolrolletjes.' },
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
