import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/Logo'
import NavSteps from '@/components/NavSteps'
import MobileNav from '@/components/MobileNav'
import ThemeToggle from '@/components/ThemeToggle'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lettuce',
  description: 'Lettuce prep your meals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-background text-foreground font-sans">
        <header className="border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {/* Main row: logo + steps (md+, centred) + nav/hamburger */}
            <div className="flex items-center justify-between h-12 md:h-14 gap-4">
              <Link href="/" className="text-foreground hover:opacity-80 transition-opacity flex-shrink-0">
                <Logo variant="horizontal" size={24} />
              </Link>
              <div className="hidden md:block">
                <NavSteps />
              </div>
              <div className="flex items-center gap-5">
                <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
                  <Link href="/manage/tags" className="hover:text-foreground transition-colors">Tags</Link>
                  <Link href="/manage/freezer" className="hover:text-foreground transition-colors">Vriezer</Link>
                  <Link href="/manage/pantry" className="hover:text-foreground transition-colors">Voorraad</Link>
                  <Link href="/saved" className="hover:text-foreground transition-colors">Opgeslagen</Link>
                  <ThemeToggle />
                </nav>
                <MobileNav />
              </div>
            </div>
            {/* Step indicator second row on mobile */}
            <div className="md:hidden flex justify-center border-t border-border py-2">
              <NavSteps />
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
