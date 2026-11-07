import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import Overview from './pages/Overview'
import MapPage from './pages/MapPage'
import Systems from './pages/Systems'
import SystemDetail from './pages/SystemDetail'
import { Journeys, JourneyDetail } from './pages/Journeys'
import Provinces from './pages/Provinces'
import Gaps from './pages/Gaps'
import Sources from './pages/Sources'

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Overview />} />
        <Route path="map" element={<MapPage />} />
        <Route path="systems" element={<Systems />} />
        <Route path="systems/:id" element={<SystemDetail />} />
        <Route path="journeys" element={<Journeys />} />
        <Route path="journeys/:id" element={<JourneyDetail />} />
        <Route path="provinces" element={<Provinces />} />
        <Route path="gaps" element={<Gaps />} />
        <Route path="sources" element={<Sources />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
