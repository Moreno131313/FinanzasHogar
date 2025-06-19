import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import AppLayout from '@/components/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finanzas Hogar - Presupuesto Personal',
  description: 'Aplicación para gestionar el presupuesto personal mensual del hogar',
  keywords: 'finanzas, presupuesto, hogar, gastos, ingresos, ahorro',
  icons: {
    icon: [
      {
        url: '/imagenes/presupuesto.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        url: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
    apple: '/imagenes/presupuesto.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  )
} 