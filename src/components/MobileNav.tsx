'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { href: '/',               label: 'Plannen' },
  { href: '/manage/tags',    label: 'Tags' },
  { href: '/manage/freezer', label: 'Kliekjes' },
  { href: '/manage/pantry',  label: 'Voorraad' },
  { href: '/saved',          label: 'Opgeslagen' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Menu sluiten' : 'Menu openen'}
        className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-secondary transition-colors"
      >
        <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 origin-center ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 origin-center ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm transition-colors hover:bg-secondary ${
                pathname === href ? 'text-primary font-semibold' : 'text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle className="w-full border-t border-border px-4 py-3 flex items-center justify-between text-sm text-foreground hover:bg-secondary transition-colors" />
        </div>
      )}
    </div>
  )
}
