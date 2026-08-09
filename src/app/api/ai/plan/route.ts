import Anthropic from '@anthropic-ai/sdk'
import { toApiError } from '@/lib/ai/errors'
import { MOCK_ENABLED, MOCK_PLAN } from '@/lib/ai/mock'
import { db } from '@/lib/db'
import { pantry_inventory, meal_history, tags } from '@/lib/db/schema'
import { gte } from 'drizzle-orm'
import { buildPlannerPrompt } from '@/lib/ai/prompt-assembly'
import type { PlannerOutput, TagAssignments, AuditorProposal } from '@/lib/types'

const client = new Anthropic()
const MODEL = 'claude-sonnet-4-5'

const PLANNER_TOOL: Anthropic.Tool = {
  name: 'generate_meal_plan',
  description: 'Genereer een volledig weekmenu en geconsolideerde boodschappenlijst',
  input_schema: {
    type: 'object' as const,
    properties: {
      days: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day:     { type: 'string' },
            persons: { type: 'number' },
            meals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name:         { type: 'string' },
                  recipe_steps: { type: 'array', items: { type: 'string' } },
                },
                required: ['name', 'recipe_steps'],
              },
            },
          },
          required: ['day', 'persons', 'meals'],
        },
      },
      shopping_list: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            department: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name:     { type: 'string' },
                  quantity: { type: 'string' },
                  unit:     { type: 'string' },
                },
                required: ['name', 'quantity', 'unit'],
              },
            },
          },
          required: ['department', 'items'],
        },
      },
    },
    required: ['days', 'shopping_list'],
  },
}

export async function POST(req: Request) {
  if (MOCK_ENABLED) {
    await new Promise(r => setTimeout(r, 20_000))
    return Response.json(MOCK_PLAN)
  }
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

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }],
      tools: [PLANNER_TOOL],
      tool_choice: { type: 'tool', name: 'generate_meal_plan' },
    })

    const toolBlock = response.content.find(b => b.type === 'tool_use')
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      throw new Error('Claude retourneerde geen tool-aanroep.')
    }

    const output = toolBlock.input as PlannerOutput

    if (process.env.NODE_ENV === 'development') {
      console.log('[planner] tool output:', JSON.stringify(output, null, 2))
    }

    if (!Array.isArray(output.days) || !Array.isArray(output.shopping_list)) {
      throw new Error(`Claude retourneerde een onvolledig weekmenu (ontbrekende velden: ${!Array.isArray(output.days) ? 'days ' : ''}${!Array.isArray(output.shopping_list) ? 'shopping_list' : ''}).`)
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
