import {
	Box,
	Container,
	VStack,
	Heading,
	Text,
	Textarea,
	Button,
	SimpleGrid,
	Card,
	CardBody,
	Badge,
	Icon,
	useDisclosure,
	Flex,
	Tag,
	TagLabel,
	TagLeftIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch, FiZap } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { aiService } from "@/services";
import type { Recipe } from "@/types/recipe";
import type { MealSuggestion } from "@/types/ai";
import type { ApiMeal } from "@/types/ai";
import { normalizeAITags } from "@/utils/food";

// Default placeholder image - A simple purple gradient food placeholder
const DEFAULT_MEAL_IMAGE =
	"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM5RjdBRUE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZCQjZDRTtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIG9wYWNpdHk9IjAuNiI+CiAgICA8dHNwYW4geD0iNTAlIiBkeT0iLTIwIj7wn42977iPPC90c3Bhbj4KICAgIDx0c3BhbiB4PSI1MCUiIGR5PSI2MCI+TWVhbCBJbWFnZTwvdHNwYW4+CiAgPC90ZXh0Pgo8L3N2Zz4=";

// Helper function to convert API meal to Recipe format
const convertApiMealToRecipe = (meal: ApiMeal, index: number): Recipe => {
	return {
		id: `meal-${index}-${Date.now()}`,
		title: meal.name,
		description: meal.description, // Default serving size
		image: DEFAULT_MEAL_IMAGE,
		foodCategory: "grains", // Default food category
		category: "lunch", // Default category
		difficulty: meal.difficulty.toLowerCase() as "easy" | "medium" | "hard",
		nutrition: {
			calories: meal.nutrition_facts.calories.value,
			protein: `${meal.nutrition_facts.protein.value}${meal.nutrition_facts.protein.unit}`,
			fat: `${meal.nutrition_facts.fat.value}${meal.nutrition_facts.fat.unit}`,
			carbs: `${meal.nutrition_facts.carbs.value}${meal.nutrition_facts.carbs.unit}`,
		},
		ingredients: meal.ingredients,
		instructions: meal.instructions,
		tags: normalizeAITags(meal.tags), // Normalize AI tags to standard format
	};
};

