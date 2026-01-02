export interface UserProfile {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	phone?: string;
	dateOfBirth?: string;
	gender?: "male" | "female" | "other";

	// Health Information
	height?: number; // cm
	weight?: number; // kg
	targetWeight?: number; // kg
	activityLevel?: string;
	healthGoal?: string;

	// Dietary Information
	dietaryPreferences?: string[];
	allergens?: string[];

	// Tracking Stats
	caloriesGoal?: number;
	proteinGoal?: number;
	carbsGoal?: number;
	fatsGoal?: number;
	waterGoal?: number; // ml
}

export interface DailyTracking {
	date: string;
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	water: number;
	weight?: number;
}

export interface WeeklyStats {
	week: string;
	avgCalories: number;
	avgProtein: number;
	avgCarbs: number;
	avgFats: number;
	avgWater: number;
	avgWeight?: number;
}

export interface NutritionGoals {
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	water: number;
}

export interface MacroDistribution {
	protein: number;
	carbohydrates: number;
	fat: number;
}

export interface DailyCalorieNeeds {
	totalCalories: number;
	macroDistribution: MacroDistribution;
}
