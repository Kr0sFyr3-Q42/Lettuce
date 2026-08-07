import type {
  Tag,
  FreezerItem,
  PantryItem,
  MealHistory,
  TagAssignments,
  AuditorProposal,
} from '@/lib/types'

export const DAYS = [
  'Maandag',
  'Dinsdag',
  'Woensdag',
  'Donderdag',
  'Vrijdag',
  'Zaterdag',
  'Zondag',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPantryList(items: PantryItem[]): string {
  if (items.length === 0) return 'geen'
  return items.map(i => i.item_name).join(', ')
}

function formatMealHistory(items: MealHistory[]): string {
  if (items.length === 0) return 'geen'
  return items.map(i => `${i.meal_name} (${i.date_served})`).join(', ')
}

export function formatDayConstraints(
  tagAssignments: TagAssignments,
  allTags: Tag[]
): string {
  return DAYS.map(day => {
    const ids = new Set([
      ...tagAssignments.allDays,
      ...(tagAssignments.perDay[day] ?? []),
    ])
    const applicable = allTags.filter(t => ids.has(t.id))
    if (applicable.length === 0) return `${day}: geen beperkingen`
    const snippets = applicable.map(t => `${t.name} (${t.prompt_snippet})`).join(', ')
    return `${day}: ${snippets}`
  }).join('\n')
}

// ---------------------------------------------------------------------------
// Auditor prompt
// ---------------------------------------------------------------------------

export function buildAuditorPrompt(
  freezerItems: FreezerItem[],
  mealHistory: MealHistory[],
  personsPerDay: Record<string, number>,
  tagAssignments: TagAssignments,
  allTags: Tag[]
): { system: string; user: string } {
  const system = `Je bent een slimme maaltijdplanning-assistent. Analyseer de kliekjes en \
eetgeschiedenis en doe concrete planningsvoorstellen voor de komende week.

Houd rekening met dieetbeperkingen per dag:
${formatDayConstraints(tagAssignments, allTags)}

Regels:
- Stel alleen kliekjes voor die daadwerkelijk beschikbaar zijn.
- Vermijd dagen waarop het item niet past vanwege dieetbeperkingen.
- Houd de beschrijving vriendelijk en in het Nederlands.
- Als er niets zinvols voor te stellen is, geef een lege proposals-array terug.`

  const freezerBlock = freezerItems.length === 0
    ? 'Geen kliekjes beschikbaar.'
    : freezerItems.map(i =>
        `- ${i.item_name}: ${i.portions} portie(s), bewaard op ${i.date_added} (id: ${i.id})`
      ).join('\n')

  const historyBlock = mealHistory.length === 0
    ? 'Geen recente maaltijden.'
    : mealHistory.map(m => `- ${m.meal_name} (${m.date_served})`).join('\n')

  const personsBlock = DAYS.map(d =>
    `${d}: ${personsPerDay[d] ?? 0} personen`
  ).join('\n')

  const user = `Beschikbare kliekjes:
${freezerBlock}

Eetgeschiedenis (afgelopen 14 dagen):
${historyBlock}

Personen per dag komende week:
${personsBlock}

Doe planningsvoorstellen voor kliekjes die deze week gebruikt kunnen worden.`

  return { system, user }
}

// ---------------------------------------------------------------------------
// Planner prompt
// ---------------------------------------------------------------------------

export function buildPlannerPrompt(
  allTags: Tag[],
  personsPerDay: Record<string, number>,
  tagAssignments: TagAssignments,
  acceptedProposals: AuditorProposal[],
  pantryItems: PantryItem[],
  mealHistory: MealHistory[]
): { system: string; user: string } {
  const system = `Je bent een professionele maaltijdplanner. Genereer een volledig weekmenu en een \
geconsolideerde boodschappenlijst.

VASTE REGELS:
- Bereken porties altijd als: (aantal personen) + 20% extra voor kliekjes/vriezer.
- Rond ingrediënten af naar gangbare supermarkt-verpakkingen:
    gehakt: 250g of 500g
    kipfilet: 300g of 600g
    groenten (zak): 200g, 250g, 400g of 500g
    pasta/rijst: 500g of 1000g
- Gebruik deels verbruikte ingrediënten elders in de week (zero-waste).
- De volgende ingrediënten zijn altijd in huis. Gebruik ze gerust in recepten maar zet ze NIET op de boodschappenlijst: ${formatPantryList(pantryItems)}
- Vermijd maaltijden die recent gegeten zijn: ${formatMealHistory(mealHistory)}
- Plan één maaltijd per dag (avondeten).

DIEETBEPERKINGEN PER DAG:
De onderstaande beperkingen gelden UITSLUITEND voor de genoemde dag. Ze mogen GEEN invloed hebben op de stijl, het type of de complexiteit van maaltijden op andere dagen. Een "culinair" tag op maandag betekent niet dat dinsdag ook culinair moet zijn.
${formatDayConstraints(tagAssignments, allTags)}`

  const personsBlock = DAYS.map(d =>
    `${d}: ${personsPerDay[d] ?? 0} personen`
  ).join('\n')

  const proposalsBlock = acceptedProposals.length === 0
    ? 'Geen kliekjes ingepland.'
    : acceptedProposals.map(p =>
        `- Plan "${p.description}" op ${p.suggested_day}`
      ).join('\n')

  const user = `Personen per dag:
${personsBlock}

Ingeplande kliekjes (verplicht opnemen):
${proposalsBlock}

Genereer het weekmenu (maandag t/m zondag) en de boodschappenlijst. \
Combineer ingrediënten die meerdere dagen gebruikt worden op de lijst. \
Groepeer de boodschappenlijst per supermarktafdeling.`

  return { system, user }
}
