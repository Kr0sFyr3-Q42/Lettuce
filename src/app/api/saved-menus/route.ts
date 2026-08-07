import { db } from '@/lib/db'
import { saved_menus } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET() {
  const rows = db
    .select({
      id:           saved_menus.id,
      name:         saved_menus.name,
      created_at:   saved_menus.created_at,
      is_autosaved: saved_menus.is_autosaved,
    })
    .from(saved_menus)
    .orderBy(desc(saved_menus.created_at))
    .all()
  return Response.json(rows)
}

export async function POST(req: NextRequest) {
  try {
    const { name, menu_data, persons_per_day, is_autosaved } = await req.json()
    if (!name?.trim()) return Response.json({ error: 'Naam is verplicht.' }, { status: 400 })
    const row = db.insert(saved_menus).values({
      name:            name.trim(),
      menu_data:       JSON.stringify(menu_data),
      persons_per_day: JSON.stringify(persons_per_day),
      created_at:      new Date().toISOString(),
      is_autosaved:    is_autosaved ?? false,
    }).returning().get()
    return Response.json(row, { status: 201 })
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : 'Onbekende fout' }, { status: 500 })
  }
}
