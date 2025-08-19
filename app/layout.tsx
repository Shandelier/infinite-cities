import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solar Explorer',
  description: 'Interactive globe and photo comparisons exploring a solarpunk future',
  keywords: 'urban planning, photo comparison, city futures, sustainability, architecture, globe, solarpunk',
  openGraph: {
    url: 'https://infinite-cities.netlify.app/',
    type: 'website',
    title: 'Solar Explorer',
    description: 'Interactive globe and photo comparisons exploring a solarpunk future',
    images: [
      {
        url: 'https://opengraph.b-cdn.net/production/images/f3c8cb5b-524a-4d8a-ae5a-0ca8d52faf7a.jpg?token=tvxTUtUhaPrk79j5-0nRyEv6yxG3NfdB2FYeFXz1MGk&height=630&width=1200&expires=33291637696',
        width: 1200,
        height: 630,
        alt: 'Solar Explorer - Interactive globe and photo comparisons exploring a solarpunk future',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@infinite-cities',
    creator: '@infinite-cities',
    title: 'Solar Explorer',
    description: 'Interactive globe and photo comparisons exploring a solarpunk future',
    images: [
      'https://opengraph.b-cdn.net/production/images/f3c8cb5b-524a-4d8a-ae5a-0ca8d52faf7a.jpg?token=tvxTUtUhaPrk79j5-0nRyEv6yxG3NfdB2FYeFXz1MGk&height=630&width=1200&expires=33291637696',
    ],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <div className="app-container">
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  )
}