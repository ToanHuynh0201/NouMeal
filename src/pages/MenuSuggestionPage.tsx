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
	Badge,
	useToast,
} from "@chakra-ui/react";
import { useState, useMemo, useEffect } from "react";
import { FiCalendar, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import DayMenuView from "@/components/menu/DayMenuView";
import UserProfileHeader from "@/components/menu/UserProfileHeader";
import WeeklyMenuCard from "@/components/menu/WeeklyMenuCard";
import WeeklyDayDetailView from "@/components/menu/WeeklyDayDetailView";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import useDailyCalorieNeeds from "@/hooks/useDailyCalorieNeeds";
import { useTodayProgress } from "@/hooks/useTodayProgress";
import { authService, foodService } from "@/services";
import { MealChangeService } from "@/services/mealChangeService";
import type {
	Recipe,
	DailyMenu,
	TodayMealsResponse,
	WeeklyMenuData,
	MealType,
} from "@/types";
import {
	convertTodayMealsToDailyMenu,
	convertWeeklyMenuToDailyMenus,
} from "@/utils/food";
import ChangeMealModal from "@/components/menu/ChangeMealModal";

const MenuSuggestionPage = () => {
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const [selectedDayMenu, setSelectedDayMenu] = useState<DailyMenu | null>(
		null,
	);
	const headerSection = useScrollAnimation({ threshold: 0.1 });
	const user = authService.getCurrentUser();

	// Change meal modal states
	const {
		isOpen: isChangeOpen,
		onOpen: onChangeOpen,
		onClose: onChangeClose,
	} = useDisclosure();
	const [changingMealType, setChangingMealType] = useState<MealType | null>(
		null,
	);
	const [currentFoodId, setCurrentFoodId] = useState<string>("");
	const [changedMeals, setChangedMeals] = useState<MealType[]>([]);

	// Fetch daily calorie needs
	const { data: dailyCalorieNeeds, isLoading: isLoadingCalories } =
		useDailyCalorieNeeds();

	// Fetch today's progress
	const {
		data: progressData,
		isLoading: isLoadingProgress,
		refetch: refetchProgress,
	} = useTodayProgress();

	// State for today's meals
	const [todayMealsData, setTodayMealsData] =
		useState<TodayMealsResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// State for weekly menu
	const [weeklyMenuData, setWeeklyMenuData] = useState<WeeklyMenuData | null>(
		null,
	);
	const [isLoadingWeekly, setIsLoadingWeekly] = useState<boolean>(true);
	const [weeklyError, setWeeklyError] = useState<string | null>(null);

	// Fetch today's meals
	const fetchTodayMeals = async () => {
		setIsLoading(true);
		setError(null);

		const result = await foodService.getTodayMeals();

		if (result.success) {
			setTodayMealsData(result.data);
		} else {
			setError(result.error || "Failed to fetch today's meals");
		}

		setIsLoading(false);
	};

	// Reset today's meals
	const handleResetTodayMeals = async () => {
		try {
			setIsLoading(true);
			const result = await foodService.resetTodayMeals();

			if (result.success) {
				setTodayMealsData(result.data);

				// Reset meal change tracking
				const mealChangeService = new MealChangeService();
				mealChangeService.resetDailyChanges();
				setChangedMeals([]);

				// Refresh progress
				await refetchProgress();

				toast({
					title: "Menu reset successfully",
					description: "Your today's meals have been refreshed with new suggestions",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Failed to reset menu",
					description: result.error || "Please try again",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred while resetting menu",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch weekly menu
	const fetchWeeklyMenu = async () => {
		setIsLoadingWeekly(true);
		setWeeklyError(null);

		const result = await foodService.getWeeklyMenu();

		if (result.success) {
			setWeeklyMenuData(result.data);
		} else {
			setWeeklyError(result.error || "Failed to fetch weekly menu");
		}

		setIsLoadingWeekly(false);
	};

	// Fetch on component mount and initialize meal change tracking
	useEffect(() => {
		fetchTodayMeals();
		fetchWeeklyMenu();

		// Initialize meal change tracking
		const mealChangeService = new MealChangeService();
		if (mealChangeService.isNewDay()) {
			mealChangeService.resetDailyChanges();
		}

		// Load which meals have been changed today
		const changedToday = mealChangeService.getChangedMeals();
		setChangedMeals(changedToday);
	}, []);

	// Convert API today's meals to DailyMenu format
	const todayMenu = useMemo(() => {
		if (!todayMealsData) return null;
		return convertTodayMealsToDailyMenu(todayMealsData);
	}, [todayMealsData]);

	// Convert API weekly menu to DailyMenu[] format
	const weeklyMenu = useMemo(() => {
		if (!weeklyMenuData) return [];
		return convertWeeklyMenuToDailyMenus(weeklyMenuData);
	}, [weeklyMenuData]);

	const handleRecipeClick = (recipe: Recipe) => {
		setSelectedRecipe(recipe);
		onOpen();
	};

	const handleLogFood = async (foodId: string) => {
		const result = await foodService.logFood(foodId);

		if (result.success) {
			// Refresh today's progress after logging food
			await refetchProgress();
		} else {
			throw new Error(result.error || "Failed to log food");
		}
	};

	// Handle opening change meal modal
	const handleChangeMeal = (mealType: MealType, currentFoodId: string) => {
		const mealChangeService = new MealChangeService();

		// Check if change is allowed
		if (!mealChangeService.canChangeMeal(mealType)) {
			toast({
				title: "Change limit reached",
				description: `You can only change ${mealType} once per day`,
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setChangingMealType(mealType);
		setCurrentFoodId(currentFoodId);
		onChangeOpen();
	};

	// Handle confirming meal change
	const handleConfirmChange = async (newFoodId: string) => {
		if (!changingMealType) return;

		try {
			// Call API to change meal
			const result = await foodService.changeTodayMeal(newFoodId);

			if (result.success) {
				// Record change in localStorage
				const mealChangeService = new MealChangeService();
				mealChangeService.recordMealChange(changingMealType, newFoodId);

				// Update changed meals state
				setChangedMeals([...changedMeals, changingMealType]);

				// Show success toast
				toast({
					title: "Meal changed successfully",
					description: `Your ${changingMealType} has been updated`,
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				// Close modal
				onChangeClose();

				// Refresh today's meals data
				await fetchTodayMeals();
			} else {
				toast({
					title: "Failed to change meal",
					description: result.error || "Please try again",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An error occurred while changing meal",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
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
											onClick={fetchTodayMeals}
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
										{/* Reset Menu Button */}
										<HStack justify="flex-end">
											<Button
												leftIcon={<Icon as={FiRefreshCw} />}
												colorScheme="purple"
												variant="outline"
												size="md"
												onClick={handleResetTodayMeals}
												isLoading={isLoading}
												_hover={{
													bg: "purple.50",
													transform: "translateY(-2px)",
													shadow: "md",
												}}
												transition="all 0.2s">
												Reset Today's Menu
											</Button>
										</HStack>
										{/* Today's Progress Card */}
										{!isLoadingProgress && progressData && (
											<Box
												bg="white"
												borderRadius="2xl"
												shadow="lg"
												border="1px solid"
												borderColor="purple.100"
												overflow="hidden">
												<Box
													bgGradient="linear(to-r, purple.500, pink.500)"
													p={4}>
													<HStack justify="space-between">
														<Text
															color="white"
															fontSize="lg"
															fontWeight="bold">
															Today's Progress
														</Text>
														<Badge
															colorScheme="whiteAlpha"
															fontSize="sm"
															px={3}
															py={1}
															bg="whiteAlpha.300">
															{
																progressData
																	.consumed
																	.calories
															}{" "}
															/{" "}
															{
																progressData.totalCalories
															}{" "}
															cal
														</Badge>
													</HStack>
												</Box>

												<Box p={6}>
													<VStack
														spacing={4}
														align="stretch">
														{/* Progress bars */}
														<SimpleGrid
															columns={{
																base: 1,
																md: 2,
															}}
															spacing={4}>
															{/* Protein */}
															<Box>
																<HStack
																	justify="space-between"
																	mb={2}>
																	<Text
																		fontSize="sm"
																		fontWeight="medium"
																		color="gray.600">
																		Protein
																	</Text>
																	<Text
																		fontSize="sm"
																		fontWeight="bold"
																		color="green.600">
																		{
																			progressData
																				.consumed
																				.protein
																		}
																		g /{" "}
																		{
																			progressData
																				.macroProfile
																				.protein
																		}
																		g
																	</Text>
																</HStack>
																<Box
																	h="8px"
																	bg="gray.200"
																	borderRadius="full"
																	overflow="hidden">
																	<Box
																		h="100%"
																		bg="green.500"
																		borderRadius="full"
																		width={`${Math.min(
																			(progressData
																				.consumed
																				.protein /
																				progressData
																					.macroProfile
																					.protein) *
																				100,
																			100,
																		)}%`}
																		transition="width 0.5s ease"
																	/>
																</Box>
															</Box>

															{/* Carbs */}
															<Box>
																<HStack
																	justify="space-between"
																	mb={2}>
																	<Text
																		fontSize="sm"
																		fontWeight="medium"
																		color="gray.600">
																		Carbs
																	</Text>
																	<Text
																		fontSize="sm"
																		fontWeight="bold"
																		color="blue.600">
																		{
																			progressData
																				.consumed
																				.carbs
																		}
																		g /{" "}
																		{
																			progressData
																				.macroProfile
																				.carb
																		}
																		g
																	</Text>
																</HStack>
																<Box
																	h="8px"
																	bg="gray.200"
																	borderRadius="full"
																	overflow="hidden">
																	<Box
																		h="100%"
																		bg="blue.500"
																		borderRadius="full"
																		width={`${Math.min(
																			(progressData
																				.consumed
																				.carbs /
																				progressData
																					.macroProfile
																					.carb) *
																				100,
																			100,
																		)}%`}
																		transition="width 0.5s ease"
																	/>
																</Box>
															</Box>

															{/* Fat */}
															<Box>
																<HStack
																	justify="space-between"
																	mb={2}>
																	<Text
																		fontSize="sm"
																		fontWeight="medium"
																		color="gray.600">
																		Fat
																	</Text>
																	<Text
																		fontSize="sm"
																		fontWeight="bold"
																		color="purple.600">
																		{
																			progressData
																				.consumed
																				.fat
																		}
																		g /{" "}
																		{
																			progressData
																				.macroProfile
																				.fat
																		}
																		g
																	</Text>
																</HStack>
																<Box
																	h="8px"
																	bg="gray.200"
																	borderRadius="full"
																	overflow="hidden">
																	<Box
																		h="100%"
																		bg="purple.500"
																		borderRadius="full"
																		width={`${Math.min(
																			(progressData
																				.consumed
																				.fat /
																				progressData
																					.macroProfile
																					.fat) *
																				100,
																			100,
																		)}%`}
																		transition="width 0.5s ease"
																	/>
																</Box>
															</Box>

															{/* Calories */}
															<Box>
																<HStack
																	justify="space-between"
																	mb={2}>
																	<Text
																		fontSize="sm"
																		fontWeight="medium"
																		color="gray.600">
																		Calories
																	</Text>
																	<Text
																		fontSize="sm"
																		fontWeight="bold"
																		color="orange.600">
																		{
																			progressData
																				.consumed
																				.calories
																		}{" "}
																		/{" "}
																		{
																			progressData.totalCalories
																		}
																	</Text>
																</HStack>
																<Box
																	h="8px"
																	bg="gray.200"
																	borderRadius="full"
																	overflow="hidden">
																	<Box
																		h="100%"
																		bg="orange.500"
																		borderRadius="full"
																		width={`${Math.min(
																			(progressData
																				.consumed
																				.calories /
																				progressData.totalCalories) *
																				100,
																			100,
																		)}%`}
																		transition="width 0.5s ease"
																	/>
																</Box>
															</Box>
														</SimpleGrid>

														{/* Remaining meals */}
														{progressData
															.remainingMeals
															.length > 0 && (
															<Box
																pt={4}
																borderTop="1px"
																borderColor="gray.200">
																<Text
																	fontSize="sm"
																	color="gray.600"
																	mb={2}
																	fontWeight="medium">
																	Remaining
																	Meals:
																</Text>
																<HStack
																	spacing={2}
																	flexWrap="wrap">
																	{progressData.remainingMeals.map(
																		(
																			meal,
																			index,
																		) => (
																			<Badge
																				key={
																					index
																				}
																				colorScheme="orange"
																				fontSize="sm"
																				px={
																					3
																				}
																				py={
																					1
																				}
																				borderRadius="full"
																				textTransform="capitalize">
																				{
																					meal
																				}
																			</Badge>
																		),
																	)}
																</HStack>
															</Box>
														)}
													</VStack>
												</Box>
											</Box>
										)}

										{/* Today's Detailed Menu */}
										<DayMenuView
											dailyMenu={todayMenu}
											onRecipeClick={handleRecipeClick}
											onLogFood={handleLogFood}
											onChangeMeal={handleChangeMeal}
											disabledMealChanges={changedMeals}
											remainingMeals={
												progressData?.remainingMeals ||
												[]
											}
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
												{/* Weekly Menu Grid - 2 Columns */}
												<SimpleGrid
													columns={{ base: 1, md: 2 }}
													spacing={4}>
													{weeklyMenu.map(
														(day, index) => (
															<Box
																key={index}
																opacity={0}
																animation={`fadeInUp 0.5s ease-out ${
																	index * 0.1
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
																	day={day}
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
				showSaveButton={true}
			/>

			{/* Change Meal Modal */}
			<ChangeMealModal
				isOpen={isChangeOpen}
				onClose={onChangeClose}
				mealType={changingMealType || "breakfast"}
				currentFoodId={currentFoodId}
				onConfirmChange={handleConfirmChange}
			/>
		</MainLayout>
	);
};

export default MenuSuggestionPage;
