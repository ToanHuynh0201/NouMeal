import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import {ROUTES} from "./constants";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import {AuthProvider} from "./contexts/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path={ROUTES.LANDING} element={<LandingPage />} />
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    
                    {/* Protected Routes */}
                    <Route
                        path={ROUTES.DASHBOARD}
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE}
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Fallback Routes */}
                    <Route
                        path="*"
                        element={<Navigate to={ROUTES.LANDING} replace />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
