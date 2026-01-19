import type {
	Food,
	Recipe,
	DailyMenu,
	MealType,
	TodayMealsResponse,
	DietaryPreferenceTag,
} from "@/types";
import { DIETARY_PREFERENCE_TAGS } from "@/constants";

/**
 * Format meal type for display
 * @param {MealType} mealType - The meal type
 * @returns {string} Formatted meal type
 */
export const formatMealType = (mealType: MealType): string => {
	const mealTypeMap: Record<MealType, string> = {
		breakfast: "Breakfast",
		lunch: "Lunch",
		dinner: "Dinner",
		snack: "Snack",
	};
	return mealTypeMap[mealType] || mealType;
};

/**
 * Normalize AI-generated tags to standard dietary preference tags
 * Maps various tag formats and synonyms to the 16 predefined dietary preference tags
 * @param {string[]} aiTags - Tags from AI response
 * @returns {DietaryPreferenceTag[]} Normalized tags matching DIETARY_PREFERENCE_TAGS
 */
export const normalizeAITags = (aiTags: string[]): DietaryPreferenceTag[] => {
	const normalizedTags = new Set<DietaryPreferenceTag>();

	aiTags.forEach((tag) => {
		// Normalize the tag: lowercase, trim, replace spaces/hyphens with underscores
		const normalizedTag = tag
			.toLowerCase()
			.trim()
			.replace(/[-\s]/g, "_") as DietaryPreferenceTag;

		// Check if normalized tag is a valid standard tag
		if (DIETARY_PREFERENCE_TAGS.includes(normalizedTag)) {
			normalizedTags.add(normalizedTag);
		}
		// Additional mapping for common synonyms and variations
		else {
			const tagLower = tag.toLowerCase().trim();

			// Mapping synonyms to standard tags
			if (tagLower.includes("veggie") || tagLower === "plant-based") {
				normalizedTags.add("vegetarian");
			} else if (tagLower === "plant based") {
				normalizedTags.add("vegan");
			} else if (
				tagLower === "pescetarian" ||
				tagLower === "fish-based" ||
				tagLower === "fish_based"
			) {
				normalizedTags.add("pescatarian");
			} else if (tagLower === "ketogenic") {
				normalizedTags.add("keto");
			} else if (tagLower === "paleolithic" || tagLower === "primal") {
				normalizedTags.add("paleo");
			} else if (
				tagLower === "lowcarb" ||
				tagLower.replace(/[-\s_]/g, "") === "lowcarb"
			) {
				normalizedTags.add("low_carb");
			} else if (
				tagLower === "lowfat" ||
				tagLower.replace(/[-\s_]/g, "") === "lowfat"
			) {
				normalizedTags.add("low_fat");
			} else if (
				tagLower === "highprotein" ||
				tagLower === "protein" ||
				tagLower.replace(/[-\s_]/g, "") === "highprotein"
			) {
				normalizedTags.add("high_protein");
			} else if (
				tagLower === "glutenfree" ||
				tagLower === "no gluten" ||
				tagLower.replace(/[-\s_]/g, "") === "glutenfree"
			) {
				normalizedTags.add("gluten_free");
			} else if (
				tagLower === "dairyfree" ||
				tagLower === "no dairy" ||
				tagLower === "lactose" ||
				tagLower === "lactose-free" ||
				tagLower === "lactose_free" ||
				tagLower.replace(/[-\s_]/g, "") === "dairyfree"
			) {
				normalizedTags.add("dairy_free");
			} else if (tagLower === "natural") {
				normalizedTags.add("organic");
			} else if (
				tagLower === "lowsodium" ||
				tagLower === "low salt" ||
				tagLower === "low_salt" ||
				tagLower.replace(/[-\s_]/g, "") === "lowsodium"
			) {
				normalizedTags.add("low_sodium");
			} else if (
				tagLower === "diabetic" ||
				tagLower === "sugar-free" ||
				tagLower === "sugar_free" ||
				tagLower === "sugarfree"
			) {
				normalizedTags.add("diabetic_friendly");
			} else if (
				tagLower === "heart-friendly" ||
				tagLower === "heart_friendly" ||
				tagLower === "cardiovascular"
			) {
				normalizedTags.add("heart_healthy");
			}
		}
	});

	return Array.from(normalizedTags);
};

/**
 * Convert a Food object from the API to a Recipe object for UI
 * @param {Food} food - Food object from API
 * @returns {Recipe} Recipe object for UI components
 */
export const convertFoodToRecipe = (food: Food): Recipe => {
	const nutritionalInfo = food.nutritionalInfo || {
		calories: 0,
		protein: 0,
		carbohydrates: 0,
		fat: 0,
	};

	return {
		id: food._id,
		title: food.name,
		description: food.description || "No description available",
		image: food.imageUrl || getDefaultImageForCategory(food.category),
		foodCategory: food.category, // Food category from API
		category: food.meal || getCategoryFromMealType(food.category),
		difficulty: "medium" as const,
		nutrition: {
			calories: nutritionalInfo.calories,
			protein: `${nutritionalInfo.protein}g`,
			fat: `${nutritionalInfo.fat}g`,
			carbs: `${nutritionalInfo.carbohydrates}g`,
		},
		ingredients:
			food.ingredients?.map((ing) => `${ing.amount} ${ing.name}`) || [],
		instructions: ["Preparation instructions not available"], // API doesn't provide instructions
		tags: food.tags || [],
	};
};

