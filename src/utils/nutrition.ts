import type { User } from "@/types";
import type { DailyCalorieNeeds } from "@/types/profile";

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 * BMR for men: 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) + 5
 * BMR for women: 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) - 161
 */
const calculateBMR = (
	weight: number,
	height: number,
	age: number,
	gender: "male" | "female" | "other",
): number => {
	const baseBMR = 10 * weight + 6.25 * height - 5 * age;

	if (gender === "male") {
		return baseBMR + 5;
	} else if (gender === "female") {
		return baseBMR - 161;
	} else {
		// For "other" gender, use average of male and female
		return baseBMR - 78;
	}
};

/**
 * Activity level multipliers
 */
const ACTIVITY_MULTIPLIERS = {
	sedentary: 1.2, // Little or no exercise
	lightly_active: 1.375, // Light exercise 1-3 days/week
	moderately_active: 1.55, // Moderate exercise 3-5 days/week
	very_active: 1.725, // Hard exercise 6-7 days/week
	extra_active: 1.9, // Very hard exercise & physical job
};

/**
 * Goal adjustments (calorie deficit/surplus)
 */
const GOAL_ADJUSTMENTS = {
	lose_weight: -500, // 500 calorie deficit per day (1 lb/week loss)
	maintain_weight: 0,
	gain_weight: 300, // 300 calorie surplus for healthy weight gain
	build_muscle: 400, // 400 calorie surplus for muscle building
	improve_health: 0, // Maintenance calories for general health
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
const calculateTDEE = (
	bmr: number,
	activity:
		| "sedentary"
		| "lightly_active"
		| "moderately_active"
		| "very_active"
		| "extra_active",
): number => {
	return bmr * ACTIVITY_MULTIPLIERS[activity];
};

/**
 * Calculate daily calorie goal based on user's goal
 */
const calculateCalorieGoal = (
	tdee: number,
	goal:
		| "lose_weight"
		| "maintain_weight"
		| "gain_weight"
		| "build_muscle"
		| "improve_health",
): number => {
	return Math.round(tdee + GOAL_ADJUSTMENTS[goal]);
};

/**
 * Calculate macro distribution based on goal
 * Returns grams for each macro
 */
const calculateMacroDistribution = (
	totalCalories: number,
	goal:
		| "lose_weight"
		| "maintain_weight"
		| "gain_weight"
		| "build_muscle"
		| "improve_health",
): { protein: number; carbohydrates: number; fat: number } => {
	let proteinPercentage = 0.3;
	let fatPercentage = 0.3;
	let carbPercentage = 0.4;

	// Adjust macros based on goal
	switch (goal) {
		case "lose_weight":
			proteinPercentage = 0.35; // Higher protein for satiety
			fatPercentage = 0.25;
			carbPercentage = 0.4;
			break;
		case "build_muscle":
			proteinPercentage = 0.35; // Higher protein for muscle growth
			fatPercentage = 0.25;
			carbPercentage = 0.4;
			break;
		case "gain_weight":
			proteinPercentage = 0.3;
			fatPercentage = 0.3;
			carbPercentage = 0.4;
			break;
		case "maintain_weight":
		case "improve_health":
			proteinPercentage = 0.3;
			fatPercentage = 0.3;
			carbPercentage = 0.4;
			break;
	}

	// Calculate grams (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
	const proteinGrams = Math.round(
		(totalCalories * proteinPercentage) / 4,
	);
	const carbGrams = Math.round((totalCalories * carbPercentage) / 4);
	const fatGrams = Math.round((totalCalories * fatPercentage) / 9);

	return {
		protein: proteinGrams,
		carbohydrates: carbGrams,
		fat: fatGrams,
	};
};

/**
 * Calculate daily calorie needs and macro distribution from user profile
 */
export const calculateDailyCalorieNeeds = (
	user: User,
): DailyCalorieNeeds => {
	// Calculate BMR
	const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);

	// Calculate TDEE
	const tdee = calculateTDEE(bmr, user.activity);

	// Calculate calorie goal based on user's goal
	const totalCalories = calculateCalorieGoal(tdee, user.goal);

	// Calculate macro distribution
	const macroDistribution = calculateMacroDistribution(
		totalCalories,
		user.goal,
	);

	return {
		totalCalories,
		macroDistribution,
	};
};
