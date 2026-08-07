import { db } from '@/lib/db'
import { saved_menus } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const row = db.select().from(saved_menus).where(eq(saved_menus.id, Number(id))).get()
    if (!row) return Response.json({ error: 'Niet gevonden.' }, { status: 404 })
    return Response.json(row)
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    db.delete(saved_menus).where(eq(saved_menus.id, Number(id))).run()
    return new Response(null, { status: 204 })
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}
