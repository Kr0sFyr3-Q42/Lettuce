import Anthropic from '@anthropic-ai/sdk'

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
