import GlobeApp from './components/GlobeApp'
import { getLocations } from './lib/getLocations'

export default function Page() {
  const locations = getLocations()
  return <GlobeApp locations={locations} />
}
