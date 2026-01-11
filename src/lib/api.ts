import { API_CONFIG, AUTH_CONFIG, ROUTES } from "@/constants";
import {
	clearStorageItems,
	getStorageItem,
	logError,
	parseError,
	setStorageItem,
	shouldLogout,
} from "@/utils";
import axios, { type AxiosInstance } from "axios";

class ApiService {
	private baseUrl: string;
	private api: AxiosInstance;
	private isRefreshing: boolean = false;
	private failedQueue: Array<{
		resolve: (value?: any) => void;
		reject: (reason?: any) => void;
	}> = [];

	constructor(customBaseUrl = null) {
		this.baseUrl = customBaseUrl || API_CONFIG.BASE_URL;
		this.api = this._createAxiosInstance();
		this._setupInterceptors();
	}

	/**
	 * Create axios instance with base configuration
	 * @private
	 * @returns {axios.AxiosInstance} Configured axios instance
	 */
	_createAxiosInstance() {
		return axios.create({
			baseURL: this.baseUrl,
			timeout: API_CONFIG.TIMEOUT,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	/**
	 * Setup request and response interceptors
	 * @private
	 */
	_setupInterceptors() {
		this._setupRequestInterceptor();
		this._setupResponseInterceptor();
	}

	/**
	 * Setup request interceptor to add auth token
	 * @private
	 */
	_setupRequestInterceptor() {
		this.api.interceptors.request.use(
			(config: any) => {
				const token = getStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY);
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error: any) => {
				const parsedError = parseError(error);
				logError(parsedError, { context: "api.request" });
				return Promise.reject(parsedError);
			},
		);
	}

	/**
	 * Setup response interceptor to handle auth errors
	 * @private
	 */
	_setupResponseInterceptor() {
		this.api.interceptors.response.use(
			(response: any) => response,
			async (error: any) => {
				const parsedError = parseError(error);

				console.log("🔍 Response error:", {
					url: error.config?.url,
					status: parsedError.status,
					message: parsedError.message,
				});

				// Don't trigger logout for login endpoint errors
				if (this._isLoginEndpoint(error.config?.url)) {
					logError(parsedError, { context: "api.response" });
					return Promise.reject(parsedError);
				}

				// Handle auth errors with token refresh attempt
				if (shouldLogout(parsedError)) {
					console.log(
						"🔐 Auth error detected, attempting refresh...",
					);
					const refreshResult = await this._handleAuthError(
						error,
						parsedError,
					);
					if (refreshResult) {
						console.log("✅ Request retry successful");
						return refreshResult;
					}
					console.log("❌ Refresh failed, logout handled");
					// this._handleLogout();
				}

				logError(parsedError, { context: "api.response" });
				return Promise.reject(parsedError);
			},
		);
	}

	/**
	 * Check if URL is login endpoint
	 * @private
	 * @param {string} url - Request URL
	 * @returns {boolean} Whether URL is login endpoint
	 */
	_isLoginEndpoint(url: string) {
		return (
			url?.includes("/users/login") ||
			url?.includes("/auth/refresh-token")
		);
	}

	/**
	 * Handle authentication errors
	 * @private
	 * @param {Object} originalError - Original error object
	 * @param {Object} parsedError - Parsed error object
	 * @returns {Promise<Object|false>} Retry result or false
	 */
	async _handleAuthError(originalError: any, parsedError: any) {
		// Try token refresh for 401 errors only
		if (parsedError.status === 401) {
			return await this._tryTokenRefresh(originalError);
		}
		return false;
	}

	/**
	 * Process failed requests queue
	 * @private
	 */
	_processQueue(error: any, token: string | null = null) {
		this.failedQueue.forEach((prom) => {
			if (error) {
				prom.reject(error);
			} else {
				prom.resolve(token);
			}
		});

		this.failedQueue = [];
	}

	/**
	 * Attempt to refresh token and retry original request
	 * @private
	 * @param {Object} originalError - Original error object
	 * @returns {Promise<Object|false>} Retry result or false
	 */
	async _tryTokenRefresh(originalError: any) {
		const refreshToken = getStorageItem(
			AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
		);

		if (!refreshToken) {
			return false;
		}

		// If already refreshing, queue this request
		if (this.isRefreshing) {
			return new Promise((resolve, reject) => {
				this.failedQueue.push({ resolve, reject });
			})
				.then((token) => {
					originalError.config.headers.Authorization = `Bearer ${token}`;
					return this.api(originalError.config);
				})
				.catch((err) => {
					return Promise.reject(err);
				});
		}

		this.isRefreshing = true;

		try {
			const refreshResponse = await this._performTokenRefresh(
				refreshToken,
			);

			if (refreshResponse.data.success === true) {
				// Tokens are inside the `data` object
				const accessToken = refreshResponse.data.data.accessToken;
				const newRefreshToken = refreshResponse.data.data.refreshToken;
				setStorageItem(AUTH_CONFIG.TOKEN_STORAGE_KEY, accessToken);

				if (newRefreshToken) {
					setStorageItem(
						AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
						newRefreshToken,
					);
				}

				// Process queued requests
				this._processQueue(null, accessToken);
				this.isRefreshing = false;

				return this._retryOriginalRequest(originalError, accessToken);
			}
		} catch (refreshError) {
			this._processQueue(refreshError, null);
			this.isRefreshing = false;
			logError(parseError(refreshError), { context: "api.refresh" });

			// Logout if refresh fails
			// this._handleLogout();
		}

		return false;
	}

	/**
	 * Perform token refresh API call
	 * @private
	 * @param {string} refreshToken - Refresh token
	 * @returns {Promise<Object>} Refresh response
	 */
	async _performTokenRefresh(refreshToken: any) {
		console.log("🔄 Attempting token refresh...");
		try {
			const response = await axios.post(
				`${API_CONFIG.BASE_URL}/auth/refresh-token`,
				{ refreshToken },
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			console.log("✅ Token refresh successful");
			return response;
		} catch (error) {
			console.error("❌ Token refresh failed:", error);
			throw error;
		}
	}

	/**
	 * Retry original request with new token
	 * @private
	 * @param {Object} originalError - Original error object
	 * @param {string} accessToken - New access token
	 * @returns {Promise<Object>} Request response
	 */
	_retryOriginalRequest(originalError: any, accessToken: any) {
		const originalRequest = originalError.config;
		originalRequest.headers.Authorization = `Bearer ${accessToken}`;
		return this.api(originalRequest);
	}

	/**
	 * Handle logout by clearing storage and redirecting
	 * @private
	 */
	_handleLogout() {
		clearStorageItems([
			AUTH_CONFIG.TOKEN_STORAGE_KEY,
			AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY,
			AUTH_CONFIG.USER_STORAGE_KEY,
		]);
		window.location.href = ROUTES.LOGIN;
	}

	// Proxy methods to axios instance
	get(url: any, config?: any) {
		return this.api.get(url, config);
	}

	post(url: any, data: any, config?: any) {
		return this.api.post(url, data, config);
	}

	put(url: any, data: any, config?: any) {
		return this.api.put(url, data, config);
	}

	patch(url: any, data: any, config?: any) {
		return this.api.patch(url, data, config);
	}

	delete(url: any, config?: any) {
		return this.api.delete(url, config);
	}
}

const apiService = new ApiService();

// * Use this for custom instances
export { ApiService };

export default apiService;
