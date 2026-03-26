import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut, User, MapPin, Siren, Phone } from "lucide-react";
import AuthService from "../services/auth.service";

const Navbar = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

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

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
            >
              <Siren size={18} />
              Dashboard
            </Link>
            <Link
              to="/safe-places"
              className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
            >
              <MapPin size={18} />
              Safe Places
            </Link>
            <Link
              to="/fake-call"
              className="text-gray-700 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
            >
              <Phone size={18} />
              Fake Call
            </Link>
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
              <span className="text-gray-600 font-medium">
                Hi, {user.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-red-600 font-medium px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
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
