import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Insyd Inventory Management',
  description: 'Inventory management system for AEC material businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

