import Anthropic from '@anthropic-ai/sdk'
import { toApiError, extractJson } from '@/lib/ai/errors'
import { db } from '@/lib/db'
import { pantry_inventory, meal_history, tags } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'
import { buildPlannerPrompt } from '@/lib/ai/prompt-assembly'
import type { PlannerOutput, TagAssignments, AuditorProposal } from '@/lib/types'

const client = new Anthropic()
const MODEL = 'claude-sonnet-4-6'

function extractText(response: Anthropic.Message): string {
  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Onverwacht response-type van Claude')
  return block.text
}

export async function POST(req: Request) {
  try {
    const { persons_per_day, tag_assignments, accepted_proposals } = await req.json() as {
      persons_per_day: Record<string, number>
      tag_assignments: TagAssignments
      accepted_proposals: AuditorProposal[]
    }

    const allTags     = db.select().from(tags).all()
    const pantryItems = db.select().from(pantry_inventory).all()

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 14)
    const cutoffStr = cutoff.toISOString().split('T')[0]
    const recentMeals = db
      .select()
      .from(meal_history)
      .where(gte(meal_history.date_served, cutoffStr))
      .all()

    const prompt = buildPlannerPrompt(
      allTags,
      persons_per_day,
      tag_assignments,
      accepted_proposals,
      pantryItems,
      recentMeals
    )

    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: prompt.user },
    ]

    const first = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: prompt.system,
      messages,
    })

    const rawText = extractText(first)

    let output: PlannerOutput
    try {
      output = JSON.parse(extractJson(rawText))
    } catch {
      const retry = await client.messages.create({
        model: MODEL,
        max_tokens: 8192,
        system: prompt.system,
        messages: [
          ...messages,
          { role: 'assistant', content: rawText },
          { role: 'user', content: 'Je vorige antwoord was geen valide JSON. Probeer opnieuw en retourneer uitsluitend het JSON object.' },
        ],
      })
      output = JSON.parse(extractJson(extractText(retry)))
    }

    // Write generated meals to history
    const today = new Date().toISOString().split('T')[0]
    for (const day of output.days) {
      for (const meal of day.meals) {
        db.insert(meal_history).values({
          meal_name:   meal.name,
          date_served: today,
          servings:    day.persons,
        }).run()
      }
    }

    return Response.json(output)
  } catch (e: unknown) {
    return Response.json({ error: toApiError(e) }, { status: 500 })
  }
}
