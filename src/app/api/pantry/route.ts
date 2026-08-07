import { db } from '@/lib/db'
import { pantry_inventory } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET() {
  const rows = db.select().from(pantry_inventory).orderBy(asc(pantry_inventory.item_name)).all()
  return Response.json(rows)
}

export async function POST(req: NextRequest) {
  try {
    const { item_name, unit, quantity, location } = await req.json()
    if (!item_name?.trim()) return Response.json({ error: 'Naam is verplicht.' }, { status: 400 })
    const row = db
      .insert(pantry_inventory)
      .values({
        item_name: item_name.trim(),
        unit: unit?.trim() || null,
        quantity: quantity != null ? Number(quantity) : null,
        location: location ?? 'voorraadkast',
      })
      .returning()
      .get()
    return Response.json(row, { status: 201 })
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}