/**
 * Get default image URL based on food category
 * @param {string} category - Food category
 * @returns {string} Default image URL
 */
const getDefaultImageForCategory = (category: string): string => {
	const imageMap: Record<string, string> = {
		fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=600&fit=crop",
		vegetables:
			"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
		grains: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
		protein:
			"https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&h=600&fit=crop",
		dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&h=600&fit=crop",
		fats: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=600&fit=crop",
		beverages:
			"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600&fit=crop",
		snacks: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
		desserts:
			"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
		spices: "https://images.unsplash.com/photo-1596040033229-a0b3b7ba0c6a?w=800&h=600&fit=crop",
	};

	return (
		imageMap[category] ||
		"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop"
	);
};

/**
 * Map food category to meal type
 * @param {string} category - Food category
 * @returns {string} Meal type
 */
const getCategoryFromMealType = (
	category: string,
): "breakfast" | "lunch" | "dinner" | "snack" => {
	// Default mapping if meal type is not provided
	const categoryToMealMap: Record<
		string,
		"breakfast" | "lunch" | "dinner" | "snack"
	> = {
		fruits: "breakfast",
		grains: "breakfast",
		dairy: "breakfast",
		protein: "lunch",
		vegetables: "lunch",
		fats: "lunch",
		beverages: "snack",
		snacks: "snack",
		desserts: "snack",
		spices: "dinner",
	};

	return categoryToMealMap[category] || "lunch";
};

/**
 * Convert Food recommendations to DailyMenu
 * @param {Object} recommendations - Food recommendations from API
 * @param {Food[]} recommendations.breakfast - Breakfast foods
 * @param {Food[]} recommendations.lunch - Lunch foods
 * @param {Food[]} recommendations.dinner - Dinner foods
 * @param {Food[]} recommendations.snack - Snack foods
 * @returns {DailyMenu} Daily menu object
 */
export const convertRecommendationsToDailyMenu = (recommendations: {
	breakfast: Food[];
	lunch: Food[];
	dinner: Food[];
	snack: Food[];
}): DailyMenu => {
	console.log("Converting recommendations to DailyMenu:", recommendations);
	console.log("Breakfast array:", recommendations.breakfast);
	console.log("Breakfast length:", recommendations.breakfast?.length);

	const breakfastRecipe = recommendations.breakfast?.[0]
		? convertFoodToRecipe(recommendations.breakfast[0])
		: createDefaultRecipe("breakfast");

	const lunchRecipe = recommendations.lunch?.[0]
		? convertFoodToRecipe(recommendations.lunch[0])
		: createDefaultRecipe("lunch");

	const dinnerRecipe = recommendations.dinner?.[0]
		? convertFoodToRecipe(recommendations.dinner[0])
		: createDefaultRecipe("dinner");

	const snackRecipes = (recommendations.snack || [])
		.slice(0, 2)
		.map(convertFoodToRecipe);

	console.log("Breakfast recipe created:", breakfastRecipe);

	// Calculate totals
	const allRecipes = [
		breakfastRecipe,
		lunchRecipe,
		dinnerRecipe,
		...snackRecipes,
	];
	const totalCalories = allRecipes.reduce(
		(sum, recipe) => sum + recipe.nutrition.calories,
		0,
	);
	const totalProtein = allRecipes.reduce(
		(sum, recipe) => sum + parseFloat(recipe.nutrition.protein),
		0,
	);
	const totalCarbs = allRecipes.reduce(
		(sum, recipe) => sum + parseFloat(recipe.nutrition.carbs),
		0,
	);
	const totalFat = allRecipes.reduce(
		(sum, recipe) => sum + parseFloat(recipe.nutrition.fat),
		0,
	);

	return {
		date: new Date().toISOString().split("T")[0],
		breakfast: breakfastRecipe,
		lunch: lunchRecipe,
		dinner: dinnerRecipe,
		snacks: snackRecipes.length > 0 ? snackRecipes : undefined,
		totalCalories,
		totalProtein: `${Math.round(totalProtein)}g`,
		totalCarbs: `${Math.round(totalCarbs)}g`,
		totalFat: `${Math.round(totalFat)}g`,
	};
};

/**
 * Convert Today's Meals response to DailyMenu
 * @param {TodayMealsResponse} todayMealsData - Today's meals data from API
 * @returns {DailyMenu} Daily menu object
 */
