import Anthropic from '@anthropic-ai/sdk'
import { toApiError } from '@/lib/ai/errors'
import { MOCK_ENABLED, MOCK_AUDITOR } from '@/lib/ai/mock'
import { db } from '@/lib/db'
import { freezer_inventory, meal_history, tags } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'
import { buildAuditorPrompt } from '@/lib/ai/prompt-assembly'
import type { AuditorOutput, TagAssignments } from '@/lib/types'

const client = new Anthropic()
const MODEL = 'claude-haiku-4-5-20251001'

const AUDITOR_TOOL: Anthropic.Tool = {
  name: 'scan_freezer',
  description: 'Analyseer kliekjes en doe planningsvoorstellen voor de komende week',
  input_schema: {
    type: 'object' as const,
    properties: {
      proposals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id:              { type: 'string' },
            description:     { type: 'string' },
            suggested_day:   { type: 'string' },
            freezer_item_id: { type: 'number' },
          },
          required: ['id', 'description', 'suggested_day', 'freezer_item_id'],
        },
      },
    },
    required: ['proposals'],
  },
}

export async function POST(req: Request) {
  if (MOCK_ENABLED) return Response.json(MOCK_AUDITOR)
  try {
    const { persons_per_day, tag_assignments } = await req.json() as {
      persons_per_day: Record<string, number>
      tag_assignments: TagAssignments
    }

    const freezerItems = db.select().from(freezer_inventory).all()

    // Skip AI call when freezer is empty — nothing to audit
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

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }],
      tools: [AUDITOR_TOOL],
      tool_choice: { type: 'tool', name: 'scan_freezer' },
    })

    const toolBlock = response.content.find(b => b.type === 'tool_use')
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      throw new Error('Claude retourneerde geen tool-aanroep.')
    }

    return Response.json(toolBlock.input as AuditorOutput)
  } catch (e: unknown) {
    return Response.json({ error: toApiError(e) }, { status: 500 })
  }
}
