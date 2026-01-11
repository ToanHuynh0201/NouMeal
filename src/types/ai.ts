/**
 * AI-related types for meal suggestions and image recognition
 */

import type {Recipe, NutritionInfo} from "./recipe";
import type { DietaryPreferenceTag } from "./index";

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
    weight?: string; // From API response
}

export interface NutritionValue {
    value: number;
    unit: string;
}

export interface NutritionAnalysis {
    calories: NutritionValue;
    protein: NutritionValue;
    carbs: NutritionValue;
    fat: NutritionValue;
    fiber: NutritionValue;
    sugar: NutritionValue;
    sodium: NutritionValue;
    cholesterol: NutritionValue;
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

// API Request/Response Types
export interface AnalyzeFoodRequest {
    dietary_goals: string;
    health_condition: string;
    image: string; // base64 image string
}

export interface AnalyzeFoodData {
    session_id: string;
    status: string;
    dietary_goals: string;
    health_condition: string;
    recognized_foods: RecognizedFood[];
    nutrition_analysis: NutritionAnalysis;
    recommendations: string[];
    processing_time: string;
}

export interface AnalyzeFoodResponse {
    success: boolean;
    message: string;
    data: AnalyzeFoodData;
}

// Meal Suggestion API Types (Backend)
export interface ApiMealSuggestionRequest {
    query: string;
}

export interface ApiNutritionValue {
    value: number;
    unit: string;
}

export interface ApiNutritionFacts {
    calories: ApiNutritionValue;
    protein: ApiNutritionValue;
    carbs: ApiNutritionValue;
    fat: ApiNutritionValue;
    fiber: ApiNutritionValue;
    sugar: ApiNutritionValue;
    sodium: ApiNutritionValue;
    cholesterol: ApiNutritionValue;
}

export interface ApiMeal {
    name: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    ingredients: string[];
    instructions: string[];
    match_percentage: number;
    nutrition_facts: ApiNutritionFacts;
    prep_time: string;
    servings: number;
    tags: DietaryPreferenceTag[];
}

export interface ApiMealSuggestionData {
    meals: ApiMeal[];
    query: string;
    total_suggestions: number;
}

export interface ApiMealSuggestionResponse {
    success: boolean;
    message: string;
    data: ApiMealSuggestionData;
}
