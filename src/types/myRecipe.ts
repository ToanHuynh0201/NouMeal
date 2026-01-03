/**
 * Types for My Recipes feature
 */

// Form data for creating/editing recipes
export interface RecipeFormData {
	title: string;
	description: string;
	cookingTime: string;
	servingSize: string;
	image: string;
	foodCategory:
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
	ingredients: Array<{ name: string; amount: string }>;
	instructions: string[];
	tags: string[];
	allergens: string[];
	nutrition: {
		calories: number;
		protein: string;
		fat: string;
		satFat: string;
		carbs: string;
		cholesterol: string;
		fiber: string;
		sugar: string;
		sodium: string;
	};
	_id: string;
}

// Filter options for recipe list
export interface RecipeFilters {
	category?: "breakfast" | "lunch" | "dinner" | "snack" | "all";
	difficulty?: "easy" | "medium" | "hard" | "all";
	searchQuery?: string;
}

// Sort options
export type RecipeSortBy = "title" | "calories" | "cookingTime" | "createdAt";
export type SortOrder = "asc" | "desc";
