'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { type Locale, type TranslationKey, t as translate } from '@/lib/i18n'

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'nl',
  setLocale: () => {},
  t: (key) => translate('nl', key),
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('nl')

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored === 'en' || stored === 'nl') setLocaleState(stored)
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }, [])

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
