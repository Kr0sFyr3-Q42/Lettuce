'use client'

import { usePathname } from 'next/navigation'
import StepIndicator from './StepIndicator'

const STEPS = ['Configureer', 'Controleer', 'Genereer']
const STEP_PATHS = ['/', '/planning', '/result']

export default function NavSteps() {
  const pathname = usePathname()
  const current = STEP_PATHS.indexOf(pathname) + 1
  if (current === 0) return null
  return <StepIndicator current={current} steps={STEPS} />
}
