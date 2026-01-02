import { useEffect, useState } from "react";
import RecipeFormModal from "@/components/myRecipes/RecipeFormModal";
import type { Food } from "@/types/recipe";
import type { RecipeFormData } from "@/types/myRecipe";

interface FoodEditModalProps {
	food: Food | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (foodId: string, data: RecipeFormData) => void;
}

// Convert Food to Recipe format for the form
const convertFoodToRecipe = (food: Food) => {
	return {
		id: food._id,
		title: food.name,
		description: food.description,
		cookingTime: "30 mins", // Default, can be enhanced later
		servingSize: "1 serving", // Default, can be enhanced later
		image: food.imageUrl,
		foodCategory: food.category,
		category: food.meal,
		difficulty: "medium" as const, // Default
		nutrition: {
			calories: food.nutritionalInfo.calories,
			protein: `${food.nutritionalInfo.protein}g`,
			fat: `${food.nutritionalInfo.fat}g`,
			satFat: "0g", // Default if not available
			carbs: `${food.nutritionalInfo.carbohydrates}g`,
			cholesterol: `${food.nutritionalInfo.cholesterol}mg`,
			fiber: `${food.nutritionalInfo.fiber}g`,
			sugar: `${food.nutritionalInfo.sugar}g`,
			sodium: `${food.nutritionalInfo.sodium}mg`,
		},
		ingredients: food.ingredients.map((ing) => `${ing.name} - ${ing.amount}`),
		instructions: food.instructions.map((inst) => inst.description),
		tags: food.tags || [],
		allergens: food.allergens || [],
	};
};

export const FoodEditModal = ({
	food,
	isOpen,
	onClose,
	onSave,
}: FoodEditModalProps) => {
	const [editingRecipe, setEditingRecipe] = useState<any>(null);

	useEffect(() => {
		if (food) {
			setEditingRecipe(convertFoodToRecipe(food));
		} else {
			setEditingRecipe(null);
		}
	}, [food]);

	const handleSave = (recipeData: RecipeFormData) => {
		if (food) {
			onSave(food._id, recipeData);
		}
	};

	return (
		<RecipeFormModal
			isOpen={isOpen}
			onClose={onClose}
			onSave={handleSave}
			editingRecipe={editingRecipe}
		/>
	);
};
