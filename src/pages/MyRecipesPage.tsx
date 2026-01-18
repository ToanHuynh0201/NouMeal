import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Button,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	SimpleGrid,
	useDisclosure,
	Heading,
	Stat,
	StatLabel,
	StatNumber,
	StatGroup,
	Card,
	CardBody,
	Flex,
	Badge,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import {
	FiPlus,
	FiSearch,
	FiFilter,
	FiChevronDown,
	FiTrendingUp,
	FiCheckSquare,
	FiX,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import RecipeCard from "@/components/myRecipes/RecipeCard";
import RecipeFormModal from "@/components/myRecipes/RecipeFormModal";
import DeleteConfirmDialog from "@/components/myRecipes/DeleteConfirmDialog";
import EmptyState from "@/components/myRecipes/EmptyState";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import CreatePostFromRecipeModal from "@/components/myRecipes/CreatePostFromRecipeModal";
import { InappropriateFoodWarningModal } from "@/components/myRecipes/InappropriateFoodWarningModal";
import { useMyRecipes } from "@/hooks/useMyRecipes";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import type { Recipe } from "@/types/recipe";
import type { RecipeFormData } from "@/types/myRecipe";

const MyRecipesPage = () => {
	const toast = useToast();
	const {
		recipes,
		filters,
		statistics,
		isLoading,
		addRecipe,
		createRecipe,
		updateRecipe,
		deleteRecipe,
		updateFilters,
		sortBy,
		sortOrder,
		updateSorting,
		toggleSortOrder,
	} = useMyRecipes();

	// Modal states
	const {
		isOpen: isFormOpen,
		onOpen: onFormOpen,
		onClose: onFormClose,
	} = useDisclosure();
	const {
		isOpen: isDeleteOpen,
		onOpen: onDeleteOpen,
		onClose: onDeleteClose,
	} = useDisclosure();
	const {
		isOpen: isDetailOpen,
		onOpen: onDetailOpen,
		onClose: onDetailClose,
	} = useDisclosure();
	const {
		isOpen: isShareOpen,
		onOpen: onShareOpen,
		onClose: onShareClose,
	} = useDisclosure();
	const {
		isOpen: isWarningOpen,
		onOpen: onWarningOpen,
		onClose: onWarningClose,
	} = useDisclosure();

	// Selected recipe states
	const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
	const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);
	const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
	const [sharingRecipe, setSharingRecipe] = useState<Recipe | null>(null);
	const [pendingRecipe, setPendingRecipe] = useState<RecipeFormData | null>(
		null,
	);

	// Selection mode for creating menu posts
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

	// Animation
	const headerSection = useScrollAnimation({ threshold: 0.1 });

	// Handlers
	const handleAddRecipe = () => {
		setEditingRecipe(null);
		onFormOpen();
	};

	const handleEditRecipe = (recipe: Recipe) => {
		setEditingRecipe(recipe);
		onFormOpen();
	};

	const handleDeleteRecipe = (recipe: Recipe) => {
		setDeletingRecipe(recipe);
		onDeleteOpen();
	};

	const handleViewRecipe = (recipe: Recipe) => {
		setViewingRecipe(recipe);
		onDetailOpen();
	};

	const handleShareRecipe = (recipe: Recipe) => {
		setSharingRecipe(recipe);
		setSelectedRecipes([recipe]);
		onShareOpen();
	};

	const handleShareSuccess = () => {
		setIsSelectionMode(false);
		setSelectedRecipes([]);
	};

	const handleToggleSelectionMode = () => {
		setIsSelectionMode(!isSelectionMode);
		setSelectedRecipes([]);
	};

	const handleToggleRecipeSelection = (recipe: Recipe) => {
		setSelectedRecipes((prev) => {
			const isSelected = prev.some((r) => r.id === recipe.id);
			if (isSelected) {
				return prev.filter((r) => r.id !== recipe.id);
			} else {
				return [...prev, recipe];
			}
		});
	};

	const handleShareSelected = () => {
		if (selectedRecipes.length > 0) {
			setSharingRecipe(null);
			onShareOpen();
		}
	};

	const handleSaveRecipe = async (recipeData: RecipeFormData) => {
		if (editingRecipe) {
			updateRecipe(editingRecipe.id, recipeData);
		} else {
			// Add new recipe - check if appropriate
			const result = await addRecipe(recipeData);
			if (!result.isAllergyFree) {
				// Contains allergens - block completely
				toast({
					title: "Cannot Add Recipe",
					description:
						"This food contains allergens that you are allergic to. For your safety, we cannot add this recipe.",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
				return;
			}

			if (result.isAppropriate) {
				// Food is appropriate and allergy-free, create directly
				await createRecipe(recipeData);
			} else {
				// Food is not appropriate but allergy-free, show warning modal
				setPendingRecipe(recipeData);
				onWarningOpen();
			}
		}
	};

	const handleConfirmAddInappropriate = async () => {
		if (pendingRecipe) {
			await createRecipe(pendingRecipe);
			setPendingRecipe(null);
			onWarningClose();
		}
	};

	const handleCancelAddInappropriate = () => {
		setPendingRecipe(null);
		onWarningClose();
	};

	const handleConfirmDelete = () => {
		if (deletingRecipe) {
			deleteRecipe(deletingRecipe.id);
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateFilters({ searchQuery: e.target.value });
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		updateFilters({ category: e.target.value as any });
	};

	const handleDifficultyChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		updateFilters({ difficulty: e.target.value as any });
	};

	const handleSortChange = (newSortBy: string) => {
		if (sortBy === newSortBy) {
			toggleSortOrder();
		} else {
			updateSorting(newSortBy as any, "asc");
		}
	};

	return (
		<MainLayout
			showHeader={true}
			showFooter={true}>
			<Container
				maxW="7xl"
				py={8}>
				<VStack
					spacing={8}
					align="stretch">
					{/* Header Section */}
					<Box
						ref={headerSection.elementRef}
						opacity={headerSection.isVisible ? 1 : 0}
						transform={
							headerSection.isVisible
								? "translateY(0)"
								: "translateY(30px)"
						}
						transition="all 0.6s ease-out">
						<Flex
							direction={{ base: "column", md: "row" }}
							justify="space-between"
							align={{ base: "start", md: "center" }}
							gap={4}
							mb={6}>
							<VStack
								align="start"
								spacing={1}>
								<Heading
									size="xl"
									color="gray.800">
									My Recipes
								</Heading>
								<Text
									fontSize="md"
									color="gray.600">
									Manage your personal recipe collection
								</Text>
							</VStack>
							<HStack spacing={3}>
								{!isSelectionMode ? (
									<>
										<Button
											leftIcon={
												<Icon as={FiCheckSquare} />
											}
											colorScheme="blue"
											variant="outline"
											size="lg"
											onClick={handleToggleSelectionMode}
											shadow="md">
											Create Menu Post
										</Button>
										<Button
											leftIcon={<Icon as={FiPlus} />}
											colorScheme="purple"
											size="lg"
											onClick={handleAddRecipe}
											shadow="md"
											_hover={{
												transform: "translateY(-2px)",
												shadow: "lg",
											}}>
											Add New Recipe
										</Button>
									</>
								) : (
									<>
										<Button
											leftIcon={<Icon as={FiX} />}
											variant="outline"
											size="lg"
											onClick={handleToggleSelectionMode}>
											Cancel
										</Button>
										<Button
											colorScheme="purple"
											size="lg"
											onClick={handleShareSelected}
											isDisabled={
												selectedRecipes.length === 0
											}
											shadow="md">
											Share {selectedRecipes.length}{" "}
											Recipe
											{selectedRecipes.length !== 1
												? "s"
												: ""}
										</Button>
									</>
								)}
							</HStack>
						</Flex>

						{/* Statistics */}
						{statistics.total > 0 && (
							<Card
								bg="white"
								shadow="md"
								borderRadius="xl"
								mb={6}>
								<CardBody>
									<StatGroup>
										<Stat>
											<StatLabel>Total Recipes</StatLabel>
											<StatNumber color="purple.600">
												{statistics.total}
											</StatNumber>
										</Stat>
										<Stat>
											<StatLabel>Breakfast</StatLabel>
											<StatNumber color="orange.600">
												{
													statistics.categories
														.breakfast
												}
											</StatNumber>
										</Stat>
										<Stat>
											<StatLabel>Lunch</StatLabel>
											<StatNumber color="green.600">
												{statistics.categories.lunch}
											</StatNumber>
										</Stat>
										<Stat>
											<StatLabel>Dinner</StatLabel>
											<StatNumber color="purple.600">
												{statistics.categories.dinner}
											</StatNumber>
										</Stat>
										<Stat>
											<StatLabel>Avg Calories</StatLabel>
											<StatNumber color="brand.600">
												{statistics.avgCalories}
											</StatNumber>
										</Stat>
									</StatGroup>
								</CardBody>
							</Card>
						)}

						{/* Filters and Search */}
						{statistics.total > 0 && (
							<Card
								bg="white"
								shadow="md"
								borderRadius="xl">
								<CardBody>
									<VStack
										spacing={4}
										align="stretch">
										{/* Search */}
										<InputGroup size="lg">
											<InputLeftElement pointerEvents="none">
												<Icon
													as={FiSearch}
													color="gray.400"
												/>
											</InputLeftElement>
											<Input
												placeholder="Search recipes by title, ingredients, or tags..."
												value={filters.searchQuery}
												onChange={handleSearchChange}
												borderRadius="lg"
											/>
										</InputGroup>

										{/* Filters */}
										<Flex
											direction={{
												base: "column",
												md: "row",
											}}
											gap={4}
											align={{
												base: "stretch",
												md: "center",
											}}>
											<HStack
												flex={1}
												spacing={4}>
												<Icon
													as={FiFilter}
													color="gray.500"
												/>
												<Select
													value={filters.category}
													onChange={
														handleCategoryChange
													}
													borderRadius="lg">
													<option value="all">
														All Categories
													</option>
													<option value="breakfast">
														Breakfast
													</option>
													<option value="lunch">
														Lunch
													</option>
													<option value="dinner">
														Dinner
													</option>
													<option value="snack">
														Snack
													</option>
												</Select>

												<Select
													value={filters.difficulty}
													onChange={
														handleDifficultyChange
													}
													borderRadius="lg">
													<option value="all">
														All Difficulties
													</option>
													<option value="easy">
														Easy
													</option>
													<option value="medium">
														Medium
													</option>
													<option value="hard">
														Hard
													</option>
												</Select>
											</HStack>

											{/* Sort */}
											<HStack>
												<Icon
													as={FiTrendingUp}
													color="gray.500"
												/>
												<Menu>
													<MenuButton
														as={Button}
														rightIcon={
															<Icon
																as={
																	FiChevronDown
																}
															/>
														}
														variant="outline"
														borderRadius="lg">
														Sort:{" "}
														{sortBy === "createdAt"
															? "Newest"
															: sortBy === "title"
																? "A-Z"
																: sortBy ===
																	  "calories"
																	? "Calories"
																	: "Time"}{" "}
														{sortOrder === "asc"
															? "↑"
															: "↓"}
													</MenuButton>
													<MenuList>
														<MenuItem
															onClick={() =>
																handleSortChange(
																	"createdAt",
																)
															}>
															Newest First
														</MenuItem>
														<MenuItem
															onClick={() =>
																handleSortChange(
																	"title",
																)
															}>
															Alphabetical
														</MenuItem>
														<MenuItem
															onClick={() =>
																handleSortChange(
																	"calories",
																)
															}>
															Calories
														</MenuItem>
														<MenuItem
															onClick={() =>
																handleSortChange(
																	"cookingTime",
																)
															}>
															Cooking Time
														</MenuItem>
													</MenuList>
												</Menu>
											</HStack>
										</Flex>

										{/* Active Filters */}
										{(filters.category !== "all" ||
											filters.difficulty !== "all" ||
											filters.searchQuery) && (
											<HStack
												spacing={2}
												flexWrap="wrap">
												<Text
													fontSize="sm"
													color="gray.600">
													Active filters:
												</Text>
												{filters.category !== "all" && (
													<Badge
														colorScheme="purple"
														borderRadius="md"
														px={2}
														py={1}>
														{filters.category}
													</Badge>
												)}
												{filters.difficulty !==
													"all" && (
													<Badge
														colorScheme="green"
														borderRadius="md"
														px={2}
														py={1}>
														{filters.difficulty}
													</Badge>
												)}
												{filters.searchQuery && (
													<Badge
														colorScheme="blue"
														borderRadius="md"
														px={2}
														py={1}>
														"{filters.searchQuery}"
													</Badge>
												)}
												<Button
													size="xs"
													variant="ghost"
													colorScheme="red"
													onClick={() =>
														updateFilters({
															category: "all",
															difficulty: "all",
															searchQuery: "",
														})
													}>
													Clear all
												</Button>
											</HStack>
										)}
									</VStack>
								</CardBody>
							</Card>
						)}
					</Box>

					{/* Recipes Grid or Empty State */}
					{isLoading ? (
						<Box
							p={16}
							textAlign="center">
							<Text
								fontSize="xl"
								color="gray.600">
								Loading recipes...
							</Text>
						</Box>
					) : recipes.length > 0 ? (
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 3 }}
							spacing={6}>
							{recipes.map((recipe) => (
								<RecipeCard
									key={recipe.id}
									recipe={recipe}
									onView={handleViewRecipe}
									onEdit={handleEditRecipe}
									onDelete={handleDeleteRecipe}
									onShare={handleShareRecipe}
									isSelectionMode={isSelectionMode}
									isSelected={selectedRecipes.some(
										(r) => r.id === recipe.id,
									)}
									onToggleSelect={handleToggleRecipeSelection}
								/>
							))}
						</SimpleGrid>
					) : filters.category !== "all" ||
					  filters.difficulty !== "all" ||
					  filters.searchQuery ? (
						<Box
							p={16}
							textAlign="center"
							borderWidth="2px"
							borderStyle="dashed"
							borderColor="gray.300"
							borderRadius="xl"
							bg="gray.50">
							<VStack spacing={4}>
								<Text
									fontSize="2xl"
									fontWeight="bold"
									color="gray.700">
									No recipes found
								</Text>
								<Text
									fontSize="md"
									color="gray.600">
									Try adjusting your filters or search query
								</Text>
								<Button
									colorScheme="purple"
									variant="outline"
									onClick={() =>
										updateFilters({
											category: "all",
											difficulty: "all",
											searchQuery: "",
										})
									}>
									Clear Filters
								</Button>
							</VStack>
						</Box>
					) : (
						<EmptyState onAddRecipe={handleAddRecipe} />
					)}
				</VStack>
			</Container>

			{/* Modals */}
			<RecipeFormModal
				isOpen={isFormOpen}
				onClose={onFormClose}
				onSave={handleSaveRecipe}
				editingRecipe={editingRecipe}
			/>

			<DeleteConfirmDialog
				isOpen={isDeleteOpen}
				onClose={onDeleteClose}
				onConfirm={handleConfirmDelete}
				recipe={deletingRecipe}
			/>

			<RecipeDetailModal
				isOpen={isDetailOpen}
				onClose={onDetailClose}
				recipe={viewingRecipe}
			/>

			<CreatePostFromRecipeModal
				isOpen={isShareOpen}
				onClose={onShareClose}
				recipes={selectedRecipes}
				onSuccess={handleShareSuccess}
			/>

			<InappropriateFoodWarningModal
				isOpen={isWarningOpen}
				onClose={handleCancelAddInappropriate}
				onConfirm={handleConfirmAddInappropriate}
				foodName={pendingRecipe?.title || ""}
			/>
		</MainLayout>
	);
};

export default MyRecipesPage;
