export * from "./layout";
export * from "./props";
export * from "./ai";
export * from "./recipe";
export * from "./myRecipe";
export * from "./admin";
// Export specific types from profile to avoid conflict with recipe UserProfile
export type {
	DailyCalorieNeeds,
	MacroDistribution,
	DailyTracking,
	WeeklyStats,
	NutritionGoals,
} from "./profile";
// Auth Types
export interface UserRegistrationRequest {
	email: string;
	password: string;
	name: string;
	age: number;
	gender: "male" | "female" | "other";
	height: number;
	weight: number;
	activity:
		| "sedentary"
		| "lightly_active"
		| "moderately_active"
		| "very_active"
		| "extra_active";
	goal:
		| "lose_weight"
		| "maintain_weight"
		| "gain_weight"
		| "build_muscle"
		| "improve_health";
	preferences?: string[];
	allergies?: string[];
}

export interface UserLoginRequest {
	email: string;
	password: string;
}

export interface User {
	_id: string;
	email: string;
	name: string;
	age: number;
	gender: "male" | "female" | "other";
	height: number;
	weight: number;
	activity:
		| "sedentary"
		| "lightly_active"
		| "moderately_active"
		| "very_active"
		| "extra_active";
	goal:
		| "lose_weight"
		| "maintain_weight"
		| "gain_weight"
		| "build_muscle"
		| "improve_health";
	preferences?: string[];
	allergies?: string[];
	favoriteFoods?: string[];
	isActive: boolean;
	isEmailVerified?: boolean;
	role?: string;
	lastLogin?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	token?: string;
	data?: {
		user: User;
		accessToken?: string;
		refreshToken?: string;
	};
}

export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	status?: string;
}

export interface ErrorResponse {
	success: boolean;
	message: string;
	error?: {
		details?: string;
	};
}

// Food Types (matching backend API)
export interface FoodNutritionalInfo {
	calories: number;
	protein: number;
	carbohydrates: number;
	fat: number;
	fiber?: number;
	sugar?: number;
	sodium?: number;
	cholesterol?: number;
}

export interface FoodIngredient {
	name: string;
	amount: string;
}

export type FoodCategory =
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

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type AllergenType =
	| "peanuts"
	| "tree_nuts"
	| "milk"
	| "eggs"
	| "wheat_gluten"
	| "fish"
	| "shellfish"
	| "soy"
	| "corn"
	| "sesame"
	| "pineapple"
	| "strawberry"
	| "banana"
	| "tomato"
	| "apple"
	| "chocolate"
	| "honey"
	| "mustard"
	| "other";

export interface FoodInstruction {
	step: number;
	description: string;
}

export interface Food {
	_id: string;
	name: string;
	description?: string;
	instructions?: FoodInstruction[];
	imageUrl?: string;
	category: FoodCategory;
	meal?: MealType;
	ingredients?: FoodIngredient[];
	nutritionalInfo?: FoodNutritionalInfo;
	allergens?: AllergenType[];
	isActive: boolean;
	tags?: string[];
	createdAt: string;
	updatedAt: string;
}

export interface FoodRecommendationResponse {
	breakfast: Food[];
	lunch: Food[];
	dinner: Food[];
	snack: Food[];
}

// Weekly Menu Types
export interface NutritionTarget {
	dailyCalories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface DayMeals {
	breakfast: Food[];
	lunch: Food[];
	dinner: Food[];
	snacks: Food[];
}

export interface WeekDayMenu {
	date: string;
	dayOfWeek: string;
	meals: DayMeals;
}

export interface WeeklyMenuData {
	week: WeekDayMenu[];
	nutritionTarget: NutritionTarget;
	cached: boolean;
}

export interface WeeklyMenuResponse {
	success: boolean;
	data: WeeklyMenuData;
}

// Food Log Types
export interface NutritionSnapshot {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface FoodLog {
	_id: string;
	user: string;
	food: string;
	meal: MealType;
	date: string;
	servings: number;
	source: "recommended" | "non_recommended";
	nutritionSnapshot: NutritionSnapshot;
	loggedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface LogFoodRequest {
	foodId: string;
	meal?: MealType;
	servings?: number;
	date?: string;
}

export interface LogFoodResponse {
	success: boolean;
	message: number | string;
	data: FoodLog;
}
