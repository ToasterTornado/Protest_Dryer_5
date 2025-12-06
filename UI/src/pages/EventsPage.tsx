import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import MobileLayout from "@/layouts/MobileLayout";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees?: number;
  imageUrl?: string;
}

const categoryColors: Record<string, string> = {
  Festival: "bg-coral-light text-coral",
  Market: "bg-sage-light text-sage",
  Concert: "bg-ocean-light text-ocean",
  Tour: "bg-amber-light text-amber",
  Food: "bg-coral-light text-coral",
};

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cityName, setCityName] = useState("Linz");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedCity = localStorage.getItem("cityguide_city");
    if (savedCity) {
      const city = JSON.parse(savedCity);
      setCityName(city.name);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events?city=${encodeURIComponent(cityName)}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [cityName]);

  const categories = ["All", ...new Set(events.map((e) => e.category))];
  
  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter((e) => e.category === selectedCategory);

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
              <h1 className="text-lg font-bold text-foreground">Events in {cityName}</h1>
              <p className="text-xs text-muted-foreground">Discover what's happening</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 mt-4 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-coral text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all hover:shadow-md">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[event.category] || "bg-secondary text-muted-foreground"}`}>
                      {event.category}
                    </span>
                    {event.attendees && (
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {event.attendees > 1000 ? `${(event.attendees / 1000).toFixed(1)}k` : event.attendees}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-coral transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-coral" />
                      <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-coral" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-coral" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/50 px-5 py-3 flex justify-between items-center">
                  <span className="text-xs font-medium text-coral">View Details</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No events found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default EventsPage;
