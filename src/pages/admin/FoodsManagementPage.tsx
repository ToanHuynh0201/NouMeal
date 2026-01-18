import { useEffect, useState } from "react";
import {
	Box,
	Heading,
	Spinner,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Flex,
	Button,
	HStack,
	Text,
	useToast,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import {
	FiSearch,
	FiChevronLeft,
	FiChevronRight,
	FiPlus,
} from "react-icons/fi";
import { useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { FoodsTable } from "@/components/admin/foods/FoodsTable";
import { FoodDetailModal } from "@/components/admin/foods/FoodDetailModal";
import { FoodEditModal } from "@/components/admin/foods/FoodEditModal";
import { FoodCreateModal } from "@/components/admin/foods/FoodCreateModal";
import { foodService } from "@/services/foodService";
import type { Food } from "@/types/recipe";
import type { RecipeFormData } from "@/types/myRecipe";

interface PaginationInfo {
	currentPage: number;
	totalPages: number;
	totalFoods: number;
	limit: number;
}

const FoodsManagementPage = () => {
	const [allFoods, setAllFoods] = useState<Food[]>([]);
	const [foods, setFoods] = useState<Food[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingFood, setEditingFood] = useState<Food | null>(null);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [searchDebounced, setSearchDebounced] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("all");
	const [filterMeal, setFilterMeal] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<PaginationInfo>({
		currentPage: 1,
		totalPages: 1,
		totalFoods: 0,
		limit: 10,
	});
	const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement>(null);
	const toast = useToast();

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchDebounced(search);
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	// Fetch all foods from API (no filters on backend)
	const fetchAllFoods = async () => {
		try {
			setLoading(true);

			// Fetch all foods with a large limit to get everything
			const response = await foodService.getAdminFoods(1, 1000);
			console.log(response);

			if (response && response.success) {
				const foodsData = response.data;

				// Set all foods array
				if (Array.isArray(foodsData)) {
					setAllFoods(foodsData);
				}
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
			toast({
				title: "Error",
				description: "Failed to fetch foods",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	// Client-side filtering
	useEffect(() => {
		let filtered = [...allFoods];

		// Filter by category
		if (filterCategory !== "all") {
			filtered = filtered.filter(
				(food) => food.category === filterCategory,
			);
		}

		// Filter by meal
		if (filterMeal !== "all") {
			filtered = filtered.filter((food) => food.meal === filterMeal);
		}

		// Filter by search
		if (searchDebounced.trim()) {
			const searchLower = searchDebounced.toLowerCase();
			filtered = filtered.filter((food) =>
				food.name.toLowerCase().includes(searchLower),
			);
		}

		// Calculate pagination
		const itemsPerPage = 10;
		const totalPages = Math.ceil(filtered.length / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const paginatedFoods = filtered.slice(startIndex, endIndex);

		// Update state
		setFoods(paginatedFoods);
		setPagination({
			currentPage: currentPage,
			totalPages: totalPages || 1,
			totalFoods: filtered.length,
			limit: itemsPerPage,
		});

		// Reset to page 1 if current page exceeds total pages
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(1);
		}
	}, [allFoods, searchDebounced, filterCategory, filterMeal, currentPage]);

	// Fetch all foods on mount
	useEffect(() => {
		fetchAllFoods();
	}, []);

	const handleView = (food: Food) => {
		setSelectedFood(food);
		setModalOpen(true);
	};

	const handleEdit = (food: Food) => {
		setEditingFood(food);
		setEditModalOpen(true);
	};

	const handleSaveEdit = async (
		foodId: string,
		recipeData: RecipeFormData,
	) => {
		try {
			console.log("handleSaveEdit called with:", { foodId, recipeData });
			setLoading(true);

			// Convert RecipeFormData back to CreateFoodRequest format
			const foodData = {
				name: recipeData.title,
				description: recipeData.description,
				image: recipeData.image,
				category: recipeData.foodCategory,
				meal: recipeData.category,
				ingredients: recipeData.ingredients,
				instructions: recipeData.instructions.map((desc, index) => ({
					step: index + 1,
					description: desc,
				})),
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
				allergens: recipeData.allergens || [],
				tags: recipeData.tags || [],
			};

			console.log("Sending foodData to API:", foodData);
			const response = await foodService.updateAdminFood(
				foodId,
				foodData,
			);
			console.log("API Response:", response);

			if (response && response.success) {
				// Update the food in allFoods
				setAllFoods((prev) =>
					prev.map((f) => (f._id === foodId ? response.data : f)),
				);

				// Update selected food if it's the same one
				if (selectedFood?._id === foodId) {
					setSelectedFood(response.data);
				}

				toast({
					title: "Success",
					description: "Food updated successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error updating food:", error);
			toast({
				title: "Error",
				description: "Failed to update food",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleToggleStatus = async (food: Food) => {
		try {
			setLoading(true);
			const response = await foodService.updateFoodStatus(
				food._id,
				!food.isActive,
			);

			if (response && response.success) {
				// Update the food in allFoods with new status
				setAllFoods((prev) =>
					prev.map((f) =>
						f._id === food._id
							? { ...f, isActive: !food.isActive }
							: f,
					),
				);

				// Update selected food if it's the same one
				if (selectedFood?._id === food._id) {
					setSelectedFood({ ...food, isActive: !food.isActive });
				}

				toast({
					title: "Success",
					description: `Food ${
						!food.isActive ? "activated" : "deactivated"
					} successfully`,
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error updating food status:", error);
			toast({
				title: "Error",
				description: "Failed to update food status",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (food: Food) => {
		setFoodToDelete(food);
		onDeleteOpen();
	};

	const handleDeleteConfirm = async () => {
		if (!foodToDelete) return;

		try {
			setLoading(true);
			const response = await foodService.deleteAdminFood(
				foodToDelete._id,
			);

			if (response && response.success) {
				// Remove the food from allFoods
				setAllFoods((prev) =>
					prev.filter((f) => f._id !== foodToDelete._id),
				);

				// Close modal if it's the same food
				if (selectedFood?._id === foodToDelete._id) {
					setModalOpen(false);
					setSelectedFood(null);
				}

				toast({
					title: "Success",
					description: "Food deleted successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error deleting food:", error);
			toast({
				title: "Error",
				description: "Failed to delete food",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
			onDeleteClose();
			setFoodToDelete(null);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			setCurrentPage(newPage);
		}
	};

	const handleCreateFood = async (recipeData: RecipeFormData) => {
		try {
			setLoading(true);

			// Convert RecipeFormData to CreateFoodRequest format
			const foodData = {
				name: recipeData.title,
				description: recipeData.description,
				image: recipeData.image,
				category: recipeData.foodCategory,
				meal: recipeData.category,
				ingredients: recipeData.ingredients,
				instructions: recipeData.instructions.map((desc, index) => ({
					step: index + 1,
					description: desc,
				})),
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
				allergens: recipeData.allergens || [],
				tags: recipeData.tags || [],
			};

			const response = await foodService.createAdminFood(foodData);

			if (response && response.success) {
				// Refresh all foods list
				await fetchAllFoods();

				// Close create modal
				setCreateModalOpen(false);

				toast({
					title: "Success",
					description: "Food created successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error creating food:", error);
			toast({
				title: "Error",
				description: "Failed to create food",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<MainLayout>
			<Box
				p={8}
				minH="100vh"
				bg="gray.50">
				<Flex
					justify="space-between"
					align="center"
					mb={6}>
					<Heading
						size="lg"
						color="gray.700">
						Foods Management
					</Heading>
					<Button
						leftIcon={<FiPlus />}
						colorScheme="blue"
						onClick={() => setCreateModalOpen(true)}>
						Add Food
					</Button>
				</Flex>
				<Flex
					mb={6}
					gap={4}
					direction={{ base: "column", md: "row" }}
					wrap="wrap">
					<InputGroup maxW="400px">
						<InputLeftElement pointerEvents="none">
							<FiSearch color="gray.400" />
						</InputLeftElement>
						<Input
							placeholder="Search by name..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							bg="white"
							borderRadius="lg"
						/>
					</InputGroup>
					<Select
						maxW="200px"
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
						bg="white"
						borderRadius="lg">
						<option value="all">All Categories</option>
						<option value="protein">Protein</option>
						<option value="carbohydrate">Carbohydrate</option>
						<option value="vegetable">Vegetable</option>
						<option value="fruit">Fruit</option>
						<option value="dairy">Dairy</option>
						<option value="fat">Fat</option>
					</Select>
					<Select
						maxW="200px"
						value={filterMeal}
						onChange={(e) => setFilterMeal(e.target.value)}
						bg="white"
						borderRadius="lg">
						<option value="all">All Meals</option>
						<option value="breakfast">Breakfast</option>
						<option value="lunch">Lunch</option>
						<option value="dinner">Dinner</option>
						<option value="snack">Snack</option>
					</Select>
				</Flex>
				{loading ? (
					<Box
						textAlign="center"
						py={10}>
						<Spinner
							size="xl"
							color="blue.500"
						/>
					</Box>
				) : (
					<>
						<FoodsTable
							foods={foods}
							onView={handleView}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>

						{/* Pagination Controls */}
						<Flex
							mt={6}
							justify="space-between"
							align="center"
							bg="white"
							p={4}
							borderRadius="lg"
							boxShadow="md">
							<Text
								fontSize="sm"
								color="gray.600">
								Showing{" "}
								{(currentPage - 1) * pagination.limit + 1} to{" "}
								{Math.min(
									currentPage * pagination.limit,
									pagination.totalFoods,
								)}{" "}
								of {pagination.totalFoods} foods
							</Text>

							<HStack spacing={2}>
								<Button
									size="sm"
									leftIcon={<FiChevronLeft />}
									onClick={() =>
										handlePageChange(currentPage - 1)
									}
									isDisabled={currentPage === 1}
									variant="outline"
									colorScheme="blue">
									Previous
								</Button>

								<HStack spacing={1}>
									{[...Array(pagination.totalPages)].map(
										(_, index) => {
											const pageNumber = index + 1;
											// Show first page, last page, current page and adjacent pages
											if (
												pageNumber === 1 ||
												pageNumber ===
													pagination.totalPages ||
												(pageNumber >=
													currentPage - 1 &&
													pageNumber <=
														currentPage + 1)
											) {
												return (
													<Button
														key={pageNumber}
														size="sm"
														onClick={() =>
															handlePageChange(
																pageNumber,
															)
														}
														colorScheme={
															currentPage ===
															pageNumber
																? "blue"
																: "gray"
														}
														variant={
															currentPage ===
															pageNumber
																? "solid"
																: "outline"
														}>
														{pageNumber}
													</Button>
												);
											} else if (
												pageNumber ===
													currentPage - 2 ||
												pageNumber === currentPage + 2
											) {
												return (
													<Text key={pageNumber}>
														...
													</Text>
												);
											}
											return null;
										},
									)}
								</HStack>

								<Button
									size="sm"
									rightIcon={<FiChevronRight />}
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
									isDisabled={
										currentPage === pagination.totalPages
									}
									variant="outline"
									colorScheme="blue">
									Next
								</Button>
							</HStack>
						</Flex>
					</>
				)}

				{/* Food Detail Modal */}
				<FoodDetailModal
					food={selectedFood}
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					onToggleStatus={handleToggleStatus}
					onDelete={handleDeleteClick}
				/>

				{/* Delete Confirmation Dialog */}
				<AlertDialog
					isOpen={isDeleteOpen}
					leastDestructiveRef={cancelRef}
					onClose={onDeleteClose}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader
								fontSize="lg"
								fontWeight="bold">
								Delete Food
							</AlertDialogHeader>

							<AlertDialogBody>
								Are you sure you want to delete{" "}
								<strong>{foodToDelete?.name}</strong>? This
								action cannot be undone.
							</AlertDialogBody>

							<AlertDialogFooter>
								<Button
									ref={cancelRef}
									onClick={onDeleteClose}>
									Cancel
								</Button>
								<Button
									colorScheme="red"
									onClick={handleDeleteConfirm}
									ml={3}>
									Delete
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</AlertDialog>

				{/* Food Edit Modal */}
				<FoodEditModal
					food={editingFood}
					isOpen={editModalOpen}
					onClose={() => {
						setEditModalOpen(false);
						setEditingFood(null);
					}}
					onSave={handleSaveEdit}
				/>

				{/* Food Create Modal */}
				<FoodCreateModal
					isOpen={createModalOpen}
					onClose={() => setCreateModalOpen(false)}
					onSave={handleCreateFood}
				/>
			</Box>
		</MainLayout>
	);
};

export default FoodsManagementPage;
