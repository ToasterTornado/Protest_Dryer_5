import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-[100dvh] w-full max-w-md mx-auto bg-background">
      {children}
    </div>
  );
};

export default MobileLayout;
