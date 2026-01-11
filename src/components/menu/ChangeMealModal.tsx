import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	VStack,
	SimpleGrid,
	Box,
	Image,
	Text,
	Badge,
	HStack,
	Input,
	InputGroup,
	InputLeftElement,
	Icon,
	useColorModeValue,
	Spinner,
	Center,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiCheck } from "react-icons/fi";
import { foodService } from "@/services";
import { convertFoodToRecipe } from "@/utils/food";
import type { MealType, Food } from "@/types";
import type { Recipe } from "@/types/recipe";

interface ChangeMealModalProps {
	isOpen: boolean;
	onClose: () => void;
	mealType: MealType;
	currentFoodId: string;
	onConfirmChange: (newFoodId: string) => Promise<void>;
}

const ChangeMealModal = ({
	isOpen,
	onClose,
	mealType,
	currentFoodId,
	onConfirmChange,
}: ChangeMealModalProps) => {
	const [userFoods, setUserFoods] = useState<Recipe[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
	const [isChanging, setIsChanging] = useState(false);

	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const selectedBorderColor = useColorModeValue("purple.500", "purple.300");

	// Meal type display config
	const mealTypeConfig = {
		breakfast: { emoji: "🌅", color: "orange", label: "Breakfast" },
		lunch: { emoji: "☀️", color: "green", label: "Lunch" },
		dinner: { emoji: "🌙", color: "purple", label: "Dinner" },
		snack: { emoji: "🍎", color: "blue", label: "Snack" },
	};

	const config = mealTypeConfig[mealType];

	// Fetch user's foods on mount
	useEffect(() => {
		const fetchUserFoods = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await foodService.getUserFoods(1, 100);

				if (result.success) {
					const foods = result.data as Food[];
					// Convert Food[] to Recipe[] and filter by meal type
					const recipes = foods
						.map(convertFoodToRecipe)
						.filter((recipe) => recipe.category === mealType);

					setUserFoods(recipes);
				} else {
					setError(result.error || "Failed to fetch your recipes");
				}
			} catch (err) {
				setError("An error occurred while fetching recipes");
			} finally {
				setIsLoading(false);
			}
		};

		if (isOpen) {
			fetchUserFoods();
			setSelectedFoodId(null);
			setSearchQuery("");
		}
	}, [isOpen, mealType]);

	// Filter recipes by search query
	const filteredRecipes = useMemo(() => {
		if (!searchQuery.trim()) {
			return userFoods;
		}

		const query = searchQuery.toLowerCase();
		return userFoods.filter(
			(recipe) =>
				recipe.title.toLowerCase().includes(query) ||
				recipe.description.toLowerCase().includes(query) ||
				recipe.tags?.some((tag) => tag.toLowerCase().includes(query)),
		);
	}, [userFoods, searchQuery]);

	const handleConfirm = async () => {
		if (!selectedFoodId || selectedFoodId === currentFoodId) {
			return;
		}

		setIsChanging(true);
		try {
			await onConfirmChange(selectedFoodId);
		} finally {
			setIsChanging(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="3xl"
			scrollBehavior="inside">
			<ModalOverlay backdropFilter="blur(4px)" />
			<ModalContent>
				<ModalHeader>
					<HStack spacing={3}>
						<Text fontSize="2xl">{config.emoji}</Text>
						<Text>Change {config.label} Meal</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					<VStack
						spacing={4}
						align="stretch">
						{/* Search Input */}
						<InputGroup>
							<InputLeftElement pointerEvents="none">
								<Icon
									as={FiSearch}
									color="gray.400"
								/>
							</InputLeftElement>
							<Input
								placeholder="Search your recipes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</InputGroup>

						{/* Loading State */}
						{isLoading && (
							<Center py={12}>
								<VStack spacing={3}>
									<Spinner
										size="xl"
										color={`${config.color}.500`}
									/>
									<Text color="gray.500">Loading your recipes...</Text>
								</VStack>
							</Center>
						)}

						{/* Error State */}
						{error && !isLoading && (
							<Alert
								status="error"
								variant="subtle"
								borderRadius="lg">
								<AlertIcon />
								<Box>
									<AlertTitle>Unable to load recipes</AlertTitle>
									<AlertDescription>{error}</AlertDescription>
								</Box>
							</Alert>
						)}

						{/* Empty State */}
						{!isLoading && !error && filteredRecipes.length === 0 && (
							<Alert
								status="info"
								variant="subtle"
								borderRadius="lg">
								<AlertIcon />
								<Box>
									<AlertTitle>No recipes found</AlertTitle>
									<AlertDescription>
										{searchQuery
											? "Try a different search term"
											: `You don't have any ${mealType} recipes yet. Create one in My Recipes page!`}
									</AlertDescription>
								</Box>
							</Alert>
						)}

						{/* Recipe Grid */}
						{!isLoading && !error && filteredRecipes.length > 0 && (
							<SimpleGrid
								columns={{ base: 1, md: 2 }}
								spacing={4}>
								{filteredRecipes.map((recipe) => {
									const isCurrentMeal = recipe.id === currentFoodId;
									const isSelected = recipe.id === selectedFoodId;

									return (
										<Box
											key={recipe.id}
											bg={cardBg}
											borderRadius="lg"
											border="2px"
											borderColor={
												isSelected
													? selectedBorderColor
													: borderColor
											}
											overflow="hidden"
											cursor="pointer"
											transition="all 0.2s"
											_hover={{
												shadow: "md",
												transform: "translateY(-2px)",
											}}
											onClick={() =>
												setSelectedFoodId(recipe.id)
											}
											position="relative">
											{/* Current Meal Badge */}
											{isCurrentMeal && (
												<Badge
													position="absolute"
													top={2}
													left={2}
													colorScheme="green"
													fontSize="xs"
													px={2}
													py={1}
													borderRadius="md"
													zIndex={2}>
													✓ Current
												</Badge>
											)}

											{/* Selected Indicator */}
											{isSelected && (
												<Box
													position="absolute"
													top={2}
													right={2}
													bg={`${config.color}.500`}
													color="white"
													p={1}
													borderRadius="full"
													zIndex={2}>
													<Icon
														as={FiCheck}
														boxSize={4}
													/>
												</Box>
											)}

											{/* Recipe Image */}
											<Image
												src={recipe.image}
												alt={recipe.title}
												h="120px"
												w="100%"
												objectFit="cover"
											/>

											{/* Recipe Info */}
											<VStack
												p={3}
												align="stretch"
												spacing={2}>
												<Text
													fontWeight="bold"
													fontSize="md"
													noOfLines={1}>
													{recipe.title}
												</Text>
												<Text
													fontSize="sm"
													color="gray.600"
													noOfLines={2}>
													{recipe.description}
												</Text>

												{/* Nutrition Info */}
												<HStack
													spacing={2}
													fontSize="xs">
													<Badge colorScheme="orange">
														{recipe.nutrition.calories} cal
													</Badge>
													<Badge colorScheme="green">
														{recipe.nutrition.protein} protein
													</Badge>
													<Badge colorScheme="blue">
														{recipe.nutrition.carbs} carbs
													</Badge>
												</HStack>
											</VStack>
										</Box>
									);
								})}
							</SimpleGrid>
						)}
					</VStack>
				</ModalBody>

				<ModalFooter>
					<HStack spacing={3}>
						<Button
							variant="ghost"
							onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme={config.color}
							onClick={handleConfirm}
							isDisabled={
								!selectedFoodId ||
								selectedFoodId === currentFoodId ||
								isChanging
							}
							isLoading={isChanging}
							loadingText="Changing...">
							Confirm Change
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ChangeMealModal;
