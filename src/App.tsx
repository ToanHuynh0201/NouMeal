import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import "./App.css";
import { ROUTES } from "./constants";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import MenuSuggestionPage from "./pages/MenuSuggestionPage";
import AIMealSuggestionPage from "./pages/AIMealSuggestionPage";
import ImageRecognitionPage from "./pages/ImageRecognitionPage";
import MyRecipesPage from "./pages/MyRecipesPage";

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route
						path={ROUTES.LANDING}
						element={<LandingPage />}
					/>
					<Route
						path={ROUTES.LOGIN}
						element={<LoginPage />}
					/>

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
						element={
							<Navigate
								to={ROUTES.LANDING}
								replace
							/>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
};

export default App;
