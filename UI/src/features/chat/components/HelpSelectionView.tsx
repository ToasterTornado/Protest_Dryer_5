import { useNavigate } from "react-router-dom";
import { Zap, Compass, MapPin } from "lucide-react";
import MobileLayout from "@/layouts/MobileLayout";

interface HelpSelectionViewProps {
  cityName: string;
  countryName: string;
  onSelectMode: (mode: "quick" | "full") => void;
}

const HelpSelectionView = ({
  cityName,
  countryName,
  onSelectMode,
}: HelpSelectionViewProps) => {
  const navigate = useNavigate();

  const handleFullPlan = () => {
    onSelectMode("full");
    navigate("/plan-trip");
  };

  return (
    <MobileLayout>
      <div className="flex min-h-[100dvh] flex-col bg-background px-5 py-8">
        {/* City Badge */}
        <div className="mb-6 flex items-center gap-2 animate-in">
          <div className="flex items-center gap-1.5 rounded-full bg-coral-light px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-coral" />
            <span className="text-sm font-medium text-coral">
              {cityName}, {countryName}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 animate-in-delay-1">
          <h1 className="text-2xl font-bold text-foreground">
            How can I help you today?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose your planning style for {cityName}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {/* Quick Advice Option */}
          <button
            onClick={() => onSelectMode("quick")}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:border-amber/40 hover:bg-amber-light active:scale-[0.99] animate-slide-left-delay-1"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-light transition-transform duration-200 group-hover:scale-105">
              <Zap className="h-7 w-7 text-amber" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                Quick Answer
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Best coffee nearby? Where is the toilet? Open/Close times?
              </p>
            </div>
          </button>

          {/* Full Guide Option */}
          <button
            onClick={handleFullPlan}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:border-ocean/40 hover:bg-ocean-light active:scale-[0.99] animate-slide-left-delay-2"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ocean-light transition-transform duration-200 group-hover:scale-105">
              <Compass className="h-7 w-7 text-ocean" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                Plan My Day
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a full itinerary based on my interests.
              </p>
            </div>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer hint */}
        <p className="mt-8 text-center text-sm text-muted-foreground animate-in-delay-3">
          You can always change this later
        </p>
      </div>
    </MobileLayout>
  );
};

export default HelpSelectionView;