const AIMealSuggestionPage = () => {
	const [prompt, setPrompt] = useState("");
	const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

	const handleRecipeClick = (recipe: Recipe) => {
		setSelectedRecipe(recipe);
		onOpen();
	};

	const handleSearch = async () => {
		if (!prompt.trim()) return;

		setIsLoading(true);
		setHasSearched(true);

		try {
			const response = await aiService.getMealSuggestions({
				query: prompt,
			});

			console.log(response);

			if (response.success && response.data.meals) {
				const mealSuggestions: MealSuggestion[] =
					response.data.meals.map((meal: ApiMeal, index: number) => ({
						id: `suggestion-${index}-${Date.now()}`,
						recipe: convertApiMealToRecipe(meal, index),
						matchScore: meal.match_percentage,
						matchReason: meal.description,
						alternativeOptions: [],
					}));

				setSuggestions(mealSuggestions);
			} else {
				setSuggestions([]);
			}
		} catch (error) {
			console.error("Error fetching meal suggestions:", error);
			setSuggestions([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSearch();
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
						textAlign="center"
						mb={4}>
						<Heading
							size="2xl"
							bgGradient="linear(to-r, purple.500, pink.500)"
							bgClip="text"
							mb={3}
							paddingBottom={3}>
							AI Meal Suggestion
						</Heading>
						<Text
							fontSize="lg"
							color="gray.600">
							Describe what you're craving, and let our AI suggest
							the perfect meal for you!
						</Text>
					</Box>

					{/* Search Box */}
					<Card
						shadow="lg"
						borderRadius="2xl"
						bg="white"
						border="2px"
						borderColor="purple.100">
						<CardBody p={6}>
							<VStack spacing={4}>
								<Textarea
									placeholder="E.g., 'I want a healthy breakfast with eggs' or 'Suggest a high-protein lunch' or 'Quick vegan dinner ideas'..."
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									onKeyPress={handleKeyPress}
									size="lg"
									rows={4}
									fontSize="md"
									borderColor="purple.200"
									_hover={{ borderColor: "purple.300" }}
									_focus={{
										borderColor: "purple.500",
										boxShadow:
											"0 0 0 1px var(--chakra-colors-purple-500)",
									}}
								/>
								<Button
									leftIcon={<Icon as={FiSearch} />}
									colorScheme="purple"
									size="lg"
									width="full"
									onClick={handleSearch}
									isDisabled={!prompt.trim()}
									isLoading={isLoading}
									loadingText="Finding perfect meals..."
									_hover={{
										transform: "translateY(-2px)",
										boxShadow: "lg",
									}}
									transition="all 0.2s">
									Get AI Suggestions
								</Button>
							</VStack>
						</CardBody>
					</Card>

					{/* Loading State */}
					{isLoading && (
						<Box
							textAlign="center"
							py={8}>
							<LoadingSpinner
								message="Analyzing your request..."
								minHeight="200px"
								variant="primary"
							/>
						</Box>
					)}

					{/* Results Section */}
					{!isLoading && hasSearched && suggestions.length > 0 && (
						<VStack
							spacing={6}
							align="stretch">
							<Flex
								justify="space-between"
								align="center"
								flexWrap="wrap">
								<Heading
									size="lg"
									color="gray.700">
									Suggested Meals ({suggestions.length})
								</Heading>
								<Text
									color="gray.500"
									fontSize="sm">
									Sorted by relevance
								</Text>
							</Flex>

							<SimpleGrid
								columns={{ base: 1, md: 2 }}
								spacing={6}>
								{suggestions.map((suggestion) => (
									<Card
										key={suggestion.id}
										cursor="pointer"
										onClick={() =>
											handleRecipeClick(suggestion.recipe)
										}
										transition="all 0.3s"
										_hover={{
											transform: "translateY(-4px)",
											boxShadow: "xl",
											borderColor: "purple.300",
										}}
										overflow="hidden"
										position="relative"
										border="2px"
										borderColor="gray.100"
										bg="white">
										<CardBody p={6}>
											<VStack
												align="stretch"
												spacing={4}>
												{/* Header with Title and Match Score */}
												<Flex
													justify="space-between"
													align="start">
													<Heading
														size="md"
														flex="1"
														noOfLines={2}>
														{
															suggestion.recipe
																.title
														}
													</Heading>
													<Badge
														colorScheme="green"
														fontSize="md"
														px={3}
														py={1}
														borderRadius="full"
														ml={3}>
														{suggestion.matchScore}%
													</Badge>
												</Flex>

												{/* Description */}
												<Text
													fontSize="sm"
													color="gray.600"
													noOfLines={2}>
													{suggestion.matchReason}
												</Text>

												{/* Meal Info Tags */}
												<Flex
													gap={2}
													flexWrap="wrap">
													<Tag
														size="md"
														colorScheme="orange"
														variant="subtle">
														<TagLeftIcon
															as={FiZap}
														/>
														<TagLabel>
															{
																suggestion
																	.recipe
																	.nutrition
																	.calories
															}{" "}
															cal
														</TagLabel>
													</Tag>
												</Flex>

												{/* Nutrition Facts */}
												<Box
													bg="gradient"
													bgGradient="linear(to-r, purple.50, pink.50)"
													p={4}
													borderRadius="xl"
													border="1px"
													borderColor="purple.100">
													<Text
														fontSize="xs"
														fontWeight="bold"
														color="gray.600"
														mb={2}
														textTransform="uppercase"
														letterSpacing="wide">
														Nutrition Facts
													</Text>
													<SimpleGrid
														columns={3}
														spacing={3}>
														<VStack spacing={0}>
															<Text
																fontWeight="bold"
																color="purple.600"
																fontSize="lg">
																{
																	suggestion
																		.recipe
																		.nutrition
																		.protein
																}
															</Text>
															<Text
																fontSize="xs"
																color="gray.600"
																fontWeight="medium">
																Protein
															</Text>
														</VStack>
														<VStack spacing={0}>
															<Text
																fontWeight="bold"
																color="orange.600"
																fontSize="lg">
																{
																	suggestion
																		.recipe
																		.nutrition
																		.carbs
																}
															</Text>
															<Text
																fontSize="xs"
																color="gray.600"
																fontWeight="medium">
																Carbs
															</Text>
														</VStack>
														<VStack spacing={0}>
															<Text
																fontWeight="bold"
																color="yellow.600"
																fontSize="lg">
																{
																	suggestion
																		.recipe
																		.nutrition
																		.fat
																}
															</Text>
															<Text
																fontSize="xs"
																color="gray.600"
																fontWeight="medium">
																Fat
															</Text>
														</VStack>
													</SimpleGrid>
												</Box>

												{/* Tags */}
												{suggestion.recipe.tags.length >
													0 && (
													<Flex
														gap={2}
														flexWrap="wrap">
														{suggestion.recipe.tags
															.slice(0, 4)
															.map((tag, idx) => (
																<Badge
																	key={idx}
																	colorScheme="purple"
																	fontSize="xs"
																	px={2}
																	py={1}
																	borderRadius="md">
																	{tag}
																</Badge>
															))}
													</Flex>
												)}
											</VStack>
										</CardBody>
									</Card>
								))}
							</SimpleGrid>
						</VStack>
					)}

					{/* No Results */}
					{!isLoading && hasSearched && suggestions.length === 0 && (
						<Box
							textAlign="center"
							py={12}>
							<Icon
								as={FiSearch}
								boxSize={16}
								color="gray.300"
								mb={4}
							/>
							<Heading
								size="md"
								color="gray.500"
								mb={2}>
								No results found
							</Heading>
							<Text color="gray.400">
								Try a different description or be more specific
							</Text>
						</Box>
					)}

					{/* Example Prompts */}
					{!hasSearched && (
						<Box>
							<Text
								fontSize="sm"
								color="gray.600"
								mb={3}
								fontWeight="semibold">
								Try these examples:
							</Text>
							<Flex
								gap={2}
								flexWrap="wrap">
								{[
									"Healthy breakfast with eggs",
									"High protein lunch",
									"Quick vegan dinner",
									"Low carb meal",
									"Easy recipe under 30 minutes",
								].map((example, idx) => (
									<Tag
										key={idx}
										size="md"
										colorScheme="purple"
										variant="subtle"
										cursor="pointer"
										onClick={() => setPrompt(example)}
										_hover={{
											bg: "purple.100",
											transform: "scale(1.05)",
										}}
										transition="all 0.2s">
										{example}
									</Tag>
								))}
							</Flex>
						</Box>
					)}
				</VStack>
			</Container>

			{/* Recipe Detail Modal */}
			<RecipeDetailModal
				isOpen={isOpen}
				onClose={onClose}
				recipe={selectedRecipe}
				showSaveButton={true}
			/>
		</MainLayout>
	);
};

export default AIMealSuggestionPage;
