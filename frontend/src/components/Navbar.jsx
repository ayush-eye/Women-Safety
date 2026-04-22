import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, User, MapPin, Siren, Phone, Menu, X } from "lucide-react";
import AuthService from "../services/auth.service";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 border-b border-gray-50">
      <Link to="/" className="flex items-center gap-2 group">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-pink-700 transition-all">
          SafeHer 🚨
        </h1>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-red-600 font-semibold flex items-center gap-2 transition-colors"
            >
              <Siren size={18} />
              Dashboard
            </Link>
            <Link
              to="/safe-places"
              className="text-gray-600 hover:text-red-600 font-semibold flex items-center gap-2 transition-colors"
            >
              <MapPin size={18} />
              Safe Places
            </Link>
            <Link
              to="/fake-call"
              className="text-gray-600 hover:text-red-600 font-semibold flex items-center gap-2 transition-colors"
            >
              <Phone size={18} />
              Fake Call
            </Link>
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-100">
              <span className="text-gray-500 font-medium text-sm">
                Hi, {user.name?.split(' ')[0] || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-xl"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-red-600 font-semibold px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Right Action (Logout/Profile) */}
      <div className="md:hidden flex items-center gap-3">
        {user ? (
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-xl"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <Link
            to="/login"
            className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
