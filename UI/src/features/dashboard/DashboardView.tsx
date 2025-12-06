import { User } from "lucide-react";
import WeatherHero from "./components/WeatherHero";
import ChatPromptCard from "./components/ChatPromptCard";
import ActionGrid from "./components/ActionGrid";
import EmergencyRow from "./components/EmergencyRow";

interface DashboardViewProps {
  onChatStart?: () => void;
  cityName?: string;
  countryName?: string;
}

const DashboardView = ({ 
  onChatStart, 
  cityName = "Linz", 
  countryName = "Austria" 
}: DashboardViewProps) => {
  return (
    <div className="flex min-h-[100dvh] flex-col px-4 pb-8 pt-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between animate-in">
        <div>
          <h1 className="text-sm font-medium text-muted-foreground">Welcome back</h1>
          <p className="text-lg font-bold text-foreground">CityGuide</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80">
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-5">
        {/* Weather Hero */}
        <div className="animate-in-delay-1">
          <WeatherHero location={`${cityName}, ${countryName}`} temperature={14} />
        </div>

        {/* Chat Prompt */}
        <div className="animate-in-delay-2">
          <ChatPromptCard onPress={onChatStart} />
        </div>

        {/* Action Grid */}
        <div className="animate-in-delay-3">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Actions
          </h2>
          <ActionGrid />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Emergency Row */}
        <EmergencyRow />
      </div>
    </div>
  );
};

export default DashboardView;
