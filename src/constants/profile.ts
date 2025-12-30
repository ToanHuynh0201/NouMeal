/**
 * Profile related constants
 * All constants related to user profile, health, fitness, and dietary preferences
 */

// Profile Tabs
export const PROFILE_TABS = {
	USER_INFO: "user-info",
	TRACKING: "tracking",
} as const;

// Activity Levels
export const ACTIVITY_LEVELS = [
	{ value: "sedentary", label: "Sedentary (little or no exercise)" },
	{ value: "lightly_active", label: "Lightly active (1-3 days/week)" },
	{ value: "moderately_active", label: "Moderately active (3-5 days/week)" },
	{ value: "very_active", label: "Very active (6-7 days/week)" },
	{ value: "extra_active", label: "Extra active (intense daily exercise)" },
];

// Dietary Preferences
export const DIETARY_PREFERENCES = [
	{ value: "vegetarian", label: "Vegetarian" },
	{ value: "vegan", label: "Vegan" },
	{ value: "pescatarian", label: "Pescatarian" },
	{ value: "keto", label: "Keto" },
	{ value: "paleo", label: "Paleo" },
	{ value: "low_carb", label: "Low Carb" },
	{ value: "low_fat", label: "Low Fat" },
	{ value: "high_protein", label: "High Protein" },
	{ value: "gluten_free", label: "Gluten Free" },
	{ value: "dairy_free", label: "Dairy Free" },
	{ value: "halal", label: "Halal" },
	{ value: "kosher", label: "Kosher" },
	{ value: "organic", label: "Organic" },
	{ value: "low_sodium", label: "Low Sodium" },
	{ value: "diabetic_friendly", label: "Diabetic Friendly" },
	{ value: "heart_healthy", label: "Heart Healthy" },
];

// Health & Fitness Goals
export const HEALTH_GOALS = [
	{ value: "maintain_weight", label: "Maintain Weight", icon: "⚖️" },
	{ value: "lose_weight", label: "Lose Weight", icon: "📉" },
	{ value: "gain_weight", label: "Gain Weight", icon: "📈" },
	{ value: "build_muscle", label: "Build Muscle", icon: "💪" },
	{ value: "improve_health", label: "Improve Health", icon: "❤️" },
];

// Gender Options
export const GENDERS = [
	{ value: "male", label: "Male" },
	{ value: "female", label: "Female" },
	{ value: "other", label: "Other" },
];

// Allergens
export const ALLERGIES = [
	{ value: "peanuts", label: "Peanuts" },
	{ value: "tree_nuts", label: "Tree nuts" },
	{ value: "milk", label: "Milk" },
	{ value: "eggs", label: "Eggs" },
	{ value: "wheat_gluten", label: "Wheat/Gluten" },
	{ value: "fish", label: "Fish" },
	{ value: "shellfish", label: "Shellfish" },
	{ value: "soy", label: "Soy" },
	{ value: "corn", label: "Corn" },
	{ value: "sesame", label: "Sesame" },
	{ value: "pineapple", label: "Pineapple" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "banana", label: "Banana" },
	{ value: "tomato", label: "Tomato" },
	{ value: "apple", label: "Apple" },
	{ value: "chocolate", label: "Chocolate" },
	{ value: "honey", label: "Honey" },
	{ value: "mustard", label: "Mustard" },
	{ value: "other", label: "Other" },
];

export default {
	PROFILE_TABS,
	ACTIVITY_LEVELS,
	DIETARY_PREFERENCES,
	HEALTH_GOALS,
	GENDERS,
	ALLERGIES,
};
