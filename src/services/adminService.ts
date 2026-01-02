import api from "../lib/api";
import { withErrorHandling } from "../utils";

class AdminService {
	/**
	 * Get admin overview statistics
	 * @param {string} startDate - Start date for filtering data (ISO format)
	 * @param {string} endDate - End date for filtering data (ISO format)
	 * @param {string} groupBy - Group results by day, week, or month
	 * @param {string} tz - Timezone for date calculations
	 * @returns {Promise<Object>} Standardized response with admin overview data
	 */
	getOverview = withErrorHandling(
		async (params?: {
			startDate?: string;
			endDate?: string;
			groupBy?: string;
			tz?: string;
		}) => {
			return api.get("/reports/admin/overview", { params });
		},
	);

	/**
	 * Get admin demographics statistics
	 * @returns {Promise<Object>} Standardized response with admin demographics data
	 */
	getDemographics = withErrorHandling(async () => {
		return api.get("/reports/admin/demographics");
	});

	/**
	 * Get admin food overview statistics
	 * @returns {Promise<Object>} Standardized response with admin food overview data
	 */
	getFoodOverview = withErrorHandling(async () => {
		return api.get("/reports/admin/food-overview");
	});

	/**
	 * Get top foods by calories and allergens
	 * @returns {Promise<Object>} Standardized response with top foods data
	 */
	getTopFoods = withErrorHandling(async () => {
		return api.get("/reports/admin/top-foods");
	});

	/**
	 * Get all users with pagination and filters
	 * @param {number} page - Page number (default: 1)
	 * @param {number} limit - Items per page (default: 10)
	 * @param {Object} filters - Optional filters (role, isActive, search)
	 * @returns {Promise<Object>} Standardized response with users list and pagination info
	 */
	getAllUsers = withErrorHandling(
		async (
			page: number = 1,
			limit: number = 10,
			filters?: {
				role?: string;
				isActive?: string;
				search?: string;
			},
		) => {
			const params: any = { page, limit };

			// Add filters if provided
			if (filters?.role) {
				params.role = filters.role;
			}
			if (filters?.isActive) {
				params.isActive = filters.isActive;
			}
			if (filters?.search) {
				params.search = filters.search;
			}

			return api.get("/admin/users", { params });
		},
	);

	/**
	 * Update user status (activate/deactivate)
	 * @param {string} userId - User ID
	 * @param {boolean} isActive - New active status
	 * @returns {Promise<Object>} Standardized response with updated user info
	 */
	updateUserStatus = withErrorHandling(
		async (userId: string, isActive: boolean) => {
			return api.patch(`/admin/users/${userId}/status`, { isActive });
		},
	);

	/**
	 * Promote user to admin role
	 * @param {string} userId - User ID
	 * @param {string} email - User email
	 * @returns {Promise<Object>} Standardized response with promotion result
	 */
	promoteToAdmin = withErrorHandling(
		async (userId: string, email: string) => {
			return api.post("/admin/promote", { userId, email });
		},
	);

	/**
	 * Demote admin to user role
	 * @param {string} userId - User ID
	 * @param {string} email - User email
	 * @returns {Promise<Object>} Standardized response with demotion result
	 */
	demoteToUser = withErrorHandling(
		async (userId: string, email: string) => {
			return api.post("/admin/demote", { userId, email });
		},
	);

	/**
	 * Get all foods with pagination and filters
	 * @param {number} page - Page number (default: 1)
	 * @param {number} limit - Items per page (default: 10)
	 * @param {Object} filters - Optional filters (category, meal, isActive, search)
	 * @returns {Promise<Object>} Standardized response with foods list and pagination info
	 */
	getAllFoods = withErrorHandling(
		async (
			page: number = 1,
			limit: number = 10,
			filters?: {
				category?: string;
				meal?: string;
				isActive?: string;
				search?: string;
			},
		) => {
			const params: any = { page, limit };

			// Add filters if provided
			if (filters?.category) {
				params.category = filters.category;
			}
			if (filters?.meal) {
				params.meal = filters.meal;
			}
			if (filters?.isActive) {
				params.isActive = filters.isActive;
			}
			if (filters?.search) {
				params.search = filters.search;
			}

			return api.get("/foods", { params });
		},
	);

	/**
	 * Update food status (activate/deactivate)
	 * @param {string} foodId - Food ID
	 * @param {boolean} isActive - New active status
	 * @returns {Promise<Object>} Standardized response with updated food info
	 */
	updateFoodStatus = withErrorHandling(
		async (foodId: string, isActive: boolean) => {
			return api.patch(`/foods/${foodId}/status`, { isActive });
		},
	);

	/**
	 * Delete a food item
	 * @param {string} foodId - Food ID
	 * @returns {Promise<Object>} Standardized response with deletion result
	 */
	deleteFood = withErrorHandling(async (foodId: string) => {
		return api.delete(`/foods/${foodId}`);
	});
}

export const adminService = new AdminService();
