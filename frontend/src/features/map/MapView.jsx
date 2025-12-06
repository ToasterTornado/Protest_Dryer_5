export default function MapView() {
  return (
    <div className="h-full w-full bg-slate-200 flex items-center justify-center p-4">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-700">Map Placeholder</h2>
        <p className="text-slate-500 text-sm">Leaflet Map will render here.</p>
        <div className="p-4 bg-white rounded-lg shadow-sm border mt-4">
          <p className="text-xs text-green-600 font-mono">PWA Shell Active</p>
        </div>
      </div>
    </div>
  );
}