export const convertTodayMealsToDailyMenu = (
	todayMealsData: TodayMealsResponse,
): DailyMenu => {
	const { meals, date } = todayMealsData;

	const breakfastRecipe = meals.breakfast?.[0]
		? convertFoodToRecipe(meals.breakfast[0])
		: createDefaultRecipe("breakfast");

	const lunchRecipe = meals.lunch?.[0]
		? convertFoodToRecipe(meals.lunch[0])
		: createDefaultRecipe("lunch");

	const dinnerRecipe = meals.dinner?.[0]
		? convertFoodToRecipe(meals.dinner[0])
		: createDefaultRecipe("dinner");

	const snackRecipes = (meals.snack || [])
		.slice(0, 2)
		.map(convertFoodToRecipe);

	// Calculate totals
	const allRecipes = [
		breakfastRecipe,
		lunchRecipe,
		dinnerRecipe,
		...snackRecipes,
	];
	const totalCalories = allRecipes.reduce(
		(sum, recipe) => sum + recipe.nutrition.calories,
		0,
	);
	const totalProtein = allRecipes.reduce(
		(sum, recipe) => sum + parseFloat(recipe.nutrition.protein),
		0,
	);
	const totalCarbs = allRecipes.reduce(
		(sum, recipe) => sum + parseFloat(recipe.nutrition.carbs),
		0,
	);
	const totalFat = allRecipes.reduce(
		(sum, recipe) => sum + parseFloat(recipe.nutrition.fat),
		0,
	);

	return {
		date: date,
		breakfast: breakfastRecipe,
		lunch: lunchRecipe,
		dinner: dinnerRecipe,
		snacks: snackRecipes.length > 0 ? snackRecipes : undefined,
		totalCalories,
		totalProtein: `${Math.round(totalProtein)}g`,
		totalCarbs: `${Math.round(totalCarbs)}g`,
		totalFat: `${Math.round(totalFat)}g`,
	};
};

/**
 * Create a default recipe when no food is available
 * @param {string} mealType - Type of meal
 * @returns {Recipe} Default recipe
 */
const createDefaultRecipe = (
	mealType: "breakfast" | "lunch" | "dinner" | "snack",
): Recipe => {
	return {
		id: `default-${mealType}`,
		title: `No ${mealType} recommendation available`,
		description: "Please check back later for personalized recommendations",
		image: getDefaultImageForCategory(mealType),
		foodCategory: "grains", // Default food category
		category: mealType,
		difficulty: "easy",
		nutrition: {
			calories: 0,
			protein: "0g",
			fat: "0g",
			carbs: "0g",
		},
		ingredients: [],
		instructions: [],
		tags: [],
	};
};

/**
 * Convert weekly menu data from API to DailyMenu array
 * @param {WeeklyMenuData} weeklyData - Weekly menu data from API
 * @returns {DailyMenu[]} Array of daily menus
 */
export const convertWeeklyMenuToDailyMenus = (weeklyData: any): DailyMenu[] => {
	// Handle both array format and object with week property
	const weekArray = Array.isArray(weeklyData) ? weeklyData : weeklyData?.week;

	if (!weekArray || !Array.isArray(weekArray)) {
		return [];
	}

	return weekArray.map((day: any) => {
		const breakfastRecipe = day.meals?.breakfast?.[0]
			? convertFoodToRecipe(day.meals.breakfast[0])
			: createDefaultRecipe("breakfast");

		const lunchRecipe = day.meals?.lunch?.[0]
			? convertFoodToRecipe(day.meals.lunch[0])
			: createDefaultRecipe("lunch");

		const dinnerRecipe = day.meals?.dinner?.[0]
			? convertFoodToRecipe(day.meals.dinner[0])
			: createDefaultRecipe("dinner");

		const snackArray = Array.isArray(day.meals?.snack)
			? day.meals.snack
			: [];
		const snackRecipes = snackArray.slice(0, 2).map(convertFoodToRecipe);

		// Calculate totals
		const allRecipes = [
			breakfastRecipe,
			lunchRecipe,
			dinnerRecipe,
			...snackRecipes,
		];
		const totalCalories = allRecipes.reduce(
			(sum, recipe) => sum + recipe.nutrition.calories,
			0,
		);
		const totalProtein = allRecipes.reduce(
			(sum, recipe) => sum + parseFloat(recipe.nutrition.protein),
			0,
		);
		const totalCarbs = allRecipes.reduce(
			(sum, recipe) => sum + parseFloat(recipe.nutrition.carbs),
			0,
		);
		const totalFat = allRecipes.reduce(
			(sum, recipe) => sum + parseFloat(recipe.nutrition.fat),
			0,
		);

		return {
			date: day.date,
			breakfast: breakfastRecipe,
			lunch: lunchRecipe,
			dinner: dinnerRecipe,
			snacks: snackRecipes.length > 0 ? snackRecipes : undefined,
			totalCalories,
			totalProtein: `${Math.round(totalProtein)}g`,
			totalCarbs: `${Math.round(totalCarbs)}g`,
			totalFat: `${Math.round(totalFat)}g`,
		};
	});
};
