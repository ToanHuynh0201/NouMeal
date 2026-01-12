import api from "../lib/api";
import { AUTH_CONFIG, ERROR_MESSAGES } from "../constants";
import {
	getStorageItem,
	setStorageItem,
	clearStorageItems,
	parseError,
	logError,
} from "../utils";
import type {
	UserRegistrationRequest,
	UserLoginRequest,
	AuthResponse,
} from "../types";

class AuthService {
	/**
	 * Register a new user
	 * Note: Does NOT auto-login. User must verify email first.
	 * @param {UserRegistrationRequest} userData - User registration data
	 * @returns {Promise<AuthResponse>} API response data
	 */
	async register(userData: UserRegistrationRequest): Promise<AuthResponse> {
		try {
			const response = await api.post("/users/register", userData);

			if (response.data.status === "success" || response.data.success) {
				// Don't store auth data yet - user needs to verify email first
				// Backend will send OTP email automatically
				return response.data;
			}

			throw this._createAuthError(response, userData.email);
		} catch (error: any) {
			if (error.name === "ApiError") {
				throw error;
			}

			const parsedError = parseError(error);
			logError(parsedError, {
				context: "auth.register",
				email: userData.email,
			});
			throw parsedError;
		}
	}

	/**
	 * Login user with email and password
	 * @param {string} email - User email
	 * @param {string} password - User password
	 * @returns {Promise<AuthResponse>} API response data
	 */
	async login(email: string, password: string): Promise<AuthResponse> {
		try {
			// Mock admin login
			if (
				email === "admin@NouMeal.com" &&
				password === "Toanhuynh0201@"
			) {
				const mockAdminData: AuthResponse = {
					success: true,
					message: "Login successful",
					data: {
						user: {
							_id: "admin-001",
							email: "admin@NouMeal.com",
							name: "Administrator",
							age: 30,
							gender: "other" as const,
							height: 170,
							weight: 70,
							activity: "moderately_active" as const,
							goal: "maintain_weight" as const,
							isActive: true,
							isEmailVerified: true,
							role: "ADMIN",
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
						accessToken: "mock-admin-token-123456",
						refreshToken: "mock-admin-refresh-token-123456",
					},
				};

				const { user, accessToken, refreshToken } = mockAdminData.data!;
				this._storeAuthData(user, accessToken, refreshToken);
				return mockAdminData;
			}

			const loginData: UserLoginRequest = {
				email,
				password,
			};

			const response = await api.post("/users/login", loginData);

			if (response.data.status === "success" || response.data.success) {
				// Handle both response formats from backend
				const data = response.data.data || response.data;
				const { user, accessToken, refreshToken, token } = data;

				// Use either accessToken or token (depending on backend response)
				const authToken = accessToken || token;

				if (user && authToken) {
					// Note: Removed role validation to support both USER and ADMIN roles
					// If you need role-specific validation, implement it at route level
					this._storeAuthData(user, authToken, refreshToken);
				}

				return response.data;
			}

			throw this._createAuthError(response, email);
		} catch (error: any) {
			if (error.name === "ApiError") {
				throw error;
			}

			const parsedError = parseError(error);
			logError(parsedError, { context: "auth.login", email });
			throw parsedError;
		}
	}

	/**
	 * Logout user and clear stored data
	 * Also calls the backend logout endpoint to invalidate refresh token
	 */
	async logout() {
		try {
			// Call backend logout endpoint to invalidate refresh token
			const token = this.getAccessToken();
			if (token) {
				await api.post("/auth/logout", {});
			}
		} catch (error) {
			// Log error but continue with local logout
			logError(parseError(error), { context: "auth.logout" });
		} finally {
			// Always clear local storage
			clearStorageItems([
				AUTH_CONFIG.TOKEN_STORAGE_KEY,
				AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
				AUTH_CONFIG.USER_STORAGE_KEY,
			]);
		}
	}

	/**
	 * Get current user from localStorage
	 * @returns {Object|null} User object or null
	 */
	getCurrentUser() {
		return getStorageItem(AUTH_CONFIG.USER_STORAGE_KEY);
	}

	/**
	 * Check if user is authenticated
	 * @returns {boolean} Authentication status
	 */
	isAuthenticated() {
		try {
			const token = this.getAccessToken();
			const user = this.getCurrentUser();

			// Check if token and user exist
			if (!token || !user) {
				return false;
			}

			// User is authenticated if they have valid token and user data
			// Role validation should be done at route/component level if needed
			return true;
		} catch (error) {
			logError(error, { context: "auth.isAuthenticated" });
			this.logout();
			return false;
		}
	}

	/**
	 * Get access token
	 * @returns {string|null} Access token or null
	 */
	getAccessToken() {
		return getStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
	}

	/**
	 * Get refresh token
	 * @returns {string|null} Refresh token or null
	 */
	getRefreshToken() {
		return getStorageItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
	}

	/**
	 * Validate user session
	 * @returns {boolean} Whether session is valid
	 */
	validateSession() {
		const token = this.getAccessToken();
		if (!token) {
			return false;
		}

		const user = this.getCurrentUser();
		if (!user) {
			this.logout();
			return false;
		}

		return true;
	}

	/**
	 * Change user password
	 * @param {string} currentPassword - Current password
	 * @param {string} newPassword - New password
	 * @returns {Promise<Object>} API response data
	 */
	async changePassword(currentPassword: string, newPassword: string) {
		try {
			const response = await api.patch("/users/change-password", {
				currentPassword,
				newPassword,
			});

			if (response.data.status === "success" || response.data.success) {
				return response.data;
			}

			throw parseError({ response });
		} catch (error: any) {
			if (error.name === "ApiError") {
				throw error;
			}

			const parsedError = parseError(error);
			logError(parsedError, { context: "auth.changePassword" });
			throw parsedError;
		}
	}

	/**
	 * Verify email with OTP
	 * @param {string} email - User email
	 * @param {string} otp - 6-digit OTP
	 * @returns {Promise<Object>} API response data
	 */
	async verifyEmail(email: string, otp: string) {
		try {
			const response = await api.post("/auth/verify-email", {
				email,
				otp,
			});

			if (response.data.status === "success" || response.data.success) {
				return response.data;
			}

			throw parseError({ response });
		} catch (error: any) {
			if (error.name === "ApiError") {
				throw error;
			}

			const parsedError = parseError(error);
			logError(parsedError, { context: "auth.verifyEmail", email });
			throw parsedError;
		}
	}

	/**
	 * Resend email verification OTP
	 * @param {string} email - User email
	 * @returns {Promise<Object>} API response data
	 */
	async resendVerificationEmail(email: string) {
		try {
			const response = await api.post("/auth/resend-verification", {
				email,
			});

			if (response.data.status === "success" || response.data.success) {
				return response.data;
			}

			throw parseError({ response });
		} catch (error: any) {
			if (error.name === "ApiError") {
				throw error;
			}

			const parsedError = parseError(error);
			logError(parsedError, {
				context: "auth.resendVerification",
				email,
			});
			throw parsedError;
		}
	}

	/**
	 * Request password reset OTP
	 * @param {string} email - User email
	 * @returns {Promise<Object>} API response data
	 */
	async forgotPassword(email: string) {
		try {
			const response = await api.post("/auth/forgot-password", {
				email,
			});

			if (response.data.status === "success" || response.data.success) {
				return response.data;
			}

			throw parseError({ response });
		} catch (error: any) {
			if (error.name === "ApiError") {
				throw error;
			}

			const parsedError = parseError(error);
			logError(parsedError, { context: "auth.forgotPassword", email });
			throw parsedError;
		}
	}

	/**
	 * Reset password with OTP
	 * @param {string} email - User email
	 * @param {string} otp - 6-digit OTP
	 * @param {string} newPassword - New password
	 * @returns {Promise<AuthResponse>} API response data with new tokens
	 */
	async resetPassword(
		email: string,
		otp: string,
		newPassword: string,
	): Promise<AuthResponse> {
		try {
			const response = await api.post("/auth/reset-password", {
				email,
				otp,
				newPassword,
			});

			if (response.data.status === "success" || response.data.success) {
				const data = response.data.data || response.data;
				const { user, accessToken, refreshToken, token } = data;

				// Use either accessToken or token (depending on backend response)
				const authToken = accessToken || token;

				if (user && authToken) {
					this._storeAuthData(user, authToken, refreshToken);
				}

				return response.data;
			}

			throw parseError({ response });
		} catch (error: any) {
			if (error.name === "ApiError") {
				throw error;
			}

			const parsedError = parseError(error);
			logError(parsedError, { context: "auth.resetPassword", email });
			throw parsedError;
		}
	}

	/**
	 * Refresh authentication token
	 * @returns {Promise<boolean>} Success status
	 */
	async refreshToken() {
		try {
			const refreshToken = this.getRefreshToken();
			if (!refreshToken) {
				return false;
			}

			const response = await api.post("/auth/token/refresh", {
				refreshToken,
			});

			if (response.data.status === "success") {
				const { accessToken, refreshToken: newRefreshToken } =
					response.data.data;
				setStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, accessToken);

				if (newRefreshToken) {
					setStorageItem(
						AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
						newRefreshToken,
					);
				}

				return true;
			}

			return false;
		} catch (error) {
			logError(parseError(error), { context: "auth.refreshToken" });
			this.logout();
			return false;
		}
	}

