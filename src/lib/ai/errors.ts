import Anthropic from '@anthropic-ai/sdk'

// Extract JSON from a model response, handling:
// 1. ```json ... ``` fenced blocks
// 2. Plain JSON with preamble/postamble text
export function extractJson(raw: string): string {
  // Fenced code block
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()

  // Find the outermost { ... } in case of surrounding text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end > start) return raw.slice(start, end + 1)

  return raw.trim()
}

export function toApiError(e: unknown): string {
  if (e instanceof Anthropic.APIError) {
    if (e.status === 429) return 'Rate limit bereikt — probeer over een moment opnieuw.'
    if (e.status === 401) return 'Ongeldige API-sleutel. Controleer je ANTHROPIC_API_KEY.'
    if (e.status === 529) return 'Anthropic is tijdelijk overbelast — probeer later opnieuw.'
    return `Anthropic API-fout (${e.status}): ${e.message}`
  }
  if (e instanceof Error && e.message.includes('timed out')) {
    return 'Verbinding time-out — probeer opnieuw.'
  }
  if (e instanceof SyntaxError) {
    return 'Kon geen geldig antwoord van Claude parsen na twee pogingen.'
  }
  return e instanceof Error ? e.message : 'Onbekende fout'
}
