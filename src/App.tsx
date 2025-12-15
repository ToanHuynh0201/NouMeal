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
import AdminRoute from "./components/auth/AdminRoute";
import UserRoute from "./components/auth/UserRoute";
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

					{/* Protected Routes - Regular Users Only */}
					<Route
						path={ROUTES.DASHBOARD}
						element={
							<UserRoute>
								<DashboardPage />
							</UserRoute>
						}
					/>
					<Route
						path={ROUTES.MENU_SUGGESTION}
						element={
							<UserRoute>
								<MenuSuggestionPage />
							</UserRoute>
						}
					/>
					<Route
						path={ROUTES.AI_MEAL_SUGGESTION}
						element={
							<UserRoute>
								<AIMealSuggestionPage />
							</UserRoute>
						}
					/>
					<Route
						path={ROUTES.IMAGE_RECOGNITION}
						element={
							<UserRoute>
								<ImageRecognitionPage />
							</UserRoute>
						}
					/>
					<Route
						path={ROUTES.MY_RECIPES}
						element={
							<UserRoute>
								<MyRecipesPage />
							</UserRoute>
						}
					/>
					<Route
						path={ROUTES.PROFILE}
						element={
							<UserRoute>
								<ProfilePage />
							</UserRoute>
						}
					/>

					{/* Protected Routes - Admin Only */}
					<Route
						path={ROUTES.ADMIN_OVERALL}
						element={
							<AdminRoute>
								<OverallPage />
							</AdminRoute>
						}
					/>
					<Route
						path={ROUTES.ADMIN_USERS}
						element={
							<AdminRoute>
								<UsersPage />
							</AdminRoute>
						}
					/>
					<Route
						path={ROUTES.ADMIN_FOOD}
						element={
							<AdminRoute>
								<FoodPage />
							</AdminRoute>
						}
					/>
					<Route
						path={ROUTES.ADMIN_COMMUNITY}
						element={
							<AdminRoute>
								<CommunityPage />
							</AdminRoute>
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
