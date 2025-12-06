import { useNavigate } from "react-router-dom";
import { Calendar, Map, Bookmark, Settings } from "lucide-react";

interface ActionItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor: string;
  route?: string;
}

const ActionGrid = () => {
  const navigate = useNavigate();

  const actions: ActionItem[] = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "What's On",
      subtitle: "Events today",
      accentColor: "bg-coral-light text-coral",
      route: "/events",
    },
    {
      icon: <Map className="h-6 w-6" />,
      title: "City Map",
      subtitle: "Navigate",
      accentColor: "bg-ocean-light text-ocean",
      route: "/map",
    },
    {
      icon: <Bookmark className="h-6 w-6" />,
      title: "My Plan",
      subtitle: "0 items",
      accentColor: "bg-sage-light text-sage",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Settings",
      accentColor: "bg-secondary text-muted-foreground",
    },
  ];

  const handleClick = (action: ActionItem) => {
    if (action.route) {
      navigate(action.route);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className="group cursor-pointer rounded-2xl border border-border/50 bg-card p-4 text-left transition-all duration-200 hover:border-primary/20 hover:shadow-card active:scale-[0.98]"
          onClick={() => handleClick(action)}
        >
          <div
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${action.accentColor} transition-transform duration-200 group-hover:scale-105`}
          >
            {action.icon}
          </div>
          <h3 className="font-semibold text-foreground">{action.title}</h3>
          {action.subtitle && (
            <p className="text-sm text-muted-foreground">{action.subtitle}</p>
          )}
        </button>
      ))}
    </div>
  );
};

export default ActionGrid;
