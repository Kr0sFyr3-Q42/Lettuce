import { db } from '@/lib/db'
import { app_settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export function getApiKey(): string {
  const row = db.select().from(app_settings).where(eq(app_settings.key, 'anthropic_api_key')).get()
  const stored = row?.value?.trim() || null
  const envKey = process.env.ANTHROPIC_API_KEY?.trim() || null
  const key = stored ?? envKey
  if (!key) throw new Error('Geen API-sleutel ingesteld. Voer je Anthropic API-sleutel in via Instellingen.')
  return key
}
