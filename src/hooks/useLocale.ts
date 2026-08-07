'use client'

import { useEffect, useState, useCallback } from 'react'
import { type Locale, type TranslationKey, t as translate } from '@/lib/i18n'

const STORAGE_KEY = 'locale'

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('nl')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored === 'en' || stored === 'nl') setLocaleState(stored)
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale])

  return { locale, setLocale, t }
}
