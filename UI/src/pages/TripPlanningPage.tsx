import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Users, Calendar, Car, Utensils, Home, Check, MapPin } from "lucide-react";
import MobileLayout from "@/layouts/MobileLayout";
import { toast } from "@/hooks/use-toast";

type Step = "travelers" | "dates" | "transport" | "food" | "accommodation";

interface TripData {
  travelers: number;
  startDate: string;
  endDate: string;
  transport: string[];
  foodPreferences: string[];
  accommodation: string;
}

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: "travelers", title: "Travelers", icon: <Users className="h-5 w-5" /> },
  { id: "dates", title: "Dates", icon: <Calendar className="h-5 w-5" /> },
  { id: "transport", title: "Transport", icon: <Car className="h-5 w-5" /> },
  { id: "food", title: "Food", icon: <Utensils className="h-5 w-5" /> },
  { id: "accommodation", title: "Stay", icon: <Home className="h-5 w-5" /> },
];

interface TripOption {
  id: string;
  label: string;
  emoji: string;
}

interface TripOptions {
  transport: TripOption[];
  food: TripOption[];
  accommodation: TripOption[];
}

const TripPlanningPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("travelers");
  const [cityName, setCityName] = useState("Linz");
  const [tripData, setTripData] = useState<TripData>({
    travelers: 1,
    startDate: "",
    endDate: "",
    transport: [],
    foodPreferences: [],
    accommodation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TripOptions>({
    transport: [],
    food: [],
    accommodation: []
  });

  useEffect(() => {
    const savedCity = localStorage.getItem("cityguide_city");
    if (savedCity) {
      const city = JSON.parse(savedCity);
      setCityName(city.name);
    }

    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/trip-options');
        if (response.ok) {
          const data = await response.json();
          setOptions(data);
        }
      } catch (error) {
        console.error("Failed to fetch trip options:", error);
      }
    };
    fetchOptions();
  }, []);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const isMultiDay = tripData.startDate && tripData.endDate && tripData.startDate !== tripData.endDate;
  const showAccommodation = isMultiDay;

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (currentStep === "food" && !showAccommodation) {
      handleComplete();
      return;
    }
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    } else {
      handleComplete();
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    } else {
      navigate("/");
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Calculate duration
      let duration = "1 day";
      if (tripData.startDate && tripData.endDate) {
        const start = new Date(tripData.startDate);
        const end = new Date(tripData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        duration = `${diffDays} days`;
      }

      // Prepare payload
      const payload = {
        destination: cityName,
        duration: duration,
        people_count: tripData.travelers.toString(),
        activities: [...tripData.transport, ...tripData.foodPreferences, tripData.accommodation].filter(Boolean),
        custom_activity: "",
        advice_type: "eco"
      };

      const response = await fetch('/api/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();

      toast({
        title: "Trip Plan Created!",
        description: `Your personalized itinerary for ${cityName} is ready.`,
      });
      
      // Navigate to result page with data
      navigate("/trip-result", { state: { result: data } });
      
    } catch (error) {
      console.error("Trip planning error:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the backend. Is it running?",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArrayItem = (arr: string[], item: string) => {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  };

  const canProceed = () => {
    switch (currentStep) {
      case "travelers":
        return tripData.travelers >= 1;
      case "dates":
        return tripData.startDate !== "";
      case "transport":
        return tripData.transport.length > 0;
      case "food":
        return tripData.foodPreferences.length > 0;
      case "accommodation":
        return tripData.accommodation !== "";
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "travelers":
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coral-light">
              <Users className="h-10 w-10 text-coral" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground mb-2">How many travelers?</h2>
              <p className="text-muted-foreground">Including yourself</p>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setTripData({ ...tripData, travelers: Math.max(1, tripData.travelers - 1) })}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-foreground hover:bg-secondary/80"
              >
                −
              </button>
              <span className="w-16 text-center text-5xl font-bold text-coral">{tripData.travelers}</span>
              <button
                onClick={() => setTripData({ ...tripData, travelers: Math.min(10, tripData.travelers + 1) })}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-foreground hover:bg-secondary/80"
              >
                +
              </button>
            </div>
          </div>
        );

      case "dates":
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ocean-light">
                <Calendar className="h-10 w-10 text-ocean" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">When are you visiting?</h2>
              <p className="text-muted-foreground">Select your trip dates</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Start Date</label>
                <input
                  type="date"
                  value={tripData.startDate}
                  onChange={(e) => setTripData({ ...tripData, startDate: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">End Date (optional)</label>
                <input
                  type="date"
                  value={tripData.endDate}
                  onChange={(e) => setTripData({ ...tripData, endDate: e.target.value })}
                  min={tripData.startDate}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>
            </div>
          </div>
        );

      case "transport":
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-light">
                <Car className="h-10 w-10 text-amber" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">How do you want to get around?</h2>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {options.transport.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTripData({ ...tripData, transport: toggleArrayItem(tripData.transport, option.id) })}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                    tripData.transport.includes(option.id)
                      ? "border-coral bg-coral-light"
                      : "border-border bg-card hover:border-coral/40"
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                  {tripData.transport.includes(option.id) && (
                    <Check className="h-4 w-4 text-coral" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case "food":
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sage-light">
                <Utensils className="h-10 w-10 text-sage" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">What do you want to eat?</h2>
              <p className="text-muted-foreground">Select your food preferences</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {options.food.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTripData({ ...tripData, foodPreferences: toggleArrayItem(tripData.foodPreferences, option.id) })}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                    tripData.foodPreferences.includes(option.id)
                      ? "border-coral bg-coral-light"
                      : "border-border bg-card hover:border-coral/40"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-sm font-medium text-foreground text-center">{option.label}</span>
                  {tripData.foodPreferences.includes(option.id) && (
                    <Check className="h-4 w-4 text-coral" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case "accommodation":
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ocean-light">
                <Home className="h-10 w-10 text-ocean" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Where do you want to stay?</h2>
              <p className="text-muted-foreground">Choose your accommodation type</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {options.accommodation.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTripData({ ...tripData, accommodation: option.id })}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${
                    tripData.accommodation === option.id
                      ? "border-coral bg-coral-light"
                      : "border-border bg-card hover:border-coral/40"
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{option.label}</span>
                  {tripData.accommodation === option.id && (
                    <Check className="h-4 w-4 text-coral" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  const visibleSteps = showAccommodation ? steps : steps.filter((s) => s.id !== "accommodation");

  return (
    <MobileLayout>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground">Plan Your Trip</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {cityName}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between gap-1">
            {visibleSteps.map((step, index) => {
              const stepIndex = visibleSteps.findIndex((s) => s.id === currentStep);
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;
              
              return (
                <div key={step.id} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                      isActive
                        ? "bg-coral text-primary-foreground"
                        : isCompleted
                        ? "bg-sage text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.icon}
                  </div>
                  <span className={`text-xs ${isActive ? "text-coral font-medium" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </header>

        {/* Step Content */}
        <div className="flex-1 px-4 py-6 animate-in">{renderStep()}</div>

        {/* Navigation */}
        <div className="sticky bottom-0 bg-background border-t border-border px-4 py-4">
          <button
            onClick={goNext}
            disabled={!canProceed() || isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-coral py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating..." : (currentStep === "food" && !showAccommodation
              ? "Create Itinerary"
              : currentStep === "accommodation"
              ? "Create Itinerary"
              : "Continue")}
            {!isLoading && <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TripPlanningPage;
