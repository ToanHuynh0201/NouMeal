import { withErrorHandling } from "@/utils";
import api from "@/lib/api";

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
}

export const userService = new UserService();
