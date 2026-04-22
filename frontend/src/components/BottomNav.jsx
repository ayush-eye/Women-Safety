import { Link, useLocation } from "react-router-dom";
import { Siren, MapPin, Phone, Heart, Shield } from "lucide-react";
import AuthService from "../services/auth.service";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = AuthService.getCurrentUser();

  if (!user) return null;

  const navItems = [
    { to: "/dashboard", icon: Siren, label: "SOS" },
    { to: "/safe-places", icon: MapPin, label: "Places" },
    { to: "/criminal-detection", icon: Shield, label: "Sentinel" },
    { to: "/fake-call", icon: Phone, label: "Fake" },
    { to: "/manage-contacts", icon: Heart, label: "Profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center py-2 z-[60] pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)] px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center p-2 transition-all duration-300 relative ${
              isActive ? "text-red-600 scale-110" : "text-gray-400"
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-1 h-1 bg-red-600 rounded-full" />
            )}
            <div className={`p-2 rounded-2xl transition-all duration-300 ${
              isActive ? "bg-red-50" : "hover:bg-gray-50"
            }`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold mt-1 tracking-tight ${
              isActive ? "text-red-600" : "text-gray-500"
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
