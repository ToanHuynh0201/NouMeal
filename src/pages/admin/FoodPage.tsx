import {
	Box,
	Grid,
	GridItem,
	Heading,
	VStack,
	useColorModeValue,
	Spinner,
	Center,
	Text,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Badge,
	HStack,
	Card,
	CardHeader,
	CardBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { StatsCard, CustomPieChart } from "@/components/admin/overview";
import { adminService } from "@/services/adminService";
import {
	FiPackage,
	FiGrid,
	FiCoffee,
	FiTrendingUp,
	FiTrendingDown,
	FiAlertTriangle,
} from "react-icons/fi";
import type {
	PieChartData,
	FoodOverviewApiResponse,
	TopFoodsApiResponse,
} from "@/types";

const FoodPage = () => {
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const cardBg = useColorModeValue("white", "gray.800");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [foodData, setFoodData] = useState<FoodOverviewApiResponse | null>(
		null,
	);
	const [topFoodsData, setTopFoodsData] =
		useState<TopFoodsApiResponse | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch both food overview and top foods data in parallel
				const [overviewResponse, topFoodsResponse] = await Promise.all([
					adminService.getFoodOverview(),
					adminService.getTopFoods(),
				]);

				if (overviewResponse.success) {
					setFoodData(overviewResponse.data);
				} else {
					setError("Failed to load food overview data");
				}

				if (topFoodsResponse.success) {
					setTopFoodsData(topFoodsResponse.data);
				} else {
					setError("Failed to load top foods data");
				}
			} catch (err: any) {
				setError(
					err?.message || "An error occurred while fetching data",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Helper function to format category labels
	const formatCategoryLabel = (category: string): string => {
		const categoryMap: Record<string, string> = {
			protein: "Protein",
			carbs: "Carbohydrates",
			vegetable: "Vegetables",
			fruit: "Fruits",
			dairy: "Dairy",
			fat: "Fats & Oils",
			snack: "Snacks",
			beverage: "Beverages",
			null: "Not Specified",
			"": "Not Specified",
		};
		return categoryMap[category] || category || "Not Specified";
	};

	// Helper function to format meal labels
	const formatMealLabel = (meal: string): string => {
		const mealMap: Record<string, string> = {
			breakfast: "Breakfast",
			lunch: "Lunch",
			dinner: "Dinner",
			snack: "Snack",
			null: "Not Specified",
			"": "Not Specified",
		};
		return mealMap[meal] || meal || "Not Specified";
	};

	// Prepare data for charts
	const categoryData: PieChartData[] = foodData
		? foodData.byCategory.map((item) => ({
				name: formatCategoryLabel(item.category),
				value: item.count,
		  }))
		: [];

	const mealData: PieChartData[] = foodData
		? foodData.byMeal.map((item) => ({
				name: formatMealLabel(item.meal),
				value: item.count,
		  }))
		: [];

	// Loading state
	if (loading) {
		return (
			<MainLayout>
				<Center minH="100vh">
					<VStack spacing={4}>
						<Spinner
							size="xl"
							color="blue.500"
							thickness="4px"
						/>
						<Text
							fontSize="lg"
							color="gray.600">
							Loading food overview data...
						</Text>
					</VStack>
				</Center>
			</MainLayout>
		);
	}

	// Error state
	if (error) {
		return (
			<MainLayout>
				<Box
					p={8}
					minH="100vh">
					<Alert
						status="error"
						variant="subtle"
						flexDirection="column"
						alignItems="center"
						justifyContent="center"
						textAlign="center"
						minH="200px">
						<AlertIcon
							boxSize="40px"
							mr={0}
						/>
						<AlertTitle
							mt={4}
							mb={1}
							fontSize="lg">
							Failed to Load Data
						</AlertTitle>
						<AlertDescription maxWidth="sm">
							{error}
						</AlertDescription>
					</Alert>
				</Box>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<Box
				p={8}
				bg={bgColor}
				minH="100vh">
				<VStack
					spacing={{ base: 6, md: 8 }}
					align="stretch">
					{/* Header */}
					<Box>
						<Heading
							size="xl"
							mb={2}>
							Food Overview
						</Heading>
						<Heading
							size="sm"
							fontWeight="normal"
							color="gray.500">
							Statistics about food items in the system
						</Heading>
					</Box>

					{/* Total Foods Stats */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							📊 Food Statistics
						</Heading>
						<Grid
							templateColumns={{
								base: "1fr",
								md: "repeat(2, 1fr)",
								lg: "repeat(4, 1fr)",
							}}
							gap={6}>
							<GridItem>
								<StatsCard
									title="Total Foods"
									value={foodData?.total.total || 0}
									icon={FiPackage}
									colorScheme="blue"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Categories"
									value={foodData?.byCategory.length || 0}
									icon={FiGrid}
									colorScheme="purple"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Meal Types"
									value={foodData?.byMeal.length || 0}
									icon={FiCoffee}
									colorScheme="green"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="New This Month"
									value={
										foodData?.newPerMonth &&
										foodData.newPerMonth.length > 0
											? foodData.newPerMonth[
													foodData.newPerMonth
														.length - 1
											  ].count
											: 0
									}
									icon={FiTrendingUp}
									colorScheme="teal"
								/>
							</GridItem>
						</Grid>
					</Box>

					{/* Category and Meal Distribution */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							📈 Distribution by Category & Meal
						</Heading>
						<Grid
							templateColumns={{
								base: "1fr",
								lg: "repeat(2, 1fr)",
							}}
							mb={6}
							gap={6}>
							<GridItem>
								<CustomPieChart
									title="Food by Category"
									data={categoryData}
									colors={[
										"#ff6b6b",
										"#4ecdc4",
										"#45b7d1",
										"#f9ca24",
										"#6c5ce7",
										"#1dd1a1",
										"#ff9ff3",
										"#54a0ff",
									]}
								/>
							</GridItem>
							<GridItem>
								<CustomPieChart
									title="Food by Meal Type"
									data={mealData}
									colors={[
										"#feca57",
										"#48dbfb",
										"#ff6b6b",
										"#1dd1a1",
										"#5f27cd",
									]}
								/>
							</GridItem>
						</Grid>
					</Box>

					{/* Top Foods Section */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							🏆 Top Foods
						</Heading>

						<Grid
							templateColumns={{
								base: "1fr",
								md: "1fr",
								lg: "repeat(2, 1fr)",
							}}
							gap={6}>
							{/* Highest Calorie Foods */}
							<GridItem>
								<Card bg={cardBg}>
									<CardHeader pb={2}>
										<HStack spacing={2}>
											<Box
												as={FiTrendingUp}
												color="red.500"
												fontSize="xl"
											/>
											<Heading size="sm">
												Highest Calorie
											</Heading>
										</HStack>
									</CardHeader>
									<CardBody pt={2}>
										<TableContainer
											maxH={{
												base: "300px",
												md: "350px",
											}}
											maxW="80%%"
											overflowY="auto">
											<Table
												size="sm"
												variant="simple">
												<Thead
													position="sticky"
													top={0}
													bg={cardBg}
													zIndex={1}>
													<Tr>
														<Th>FOOD</Th>
														<Th isNumeric>
															CALORIES
														</Th>
													</Tr>
												</Thead>
												<Tbody>
													{topFoodsData?.highest.map(
														(food) => (
															<Tr key={food._id}>
																<Td>
																	<VStack
																		align="start"
																		spacing={
																			1
																		}>
																		<Text
																			fontWeight="medium"
																			fontSize="sm">
																			{
																				food.name
																			}
																		</Text>
																		{food
																			.allergens
																			.length >
																			0 && (
																			<HStack
																				spacing={
																					1
																				}
																				flexWrap="wrap">
																				{food.allergens.map(
																					(
																						allergen,
																					) => (
																						<Badge
																							key={
																								allergen
																							}
																							colorScheme="orange"
																							fontSize="xs">
																							{
																								allergen
																							}
																						</Badge>
																					),
																				)}
																			</HStack>
																		)}
																	</VStack>
																</Td>
																<Td
																	isNumeric
																	fontWeight="bold"
																	color="red.500">
																	{
																		food.calories
																	}
																</Td>
															</Tr>
														),
													)}
												</Tbody>
											</Table>
										</TableContainer>
									</CardBody>
								</Card>
							</GridItem>

							{/* Lowest Calorie Foods */}
							<GridItem>
								<Card
									bg={cardBg}
									h="100%">
									<CardHeader pb={2}>
										<HStack spacing={2}>
											<Box
												as={FiTrendingDown}
												color="green.500"
												fontSize="xl"
											/>
											<Heading size="sm">
												Lowest Calorie
											</Heading>
										</HStack>
									</CardHeader>
									<CardBody pt={2}>
										<TableContainer
											maxH={{
												base: "300px",
												md: "350px",
											}}
											overflowY="auto">
											<Table
												size="sm"
												variant="simple">
												<Thead
													position="sticky"
													top={0}
													bg={cardBg}
													zIndex={1}>
													<Tr>
														<Th>FOOD</Th>
														<Th isNumeric>
															CALORIES
														</Th>
													</Tr>
												</Thead>
												<Tbody>
													{topFoodsData?.lowest.map(
														(food) => (
															<Tr key={food._id}>
																<Td>
																	<VStack
																		align="start"
																		spacing={
																			1
																		}>
																		<Text
																			fontWeight="medium"
																			fontSize="sm">
																			{
																				food.name
																			}
																		</Text>
																		{food
																			.allergens
																			.length >
																			0 && (
																			<HStack
																				spacing={
																					1
																				}
																				flexWrap="wrap">
																				{food.allergens.map(
																					(
																						allergen,
																					) => (
																						<Badge
																							key={
																								allergen
																							}
																							colorScheme="orange"
																							fontSize="xs">
																							{
																								allergen
																							}
																						</Badge>
																					),
																				)}
																			</HStack>
																		)}
																	</VStack>
																</Td>
																<Td
																	isNumeric
																	fontWeight="bold"
																	color="green.500">
																	{
																		food.calories
																	}
																</Td>
															</Tr>
														),
													)}
												</Tbody>
											</Table>
										</TableContainer>
									</CardBody>
								</Card>
							</GridItem>

							{/* Most Allergens */}
							<GridItem>
								<Card
									bg={cardBg}
									h="100%">
									<CardHeader pb={2}>
										<HStack spacing={2}>
											<Box
												as={FiAlertTriangle}
												color="orange.500"
												fontSize="xl"
											/>
											<Heading size="sm">
												Most Allergens
											</Heading>
										</HStack>
									</CardHeader>
									<CardBody pt={2}>
										<TableContainer
											maxH={{
												base: "300px",
												md: "350px",
											}}
											overflowY="auto">
											<Table
												size="sm"
												variant="simple">
												<Thead
													position="sticky"
													top={0}
													bg={cardBg}
													zIndex={1}>
													<Tr>
														<Th>FOOD</Th>
														<Th isNumeric>COUNT</Th>
													</Tr>
												</Thead>
												<Tbody>
													{topFoodsData?.allergens.map(
														(food) => (
															<Tr key={food._id}>
																<Td>
																	<VStack
																		align="start"
																		spacing={
																			1
																		}>
																		<Text
																			fontWeight="medium"
																			fontSize="sm">
																			{
																				food.name
																			}
																		</Text>
																		<HStack
																			spacing={
																				1
																			}
																			flexWrap="wrap">
																			{food.allergens.map(
																				(
																					allergen,
																				) => (
																					<Badge
																						key={
																							allergen
																						}
																						colorScheme="red"
																						fontSize="xs">
																						{
																							allergen
																						}
																					</Badge>
																				),
																			)}
																		</HStack>
																	</VStack>
																</Td>
																<Td
																	isNumeric
																	fontWeight="bold"
																	color="orange.500">
																	{
																		food.allergensCount
																	}
																</Td>
															</Tr>
														),
													)}
												</Tbody>
											</Table>
										</TableContainer>
									</CardBody>
								</Card>
							</GridItem>
						</Grid>
					</Box>
				</VStack>
			</Box>
		</MainLayout>
	);
};

export default FoodPage;
