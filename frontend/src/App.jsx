import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import SafePlaces from "./pages/SafePlaces";
import ManageContacts from "./pages/ManageContacts";
import AuthService from "./services/auth.service";
import FakeCall from "./pages/FakeCall";
import CriminalDetection from "./pages/CriminalDetection";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = AuthService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Register service worker
const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    });
  }
};

function App() {
  useEffect(() => {
    // Register service worker when app mounts
    registerServiceWorker();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-contacts"
            element={
              <ProtectedRoute>
                <ManageContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safe-places"
            element={
              <ProtectedRoute>
                <SafePlaces />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fake-call"
            element={
              <ProtectedRoute>
                <FakeCall />
              </ProtectedRoute>
            }
          />
          <Route
            path="/criminal-detection"
            element={
              <ProtectedRoute>
                <CriminalDetection />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
