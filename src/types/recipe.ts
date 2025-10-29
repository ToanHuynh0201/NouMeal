/**
 * Recipe related types
 */

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

export interface Recipe {
    id: string;
    title: string;
    description: string;
    cookingTime: string;
    servingSize: string;
    image: string;
    category: "breakfast" | "lunch" | "dinner" | "snack";
    difficulty: "easy" | "medium" | "hard";
    nutrition: NutritionInfo;
    ingredients: string[];
    instructions: string[];
    tags: string[];
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
    activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
    dietaryPreferences?: string[];
    allergies?: string[];
    healthGoals?: string[];
    dailyCalorieTarget?: number;
}
