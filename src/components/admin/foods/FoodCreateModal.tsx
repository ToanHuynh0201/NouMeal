import RecipeFormModal from "@/components/myRecipes/RecipeFormModal";
import type { RecipeFormData } from "@/types/myRecipe";

interface FoodCreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: RecipeFormData) => void;
}

export const FoodCreateModal = ({
	isOpen,
	onClose,
	onSave,
}: FoodCreateModalProps) => {
	const handleSave = (recipeData: RecipeFormData) => {
		onSave(recipeData);
	};

	return (
		<RecipeFormModal
			isOpen={isOpen}
			onClose={onClose}
			onSave={handleSave}
			editingRecipe={null}
		/>
	);
};
