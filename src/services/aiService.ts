import { ApiService } from "../lib/api";
import { withErrorHandling } from "../utils";
import type { AnalyzeFoodRequest, ApiMealSuggestionRequest } from "../types/ai";
import { API_CONFIG } from "@/constants";

class AiService {
	private customApi: ApiService;
	constructor() {
		this.customApi = new ApiService(API_CONFIG.AI_URL);
	}
	/**
	 * Analyze food image and get nutrition information
	 * @param {AnalyzeFoodRequest} request - Request containing image and user profile data
	 * @returns {Promise<AnalyzeFoodResponse>} Standardized response with food analysis data
	 */
	analyzeFood = withErrorHandling(async (request: AnalyzeFoodRequest) => {
		return await this.customApi.post("/analyze-food", request);
	});

	/**
	 * Get AI meal suggestions based on user query
	 * @param {ApiMealSuggestionRequest} request - Request containing user query
	 * @returns {Promise<ApiMealSuggestionResponse>} Response with meal suggestions
	 */
	getMealSuggestions = withErrorHandling(
		async (request: ApiMealSuggestionRequest) => {
			return await this.customApi.post("/meal-suggestion", request);
		},
	);
}

export const aiService = new AiService();
