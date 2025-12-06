import { useNavigate } from "react-router-dom";
import { Siren, ChevronRight } from "lucide-react";

const EmergencyRow = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/emergency")}
      className="flex w-full items-center gap-4 rounded-2xl border border-emergency/20 bg-emergency-light p-4 transition-all duration-200 hover:border-emergency/40 hover:shadow-card active:scale-[0.99]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emergency/10">
        <Siren className="h-6 w-6 text-emergency" />
      </div>
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-emergency-foreground">Emergency Help & SOS</h3>
        <p className="text-sm text-emergency-foreground/70">Get immediate assistance</p>
      </div>
      <ChevronRight className="h-5 w-5 text-emergency-foreground/50" />
    </button>
  );
};

export default EmergencyRow;
