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
}

export const adminService = new AdminService();
