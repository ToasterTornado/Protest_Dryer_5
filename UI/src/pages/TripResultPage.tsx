import { useLocation, useNavigate } from "react-router-dom";
import MobileLayout from "@/layouts/MobileLayout";
import { ArrowLeft, MapPin } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TripResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p>No result found. Please plan a trip first.</p>
          <button 
            onClick={() => navigate("/plan-trip")}
            className="mt-4 px-4 py-2 bg-coral text-white rounded-lg"
          >
            Plan Trip
          </button>
        </div>
      </MobileLayout>
    );
  }

  const { advice, places } = result;

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground">Your Itinerary</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Places Section */}
          {places && places.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recommended Places</h2>
              <div className="grid gap-4">
                {places.map((place: any, index: number) => (
                  <div key={index} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{place.name}</h3>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">{place.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{place.description}</p>
                    {place.coordinates && (
                      <div className="flex items-center gap-1 text-xs text-coral">
                        <MapPin className="h-3 w-3" />
                        View on Map
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advice Section */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TripResultPage;
