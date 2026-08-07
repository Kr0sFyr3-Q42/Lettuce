import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lettuce',
  description: 'Lettuce prep your meals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 flex items-center gap-6 h-12">
            <Link href="/" className="font-semibold text-sm tracking-tight">Lettuce 🥬</Link>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link href="/manage/tags" className="hover:text-gray-900">Tags</Link>
              <Link href="/manage/freezer" className="hover:text-gray-900">Vriezer</Link>
              <Link href="/manage/pantry" className="hover:text-gray-900">Voorraad</Link>
              <Link href="/saved" className="hover:text-gray-900">Opgeslagen</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
