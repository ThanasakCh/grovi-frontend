import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FieldProvider } from "./contexts/FieldContext";
import Navbar from "./components/common/Navbar";
import AuthPage from "./pages/AuthPage";
import MapPage from "./pages/MapPage";
import FieldDetailPage from "./pages/FieldDetailPage";
import HealthPage from "./pages/HealthPage";
import AnalysisPage from "./pages/AnalysisPage";
import ComparePage from "./pages/ComparePage";
import HomePage from "./pages/HomePage";
import TunnelDashboard from "./pages/TunnelDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ["/auth"];

  return (
    <div className="app">
      {!hideHeaderPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tunnel-dashboard" element={<TunnelDashboard />} />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/field/:fieldId"
          element={
            <ProtectedRoute>
              <FieldDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health/:fieldId"
          element={
            <ProtectedRoute>
              <HealthPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis/:fieldId"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compare/:fieldId"
          element={
            <ProtectedRoute>
              <ComparePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FieldProvider>
        <Router>
          <AppContent />
        </Router>
      </FieldProvider>
    </AuthProvider>
  );
}

export default App;
