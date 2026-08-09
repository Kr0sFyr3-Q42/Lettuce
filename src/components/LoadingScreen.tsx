'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { shufflePhrases } from '@/lib/loading-phrases'

const PHRASE_DURATION = 2800
const SUB1_DELAY = 15000
const SUB2_DELAY = 30000

type Props = { auditor?: boolean }

export default function LoadingScreen({ auditor }: Props) {
  const phrases = useRef(shufflePhrases())
  const [index, setIndex] = useState(0)
  const [subtitle, setSubtitle] = useState<1 | 2 | null>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % phrases.current.length)
    }, PHRASE_DURATION)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setSubtitle(1), SUB1_DELAY)
    const t2 = setTimeout(() => setSubtitle(2), SUB2_DELAY)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const phrase = phrases.current[index]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">

        {/* Centered, never wraps — phrase extends right of "Lettuce" */}
        <p className="text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
          🥬 Lettuce{' '}
          <AnimatePresence mode="wait">
            <motion.span key={phrase} className="inline-flex" aria-live="polite">
              {phrase.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.2 } }}
                  exit={{ opacity: 0, y: -4, transition: { delay: (phrase.length - 1 - i) * 0.02, duration: 0.15 } }}
                  style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </p>

        {/* Timed subtitles */}
        <AnimatePresence mode="wait">
          {subtitle === 1 && (
            <motion.p
              key="sub1"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              {auditor ? 'Still scanning...' : "We're still working on it..."}
            </motion.p>
          )}
          {subtitle === 2 && (
            <motion.p
              key="sub2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground"
            >
              {"It's taking a bit more to get you the perfect plan."}
            </motion.p>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
