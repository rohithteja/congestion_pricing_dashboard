import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'City Emissions Simulator | Congestion Pricing Dashboard',
  description: 'Interactive dashboard for simulating emissions reduction through congestion pricing policies. Built by Rohith Teja.',
  keywords: ['emissions', 'congestion pricing', 'urban planning', 'data visualization', 'rohith teja'],
  authors: [{ name: 'Rohith Teja', url: 'https://www.rohithteja.dev/' }],
  creator: 'Rohith Teja',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased bg-black`}>
        {children}
      </body>
    </html>
  )
}
