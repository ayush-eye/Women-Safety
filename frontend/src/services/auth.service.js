import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

const AuthService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      // Store user and token together
      const userData = {
        ...response.data.user,
        token: response.data.token
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};

export default AuthService;
