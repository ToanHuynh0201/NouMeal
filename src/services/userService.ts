import api from "../lib/api";
import { withErrorHandling } from "../utils";

class UserService {
    // /**
    //  * Get user profile
    //  * @returns {Promise<Object>} Standardized response with user profile data
    //  */
    // getProfile = withErrorHandling(async () => {
    //     return api.get("/profile");
    // });

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
