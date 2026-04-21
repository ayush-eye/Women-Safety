import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock, User, Siren, ArrowRight } from "lucide-react";
import AuthService from "../../services/auth.service";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AuthService.login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
  const user = AuthService.getCurrentUser();

  if (user) {
    navigate("/dashboard");
  }
}, []);
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-pink-50 via-white to-red-50">
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Simple decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="mb-10 relative">
          <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-red-200 shadow-xl mx-auto rotate-12 transition-transform hover:rotate-0 cursor-default">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 text-center tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-center mt-3 text-lg">
            Stay protected, stay connected
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium rounded-r-lg flex items-center gap-3 animate-shake">
            <Siren size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type="email"
                name="email"
                placeholder="yours@email.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your secure password"
                required
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                onChange={handleInputChange}
                value={formData.password}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <a href="#" className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors underline-offset-4 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-black text-white font-bold py-5 rounded-2xl transition-all duration-500 shadow-xl shadow-red-200 hover:shadow-black/20 transform active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none mt-4 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Login to Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-600 text-lg">
          Not a member?{" "}
          <Link to="/register" className="text-red-600 font-black hover:text-red-700 transition-colors underline-offset-4 hover:underline decoration-red-600/30">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
