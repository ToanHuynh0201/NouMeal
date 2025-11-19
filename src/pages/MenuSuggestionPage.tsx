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
	useToast,
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
import DayHeader from "@/components/menu/DayHeader";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import { authService, foodService } from "@/services";
import type { Recipe, DailyMenu, FoodRecommendationResponse } from "@/types";
import { mockWeeklyMenu } from "@/data/mockData";
import { convertRecommendationsToDailyMenu } from "@/utils/food";

const MenuSuggestionPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
	const [selectedDayMenu, setSelectedDayMenu] = useState<DailyMenu | null>(
		null,
	);
	const headerSection = useScrollAnimation({ threshold: 0.1 });
	const toast = useToast();
	const user = authService.getCurrentUser();

	// State for food recommendations
	const [recommendations, setRecommendations] =
		useState<FoodRecommendationResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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

	// Fetch on component mount
	useEffect(() => {
		fetchRecommendations();
	}, []);

	// Convert API recommendations to DailyMenu format
	const todayMenu = useMemo(() => {
		if (!recommendations) return null;
		return convertRecommendationsToDailyMenu(recommendations);
	}, [recommendations]);

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
	const weeklyTotals = mockWeeklyMenu.reduce(
		(acc, day) => ({
			calories: acc.calories + day.totalCalories,
			protein: acc.protein + parseInt(day.totalProtein),
			carbs: acc.carbs + parseInt(day.totalCarbs),
			fat: acc.fat + parseInt(day.totalFat),
		}),
		{ calories: 0, protein: 0, carbs: 0, fat: 0 },
	);

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
						<UserProfileHeader userProfile={user} />
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

										{/* Refresh Button */}
										<HStack justify="flex-end">
											<Button
												size="sm"
												variant="outline"
												colorScheme="purple"
												leftIcon={
													<Icon as={FiRefreshCw} />
												}
												onClick={async () => {
													await fetchRecommendations();
													toast({
														title: "Menu refreshed",
														description:
															"Your daily menu has been updated.",
														status: "success",
														duration: 2000,
														isClosable: true,
														position: "top",
													});
												}}>
												Refresh Menu
											</Button>
										</HStack>

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
								<VStack
									spacing={6}
									align="stretch">
									{selectedDayMenu ? (
										// Detailed view for selected day
										<>
											{/* Back Button */}
											<Button
												leftIcon={
													<Icon as={FiArrowLeft} />
												}
												variant="ghost"
												colorScheme="purple"
												alignSelf="flex-start"
												onClick={() =>
													setSelectedDayMenu(null)
												}
												mb={2}>
												Back to Weekly Overview
											</Button>

											{/* Selected Day Header */}
											<DayHeader
												dayMenu={selectedDayMenu}
												formatDate={formatDate}
											/>

											{/* Detailed Menu View */}
											<DayMenuView
												dailyMenu={selectedDayMenu}
												onRecipeClick={
													handleRecipeClick
												}
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
												totalCarbs={weeklyTotals.carbs}
												totalFat={weeklyTotals.fat}
											/>

											{/* Weekly Menu Cards */}
											<SimpleGrid
												columns={{
													base: 1,
													md: 2,
													lg: 3,
												}}
												spacing={6}>
												{mockWeeklyMenu.map(
													(day, index) => (
														<WeeklyMenuCard
															key={index}
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
													),
												)}
											</SimpleGrid>
										</>
									)}
								</VStack>
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
