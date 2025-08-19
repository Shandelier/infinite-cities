import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solar Explorer',
  description: 'Solar Explorer - an interactive app for checking how various places would look like when through mastering material science and sustainable energy we entered solarpunk.',
  keywords: 'solarpunk, photo comparison, sustainability, interactive globe, solar explorer',
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
                <span className="title-text">Solar Explorer</span>
              </h1>
              <p className="site-subtitle">Interactive glimpses of a solarpunk future</p>
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