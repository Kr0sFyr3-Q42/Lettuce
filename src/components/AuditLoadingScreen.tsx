'use client'

import { motion } from 'motion/react'

const ITEMS = [
  { label: 'Kliekjes checken',           delay: 0 },
  { label: 'Eetgeschiedenis bekijken',   delay: 0.9 },
  { label: 'Planning voorbereiden',      delay: 1.8 },
]

export default function AuditLoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="space-y-6">
        <p className="text-3xl font-bold tracking-tight text-foreground">🧠 AI is aan het nadenken...</p>

        <div className="space-y-3">
          {ITEMS.map(({ label, delay }) => (
            <motion.div
              key={label}
              className="flex items-center gap-3 text-sm text-foreground"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay, duration: 0.3 }}
            >
              {/* Checkbox that becomes a checkmark */}
              <motion.span
                className="w-5 h-5 rounded border-2 border-border flex items-center justify-center flex-shrink-0 text-xs"
                initial={{ borderColor: 'var(--color-border)', backgroundColor: 'transparent' }}
                animate={{ borderColor: 'var(--color-primary)', backgroundColor: 'var(--color-primary)' }}
                transition={{ delay: delay + 0.4, duration: 0.2 }}
              >
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: delay + 0.45, duration: 0.15, type: 'spring', stiffness: 400 }}
                  className="text-primary-foreground font-bold"
                >
                  ✓
                </motion.span>
              </motion.span>

              <motion.span
                className="text-muted-foreground"
                animate={{ color: 'var(--color-foreground)' }}
                transition={{ delay: delay + 0.4, duration: 0.2 }}
              >
                {label}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
