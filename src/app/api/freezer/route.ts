import { db } from '@/lib/db'
import { freezer_inventory } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET() {
  const rows = db.select().from(freezer_inventory).orderBy(asc(freezer_inventory.date_added)).all()
  return Response.json(rows)
}

export async function POST(req: NextRequest) {
  try {
    const { item_name, portions, date_added } = await req.json()
    if (!item_name?.trim()) return Response.json({ error: 'Naam is verplicht.' }, { status: 400 })
    const row = db
      .insert(freezer_inventory)
      .values({
        item_name: item_name.trim(),
        portions: Number(portions) || 1,
        date_added: date_added ?? new Date().toISOString().split('T')[0],
      })
      .returning()
      .get()
    return Response.json(row, { status: 201 })
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}
