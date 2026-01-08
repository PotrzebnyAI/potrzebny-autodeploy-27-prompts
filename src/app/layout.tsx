import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'POTRZEBNY.AI - EdTech & MedTech Platform',
  description: 'AI-powered educational and therapeutic platform with 22 specialized panels',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="antialiased">{children}</body>
    </html>
  )
}
