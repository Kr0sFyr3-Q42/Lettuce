'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

type Info = { hasStoredKey: boolean; hasEnvKey: boolean; maskedKey: string | null }

type SaveState = 'idle' | 'saving' | 'saved' | 'cleared'

export default function SettingsPage() {
  const [info, setInfo]         = useState<Info | null>(null)
  const [input, setInput]       = useState('')
  const [show, setShow]         = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  async function load() {
    const res = await fetch('/api/settings')
    setInfo(await res.json())
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    if (!input.trim()) return
    setSaveState('saving')
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: input.trim() }),
    })
    setInput('')
    setShow(false)
    setSaveState('saved')
    await load()
    setTimeout(() => setSaveState('idle'), 3000)
  }

  async function handleClear() {
    setSaveState('saving')
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: '' }),
    })
    setSaveState('cleared')
    await load()
    setTimeout(() => setSaveState('idle'), 3000)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Instellingen</h1>
        <p className="text-sm text-muted-foreground mt-1">Beheer je Anthropic API-sleutel.</p>
      </div>

      <Card className="p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Anthropic API-sleutel</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lettuce gebruikt deze sleutel voor het genereren van weekmenu&apos;s.
            {info?.hasEnvKey && ' Er is ook een sleutel ingesteld via de omgevingsvariabele — de sleutel hieronder heeft voorrang.'}
          </p>
        </div>

        {info?.hasStoredKey ? (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2">
            <code className="text-xs text-foreground font-mono tracking-wide">{info.maskedKey}</code>
            <button
              onClick={handleClear}
              disabled={saveState === 'saving'}
              className="text-xs text-destructive hover:opacity-70 transition-opacity shrink-0"
            >
              Verwijderen
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {info?.hasEnvKey ? 'Sleutel komt uit omgevingsvariabele (ANTHROPIC_API_KEY).' : 'Geen sleutel ingesteld.'}
          </p>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">
            {info?.hasStoredKey ? 'Vervangen' : 'Sleutel invoeren'}
          </label>
          <div className="flex gap-2">
            <input
              type={show ? 'text' : 'password'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="sk-ant-..."
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
              aria-label={show ? 'Verberg sleutel' : 'Toon sleutel'}
            >
              {show ? 'Verberg' : 'Toon'}
            </button>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!input.trim() || saveState === 'saving'}
          >
            {saveState === 'saving' ? 'Opslaan...' : saveState === 'saved' ? '✓ Opgeslagen' : 'Opslaan'}
          </Button>
        </div>

        {saveState === 'cleared' && (
          <p className="text-xs text-muted-foreground">Sleutel verwijderd.</p>
        )}
      </Card>
    </div>
  )
}
