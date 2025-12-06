import { useNavigate } from "react-router-dom";
import { Zap, Compass, X } from "lucide-react";

interface ChatModeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMode: (mode: "quick" | "full") => void;
}

const ChatModeSelector = ({
  open,
  onOpenChange,
  onSelectMode,
}: ChatModeSelectorProps) => {
  const navigate = useNavigate();

  if (!open) return null;

  const handleFullPlan = () => {
    onOpenChange(false);
    navigate("/plan-trip");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card px-4 pb-8 pt-4 shadow-lg animate-in">
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              How can I help you today?
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose your planning style
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Quick Advice Option */}
          <button
            onClick={() => onSelectMode("quick")}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-4 text-left transition-all duration-200 hover:border-amber/40 hover:bg-amber-light active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-light transition-transform duration-200 group-hover:scale-105">
              <Zap className="h-6 w-6 text-amber" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Quick Answer</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Best coffee nearby? Where is the toilet? Open/Close times?
              </p>
            </div>
          </button>

          {/* Full Guide Option */}
          <button
            onClick={handleFullPlan}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-4 text-left transition-all duration-200 hover:border-ocean/40 hover:bg-ocean-light active:scale-[0.99]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ocean-light transition-transform duration-200 group-hover:scale-105">
              <Compass className="h-6 w-6 text-ocean" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Plan My Day</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Create a full itinerary based on my interests.
              </p>
            </div>
          </button>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="mt-4 w-full py-3 text-center text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ChatModeSelector;
