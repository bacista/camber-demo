import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MasterNav } from '@/components/navigation/MasterNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Camber Demo - AI-Powered Sales Automation',
  description: 'Transform your quote-to-order process from 45 minutes to 45 seconds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MasterNav>
          {children}
        </MasterNav>
      </body>
    </html>
  )
}