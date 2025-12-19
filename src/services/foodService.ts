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
}

export const foodService = new FoodService();
