const fs = require('fs');
const path = require('path');

const coordinates = {
  buenosaires: { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816 },
  istanbul: { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  lisbon: { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
  london: { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  mexico: { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
  newdelhi: { name: 'New Delhi, India', lat: 28.6139, lng: 77.2090 },
  newyork: { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
  paris: { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  saintpetersburg: { name: 'Saint Petersburg, Russia', lat: 59.9311, lng: 30.3609 },
  seoul: { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780 },
  'shanghai-rails': { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
  singapore: { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198 },
  sydney: { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  vegas: { name: 'Las Vegas, USA', lat: 36.1699, lng: -115.1398 },
  'vegas-bellagio': { name: 'Bellagio Fountain, USA', lat: 36.1126, lng: -115.1767 },
  warsaw: { name: 'Warsaw, Poland', lat: 52.2297, lng: 21.0122 },
};

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'urban');
const files = fs.readdirSync(imagesDir);

const cityFiles = {};
for (const file of files) {
  const match = file.match(/^(.*?)(1|2)\.(jpg|jpeg|png|webp)$/i);
  if (!match) continue;
  const base = match[1];
  const which = match[2];
  if (!cityFiles[base]) cityFiles[base] = {};
  cityFiles[base][which === '1' ? 'before' : 'after'] = `/images/urban/${file}`;
}

const locations = [];
for (const [base, imgs] of Object.entries(cityFiles)) {
  const coord = coordinates[base];
  if (!coord || !imgs.before || !imgs.after) continue;
  locations.push({
    name: coord.name,
    lat: coord.lat,
    lng: coord.lng,
    size: 0.35,
    color: '#ffa500',
    beforeImage: { src: imgs.before, alt: `${coord.name} today`, label: 'Today' },
    afterImage: { src: imgs.after, alt: `${coord.name} future`, label: 'Future' },
  });
}

const outDir = path.join(__dirname, '..', 'app', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const content = `export interface LocationPoint {\n` +
  `  lat: number;\n` +
  `  lng: number;\n` +
  `  size: number;\n` +
  `  color: string;\n` +
  `  name: string;\n` +
  `  beforeImage: { src: string; alt: string; label: string };\n` +
  `  afterImage: { src: string; alt: string; label: string };\n` +
  `}\n\n` +
  `const locations: LocationPoint[] = ${JSON.stringify(locations, null, 2)};\n\n` +
  `export default locations;\n`;

fs.writeFileSync(path.join(outDir, 'locations.ts'), content);
console.log(`Generated ${locations.length} locations.`);
