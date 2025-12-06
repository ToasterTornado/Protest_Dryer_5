import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CitySelectionView from "@/features/city-selector/CitySelectionView";
import HelpSelectionView from "@/features/chat/components/HelpSelectionView";
import DashboardView from "@/features/dashboard/DashboardView";
import ChatModeSelector from "@/features/chat/components/ChatModeSelector";
import MobileLayout from "@/layouts/MobileLayout";
import { toast } from "@/hooks/use-toast";

const CITY_STORAGE_KEY = "cityguide_city";
const VISITED_STORAGE_KEY = "cityguide_visited";

interface SelectedCity {
  name: string;
  countryName: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [showChatSelector, setShowChatSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [helpModeSelected, setHelpModeSelected] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem(CITY_STORAGE_KEY);
    const hasVisited = localStorage.getItem(VISITED_STORAGE_KEY);

    if (savedCity) {
      try {
        setSelectedCity(JSON.parse(savedCity));
      } catch {
        localStorage.removeItem(CITY_STORAGE_KEY);
      }
    }

    if (hasVisited) {
      setIsNewUser(false);
      setHelpModeSelected(true);
    }

    setIsLoading(false);
  }, []);

  const handleCitySelect = (city: SelectedCity) => {
    localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
    setSelectedCity(city);
  };

  const handleHelpModeSelect = (mode: "quick" | "full") => {
    localStorage.setItem(VISITED_STORAGE_KEY, "true");
    setIsNewUser(false);
    setHelpModeSelected(true);

    if (mode === "quick") {
      toast({
        title: "Quick Advice Mode",
        description: `Ask me anything about ${selectedCity?.name}!`,
      });
    }
    // "full" mode navigates to /plan-trip via HelpSelectionView
  };

  const handleChatStart = () => {
    setShowChatSelector(true);
  };

  const handleDashboardModeSelect = (mode: "quick" | "full") => {
    setShowChatSelector(false);
    if (mode === "quick") {
      toast({
        title: "Quick Advice Mode",
        description: `Ask me anything about ${selectedCity?.name}!`,
      });
    }
    // "full" mode navigates to /plan-trip via ChatModeSelector
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex h-[100dvh] items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-primary" />
        </div>
      </MobileLayout>
    );
  }

  // Step 1: City Selection (always first if no city)
  if (!selectedCity) {
    return <CitySelectionView onCitySelect={handleCitySelect} />;
  }

  // Step 2: Help Mode Selection (only for new users after city selection)
  if (isNewUser && !helpModeSelected) {
    return (
      <HelpSelectionView
        cityName={selectedCity.name}
        countryName={selectedCity.countryName}
        onSelectMode={handleHelpModeSelect}
      />
    );
  }

  // Step 3: Dashboard (for returning users or after help mode selection)
  return (
    <MobileLayout>
      <DashboardView
        onChatStart={handleChatStart}
        cityName={selectedCity.name}
        countryName={selectedCity.countryName}
      />
      <ChatModeSelector
        open={showChatSelector}
        onOpenChange={setShowChatSelector}
        onSelectMode={handleDashboardModeSelect}
      />
    </MobileLayout>
  );
};

export default Index;
