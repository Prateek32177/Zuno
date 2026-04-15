import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toast'
import { Poppins } from 'next/font/google'

const inter = Poppins({ weight:"400"})

export const metadata: Metadata = {
  title: 'Zuno - Group Plans & Events',
  description: 'Scroll real plans. Join instantly. Show up.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
      </head>
      <body className={`${inter.className}`}>
        <main className="min-h-screen">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
