import { useState } from "react";
import { MapPin, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";
import linzHero from "@/assets/linz-hero.jpg";

interface OnboardingViewProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: MapPin,
    title: "Explore Linz Like a Local",
    subtitle: "Find hidden gems and navigate the city with ease.",
  },
  {
    icon: Sparkles,
    title: "AI Travel Companion",
    subtitle: "Ask for instant advice, itineraries, or current events.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    subtitle: "Emergency contacts and safe zones just one tap away.",
  },
];

const OnboardingView = ({ onComplete }: OnboardingViewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={linzHero}
          alt="Linz cityscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-10">
        <div key={currentSlide} className="mb-10 text-center animate-in">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card/20 backdrop-blur-md">
              <CurrentIcon className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>

          {/* Text */}
          <h1 className="mb-3 text-3xl font-bold text-primary-foreground">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg text-primary-foreground/80">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="mb-6 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-primary-foreground"
                  : "w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-card py-4 text-lg font-semibold text-foreground transition-all duration-200 hover:bg-card/90 active:scale-[0.98]"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingView;
