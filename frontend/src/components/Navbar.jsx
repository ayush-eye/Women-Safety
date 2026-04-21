import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, User, Menu, X, MapPin, Siren, Phone } from "lucide-react";
import { useState } from "react";
import AuthService from "../services/auth.service";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", Icon: Siren },
    { to: "/safe-places", label: "Safe Places", Icon: MapPin },
    { to: "/fake-call", label: "Fake Call", Icon: Phone },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="text-red-600" size={32} fill="currentColor" />
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
            Safe<span className="text-red-600">Her</span>
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {user && (
            <div className="flex items-center gap-6 mr-6 pr-6 border-r border-gray-100">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-500 hover:text-red-600 font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <link.Icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div>
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-800">
                    {user.name || "User"}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Guardian
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:bg-red-600 hover:text-white transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-600 font-bold px-4 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-red-100 active:scale-95 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-6">
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 text-gray-700 font-bold p-4 bg-gray-50 rounded-2xl"
                  >
                    <link.Icon size={20} className="text-red-600" />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-red-600 font-bold p-4 bg-red-50 rounded-2xl mt-4"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="text-center font-bold p-4 text-gray-700">Login</Link>
                <Link to="/register" className="text-center font-bold p-4 bg-red-600 text-white rounded-2xl">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


