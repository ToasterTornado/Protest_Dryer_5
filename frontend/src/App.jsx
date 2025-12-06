import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MobileLayout from './layouts/MobileLayout';
import MapView from './features/map/MapView'; // Make sure this path matches where you put the file above

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Layout wraps all these routes */}
        <Route element={<MobileLayout />}>
          {/* Default route redirects to map */}
          <Route path="/" element={<Navigate to="/map" replace />} />
          
          <Route path="/map" element={<MapView />} />
          <Route path="/chat" element={<div className="p-10">Chat View Coming Soon</div>} />
          <Route path="/profile" element={<div className="p-10">Profile View Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;