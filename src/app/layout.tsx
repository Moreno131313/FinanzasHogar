import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Logo from '@/components/Logo'

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
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <Logo size="md" showText={true} />
                </div>
                <nav className="flex space-x-4">
                  <a
                    href="/"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/budget"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Presupuesto
                  </a>
                  <a
                    href="/reports"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Reportes
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-sm text-gray-600">
                © 2024 Finanzas Hogar - Gestión de presupuesto personal
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 