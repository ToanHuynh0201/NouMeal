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
import OverallPage from "./pages/admin/OverallPage";
import UsersPage from "./pages/admin/UsersPage";
import FoodPage from "./pages/admin/FoodPage";
import CommunityPage from "./pages/admin/CommunityPage";

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

					{/* Protected Routes - Regular Users */}
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

					{/* Protected Routes - Admin */}
					<Route
						path={ROUTES.ADMIN_OVERALL}
						element={
							<ProtectedRoute>
								<OverallPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path={ROUTES.ADMIN_USERS}
						element={
							<ProtectedRoute>
								<UsersPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path={ROUTES.ADMIN_FOOD}
						element={
							<ProtectedRoute>
								<FoodPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path={ROUTES.ADMIN_COMMUNITY}
						element={
							<ProtectedRoute>
								<CommunityPage />
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
