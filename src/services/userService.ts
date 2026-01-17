import { withErrorHandling } from "@/utils";
import api from "@/lib/api";

export interface TimeseriesParams {
	startDate?: string; // ISO format YYYY-MM-DD
	endDate?: string; // ISO format YYYY-MM-DD
	groupBy?: "day" | "week" | "month";
	tz?: string; // e.g., "UTC", "America/New_York"
}

class UserService {
	// /**
	//  * Get user profile
	//  * @returns {Promise<Object>} Standardized response with user profile data
	//  */
	/**
	 * Update user profile
	 * @param {Object} profileData - Profile data to update
	 * @returns {Promise<Object>} Standardized response with updated user data
	 */
	updateProfile = withErrorHandling(async (profileData) => {
		return api.patch("/profile", profileData);
	});

	/**
	 * Get timeseries nutrition data
	 * @param {TimeseriesParams} params - Query parameters for filtering data
	 * @returns {Promise<Object>} Standardized response with timeseries data
	 */
	getTimeseries = withErrorHandling(async (params: TimeseriesParams = {}) => {
		const data = await api.get("/reports/user/timeseries", { params });
		console.log(data);

		return api.get("/reports/user/timeseries", { params });
	});

	/**
	 * Get user profile by ID
	 * @param {string} userId - User ID to fetch profile for
	 * @returns {Promise<Object>} Standardized response with user profile data
	 */
	getUserProfile = withErrorHandling(async (userId: string) => {
		return api.get(`/users/${userId}`);
	});

	/**
	 * Follow a user
	 * @param {string} targetUserId - ID of user to follow
	 * @returns {Promise<Object>} Standardized response
	 */
	followUser = withErrorHandling(async (targetUserId: string) => {
		return api.post(`/users/follow/${targetUserId}`, {});
	});

	/**
	 * Unfollow a user
	 * @param {string} targetUserId - ID of user to unfollow
	 * @returns {Promise<Object>} Standardized response
	 */
	unfollowUser = withErrorHandling(async (targetUserId: string) => {
		return api.delete(`/users/unfollow/${targetUserId}`, {});
	});
}

export const userService = new UserService();
