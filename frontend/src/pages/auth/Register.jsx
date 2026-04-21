import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock, User, Mail, UserPlus, ArrowRight, Phone } from "lucide-react";
import AuthService from "../../services/auth.service";
import { useEffect } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    contact: "",
    emergency_name: "",
    emergency_contact: ""
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Prepare data for backend - Prepend +91 if only 10 digits provided
      const formatPhone = (phone) => {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.length === 10) return `+91${cleaned}`;
        return phone.startsWith("+") ? phone : `+${phone}`;
      };

      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact: formatPhone(formData.contact),
        emergency_contacts: [
          {
            name: formData.emergency_name,
            contact: formatPhone(formData.emergency_contact)
          }
        ]
      };
      await AuthService.register(registrationData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
        
        <div className="mb-10 relative">
          <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-red-200 shadow-xl mx-auto rotate-12 transition-transform hover:rotate-0 cursor-default">
            <UserPlus className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 text-center tracking-tight">
            Join SafeHer
          </h2>
          <p className="text-gray-500 text-center mt-3 text-lg">
            Create your account to stay protected
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium rounded-r-lg flex items-center gap-3 animate-shake">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Jane Doe"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                onChange={handleInputChange}
                value={formData.name}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type="email"
                name="email"
                placeholder="jane@example.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Phone Number (10 Digit)</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type="tel"
                name="contact"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                title="Please enter a 10-digit Indian mobile number"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium"
                onChange={handleInputChange}
                value={formData.contact}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-black text-gray-400 tracking-widest uppercase mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input
                  type="text"
                  name="emergency_name"
                  placeholder="Contact Name"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium"
                  onChange={handleInputChange}
                  value={formData.emergency_name}
                />
              </div>
              <div className="space-y-2">
                <input
                  type="tel"
                  name="emergency_contact"
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit Indian mobile number"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 font-medium"
                  onChange={handleInputChange}
                  value={formData.emergency_contact}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Secure password"
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat password"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400"
                onChange={handleInputChange}
                value={formData.confirmPassword}
              />
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
                Create Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-600 text-lg">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-black hover:text-red-700 transition-colors underline-offset-4 hover:underline decoration-red-600/30">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
