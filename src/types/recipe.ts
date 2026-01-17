/**
 * Recipe related types
 */

import type { DietaryPreferenceTag } from "./index";

export interface NutritionInfo {
	calories: number;
	protein: string;
	fat: string;
	satFat: string;
	carbs: string;
	cholesterol: string;
	fiber: string;
	sugar: string;
	sodium: string;
}

/**
 * Food API related types
 */

export interface FoodInstruction {
	step: number;
	description: string;
}

export interface FoodIngredient {
	name: string;
	amount: string;
}

export interface FoodNutritionalInfo {
	calories: number;
	protein: number;
	carbohydrates: number;
	fat: number;
	fiber: number;
	sugar: number;
	sodium: number;
	cholesterol: number;
}

export interface Food {
	_id: string;
	name: string;
	description: string;
	instructions: FoodInstruction[];
	imageUrl: string;
	category:
		| "fruits"
		| "vegetables"
		| "grains"
		| "protein"
		| "dairy"
		| "fats"
		| "beverages"
		| "snacks"
		| "desserts"
		| "spices";
	meal: "breakfast" | "lunch" | "dinner" | "snack";
	ingredients: FoodIngredient[];
	nutritionalInfo: FoodNutritionalInfo;
	allergens: string[];
	isActive: boolean;
	tags: DietaryPreferenceTag[];
	postedBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateFoodRequest {
	id?: string;
	name: string;
	description: string;
	instructions: FoodInstruction[];
	image?: string;
	imageUrl?: string;
	category:
		| "fruits"
		| "vegetables"
		| "grains"
		| "protein"
		| "dairy"
		| "fats"
		| "beverages"
		| "snacks"
		| "desserts"
		| "spices";
	meal: "breakfast" | "lunch" | "dinner" | "snack";
	ingredients: FoodIngredient[];
	nutritionalInfo: FoodNutritionalInfo;
	allergens: string[];
	tags: DietaryPreferenceTag[];
}

export interface GetUserFoodsResponse {
	success: boolean;
	message: string;
	data: Food[];
	meta: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
	};
}

export interface CreateUserFoodResponse {
	success: boolean;
	message: string;
	data: Food;
}

export interface CheckFoodAppropriateRequest {
	name: string;
	description: string;
	category: string;
	meal: "breakfast" | "lunch" | "dinner" | "snack";
	tags: DietaryPreferenceTag[];
	allergens: string[];
	instructions: FoodInstruction[];
	nutritionalInfo: {
		calories: number;
		protein: number;
		carbohydrates: number;
		fat: number;
	};
	ingredients: Array<{ name: string; amount: string }>;
}

export interface CheckFoodAppropriateResponse {
	success: boolean;
	status: number;
	data: {
		isAppropriate: {
			isAppropriate: boolean;
			isAllergyFree: boolean;
		};
		userId: string;
	};
}

export interface Recipe {
	id: string;
	title: string;
	description: string;
	cookingTime: string;
	servingSize: string;
	image: string;
	foodCategory?:
		| "fruits"
		| "vegetables"
		| "grains"
		| "protein"
		| "dairy"
		| "fats"
		| "beverages"
		| "snacks"
		| "desserts"
		| "spices";
	category: "breakfast" | "lunch" | "dinner" | "snack";
	difficulty: "easy" | "medium" | "hard";
	nutrition: NutritionInfo;
	ingredients: string[];
	instructions: string[];
	tags: DietaryPreferenceTag[];
}

export interface DailyMenu {
	date: string;
	breakfast: Recipe;
	lunch: Recipe;
	dinner: Recipe;
	snacks?: Recipe[];
	totalCalories: number;
	totalProtein: string;
	totalCarbs: string;
	totalFat: string;
}

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	age?: number;
	gender?: "male" | "female" | "other";
	weight?: number;
	height?: number;
	activityLevel?:
		| "sedentary"
		| "light"
		| "moderate"
		| "active"
		| "very_active";
	dietaryPreferences?: string[];
	allergies?: string[];
	healthGoals?: string[];
	dailyCalorieTarget?: number;
}
