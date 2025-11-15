import {Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import {ROUTES} from "./constants";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import {AuthProvider} from "./contexts/AuthContext";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MenuSuggestionPage from "./pages/MenuSuggestionPage";
import AIMealSuggestionPage from "./pages/AIMealSuggestionPage";
import ImageRecognitionPage from "./pages/ImageRecognitionPage";
import MyRecipesPage from "./pages/MyRecipesPage";

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
                        path={ROUTES.MENU_SUGGESTION}
                        element={
                            <ProtectedRoute>
                                <MenuSuggestionPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.AI_MEAL_SUGGESTION}
                        element={
                            <ProtectedRoute>
                                <AIMealSuggestionPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.IMAGE_RECOGNITION}
                        element={
                            <ProtectedRoute>
                                <ImageRecognitionPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.MY_RECIPES}
                        element={
                            <ProtectedRoute>
                                <MyRecipesPage />
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
