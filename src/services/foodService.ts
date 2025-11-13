import api from "@/lib/api";
import {withErrorHandling} from "@/utils";

class FoodService {
    /**
     * Get recommended foods for the current user
     * @returns {Promise} Standardized response with success flag and data
     */
    getRecommendedFoods = withErrorHandling(async () => {
        return await api.get("/foods/recommended");
    });

    /**
     * Get daily calorie needs for the current user
     * @returns {Promise} Standardized response with success flag and data
     */
    getDailyCalorieNeeds = withErrorHandling(async () => {
        return await api.get("/foods/daily-calorie-needs");
    });
}

export const foodService = new FoodService();
