import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Icon,
	useDisclosure,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Button,
	SimpleGrid,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import { useState, useMemo, useEffect } from "react";
import { FiCalendar, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import DayMenuView from "@/components/menu/DayMenuView";
import UserProfileHeader from "@/components/menu/UserProfileHeader";
import NutritionSummaryCard from "@/components/menu/NutritionSummaryCard";
import WeeklyMenuCard from "@/components/menu/WeeklyMenuCard";
import WeeklySummaryCard from "@/components/menu/WeeklySummaryCard";
import WeeklyDayDetailView from "@/components/menu/WeeklyDayDetailView";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import useDailyCalorieNeeds from "@/hooks/useDailyCalorieNeeds";
import { authService, foodService } from "@/services";
import type {
	Recipe,
	DailyMenu,
	FoodRecommendationResponse,
	WeeklyMenuData,
} from "@/types";
import {
	convertRecommendationsToDailyMenu,
	convertWeeklyMenuToDailyMenus,
} from "@/utils/food";

const MenuSuggestionPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const [selectedDayMenu, setSelectedDayMenu] = useState<DailyMenu | null>(
		null,
	);
	const headerSection = useScrollAnimation({ threshold: 0.1 });
	const user = authService.getCurrentUser();

	// Fetch daily calorie needs
	const { data: dailyCalorieNeeds, isLoading: isLoadingCalories } =
		useDailyCalorieNeeds();

	// State for food recommendations
	const [recommendations, setRecommendations] =
		useState<FoodRecommendationResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// State for weekly menu
	const [weeklyMenuData, setWeeklyMenuData] = useState<WeeklyMenuData | null>(
		null,
	);
	const [isLoadingWeekly, setIsLoadingWeekly] = useState<boolean>(true);
	const [weeklyError, setWeeklyError] = useState<string | null>(null);

	// Fetch food recommendations
	const fetchRecommendations = async () => {
		setIsLoading(true);
		setError(null);

		const result = await foodService.getRecommendedFoods();

		if (result.success) {
			setRecommendations(result.data);
		} else {
			setError(result.error || "Failed to fetch recommendations");
		}

		setIsLoading(false);
	};

	// Fetch weekly menu
	const fetchWeeklyMenu = async () => {
		setIsLoadingWeekly(true);
		setWeeklyError(null);

		const result = await foodService.getWeeklyMenu();

		if (result.success) {
			setWeeklyMenuData(result.data);
			console.log(result.data);
		} else {
			setWeeklyError(result.error || "Failed to fetch weekly menu");
		}

		setIsLoadingWeekly(false);
	};

	// Fetch on component mount
	useEffect(() => {
		fetchRecommendations();
		fetchWeeklyMenu();
	}, []);

	// Convert API recommendations to DailyMenu format
	const todayMenu = useMemo(() => {
		if (!recommendations) return null;
		return convertRecommendationsToDailyMenu(recommendations);
	}, [recommendations]);

	// Convert API weekly menu to DailyMenu[] format
	const weeklyMenu = useMemo(() => {
		if (!weeklyMenuData) return [];
		return convertWeeklyMenuToDailyMenus(weeklyMenuData);
	}, [weeklyMenuData]);

	const handleRecipeClick = (recipe: Recipe) => {
		setSelectedRecipe(recipe);
		onOpen();
	};

	// Helper function to format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return "Today";
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return "Tomorrow";
		} else {
			return date.toLocaleDateString("en-US", {
				weekday: "long",
				month: "short",
				day: "numeric",
			});
		}
	};

	// Calculate weekly totals
	const weeklyTotals = useMemo(() => {
		if (!weeklyMenu || weeklyMenu.length === 0) {
			return { calories: 0, protein: 0, carbs: 0, fat: 0 };
		}

		return weeklyMenu.reduce(
			(acc, day) => ({
				calories: acc.calories + day.totalCalories,
				protein: acc.protein + parseInt(day.totalProtein),
				carbs: acc.carbs + parseInt(day.totalCarbs),
				fat: acc.fat + parseInt(day.totalFat),
			}),
			{ calories: 0, protein: 0, carbs: 0, fat: 0 },
		);
	}, [weeklyMenu]);

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
					{/* Header Section with User Info */}
					<Box
						ref={headerSection.elementRef}
						opacity={headerSection.isVisible ? 1 : 0}
						transform={
							headerSection.isVisible
								? "translateY(0)"
								: "translateY(30px)"
						}
						transition="all 0.6s ease-out">
						<UserProfileHeader
							userProfile={user}
							dailyCalorieNeeds={dailyCalorieNeeds}
							isLoadingCalories={isLoadingCalories}
						/>
					</Box>

					{/* Tabs for Today and This Week */}
					<Tabs
						variant="unstyled"
						colorScheme="purple"
						size="lg"
						isLazy>
						<TabList
							bg="white"
							p={1.5}
							borderRadius="2xl"
							shadow="lg"
							border="1px solid"
							borderColor="purple.100"
							gap={3}
							bgGradient="linear(to-r, purple.50, pink.50)">
							<Tab
								flex="1"
								py={3}
								px={6}
								fontWeight="600"
								fontSize="md"
								borderRadius="xl"
								transition="all 0.3s ease"
								color="gray.600"
								bg="white"
								position="relative"
								zIndex={1}
								_hover={{
									bg: "purple.50",
									color: "purple.600",
									transform: "translateY(-2px)",
									shadow: "sm",
								}}
								_selected={{
									bgGradient:
										"linear(135deg, purple.500, pink.500)",
									color: "white",
									shadow: "md",
									transform: "translateY(-2px)",
								}}>
								<HStack
									spacing={2}
									justify="center">
									<Icon
										as={FiCalendar}
										boxSize={5}
									/>
									<Text>Today</Text>
								</HStack>
							</Tab>
							<Tab
								flex="1"
								py={3}
								px={6}
								fontWeight="600"
								fontSize="md"
								borderRadius="xl"
								transition="all 0.3s ease"
								color="gray.600"
								bg="white"
								position="relative"
								zIndex={1}
								_hover={{
									bg: "purple.50",
									color: "purple.600",
									transform: "translateY(-2px)",
									shadow: "sm",
								}}
								_selected={{
									bgGradient:
										"linear(135deg, purple.500, pink.500)",
									color: "white",
									shadow: "md",
									transform: "translateY(-2px)",
								}}>
								<HStack
									spacing={2}
									justify="center">
									<Icon
										as={FiCalendar}
										boxSize={5}
									/>
									<Text>This Week</Text>
								</HStack>
							</Tab>
						</TabList>

						<TabPanels mt={6}>
							{/* Today's Menu */}
							<TabPanel p={0}>
								{isLoading ? (
									<LoadingSpinner
										message="Loading your personalized menu..."
										minHeight="400px"
										variant="primary"
									/>
								) : error ? (
									<Alert
										status="error"
										variant="subtle"
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
										textAlign="center"
										minH="400px"
										borderRadius="xl">
										<AlertIcon
											boxSize="40px"
											mr={0}
										/>
										<AlertTitle
											mt={4}
											mb={1}
											fontSize="lg">
											Unable to load recommendations
										</AlertTitle>
										<AlertDescription maxWidth="sm">
											{error}
										</AlertDescription>
										<Button
											mt={4}
											colorScheme="red"
											onClick={fetchRecommendations}
											leftIcon={
												<Icon as={FiRefreshCw} />
											}>
											Try Again
										</Button>
									</Alert>
								) : todayMenu ? (
									<VStack
										spacing={6}
										align="stretch">
										{/* Today's Nutrition Summary */}
										<NutritionSummaryCard
											calories={todayMenu.totalCalories}
											protein={todayMenu.totalProtein}
											carbs={todayMenu.totalCarbs}
											fat={todayMenu.totalFat}
										/>

										{/* Today's Detailed Menu */}
										<DayMenuView
											dailyMenu={todayMenu}
											onRecipeClick={handleRecipeClick}
										/>
									</VStack>
								) : (
									<Alert
										status="info"
										variant="subtle"
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
										textAlign="center"
										minH="400px"
										borderRadius="xl">
										<AlertIcon
											boxSize="40px"
											mr={0}
										/>
										<AlertTitle
											mt={4}
											mb={1}
											fontSize="lg">
											No recommendations available
										</AlertTitle>
										<AlertDescription maxWidth="sm">
											We couldn't generate personalized
											recommendations at this time.
										</AlertDescription>
									</Alert>
								)}
							</TabPanel>

							{/* Weekly Menu */}
							<TabPanel p={0}>
								{isLoadingWeekly ? (
									<LoadingSpinner
										message="Loading your weekly menu..."
										minHeight="400px"
										variant="primary"
									/>
								) : weeklyError ? (
									<Alert
										status="error"
										variant="subtle"
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
										textAlign="center"
										minH="400px"
										borderRadius="xl">
										<AlertIcon
											boxSize="40px"
											mr={0}
										/>
										<AlertTitle
											mt={4}
											mb={1}
											fontSize="lg">
											Unable to load weekly menu
										</AlertTitle>
										<AlertDescription maxWidth="sm">
											{weeklyError}
										</AlertDescription>
										<Button
											mt={4}
											colorScheme="red"
											onClick={fetchWeeklyMenu}
											leftIcon={
												<Icon as={FiRefreshCw} />
											}>
											Try Again
										</Button>
									</Alert>
								) : weeklyMenu.length > 0 ? (
									<VStack
										spacing={6}
										align="stretch">
										{selectedDayMenu ? (
											// Detailed view for selected day
											<>
												{/* Back Button */}
												<Button
													leftIcon={
														<Icon
															as={FiArrowLeft}
														/>
													}
													variant="ghost"
													colorScheme="purple"
													alignSelf="flex-start"
													onClick={() =>
														setSelectedDayMenu(null)
													}
													size="md"
													_hover={{
														bg: "purple.50",
														transform:
															"translateX(-4px)",
													}}
													transition="all 0.2s">
													Back to Weekly Overview
												</Button>

												{/* Weekly Day Detail View */}
												<WeeklyDayDetailView
													dailyMenu={selectedDayMenu}
													onRecipeClick={
														handleRecipeClick
													}
													formatDate={formatDate}
												/>
											</>
										) : (
											// Weekly overview
											<>
												{/* Weekly Summary */}
												<WeeklySummaryCard
													totalCalories={
														weeklyTotals.calories
													}
													totalProtein={
														weeklyTotals.protein
													}
													totalCarbs={
														weeklyTotals.carbs
													}
													totalFat={weeklyTotals.fat}
												/>

												{/* Weekly Menu Grid - Better layout for 7 days */}
												<VStack
													spacing={6}
													align="stretch">
													{/* First Row - 4 days */}
													<SimpleGrid
														columns={{
															base: 1,
															sm: 2,
															lg: 4,
														}}
														spacing={6}>
														{weeklyMenu
															.slice(0, 4)
															.map(
																(
																	day,
																	index,
																) => (
																	<Box
																		key={
																			index
																		}
																		opacity={
																			0
																		}
																		animation={`fadeInUp 0.5s ease-out ${
																			index *
																			0.1
																		}s forwards`}
																		sx={{
																			"@keyframes fadeInUp":
																				{
																					from: {
																						opacity: 0,
																						transform:
																							"translateY(20px)",
																					},
																					to: {
																						opacity: 1,
																						transform:
																							"translateY(0)",
																					},
																				},
																		}}>
																		<WeeklyMenuCard
																			day={
																				day
																			}
																			formatDate={
																				formatDate
																			}
																			onRecipeClick={
																				handleRecipeClick
																			}
																			onViewDetails={
																				setSelectedDayMenu
																			}
																		/>
																	</Box>
																),
															)}
													</SimpleGrid>

													{/* Second Row - 3 days centered */}
													<SimpleGrid
														columns={{
															base: 1,
															sm: 2,
															md: 3,
														}}
														spacing={6}
														maxW={{
															base: "full",
															md: "75%",
														}}
														mx="auto"
														w="full">
														{weeklyMenu
															.slice(4, 7)
															.map(
																(
																	day,
																	index,
																) => (
																	<Box
																		key={
																			index +
																			4
																		}
																		opacity={
																			0
																		}
																		animation={`fadeInUp 0.5s ease-out ${
																			(index +
																				4) *
																			0.1
																		}s forwards`}
																		sx={{
																			"@keyframes fadeInUp":
																				{
																					from: {
																						opacity: 0,
																						transform:
																							"translateY(20px)",
																					},
																					to: {
																						opacity: 1,
																						transform:
																							"translateY(0)",
																					},
																				},
																		}}>
																		<WeeklyMenuCard
																			day={
																				day
																			}
																			formatDate={
																				formatDate
																			}
																			onRecipeClick={
																				handleRecipeClick
																			}
																			onViewDetails={
																				setSelectedDayMenu
																			}
																		/>
																	</Box>
																),
															)}
													</SimpleGrid>
												</VStack>
											</>
										)}
									</VStack>
								) : (
									<Alert
										status="info"
										variant="subtle"
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
										textAlign="center"
										minH="400px"
										borderRadius="xl">
										<AlertIcon
											boxSize="40px"
											mr={0}
										/>
										<AlertTitle
											mt={4}
											mb={1}
											fontSize="lg">
											No weekly menu available
										</AlertTitle>
										<AlertDescription maxWidth="sm">
											We couldn't generate your weekly
											menu at this time.
										</AlertDescription>
									</Alert>
								)}
							</TabPanel>
						</TabPanels>
					</Tabs>
				</VStack>
			</Container>

			{/* Recipe Detail Modal */}
			<RecipeDetailModal
				isOpen={isOpen}
				onClose={onClose}
				recipe={selectedRecipe}
			/>
		</MainLayout>
	);
};

export default MenuSuggestionPage;
