import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solar Explorer',
  description: 'Interactive globe and photo comparisons exploring a solarpunk future',
  keywords: 'solarpunk, photo comparison, sustainability, eco-friendly, nature, globe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <div className="app-container">
          <header className="site-header">
            <div className="header-content">
              <h1 className="site-title">
                <span className="leaf-icon">🌿</span>
                Solar Explorer
              </h1>
              <p className="site-subtitle">Interactive solarpunk voyages</p>
            </div>
          </header>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}