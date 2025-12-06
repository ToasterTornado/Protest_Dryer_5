import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Shield, Hospital, Flame, Car, AlertTriangle } from "lucide-react";
import MobileLayout from "@/layouts/MobileLayout";

interface EmergencyContact {
  id: string;
  title: string;
  number: string;
  description: string;
  iconType: string;
  color: string;
}

interface SafeZone {
  name: string;
  address: string;
  distance: string;
}

const iconMap: Record<string, React.ReactNode> = {
  alert: <AlertTriangle className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  hospital: <Hospital className="h-6 w-6" />,
  car: <Car className="h-6 w-6" />,
};

const EmergencyPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactsRes, zonesRes] = await Promise.all([
          fetch("/api/emergency-contacts"),
          fetch("/api/safe-zones")
        ]);

        if (contactsRes.ok && zonesRes.ok) {
          const contactsData = await contactsRes.json();
          const zonesData = await zonesRes.json();
          setContacts(contactsData);
          setSafeZones(zonesData);
        }
      } catch (error) {
        console.error("Failed to fetch emergency data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <MobileLayout>
      <div className="flex min-h-[100dvh] flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-emergency px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-primary-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Emergency Help</h1>
              <p className="text-sm text-primary-foreground/80">Get immediate assistance</p>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-6">
          {/* Emergency Alert */}
          <div className="mb-6 rounded-2xl bg-emergency-light border border-emergency/20 p-4 animate-in">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emergency">
                <AlertTriangle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-emergency-foreground">Stay Calm</h3>
                <p className="text-sm text-emergency-foreground/80">
                  In case of emergency, call the appropriate number below. Help is available 24/7.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contacts List */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-bold text-foreground">Emergency Contacts</h2>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emergency"></div>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                  onClick={() => handleCall(contact.number)}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${contact.color}`}>
                    {iconMap[contact.iconType] || <Phone className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{contact.title}</h3>
                    <p className="text-xs text-muted-foreground">{contact.description}</p>
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80">
                    <Phone className="h-5 w-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Safe Zones */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Nearby Safe Zones</h2>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading safe zones...</div>
              ) : (
                safeZones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">{zone.name}</h4>
                      <p className="text-xs text-muted-foreground">{zone.address}</p>
                    </div>
                    <span className="text-xs font-bold text-foreground">{zone.distance}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EmergencyPage;
