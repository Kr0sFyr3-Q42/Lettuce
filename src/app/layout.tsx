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
      <body className="h-screen overflow-hidden flex flex-col bg-background text-foreground font-sans">
        <header className="flex-shrink-0 border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            {/* Main row */}
            <div className="relative flex items-center justify-between h-14">
              <Link href="/" className="text-foreground hover:opacity-80 transition-opacity flex-shrink-0 font-semibold tracking-tight text-lg">
                🥬 Lettuce
              </Link>
              {/* Step indicator — centered in bar on sm+, hidden on mobile */}
              <div className="hidden sm:block absolute left-1/2 -translate-x-1/2">
                <NavSteps />
              </div>
              <MobileNav />
            </div>
            {/* Step indicator — second row on mobile only */}
            <div className="sm:hidden flex justify-center border-t border-border py-1.5">
              <NavSteps />
            </div>
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-auto">{children}</main>
      </body>
    </html>
  )
}
