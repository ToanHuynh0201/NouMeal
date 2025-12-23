import api from "@/lib/api";
import { withErrorHandling } from "@/utils";

class FoodService {
	/**
	 * Get recommended foods for the current user
	 * @returns {Promise} Standardized response with success flag and data
	 */
	getRecommendedFoods = withErrorHandling(async () => {
		return await api.get("/foods/recommended");
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
}

export const foodService = new FoodService();
