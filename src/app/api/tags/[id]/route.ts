import { db } from '@/lib/db'
import { tags } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const row = db.update(tags).set(body).where(eq(tags.id, Number(id))).returning().get()
    if (!row) return Response.json({ error: 'Niet gevonden.' }, { status: 404 })
    return Response.json(row)
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const tag = db.select().from(tags).where(eq(tags.id, Number(id))).get()
    if (!tag) return Response.json({ error: 'Niet gevonden.' }, { status: 404 })
    if (tag.is_system) return Response.json({ error: 'Systeem-tags kunnen niet verwijderd worden.' }, { status: 403 })
    db.delete(tags).where(eq(tags.id, Number(id))).run()
    return new Response(null, { status: 204 })
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}
