import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, User, MapPin, Siren, Phone, Menu, X } from "lucide-react";
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
    <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
            <Shield size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            Safe<span className="text-red-600">Her</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl mr-4 border border-slate-200">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2 text-slate-600 hover:text-red-600 font-bold text-sm rounded-xl hover:bg-white transition-all flex items-center gap-2"
                  >
                    <link.Icon size={16} />
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Guardian</span>
                  <span className="text-sm font-bold text-slate-700">{user.name || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4 items-center">
              <Link
                to="/login"
                className="text-slate-600 hover:text-red-600 font-bold px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl hover:shadow-red-200 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 text-slate-700 font-bold p-4 bg-slate-50 rounded-2xl"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm text-red-600">
                      <link.Icon size={20} />
                    </div>
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-red-600 font-bold p-4 bg-red-50 rounded-2xl mt-4"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <LogOut size={20} />
                  </div>
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="text-center font-bold p-4 text-slate-700">Sign In</Link>
                <Link to="/register" className="text-center font-bold p-4 bg-slate-900 text-white rounded-2xl">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

