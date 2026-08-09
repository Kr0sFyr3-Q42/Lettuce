import type { AuditorOutput, PlannerOutput } from '@/lib/types'

export const MOCK_ENABLED = process.env.MOCK_AI === 'true'

export const MOCK_AUDITOR: AuditorOutput = {
  proposals: [
    {
      id: 'mock-1',
      description: 'Ik zie 3 porties technical debt — plannen voor maandag?',
      suggested_day: 'Maandag',
      freezer_item_id: 1,
    },
    {
      id: 'mock-2',
      description: 'Er liggen nog onafgemaakte features in de vriezer.',
      suggested_day: 'Vrijdag',
      freezer_item_id: 2,
    },
  ],
}

export const MOCK_PLAN: PlannerOutput = {
  days: [
    {
      day: 'Maandag',
      persons: 2,
      meals: [{
        name: 'Stack Overflow Soep',
        recipe_steps: ['Kopieer recept van internet.', 'Werkt niet.', 'Kopieer een ander recept.', 'Werkt ook niet.', 'Bestel pizza.'],
      }],
    },
    {
      day: 'Dinsdag',
      persons: 2,
      meals: [{
        name: 'npm install Pasta',
        recipe_steps: ['Run npm install.', 'Wacht 45 minuten.', 'Er zijn 847 dependencies geïnstalleerd.', '3 hebben een critical vulnerability.', 'Eet de pasta rauw.'],
      }],
    },
    {
      day: 'Woensdag',
      persons: 2,
      meals: [{
        name: '404 Risotto',
        recipe_steps: ['Zoek ingrediënten.', 'Ingrediënten niet gevonden.', 'Probeer het opnieuw.', '404 ingrediënten not found.', 'Eet beschuit.'],
      }],
    },
    {
      day: 'Donderdag',
      persons: 2,
      meals: [{
        name: 'Merge Conflict Salade',
        recipe_steps: ['Maak sla aan.', 'Maak ook een andere sla aan.', 'Probeer ze samen te voegen.', '<<<<<<< HEAD', 'Gooi beide salades weg.'],
      }],
    },
    {
      day: 'Vrijdag',
      persons: 2,
      meals: [{
        name: 'Undefined Behavior Stew',
        recipe_steps: ['Voeg willekeurige ingrediënten toe.', 'Resultaat is ongedefinieerd.', 'Kan heerlijk zijn.', 'Kan ook vergiftigd zijn.', 'Alleen testen in productie.'],
      }],
    },
    {
      day: 'Zaterdag',
      persons: 2,
      meals: [{
        name: 'Recursieve Lasagne',
        recipe_steps: ['Maak een lasagne.', 'Voeg een lasagne toe als laag.', 'Voeg nog een lasagne toe als laag.', 'Maximum call stack size exceeded.', 'Bel de brandweer.'],
      }],
    },
    {
      day: 'Zondag',
      persons: 2,
      meals: [{
        name: 'Hello World Hagelslag',
        recipe_steps: ['Pak twee boterhammen.', 'Doe hagelslag erop.', 'console.log("Eet smakelijk").', 'Dit is het enige recept dat altijd werkt.'],
      }],
    },
  ],
  shopping_list: [
    {
      department: 'Hardware',
      items: [
        { name: 'Rubber duck', quantity: '1', unit: 'stuk' },
        { name: 'Monitors', quantity: '3', unit: 'stuks' },
        { name: 'Mechanisch toetsenbord', quantity: '1', unit: 'stuk' },
      ],
    },
    {
      department: 'Dranken',
      items: [
        { name: 'Koffie', quantity: '∞', unit: 'liter' },
        { name: 'Energy drink', quantity: '24', unit: 'blikjes' },
      ],
    },
    {
      department: 'Overig',
      items: [
        { name: 'Technical debt', quantity: '847', unit: 'regels code' },
        { name: 'Onafgemaakte TODO comments', quantity: '23', unit: 'stuks' },
        { name: 'Stack traces', quantity: '∞', unit: 'paginas' },
      ],
    },
  ],
}
