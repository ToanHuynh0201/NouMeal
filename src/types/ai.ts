/**
 * AI-related types for meal suggestions and image recognition
 */

import type {Recipe, NutritionInfo} from "./recipe";

// AI Meal Suggestion Types
export interface MealSuggestionRequest {
    prompt: string;
    dietaryPreferences?: string[];
    allergies?: string[];
    maxCalories?: number;
    mealType?: "breakfast" | "lunch" | "dinner" | "snack" | "any";
}

export interface MealSuggestion {
    id: string;
    recipe: Recipe;
    matchScore: number; // 0-100
    matchReason: string;
    alternativeOptions?: Recipe[];
}

export interface MealSuggestionResponse {
    suggestions: MealSuggestion[];
    query: string;
    timestamp: string;
}

// Image Recognition Types
export interface RecognizedFood {
    name: string;
    confidence: number; // 0-100
    category: string;
    estimatedWeight?: string;
}

export interface ImageRecognitionResult {
    id: string;
    imageUrl: string;
    recognizedFoods: RecognizedFood[];
    overallNutrition: NutritionInfo;
    suggestions: string[];
    timestamp: string;
    processingTime: string;
}

export interface ImageUploadRequest {
    image: File | string;
    analysisType?: "nutrition" | "ingredients" | "full";
}
