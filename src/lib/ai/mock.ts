import type { AuditorOutput, PlannerOutput } from '@/lib/types'

export const MOCK_ENABLED = process.env.MOCK_AI === 'true'

export const MOCK_AUDITOR: AuditorOutput = {
  proposals: [
    {
      id: 'mock-1',
      description: 'Ik zie 2 porties stoofvlees — plannen op woensdag?',
      suggested_day: 'Woensdag',
      freezer_item_id: 1,
    },
    {
      id: 'mock-2',
      description: 'Er is nog soep over — perfect voor dinsdag.',
      suggested_day: 'Dinsdag',
      freezer_item_id: 2,
    },
  ],
}

export const MOCK_PLAN: PlannerOutput = {
  days: [
    {
      day: 'Maandag',
      persons: 2,
      meals: [{ name: 'Pasta carbonara', recipe_steps: ['Kook pasta.', 'Bak spek uit.', 'Meng eieren met kaas.', 'Combineer alles.'] }],
    },
    {
      day: 'Dinsdag',
      persons: 2,
      meals: [{ name: 'Tomatensoep (kliekje)', recipe_steps: ['Verwarm de soep op laag vuur.', 'Serveer met brood.'] }],
    },
    {
      day: 'Woensdag',
      persons: 4,
      meals: [{ name: 'Stoofvlees (kliekje) met aardappelpuree', recipe_steps: ['Verwarm het stoofvlees.', 'Kook aardappelen en stamp fijn.', 'Serveer samen.'] }],
    },
    {
      day: 'Donderdag',
      persons: 2,
      meals: [{ name: 'Gebakken kip met groenten', recipe_steps: ['Kruid de kip.', 'Bak 25 min op 200°C.', 'Rooster groenten mee.'] }],
    },
    {
      day: 'Vrijdag',
      persons: 2,
      meals: [{ name: 'Zalmfilet met rijst', recipe_steps: ['Kook rijst.', 'Bak zalm 4 min per kant.', 'Serveer met citroen.'] }],
    },
    {
      day: 'Zaterdag',
      persons: 2,
      meals: [{ name: 'Zelfgemaakte pizza', recipe_steps: ['Maak deeg.', 'Beleg naar smaak.', 'Bak 12 min op 230°C.'] }],
    },
    {
      day: 'Zondag',
      persons: 2,
      meals: [{ name: 'Geroosterde groenteschotel', recipe_steps: ['Snijd groenten grof.', 'Meng met olijfolie en kruiden.', 'Rooster 35 min op 200°C.'] }],
    },
  ],
  shopping_list: [
    {
      department: 'Vlees & vis',
      items: [
        { name: 'Kipfilet', quantity: '300', unit: 'gram' },
        { name: 'Zalmfilet', quantity: '300', unit: 'gram' },
        { name: 'Spek', quantity: '150', unit: 'gram' },
      ],
    },
    {
      department: 'Groenten & fruit',
      items: [
        { name: 'Aardappelen', quantity: '1000', unit: 'gram' },
        { name: 'Courgette', quantity: '2', unit: 'stuks' },
        { name: 'Paprika', quantity: '2', unit: 'stuks' },
        { name: 'Citroen', quantity: '1', unit: 'stuk' },
      ],
    },
    {
      department: 'Zuivel & eieren',
      items: [
        { name: 'Eieren', quantity: '4', unit: 'stuks' },
        { name: 'Parmezaanse kaas', quantity: '100', unit: 'gram' },
      ],
    },
    {
      department: 'Rijst, pasta & wereldkeuken',
      items: [
        { name: 'Spaghetti', quantity: '500', unit: 'gram' },
        { name: 'Rijst', quantity: '500', unit: 'gram' },
        { name: 'Pizzadeeg', quantity: '1', unit: 'pak' },
      ],
    },
  ],
}
