'use client'

import { usePathname } from 'next/navigation'
import StepIndicator from './StepIndicator'
import { useLocale } from '@/hooks/useLocale'

const STEP_PATHS = ['/', '/planning', '/result']

const STEPS = {
  nl: ['Configureer', 'Controleer', 'Genereer'],
  en: ['Configure', 'Review', 'Generate'],
}

export default function NavSteps() {
  const pathname = usePathname()
  const { locale } = useLocale()
  const current = STEP_PATHS.indexOf(pathname) + 1
  if (current === 0) return null
  return <StepIndicator current={current} steps={STEPS[locale]} />
}
