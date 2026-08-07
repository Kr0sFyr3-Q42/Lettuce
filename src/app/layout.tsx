import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/Logo'
import NavSteps from '@/components/NavSteps'
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
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
            <Link href="/" className="text-foreground hover:opacity-80 transition-opacity">
              <Logo variant="horizontal" size={28} />
            </Link>
            <NavSteps />
            <nav className="flex items-center gap-5 text-sm text-muted-foreground">
              <Link href="/manage/tags" className="hover:text-foreground transition-colors">Tags</Link>
              <Link href="/manage/freezer" className="hover:text-foreground transition-colors">Vriezer</Link>
              <Link href="/manage/pantry" className="hover:text-foreground transition-colors">Voorraad</Link>
              <Link href="/saved" className="hover:text-foreground transition-colors">Opgeslagen</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
