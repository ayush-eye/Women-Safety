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
    <nav className="bg-white shadow-md px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 group">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-pink-700 transition-all">
          SafeHer 🚨
        </h1>
      </Link>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-gray-700 hover:text-red-600 focus:outline-none" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop & Mobile Navigation Links */}
      <div className={`absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 flex-col md:flex-row items-center gap-6 transition-all duration-300 ${isMenuOpen ? 'flex' : 'hidden md:flex'}`}>
        {user ? (
          <>
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition-colors w-full md:w-auto justify-center md:justify-start"
            >
              <Siren size={18} />
              Dashboard
            </Link>
            <Link
              to="/safe-places"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition-colors w-full md:w-auto justify-center md:justify-start"
            >
              <MapPin size={18} />
              Safe Places
            </Link>
            <Link
              to="/fake-call"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition-colors w-full md:w-auto justify-center md:justify-start"
            >
              <Phone size={18} />
              Fake Call
            </Link>
            <div className="flex items-center gap-4 md:ml-4 md:pl-4 md:border-l md:border-gray-200 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 w-full md:w-auto justify-center md:justify-start">
              <span className="text-gray-600 font-medium truncate max-w-[150px]">
                Hi, {user.name || "User"}
              </span>
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto mt-2 md:mt-0">
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-red-600 font-medium px-4 py-2 text-center"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
