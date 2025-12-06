import { MessageCircle, Sparkles } from "lucide-react";

interface ChatPromptCardProps {
  onPress?: () => void;
}

const ChatPromptCard = ({ onPress }: ChatPromptCardProps) => {
  return (
    <button
      onClick={onPress}
      className="group relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-glow active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-105">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-muted-foreground">Ask CityGuide for advice...</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary transition-transform duration-300 group-hover:scale-110">
          <MessageCircle className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </button>
  );
};

export default ChatPromptCard;
