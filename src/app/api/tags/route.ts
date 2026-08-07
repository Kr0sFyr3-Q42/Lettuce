import { db } from '@/lib/db'
import { tags } from '@/lib/db/schema'
import { asc, desc } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET() {
  const rows = db
    .select()
    .from(tags)
    .orderBy(desc(tags.is_system), asc(tags.name))
    .all()
  return Response.json(rows)
}

export async function POST(req: NextRequest) {
  try {
    const { name, prompt_snippet } = await req.json()
    if (!name?.trim() || !prompt_snippet?.trim()) {
      return Response.json({ error: 'Naam en prompt zijn verplicht.' }, { status: 400 })
    }
    const row = db
      .insert(tags)
      .values({ name: name.trim(), prompt_snippet: prompt_snippet.trim() })
      .returning()
      .get()
    return Response.json(row, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Onbekende fout'
    if (msg.includes('UNIQUE')) {
      return Response.json({ error: `Tag "${(await req.clone().json()).name}" bestaat al.` }, { status: 409 })
    }
    return Response.json({ error: msg }, { status: 500 })
  }
}
