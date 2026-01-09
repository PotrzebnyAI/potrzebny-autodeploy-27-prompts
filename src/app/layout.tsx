import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'POTRZEBNY.AI - EdTech & MedTech Platform',
  description: 'AI-powered educational and therapeutic platform with 22 specialized panels. For teachers, therapists, doctors, students and patients.',
  keywords: ['edtech', 'medtech', 'AI', 'education', 'therapy', 'Poland', 'accessibility'],
  authors: [{ name: 'POTRZEBNY.AI Team' }],
  openGraph: {
    title: 'POTRZEBNY.AI - EdTech & MedTech Platform',
    description: 'AI-powered educational and therapeutic platform with 22 specialized panels',
    url: 'https://potrzebny.ai',
    siteName: 'POTRZEBNY.AI',
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POTRZEBNY.AI - EdTech & MedTech Platform',
    description: 'AI-powered educational and therapeutic platform with 22 specialized panels',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2a96a1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
