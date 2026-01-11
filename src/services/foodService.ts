import api from "@/lib/api";
import { withErrorHandling } from "@/utils";
import type {
	CreateFoodRequest,
	CheckFoodAppropriateRequest,
} from "@/types/recipe";

class FoodService {
	/**
	 * Get today's meals for the current user
	 * @returns {Promise} Standardized response with success flag and data
	 */
	getTodayMeals = withErrorHandling(async () => {
		return await api.get("/foods/today-meals");
	});

	/**
	 * Change today's meal by providing a new food ID
	 * @param {string} foodId - The ID of the new food to replace current meal
	 * @returns {Promise} Standardized response with success flag and data
	 */
	changeTodayMeal = withErrorHandling(async (foodId: string) => {
		const query = new URLSearchParams({ foodId }).toString();

		return await api.get(`/foods/today-meals?${query}`);
	});

	/**
	 * Get weekly menu for the current user
	 * @returns {Promise} Standardized response with success flag and data
	 */
	getWeeklyMenu = withErrorHandling(async () => {
		return await api.get("/foods/weekly-recommended");
	});

	/**
	 * Get today's progress for the current user
	 * @returns {Promise} Standardized response with success flag and data
	 */
	getTodayProgress = withErrorHandling(async () => {
		return await api.get("/foods/progress/today");
	});

	/**
	 * Log a food item for the current user
	 * @param {string} foodId - The ID of the food to log
	 * @returns {Promise} Standardized response with success flag and data
	 */
	logFood = withErrorHandling(async (foodId: string) => {
		return await api.post("/foods/log", { foodId });
	});

	/**
	 * Get food logs for a specific date
	 * @param {string} date - The date in YYYY-MM-DD format
	 * @returns {Promise} Standardized response with success flag and data
	 */
	getFoodLogsByDate = withErrorHandling(async (date: string) => {
		return await api.get(`/foods/logs/${date}`);
	});

	/**
	 * Get user's foods with pagination
	 * @param {number} page - Page number (default: 1)
	 * @param {number} limit - Items per page (default: 10)
	 * @returns {Promise<GetUserFoodsResponse>} Standardized response with success flag and data
	 */
	getUserFoods = withErrorHandling(
		async (page: number = 1, limit: number = 10) => {
			return await api.get("/foods/user", {
				params: { page, limit },
			});
		},
	);

	/**
	 * Check if a food is appropriate for the current user
	 * @param {CheckFoodAppropriateRequest} foodData - Food data to check
	 * @returns {Promise<CheckFoodAppropriateResponse>} Standardized response with isAppropriate flag
	 */
	checkFoodAppropriate = withErrorHandling(
		async (foodData: CheckFoodAppropriateRequest) => {
			const data = await api.post("/foods/check-appropriate", foodData);
			console.log(data);

			return await api.post("/foods/check-appropriate", foodData);
		},
	);

	/**
	 * Create a new food for the current user
	 * @param {CreateFoodRequest} foodData - Food data to create
	 * @returns {Promise<CreateUserFoodResponse>} Standardized response with success flag and data
	 */
	createUserFood = withErrorHandling(async (foodData: CreateFoodRequest) => {
		return await api.post("/foods/user", foodData);
	});

	/**
	 * Update a user's food by ID
	 * @param {string} foodId - The ID of the food to update
	 * @param {CreateFoodRequest} foodData - Updated food data
	 * @returns {Promise} Standardized response with success flag and data
	 */
	updateUserFood = withErrorHandling(
		async (foodId: string, foodData: CreateFoodRequest) => {
			return await api.patch(`/foods/${foodId}`, foodData);
		},
	);

	/**
	 * Delete a user's food by ID
	 * @param {string} foodId - The ID of the food to delete
	 * @returns {Promise} Standardized response with success flag
	 */
	deleteUserFood = withErrorHandling(async (foodId: string) => {
		return await api.delete(`/foods/user/${foodId}`);
	});

	/**
	 * Get food details by ID
	 * @param {string} foodId - The ID of the food to retrieve
	 * @returns {Promise} Standardized response with success flag and data
	 */
	getFoodById = withErrorHandling(async (foodId: string) => {
		return await api.get(`/foods/${foodId}`);
	});

	// ============= ADMIN FOOD OPERATIONS =============

	/**
	 * Get all foods (Admin only) with pagination and filters
	 * @param {number} page - Page number (default: 1)
	 * @param {number} limit - Items per page (default: 10)
	 * @param {Object} filters - Optional filters (category, meal, isActive, search)
	 * @returns {Promise} Standardized response with success flag and data
	 */
	getAdminFoods = withErrorHandling(
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

			return await api.get("/foods/admin", { params });
		},
	);

	/**
	 * Create a new food (Admin only)
	 * @param {CreateFoodRequest} foodData - Food data to create
	 * @returns {Promise} Standardized response with success flag and data
	 */
	createAdminFood = withErrorHandling(async (foodData: CreateFoodRequest) => {
		return await api.post("/foods/admin", foodData);
	});

	/**
	 * Update a food by ID (Admin only)
	 * @param {string} foodId - The ID of the food to update
	 * @param {CreateFoodRequest} foodData - Updated food data
	 * @returns {Promise} Standardized response with success flag and data
	 */
	updateAdminFood = withErrorHandling(
		async (foodId: string, foodData: CreateFoodRequest) => {
			return await api.patch(`/foods/${foodId}`, foodData);
		},
	);

	/**
	 * Delete a food by ID (Admin only)
	 * @param {string} foodId - The ID of the food to delete
	 * @returns {Promise} Standardized response with success flag
	 */
	deleteAdminFood = withErrorHandling(async (foodId: string) => {
		return await api.delete(`/foods/admin/${foodId}`);
	});

	/**
	 * Update food status (activate/deactivate) - Admin only
	 * @param {string} foodId - Food ID
	 * @param {boolean} isActive - New active status
	 * @returns {Promise} Standardized response with updated food info
	 */
	updateFoodStatus = withErrorHandling(
		async (foodId: string, isActive: boolean) => {
			return await api.patch(`/foods/${foodId}/status`, { isActive });
		},
	);
}

export const foodService = new FoodService();
