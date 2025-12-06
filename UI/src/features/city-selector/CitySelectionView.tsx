import { useState, useMemo, useEffect } from "react";
import { MapPin, Search, Check } from "lucide-react";
import MobileLayout from "@/layouts/MobileLayout";

interface City {
  name: string;
  countryName: string;
}

interface CitySelectionViewProps {
  onCitySelect: (city: City) => void;
}

const CitySelectionView = ({ onCitySelect }: CitySelectionViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return cities;
    
    const query = searchQuery.toLowerCase();
    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.countryName.toLowerCase().includes(query)
    );
  }, [searchQuery, cities]);

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-background">
        <div className="p-6 pb-2">
          <h1 className="text-2xl font-bold text-foreground mb-2">Select City</h1>
          <p className="text-muted-foreground mb-6">
            Choose your destination to get personalized recommendations.
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cities..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-none focus:ring-2 focus:ring-coral/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => onCitySelect(city)}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-sage/20 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">{city.countryName}</p>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-coral opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              
              {filteredCities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No cities found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default CitySelectionView;
