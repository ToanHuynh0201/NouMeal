import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import LoggedFoodCard from "@/components/dashboard/LoggedFoodCard";
import { useAuth } from "@/hooks/useAuth";
import { useTodayProgress } from "@/hooks/useTodayProgress";
import { foodService } from "@/services/foodService";
import type { PopulatedFoodLog } from "@/types";
import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	SimpleGrid,
	Card,
	CardBody,
	Icon,
	Badge,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Progress,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import {
	FaAppleAlt,
	FaFire,
	FaChartLine,
	FaBullseye,
	FaUtensils,
	FaHeart,
} from "react-icons/fa";

function DashboardPage() {
	const { user } = useAuth();
	const { data: progressData, isLoading, error } = useTodayProgress();
	const [todayFoodLogs, setTodayFoodLogs] = useState<PopulatedFoodLog[]>([]);
	const [foodLogsLoading, setFoodLogsLoading] = useState(true);

	// Fetch today's food logs
	useEffect(() => {
		const fetchTodayFoodLogs = async () => {
			try {
				setFoodLogsLoading(true);
				const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
				const response = await foodService.getFoodLogsByDate(today);
				if (response.success && response.data) {
					setTodayFoodLogs(response.data);
				}
			} catch (err) {
				console.error("Failed to fetch today's food logs:", err);
			} finally {
				setFoodLogsLoading(false);
			}
		};

		fetchTodayFoodLogs();
	}, []);

	// Calculate stats from API data
	const stats = progressData
		? [
				{
					label: "Calories Today",
					value: progressData.consumed.calories.toLocaleString(),
					goal: progressData.totalCalories.toLocaleString(),
					icon: FaFire,
					color: "orange.500",
					progress: Math.round(
						(progressData.consumed.calories /
							progressData.totalCalories) *
							100,
					),
				},
				{
					label: "Protein",
					value: `${progressData.consumed.protein}g`,
					goal: `${progressData.macroProfile.protein}g`,
					icon: FaAppleAlt,
					color: "green.500",
					progress: Math.round(
						(progressData.consumed.protein /
							progressData.macroProfile.protein) *
							100,
					),
				},
				{
					label: "Carbs",
					value: `${progressData.consumed.carbs}g`,
					goal: `${progressData.macroProfile.carb}g`,
					icon: FaHeart,
					color: "blue.500",
					progress: Math.round(
						(progressData.consumed.carbs /
							progressData.macroProfile.carb) *
							100,
					),
				},
				{
					label: "Fat",
					value: `${progressData.consumed.fat}g`,
					goal: `${progressData.macroProfile.fat}g`,
					icon: FaUtensils,
					color: "purple.500",
					progress: Math.round(
						(progressData.consumed.fat /
							progressData.macroProfile.fat) *
							100,
					),
				},
			]
		: [];

	// Get remaining meals count
	const remainingMealsCount = progressData?.remainingMeals.length || 0;
	const totalMeals = 4; // breakfast, lunch, dinner, snack
	const mealsLogged = totalMeals - remainingMealsCount;

	// Show loading state
	if (isLoading) {
		return (
			<MainLayout
				showHeader={true}
				showSidebar={true}>
				<Container
					maxW="7xl"
					py={8}>
					<LoadingSpinner />
				</Container>
			</MainLayout>
		);
	}

	// Show error state
	if (error) {
		return (
			<MainLayout
				showHeader={true}
				showSidebar={true}>
				<Container
					maxW="7xl"
					py={8}>
					<Alert
						status="error"
						variant="subtle"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						textAlign="center"
						height="200px"
						borderRadius="xl">
						<AlertIcon
							boxSize="40px"
							mr={0}
						/>
						<AlertTitle
							mt={4}
							mb={1}
							fontSize="lg">
							Failed to load progress data
						</AlertTitle>
						<AlertDescription maxWidth="sm">
							{error}
						</AlertDescription>
					</Alert>
				</Container>
			</MainLayout>
		);
	}

	return (
		<MainLayout
			showHeader={true}
			showSidebar={true}>
			<Container
				maxW="7xl"
				py={8}>
				<VStack
					spacing={8}
					align="stretch">
					{/* Welcome Section */}
					<Box>
						<Heading
							size="xl"
							mb={2}>
							Welcome back, {user?.name || "User"}! 👋
						</Heading>
						<Text
							color="gray.600"
							fontSize="lg">
							Here's your nutrition overview for today
						</Text>
					</Box>

					{/* Stats Grid */}
					<SimpleGrid
						columns={{ base: 1, md: 2, lg: 4 }}
						spacing={6}>
						{stats.map((stat, index) => (
							<Card
								key={index}
								shadow="md"
								borderRadius="xl"
								border="1px"
								borderColor="gray.100"
								_hover={{
									shadow: "lg",
									transform: "translateY(-2px)",
								}}
								transition="all 0.2s">
								<CardBody>
									<VStack
										align="stretch"
										spacing={4}>
										<HStack justify="space-between">
											<Box
												p={3}
												bg={`${
													stat.color.split(".")[0]
												}.50`}
												borderRadius="lg">
												<Icon
													as={stat.icon}
													boxSize={6}
													color={stat.color}
												/>
											</Box>
											<Badge
												colorScheme={
													stat.progress >= 80
														? "green"
														: stat.progress >= 50
															? "yellow"
															: "red"
												}>
												{stat.progress}%
											</Badge>
										</HStack>
										<Stat>
											<StatLabel color="gray.600">
												{stat.label}
											</StatLabel>
											<StatNumber fontSize="2xl">
												{stat.value}
											</StatNumber>
											<StatHelpText mb={2}>
												of {stat.goal}
											</StatHelpText>
											<Progress
												value={stat.progress}
												size="sm"
												colorScheme={
													stat.color.split(".")[0]
												}
												borderRadius="full"
											/>
										</Stat>
									</VStack>
								</CardBody>
							</Card>
						))}
					</SimpleGrid>

					{/* Today's Progress Summary */}
					<Card
						shadow="md"
						borderRadius="xl"
						border="1px"
						borderColor="gray.100">
						<CardBody>
							<VStack
								align="stretch"
								spacing={6}>
								<HStack justify="space-between">
									<Heading size="md">
										Today's Progress
									</Heading>
									<Badge
										colorScheme="purple"
										fontSize="sm"
										px={3}
										py={1}>
										{mealsLogged} / {totalMeals} meals
										logged
									</Badge>
								</HStack>

								<VStack
									align="stretch"
									spacing={4}>
									{/* Remaining Meals Section */}
									{progressData &&
									progressData.remainingMeals.length > 0 ? (
										<Box>
											<Text
												fontSize="sm"
												color="gray.600"
												mb={3}
												fontWeight="medium">
												Remaining Meals:
											</Text>
											<HStack
												spacing={2}
												flexWrap="wrap">
												{progressData.remainingMeals.map(
													(meal, index) => (
														<Badge
															key={index}
															colorScheme="orange"
															fontSize="sm"
															px={3}
															py={1}
															borderRadius="full"
															textTransform="capitalize">
															{meal}
														</Badge>
													),
												)}
											</HStack>
										</Box>
									) : (
										<Box
											py={8}
											textAlign="center"
											color="green.600"
											bg="green.50"
											borderRadius="lg">
											<Icon
												as={FaUtensils}
												boxSize={10}
												mb={3}
											/>
											<Text
												fontWeight="semibold"
												fontSize="lg">
												All meals logged for today! 🎉
											</Text>
										</Box>
									)}

									{/* Nutrition Summary */}
									{progressData && (
										<Box
											pt={4}
											borderTop="1px"
											borderColor="gray.200">
											<Text
												fontSize="sm"
												color="gray.600"
												mb={3}
												fontWeight="medium">
												Remaining Nutrition:
											</Text>
											<SimpleGrid
												columns={{ base: 2, md: 4 }}
												spacing={4}>
												<Card
													bg="orange.50"
													borderRadius="lg">
													<CardBody p={3}>
														<VStack spacing={1}>
															<Text
																fontSize="xs"
																color="gray.600">
																Calories
															</Text>
															<Text
																fontSize="lg"
																fontWeight="bold"
																color="orange.600">
																{Math.round(
																	progressData
																		.remaining
																		.calories,
																)}
															</Text>
														</VStack>
													</CardBody>
												</Card>
												<Card
													bg="green.50"
													borderRadius="lg">
													<CardBody p={3}>
														<VStack spacing={1}>
															<Text
																fontSize="xs"
																color="gray.600">
																Protein
															</Text>
															<Text
																fontSize="lg"
																fontWeight="bold"
																color="green.600">
																{
																	progressData
																		.remaining
																		.protein
																}
																g
															</Text>
														</VStack>
													</CardBody>
												</Card>
												<Card
													bg="blue.50"
													borderRadius="lg">
													<CardBody p={3}>
														<VStack spacing={1}>
															<Text
																fontSize="xs"
																color="gray.600">
																Carbs
															</Text>
															<Text
																fontSize="lg"
																fontWeight="bold"
																color="blue.600">
																{
																	progressData
																		.remaining
																		.carbs
																}
																g
															</Text>
														</VStack>
													</CardBody>
												</Card>
												<Card
													bg="purple.50"
													borderRadius="lg">
													<CardBody p={3}>
														<VStack spacing={1}>
															<Text
																fontSize="xs"
																color="gray.600">
																Fat
															</Text>
															<Text
																fontSize="lg"
																fontWeight="bold"
																color="purple.600">
																{
																	progressData
																		.remaining
																		.fat
																}
																g
															</Text>
														</VStack>
													</CardBody>
												</Card>
											</SimpleGrid>
										</Box>
									)}
								</VStack>
							</VStack>
						</CardBody>
					</Card>

					{/* Today's Meals */}
					<Card
						shadow="md"
						borderRadius="xl"
						border="1px"
						borderColor="gray.100">
						<CardBody>
							<VStack
								align="stretch"
								spacing={4}>
								<HStack justify="space-between">
									<Heading size="md">Today's Meals</Heading>
									<Badge
										colorScheme="blue"
										fontSize="sm"
										px={3}
										py={1}>
										{todayFoodLogs.length} items logged
									</Badge>
								</HStack>

								{foodLogsLoading ? (
									<Box
										py={8}
										textAlign="center">
										<LoadingSpinner />
									</Box>
								) : todayFoodLogs.length > 0 ? (
									<VStack
										align="stretch"
										spacing={3}>
										{todayFoodLogs.map((foodLog) => (
											<LoggedFoodCard
												key={foodLog._id}
												foodLog={foodLog}
											/>
										))}
									</VStack>
								) : (
									<Box
										py={8}
										textAlign="center"
										color="gray.500"
										bg="gray.50"
										borderRadius="lg">
										<Icon
											as={FaUtensils}
											boxSize={10}
											mb={3}
										/>
										<Text
											fontWeight="semibold"
											fontSize="lg">
											No meals logged yet today
										</Text>
										<Text
											fontSize="sm"
											color="gray.400"
											mt={1}>
											Start tracking your nutrition by
											logging your first meal!
										</Text>
									</Box>
								)}
							</VStack>
						</CardBody>
					</Card>

					{/* Quick Actions */}
					<SimpleGrid
						columns={{ base: 1, md: 2 }}
						spacing={6}>
						<Card
							shadow="md"
							borderRadius="xl"
							border="1px"
							borderColor="gray.100"
							bg="gradient.to-br"
							bgGradient="linear(to-br, purple.50, pink.50)"
							cursor="pointer"
							_hover={{
								shadow: "lg",
								transform: "translateY(-2px)",
							}}
							transition="all 0.2s">
							<CardBody>
								<HStack spacing={4}>
									<Box
										p={4}
										bg="purple.100"
										borderRadius="xl">
										<Icon
											as={FaBullseye}
											boxSize={8}
											color="purple.600"
										/>
									</Box>
									<VStack
										align="start"
										spacing={1}>
										<Heading
											size="sm"
											color="purple.900">
											Get AI Recommendations
										</Heading>
										<Text
											fontSize="sm"
											color="purple.700">
											Let AI suggest your next meal
										</Text>
									</VStack>
								</HStack>
							</CardBody>
						</Card>

						<Card
							shadow="md"
							borderRadius="xl"
							border="1px"
							borderColor="gray.100"
							bg="gradient.to-br"
							bgGradient="linear(to-br, green.50, teal.50)"
							cursor="pointer"
							_hover={{
								shadow: "lg",
								transform: "translateY(-2px)",
							}}
							transition="all 0.2s">
							<CardBody>
								<HStack spacing={4}>
									<Box
										p={4}
										bg="green.100"
										borderRadius="xl">
										<Icon
											as={FaChartLine}
											boxSize={8}
											color="green.600"
										/>
									</Box>
									<VStack
										align="start"
										spacing={1}>
										<Heading
											size="sm"
											color="green.900">
											View Progress
										</Heading>
										<Text
											fontSize="sm"
											color="green.700">
											Track your nutrition journey
										</Text>
									</VStack>
								</HStack>
							</CardBody>
						</Card>
					</SimpleGrid>
				</VStack>
			</Container>
		</MainLayout>
	);
}

export default DashboardPage;
