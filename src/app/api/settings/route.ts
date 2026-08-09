import { db } from '@/lib/db'
import { app_settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

const KEY = 'anthropic_api_key'

export async function GET() {
  const row = db.select().from(app_settings).where(eq(app_settings.key, KEY)).get()
  const stored = row?.value?.trim() || null
  const hasEnvKey = !!(process.env.ANTHROPIC_API_KEY?.trim())
  return Response.json({
    hasStoredKey: !!stored,
    hasEnvKey,
    maskedKey: stored ? `${stored.slice(0, 7)}${'•'.repeat(Math.max(0, stored.length - 11))}${stored.slice(-4)}` : null,
  })
}

export async function PUT(req: NextRequest) {
  const { key } = await req.json() as { key: string }
  const trimmed = key?.trim() ?? ''

  if (trimmed === '') {
    db.delete(app_settings).where(eq(app_settings.key, KEY)).run()
    return Response.json({ ok: true })
  }

  db.insert(app_settings)
    .values({ key: KEY, value: trimmed })
    .onConflictDoUpdate({ target: app_settings.key, set: { value: trimmed } })
    .run()

  return Response.json({ ok: true })
}
