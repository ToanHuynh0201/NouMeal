import { useState, useMemo, useCallback, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import type { Recipe, Food, CreateFoodRequest } from "@/types/recipe";
import type {
	RecipeFormData,
	RecipeFilters,
	RecipeSortBy,
	SortOrder,
} from "@/types/myRecipe";
import { foodService } from "@/services/foodService";

/**
 * Custom hook to manage recipes with CRUD operations
 */
export const useMyRecipes = () => {
	const toast = useToast();

	// State for recipes
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [totalItems, setTotalItems] = useState<number>(0);

	// State for filters and search
	const [filters, setFilters] = useState<RecipeFilters>({
		category: "all",
		difficulty: "all",
		searchQuery: "",
	});

	// State for sorting
	const [sortBy, setSortBy] = useState<RecipeSortBy>("createdAt");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	// Convert Food API response to Recipe type
	const convertFoodToRecipe = useCallback((food: Food): Recipe => {
		console.log("Converting food to recipe:", food);
		return {
			id: food._id,
			title: food.name,
			description: food.description,
			cookingTime: "30 mins", // Default value, adjust if needed
			servingSize: "1 serving", // Default value, adjust if needed
			image: food.imageUrl,
			category: food.meal,
			difficulty: "medium", // Default value since API doesn't provide this
			nutrition: {
				calories: food.nutritionalInfo.calories,
				protein: `${food.nutritionalInfo.protein}g`,
				fat: `${food.nutritionalInfo.fat}g`,
				satFat: "0g", // Default value if not provided
				carbs: `${food.nutritionalInfo.carbohydrates}g`,
				cholesterol: `${food.nutritionalInfo.cholesterol}mg`,
				fiber: `${food.nutritionalInfo.fiber}g`,
				sugar: `${food.nutritionalInfo.sugar}g`,
				sodium: `${food.nutritionalInfo.sodium}mg`,
			},
			ingredients: food.ingredients.map(
				(ing) => `${ing.name} - ${ing.amount}`,
			),
			instructions: food.instructions.map((inst) => inst.description),
			tags: food.tags,
		};
	}, []);

	// Convert RecipeFormData to CreateFoodRequest
	const convertRecipeToFoodRequest = useCallback(
		(recipeData: RecipeFormData): CreateFoodRequest => {
			return {
				id: recipeData._id,
				name: recipeData.title,
				description: recipeData.description,
				instructions: recipeData.instructions.map((desc, index) => ({
					step: index + 1,
					description: desc,
				})),
				imageUrl: recipeData.image,
				category: recipeData.foodCategory,
				meal: recipeData.category,
				ingredients: recipeData.ingredients,
				nutritionalInfo: {
					calories: recipeData.nutrition.calories,
					protein: parseFloat(recipeData.nutrition.protein) || 0,
					carbohydrates: parseFloat(recipeData.nutrition.carbs) || 0,
					fat: parseFloat(recipeData.nutrition.fat) || 0,
					fiber: parseFloat(recipeData.nutrition.fiber) || 0,
					sugar: parseFloat(recipeData.nutrition.sugar) || 0,
					sodium: parseFloat(recipeData.nutrition.sodium) || 0,
					cholesterol:
						parseFloat(recipeData.nutrition.cholesterol) || 0,
				},
				allergens: recipeData.allergens,
				tags: recipeData.tags,
			};
		},
		[],
	);

	// Fetch recipes from API
	const fetchRecipes = useCallback(
		async (page: number = 1) => {
			try {
				setIsLoading(true);
				const response = await foodService.getUserFoods(page, 10);
				console.log("API Response:", response);

				if (response.success) {
					const foods = response.data;
					const convertedRecipes = foods.map(convertFoodToRecipe);

					setRecipes(convertedRecipes);
					console.log("Recipes state should be updated now");
					// Note: API doesn't return meta info, so we'll calculate it
					setCurrentPage(page);
					setTotalPages(1);
					setTotalItems(foods.length);
				}
			} catch (error) {
				console.error("Error fetching recipes:", error);
				toast({
					title: "Error loading recipes",
					description:
						"Failed to fetch your recipes. Please try again.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[convertFoodToRecipe, toast],
	);

	// Load recipes on mount
	useEffect(() => {
		console.log("useEffect triggered, fetching recipes");
		fetchRecipes(currentPage);
	}, []); // Only run on mount

	// Add new recipe
	const addRecipe = useCallback(
		async (recipeData: RecipeFormData) => {
			try {
				const foodRequest = convertRecipeToFoodRequest(recipeData);
				const response = await foodService.createUserFood(foodRequest);
				console.log(response);

				if (response.success) {
					const newRecipe = convertFoodToRecipe(response.data);

					toast({
						title: "Recipe added!",
						description: `${recipeData.title} has been added to your collection.`,
						status: "success",
						duration: 3000,
						isClosable: true,
						position: "top",
					});

					// Refresh the recipe list
					await fetchRecipes(currentPage);

					return newRecipe;
				}
			} catch (error) {
				toast({
					title: "Error adding recipe",
					description: "Failed to add recipe. Please try again.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			}
		},
		[
			convertRecipeToFoodRequest,
			convertFoodToRecipe,
			toast,
			fetchRecipes,
			currentPage,
		],
	);

	// Update existing recipe
	const updateRecipe = useCallback(
		async (recipeId: string, recipeData: RecipeFormData) => {
			try {
				const foodRequest = convertRecipeToFoodRequest(recipeData);
				const response = await foodService.updateUserFood(
					recipeId,
					foodRequest,
				);

				if (response.success) {
					toast({
						title: "Recipe updated!",
						description: `${recipeData.title} has been updated successfully.`,
						status: "success",
						duration: 3000,
						isClosable: true,
						position: "top",
					});

					// Refresh the recipe list
					await fetchRecipes(currentPage);
				}
			} catch (error) {
				toast({
					title: "Error updating recipe",
					description: "Failed to update recipe. Please try again.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			}
		},
		[toast, convertRecipeToFoodRequest, fetchRecipes, currentPage],
	);

	// Delete recipe
	const deleteRecipe = useCallback(
		async (recipeId: string) => {
			try {
				const response = await foodService.deleteUserFood(recipeId);

				if (response.success) {
					toast({
						title: "Recipe deleted!",
						description:
							"Recipe has been removed from your collection.",
						status: "success",
						duration: 3000,
						isClosable: true,
						position: "top",
					});

					// Refresh the recipe list
					await fetchRecipes(currentPage);
				}
			} catch (error) {
				toast({
					title: "Error deleting recipe",
					description: "Failed to delete recipe. Please try again.",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
				});
			}
		},
		[toast, fetchRecipes, currentPage],
	);

	// Get recipe by ID
	const getRecipeById = useCallback(
		(recipeId: string) => {
			return recipes.find((recipe) => recipe.id === recipeId);
		},
		[recipes],
	);

	// Filter and sort recipes
	const filteredAndSortedRecipes = useMemo(() => {
		console.log("Filtering and sorting recipes. Current recipes:", recipes);
		let result = [...recipes];

		// Apply category filter
		if (filters.category && filters.category !== "all") {
			result = result.filter(
				(recipe) => recipe.category === filters.category,
			);
		}

		// Apply difficulty filter
		if (filters.difficulty && filters.difficulty !== "all") {
			result = result.filter(
				(recipe) => recipe.difficulty === filters.difficulty,
			);
		}

		// Apply search query
		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			result = result.filter(
				(recipe) =>
					recipe.title.toLowerCase().includes(query) ||
					recipe.description.toLowerCase().includes(query) ||
					recipe.tags.some((tag) =>
						tag.toLowerCase().includes(query),
					) ||
					recipe.ingredients.some((ing) =>
						ing.toLowerCase().includes(query),
					),
			);
		}

		// Apply sorting
		result.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "calories":
					comparison = a.nutrition.calories - b.nutrition.calories;
					break;
				case "cookingTime":
					// Extract minutes from cooking time string
					const timeA = parseInt(a.cookingTime) || 0;
					const timeB = parseInt(b.cookingTime) || 0;
					comparison = timeA - timeB;
					break;
				case "createdAt":
					// Extract timestamp from ID
					const timestampA = parseInt(a.id.split("-")[1]) || 0;
					const timestampB = parseInt(b.id.split("-")[1]) || 0;
					comparison = timestampA - timestampB;
					break;
				default:
					comparison = 0;
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

		console.log("Filtered and sorted recipes:", result);
		return result;
	}, [recipes, filters, sortBy, sortOrder]);

	// Update filters
	const updateFilters = useCallback((newFilters: Partial<RecipeFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	// Update sorting
	const updateSorting = useCallback(
		(newSortBy: RecipeSortBy, newSortOrder?: SortOrder) => {
			setSortBy(newSortBy);
			if (newSortOrder) {
				setSortOrder(newSortOrder);
			}
		},
		[],
	);

	// Toggle sort order
	const toggleSortOrder = useCallback(() => {
		setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
	}, []);

	// Get statistics
	const statistics = useMemo(() => {
		console.log("Calculating statistics for recipes:", recipes);
		const total = recipes.length;
		const categories = {
			breakfast: recipes.filter((r) => r.category === "breakfast").length,
			lunch: recipes.filter((r) => r.category === "lunch").length,
			dinner: recipes.filter((r) => r.category === "dinner").length,
			snack: recipes.filter((r) => r.category === "snack").length,
		};
		const difficulties = {
			easy: recipes.filter((r) => r.difficulty === "easy").length,
			medium: recipes.filter((r) => r.difficulty === "medium").length,
			hard: recipes.filter((r) => r.difficulty === "hard").length,
		};
		const avgCalories =
			total > 0
				? Math.round(
						recipes.reduce(
							(sum, r) => sum + r.nutrition.calories,
							0,
						) / total,
				  )
				: 0;

		const stats = {
			total,
			categories,
			difficulties,
			avgCalories,
		};
		console.log("Statistics:", stats);
		return stats;
	}, [recipes]);

	return {
		recipes: filteredAndSortedRecipes,
		allRecipes: recipes,
		filters,
		sortBy,
		sortOrder,
		statistics,
		isLoading,
		currentPage,
		totalPages,
		totalItems,
		addRecipe,
		updateRecipe,
		deleteRecipe,
		getRecipeById,
		updateFilters,
		updateSorting,
		toggleSortOrder,
		fetchRecipes,
	};
};
