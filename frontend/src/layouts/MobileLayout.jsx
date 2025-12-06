import { Outlet } from 'react-router-dom';
import { Map, MessageSquare, User } from 'lucide-react';

export default function MobileLayout() {
  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Main Content Area (Map or Page) */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="h-16 border-t bg-white flex justify-around items-center z-50 shadow-lg">
        <NavIcon icon={<Map size={24} />} label="Explore" />
        <NavIcon icon={<MessageSquare size={24} />} label="Chat" active />
        <NavIcon icon={<User size={24} />} label="Profile" />
      </nav>
    </div>
  );
}

function NavIcon({ icon, label, active }) {
  return (
    <button className={`flex flex-col items-center gap-1 ${active ? 'text-black' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}