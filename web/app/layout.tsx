import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Off-Grid Suitability Map',
  description: 'Interactive map showing global off-grid living suitability based on solar potential, water availability, remoteness, and other factors.',
  keywords: 'off-grid, sustainability, solar, water, remote living, suitability analysis',
  authors: [{ name: 'Off-Grid Suitability Project' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Off-Grid Suitability Map',
    description: 'Interactive map showing global off-grid living suitability',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off-Grid Suitability Map',
    description: 'Interactive map showing global off-grid living suitability',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* MapLibre GL CSS */}
        <link
          href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css"
          rel="stylesheet"
        />
        {/* Preconnect to tile server for faster loading */}
        <link rel="preconnect" href="/tiles" />
        <link rel="dns-prefetch" href="/tiles" />
      </head>
      <body className="bg-gray-900 text-white font-sans antialiased">
        <div id="root" className="h-screen w-screen">
          {children}
        </div>
      </body>
    </html>
  )
}