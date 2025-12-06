import { MapPin, Cloud } from "lucide-react";

interface WeatherHeroProps {
  userName?: string;
  location: string;
  temperature: number;
  weatherIcon?: React.ReactNode;
}

const WeatherHero = ({
  userName = "Traveler",
  location,
  temperature,
  weatherIcon,
}: WeatherHeroProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      {/* Location & Weather Row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{location}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-ocean-light px-3 py-1">
          {weatherIcon || <Cloud className="h-4 w-4 text-ocean" />}
          <span className="text-sm font-semibold text-ocean">{temperature}°C</span>
        </div>
      </div>

      {/* Greeting */}
      <div>
        <span className="text-2xl font-bold text-foreground">{getGreeting()},</span>
        <span className="ml-2 text-2xl font-medium text-muted-foreground">{userName}</span>
      </div>
    </div>
  );
};

export default WeatherHero;
