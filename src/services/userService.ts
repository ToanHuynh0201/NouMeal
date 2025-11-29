import api from "../lib/api";
import { withErrorHandling } from "../utils";
import type { User } from "../types";

// Mock user data cho admin
const users: User[] = [
	{
		_id: "1",
		email: "user1@example.com",
		name: "Nguyễn Văn A",
		age: 25,
		gender: "male",
		height: 170,
		weight: 65,
		activity: "moderately_active",
		goal: "lose_weight",
		isActive: true,
		isEmailVerified: true,
		role: "user",
		lastLogin: "2025-11-28T10:00:00Z",
		createdAt: "2025-01-01T08:00:00Z",
		updatedAt: "2025-11-28T10:00:00Z",
	},
	{
		_id: "2",
		email: "user2@example.com",
		name: "Trần Thị B",
		age: 32,
		gender: "female",
		height: 160,
		weight: 54,
		activity: "lightly_active",
		goal: "maintain_weight",
		isActive: false,
		isEmailVerified: false,
		role: "user",
		lastLogin: "2025-11-27T09:00:00Z",
		createdAt: "2025-02-15T08:00:00Z",
		updatedAt: "2025-11-27T09:00:00Z",
	},
	{
		_id: "3",
		email: "user3@example.com",
		name: "Lê Văn C",
		age: 41,
		gender: "male",
		height: 175,
		weight: 72,
		activity: "sedentary",
		goal: "improve_health",
		isActive: true,
		isEmailVerified: true,
		role: "user",
		lastLogin: "2025-11-29T07:00:00Z",
		createdAt: "2025-03-10T08:00:00Z",
		updatedAt: "2025-11-29T07:00:00Z",
	},
];

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

	// Lấy danh sách user (mock)
	getUsers = async (): Promise<User[]> => {
		return new Promise((resolve) => {
			setTimeout(() => resolve(users), 500);
		});
	};

	// Kích hoạt/vô hiệu hóa user (mock)
	updateUserStatus = async (
		userId: string,
		isActive: boolean,
	): Promise<User | null> => {
		const user = users.find((u) => u._id === userId);
		if (user) {
			user.isActive = isActive;
			user.updatedAt = new Date().toISOString();
			return new Promise((resolve) => {
				setTimeout(() => resolve(user), 300);
			});
		}
		return null;
	};
}

export const userService = new UserService();
