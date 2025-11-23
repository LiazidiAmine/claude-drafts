import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Optimiseur de Congés - Maximisez vos vacances',
  description: 'Application web pour optimiser vos congés en France. Maximisez vos jours de repos en tenant compte des weekends et jours fériés.',
  keywords: ['congés', 'vacances', 'optimisation', 'france', 'jours fériés'],
  authors: [{ name: 'Vacation Optimizer' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
