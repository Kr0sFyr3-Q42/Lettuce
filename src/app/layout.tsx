import type { Metadata } from 'next'
import Link from 'next/link'
import NavSteps from '@/components/NavSteps'
import MobileNav from '@/components/MobileNav'
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
              <Link href="/" className="text-foreground hover:opacity-80 transition-opacity flex-shrink-0 font-semibold tracking-tight text-lg">
                🥬 Lettuce
              </Link>
              <NavSteps />
              <MobileNav />
            </div>
            {/* Step indicator second row when nav takes up space on very small screens */}
            <div className="hidden flex justify-center border-t border-border py-2">
              <NavSteps />
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
