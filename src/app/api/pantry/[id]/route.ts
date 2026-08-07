import { db } from '@/lib/db'
import { pantry_inventory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const row = db.update(pantry_inventory).set(body).where(eq(pantry_inventory.id, Number(id))).returning().get()
    if (!row) return Response.json({ error: 'Niet gevonden.' }, { status: 404 })
    return Response.json(row)
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    db.delete(pantry_inventory).where(eq(pantry_inventory.id, Number(id))).run()
    return new Response(null, { status: 204 })
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}
