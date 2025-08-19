import fs from 'fs'
import path from 'path'
import type { LocationPoint } from '../components/GlobeApp'

const cityMetadata: Record<string, { name: string; lat: number; lng: number }> = {
  buenosaires: { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
  istanbul: { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  lisbon: { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
  london: { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  mexico: { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
  newdelhi: { name: 'New Delhi, India', lat: 28.6139, lng: 77.209 },
  newyork: { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
  paris: { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  saintpetersburg: { name: 'Saint Petersburg, Russia', lat: 59.9311, lng: 30.3609 },
  seoul: { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.978 },
  'shanghai-rails': { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
  singapore: { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198 },
  sydney: { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  'vegas-bellagio': { name: 'Las Vegas, USA', lat: 36.1699, lng: -115.1398 },
  warsaw: { name: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122 },
}

export function getLocations(): LocationPoint[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'urban')
  let files: string[] = []
  try {
    files = fs.readdirSync(dir)
  } catch {
    return []
  }

  const grouped: Record<string, { before?: string; after?: string }> = {}
  const regex = /^(.+?)([12])\.(png|jpe?g|webp)$/i

  for (const file of files) {
    const match = file.match(regex)
    if (!match) continue
    const slug = match[1]
    const type = match[2] === '1' ? 'before' : 'after'
    if (!grouped[slug]) grouped[slug] = {}
    grouped[slug][type] = `/images/urban/${file}`
  }

  const locations: LocationPoint[] = []
  for (const [slug, imgs] of Object.entries(grouped)) {
    if (!imgs.before || !imgs.after) continue
    const meta = cityMetadata[slug]
    if (!meta) continue
    locations.push({
      name: meta.name,
      lat: meta.lat,
      lng: meta.lng,
      size: 0.35,
      color: '#ffa500',
      beforeImage: { src: imgs.before, alt: `${meta.name} today`, label: 'Today' },
      afterImage: { src: imgs.after, alt: `${meta.name} future`, label: 'Future' },
    })
  }

  return locations
}
