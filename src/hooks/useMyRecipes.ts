import {useState, useMemo, useCallback} from "react";
import {useToast} from "@chakra-ui/react";
import type {Recipe} from "@/types/recipe";
import type {RecipeFormData, RecipeFilters, RecipeSortBy, SortOrder} from "@/types/myRecipe";

/**
 * Custom hook to manage recipes with CRUD operations
 */
export const useMyRecipes = () => {
    const toast = useToast();
    
    // State for recipes (using localStorage for persistence)
    const [recipes, setRecipes] = useState<Recipe[]>(() => {
        const stored = localStorage.getItem("myRecipes");
        return stored ? JSON.parse(stored) : [];
    });

    // State for filters and search
    const [filters, setFilters] = useState<RecipeFilters>({
        category: "all",
        difficulty: "all",
        searchQuery: "",
    });

    // State for sorting
    const [sortBy, setSortBy] = useState<RecipeSortBy>("createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    // Save to localStorage whenever recipes change
    const saveToStorage = useCallback((updatedRecipes: Recipe[]) => {
        localStorage.setItem("myRecipes", JSON.stringify(updatedRecipes));
        setRecipes(updatedRecipes);
    }, []);

    // Add new recipe
    const addRecipe = useCallback(
        (recipeData: RecipeFormData) => {
            const newRecipe: Recipe = {
                ...recipeData,
                id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            };

            const updatedRecipes = [...recipes, newRecipe];
            saveToStorage(updatedRecipes);

            toast({
                title: "Recipe added!",
                description: `${recipeData.title} has been added to your collection.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });

            return newRecipe;
        },
        [recipes, saveToStorage, toast]
    );

    // Update existing recipe
    const updateRecipe = useCallback(
        (recipeId: string, recipeData: RecipeFormData) => {
            const updatedRecipes = recipes.map((recipe) =>
                recipe.id === recipeId ? {...recipeData, id: recipeId} : recipe
            );

            saveToStorage(updatedRecipes);

            toast({
                title: "Recipe updated!",
                description: `${recipeData.title} has been updated successfully.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
        [recipes, saveToStorage, toast]
    );

    // Delete recipe
    const deleteRecipe = useCallback(
        (recipeId: string) => {
            const recipe = recipes.find((r) => r.id === recipeId);
            const updatedRecipes = recipes.filter((r) => r.id !== recipeId);
            
            saveToStorage(updatedRecipes);

            toast({
                title: "Recipe deleted!",
                description: `${recipe?.title} has been removed from your collection.`,
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        },
        [recipes, saveToStorage, toast]
    );

    // Get recipe by ID
    const getRecipeById = useCallback(
        (recipeId: string) => {
            return recipes.find((recipe) => recipe.id === recipeId);
        },
        [recipes]
    );

    // Filter and sort recipes
    const filteredAndSortedRecipes = useMemo(() => {
        let result = [...recipes];

        // Apply category filter
        if (filters.category && filters.category !== "all") {
            result = result.filter((recipe) => recipe.category === filters.category);
        }

        // Apply difficulty filter
        if (filters.difficulty && filters.difficulty !== "all") {
            result = result.filter((recipe) => recipe.difficulty === filters.difficulty);
        }

        // Apply search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(
                (recipe) =>
                    recipe.title.toLowerCase().includes(query) ||
                    recipe.description.toLowerCase().includes(query) ||
                    recipe.tags.some((tag) => tag.toLowerCase().includes(query)) ||
                    recipe.ingredients.some((ing) => ing.toLowerCase().includes(query))
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

        return result;
    }, [recipes, filters, sortBy, sortOrder]);

    // Update filters
    const updateFilters = useCallback((newFilters: Partial<RecipeFilters>) => {
        setFilters((prev) => ({...prev, ...newFilters}));
    }, []);

    // Update sorting
    const updateSorting = useCallback((newSortBy: RecipeSortBy, newSortOrder?: SortOrder) => {
        setSortBy(newSortBy);
        if (newSortOrder) {
            setSortOrder(newSortOrder);
        }
    }, []);

    // Toggle sort order
    const toggleSortOrder = useCallback(() => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    }, []);

    // Get statistics
    const statistics = useMemo(() => {
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
        const avgCalories = total > 0
            ? Math.round(
                  recipes.reduce((sum, r) => sum + r.nutrition.calories, 0) / total
              )
            : 0;

        return {
            total,
            categories,
            difficulties,
            avgCalories,
        };
    }, [recipes]);

    return {
        recipes: filteredAndSortedRecipes,
        allRecipes: recipes,
        filters,
        sortBy,
        sortOrder,
        statistics,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
        updateFilters,
        updateSorting,
        toggleSortOrder,
    };
};
