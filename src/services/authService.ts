import api from "../lib/api";
import {AUTH_CONFIG, ERROR_MESSAGES} from "../constants";
import {
    getStorageItem,
    setStorageItem,
    clearStorageItems,
    parseError,
    logError,
} from "../utils";

class AuthService {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} API response data
     */
    async login(email: string, password: string) {
        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            if (response.data.status === "success") {
                const {user, accessToken, refreshToken} = response.data.data;

                this._validateUserRole(user);
                this._storeAuthData(user, accessToken, refreshToken);

                return response.data;
            }

            throw this._createAuthError(response, email);
        } catch (error: any) {
            if (error.name === "ApiError") {
                throw error;
            }

            const parsedError = parseError(error);
            logError(parsedError, {context: "auth.login", email});
            throw parsedError;
        }
    }

    /**
     * Logout user and clear stored data
     */
    logout() {
        clearStorageItems([
            AUTH_CONFIG.TOKEN_STORAGE_KEY,
            AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
            AUTH_CONFIG.USER_STORAGE_KEY,
        ]);
    }

    /**
     * Get current user from localStorage
     * @returns {Object|null} User object or null
     */
    getCurrentUser() {
        return getStorageItem(AUTH_CONFIG.USER_STORAGE_KEY);
    }

    /**
     * Check if user is authenticated and has admin role
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        try {
            const token = this.getAccessToken();
            const user = this.getCurrentUser();

            if (!token || !user) {
                return false;
            }

            return this._hasRequiredRole(user);
        } catch (error) {
            logError(error, {context: "auth.isAuthenticated"});
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
     * Validate user session and role
     * @returns {boolean} Whether session is valid and user is admin
     */
    validateSession() {
        const token = this.getAccessToken();
        if (!token) {
            return false;
        }

        const user = this.getCurrentUser();
        if (!user || !this._hasRequiredRole(user)) {
            this.logout();
            return false;
        }

        return true;
    }

    /**
     * Change user password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @param {string} confirmNewPassword - Confirm new password
     * @returns {Promise<Object>} API response data
     */
    async changePassword(
        currentPassword: string,
        newPassword: string,
        confirmNewPassword: string
    ) {
        try {
            const response = await api.post("/auth/password/change", {
                currentPassword,
                newPassword,
                confirmNewPassword,
            });

            if (response.data.status === "success") {
                return response.data;
            }

            throw parseError({response});
        } catch (error: any) {
            if (error.name === "ApiError") {
                throw error;
            }

            const parsedError = parseError(error);
            logError(parsedError, {context: "auth.changePassword"});
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
                const {accessToken, refreshToken: newRefreshToken} =
                    response.data.data;
                setStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, accessToken);

                if (newRefreshToken) {
                    setStorageItem(
                        AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
                        newRefreshToken
                    );
                }

                return true;
            }

            return false;
        } catch (error) {
            logError(parseError(error), {context: "auth.refreshToken"});
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
     * Validate user role during login
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
        const error = parseError({response});
        logError(error, {context: "auth.login", email});
        return error;
    }
}

export const authService = new AuthService();
