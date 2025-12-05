import { ApiService } from "../lib/api";
import { withErrorHandling } from "../utils";
import type { AnalyzeFoodRequest } from "../types/ai";
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
		const data = await this.customApi.post("/analyze-food", request);
		console.log(data);

		return data;
	});
}

export const aiService = new AiService();
