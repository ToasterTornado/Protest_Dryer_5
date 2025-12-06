import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Navigation, Layers } from "lucide-react";
import MobileLayout from "@/layouts/MobileLayout";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface POI {
  name: string;
  type: string;
  position: { lat: number; lng: number };
}

const MapPage = () => {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("Linz");
  const [mapId] = useState("DEMO_MAP_ID");
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCity = localStorage.getItem("cityguide_city");
    if (savedCity) {
      const city = JSON.parse(savedCity);
      setCityName(city.name);
    }
  }, []);

  useEffect(() => {
    const fetchMapData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/map-data?city=${encodeURIComponent(cityName)}`);
        if (response.ok) {
          const data = await response.json();
          setCenter(data.center);
          setPois(data.pois);
        }
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMapData();
  }, [cityName]);

  if (isLoading || !center) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-[100dvh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative h-[100dvh] w-full bg-slate-100">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
          <div className="rounded-full bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="font-medium text-slate-700">{cityName}</span>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
            <Layers className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        {/* Map */}
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={center}
            defaultZoom={13}
            center={center}
            mapId={mapId}
            className="h-full w-full"
            disableDefaultUI={true}
          >
            {pois.map((poi, index) => (
              <AdvancedMarker key={index} position={poi.position} title={poi.name}>
                <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>

        {/* Recenter Button */}
        <div className="absolute bottom-32 right-4 z-10">
          <button
            onClick={() => {
              // Logic to recenter map if needed, though 'center' prop handles it reactively
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-coral shadow-card hover:bg-coral-dark transition-colors"
          >
            <Navigation className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        {/* Bottom Info Card */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="rounded-2xl bg-card p-4 shadow-lg">
            <h3 className="font-semibold text-foreground mb-2">Explore {cityName}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Tap on markers to discover points of interest, restaurants, and attractions.
            </p>
            <div className="flex gap-2">
              <span className="rounded-full bg-coral-light px-3 py-1 text-xs font-medium text-coral">
                Landmarks
              </span>
              <span className="rounded-full bg-ocean-light px-3 py-1 text-xs font-medium text-ocean">
                Transport
              </span>
              <span className="rounded-full bg-sage-light px-3 py-1 text-xs font-medium text-sage">
                Culture
              </span>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default MapPage;
