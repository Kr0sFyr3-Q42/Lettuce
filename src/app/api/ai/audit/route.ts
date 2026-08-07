import Anthropic from '@anthropic-ai/sdk'
import { toApiError, extractJson } from '@/lib/ai/errors'
import { db } from '@/lib/db'
import { freezer_inventory, meal_history, tags } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'
import { buildAuditorPrompt } from '@/lib/ai/prompt-assembly'
import type { AuditorOutput, TagAssignments } from '@/lib/types'

const client = new Anthropic()

// Haiku is sufficient for the lightweight auditor scan
const MODEL = 'claude-haiku-4-5-20251001'

function extractText(response: Anthropic.Message): string {
  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Onverwacht response-type van Claude')
  return block.text
}

export async function POST(req: Request) {
  try {
    const { persons_per_day, tag_assignments } = await req.json() as {
      persons_per_day: Record<string, number>
      tag_assignments: TagAssignments
    }

    const freezerItems = db.select().from(freezer_inventory).all()

    // Skip AI call entirely when freezer is empty — nothing to audit
    if (freezerItems.length === 0) {
      return Response.json({ proposals: [] } satisfies AuditorOutput)
    }

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 14)
    const cutoffStr = cutoff.toISOString().split('T')[0]

    const recentMeals = db
      .select()
      .from(meal_history)
      .where(gte(meal_history.date_served, cutoffStr))
      .all()

    const allTags = db.select().from(tags).all()

    const prompt = buildAuditorPrompt(
      freezerItems,
      recentMeals,
      persons_per_day,
      tag_assignments,
      allTags
    )

    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: prompt.user },
    ]

    const first = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: prompt.system,
      messages,
    })

    const rawText = extractText(first)

    let output: AuditorOutput
    try {
      output = JSON.parse(extractJson(rawText))
    } catch {
      const retry = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: prompt.system,
        messages: [
          ...messages,
          { role: 'assistant', content: rawText },
          { role: 'user', content: 'Je vorige antwoord was geen valide JSON. Probeer opnieuw en retourneer uitsluitend het JSON object.' },
        ],
      })
      output = JSON.parse(extractJson(extractText(retry)))
    }

    return Response.json(output)
  } catch (e: unknown) {
    return Response.json({ error: toApiError(e) }, { status: 500 })
  }
}
