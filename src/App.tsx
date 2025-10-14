import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import {ROUTES} from "./constants";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import {AuthProvider} from "./contexts/AuthContext";
import RecipeDetailPage from "./pages/RecipeDetailPage";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route
                        path={ROUTES.HOME}
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.RECIPE}
                        element={
                            <ProtectedRoute>
                                <RecipeDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={<Navigate to={ROUTES.HOME} replace />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to={ROUTES.HOME} replace />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