	/**
	 * Check if user has required role
	 * @private
	 * @param {Object} user - User object
	 * @returns {boolean} Whether user has required role
	 */
	_hasRequiredRole(user: any) {
		return user?.role === AUTH_CONFIG.REQUIRED_ROLE;
	}

	/**
	 * Check if current user has admin role
	 * @returns {boolean} Whether user is admin
	 */
	isAdmin() {
		const user = this.getCurrentUser();
		return user?.role?.toUpperCase() === "ADMIN";
	}

	/**
	 * Check if current user has specific role
	 * @param {string} role - Role to check
	 * @returns {boolean} Whether user has the role
	 */
	hasRole(role: string) {
		const user = this.getCurrentUser();
		return user?.role?.toUpperCase() === role.toUpperCase();
	}

	/**
	 * Validate user role during login (deprecated - kept for backward compatibility)
	 * @private
	 * @param {Object} user - User object
	 * @throws {Error} If user doesn't have required role
	 */
	_validateUserRole(user: any) {
		if (!this._hasRequiredRole(user)) {
			const error = new Error(ERROR_MESSAGES.FORBIDDEN);
			logError(error, {
				context: "auth.login",
				userRole: user.role,
			});
			throw error;
		}
	}

	/**
	 * Store authentication data in localStorage
	 * @private
	 * @param {Object} user - User object
	 * @param {string} accessToken - Access token
	 * @param {string} refreshToken - Refresh token
	 */
	_storeAuthData(user: any, accessToken: any, refreshToken: any) {
		setStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, accessToken);
		setStorageItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
		setStorageItem(AUTH_CONFIG.USER_STORAGE_KEY, user);
	}

	/**
	 * Create authentication error
	 * @private
	 * @param {Object} response - API response
	 * @param {string} email - User email
	 * @returns {Error} Parsed error
	 */
	_createAuthError(response: any, email: any) {
		const error = parseError({ response });
		logError(error, { context: "auth.login", email });
		return error;
	}
}

export const authService = new AuthService();
