import {
	Box,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Grid,
	GridItem,
	Heading,
	HStack,
	Progress,
	Stat,
	StatGroup,
	StatLabel,
	StatNumber,
	StatHelpText,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	VStack,
	Icon,
	Alert,
	AlertIcon,
} from "@chakra-ui/react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import {
	FaFire,
	FaDrumstickBite,
	FaBreadSlice,
	FaOilCan,
} from "react-icons/fa";
import { animationPresets } from "@/styles/animation";
import { useTodayProgress } from "@/hooks/useTodayProgress";
import { useTimeseries } from "@/hooks/useTimeseries";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useMemo } from "react";

const TrackingSection = () => {
	const { data: progressData, isLoading, error } = useTodayProgress();

	// Memoize params to prevent infinite loop
	const dailyParams = useMemo(() => {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
		return {
			startDate: sevenDaysAgo.toISOString().split("T")[0],
			endDate: new Date().toISOString().split("T")[0],
			groupBy: "day" as const,
		};
	}, []);

	const weeklyParams = useMemo(() => {
		const fourWeeksAgo = new Date();
		fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
		return {
			startDate: fourWeeksAgo.toISOString().split("T")[0],
			endDate: new Date().toISOString().split("T")[0],
			groupBy: "week" as const,
		};
	}, []);

	// Fetch last 7 days data for daily tracking
	const { data: dailyData, isLoading: isDailyLoading } =
		useTimeseries(dailyParams);

	// Fetch last 4 weeks data for weekly tracking
	const { data: weeklyData, isLoading: isWeeklyLoading } =
		useTimeseries(weeklyParams);

	// Show loading state
	if (isLoading || isDailyLoading || isWeeklyLoading) {
		return <LoadingSpinner />;
	}

	// Show error state
	if (error) {
		return (
			<Alert status="error">
				<AlertIcon />
				{error}
			</Alert>
		);
	}

	// Show message if no data
	if (!progressData) {
		return (
			<Alert status="info">
				<AlertIcon />
				No tracking data available
			</Alert>
		);
	}

	const todayProgress = {
		calories:
			(progressData.consumed.calories / progressData.totalCalories) * 100,
		protein:
			(progressData.consumed.protein /
				progressData.macroProfile.protein) *
			100,
		carbs:
			(progressData.consumed.carbs / progressData.macroProfile.carb) *
			100,
		fats: (progressData.consumed.fat / progressData.macroProfile.fat) * 100,
	};

	const macroDistribution = [
		{
			name: "Protein",
			value: progressData.consumed.protein,
			color: "#3182CE",
		},
		{ name: "Carbs", value: progressData.consumed.carbs, color: "#38A169" },
		{ name: "Fats", value: progressData.consumed.fat, color: "#D69E2E" },
	];

	// Transform daily data for charts
	const dailyChartData = dailyData.map((item) => ({
		date: item.date,
		calories: item.calories,
		protein: item.protein,
		carbs: item.carb,
		fats: item.fat,
	}));

	// Transform weekly data for charts
	const weeklyChartData = weeklyData.map((item, index) => ({
		week: `Week ${index + 1}`,
		avgCalories: item.calories,
		avgProtein: item.protein,
		avgCarbs: item.carb,
		avgFats: item.fat,
	}));

	const NutrientProgress = ({
		label,
		current,
		goal,
		icon,
		color,
	}: {
		label: string;
		current: number;
		goal: number;
		icon: any;
		color: string;
	}) => (
		<Box>
			<HStack
				justify="space-between"
				mb={2}>
				<HStack spacing={2}>
					<Icon
						as={icon}
						color={color}
					/>
					<Text
						fontWeight="semibold"
						fontSize="sm">
						{label}
					</Text>
				</HStack>
				<Text
					fontSize="sm"
					color="gray.600">
					{current} / {goal}
				</Text>
			</HStack>
			<Progress
				value={(current / goal) * 100}
				colorScheme={color.split(".")[0]}
				borderRadius="full"
				size="sm"
			/>
		</Box>
	);

	return (
		<VStack
			spacing={6}
			align="stretch">
			{/* Today's Progress Card */}
			<Card animation={animationPresets.fadeIn}>
				<CardHeader>
					<Heading size="md">Today's Progress</Heading>
					<Text
						fontSize="sm"
						color="gray.600"
						mt={1}>
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</Text>
				</CardHeader>
				<Divider />
				<CardBody>
					<VStack
						spacing={4}
						align="stretch">
						<NutrientProgress
							label="Calories"
							current={progressData.consumed.calories}
							goal={progressData.totalCalories}
							icon={FaFire}
							color="orange.500"
						/>
						<NutrientProgress
							label="Protein"
							current={progressData.consumed.protein}
							goal={progressData.macroProfile.protein}
							icon={FaDrumstickBite}
							color="blue.500"
						/>
						<NutrientProgress
							label="Carbs"
							current={progressData.consumed.carbs}
							goal={progressData.macroProfile.carb}
							icon={FaBreadSlice}
							color="green.500"
						/>
						<NutrientProgress
							label="Fats"
							current={progressData.consumed.fat}
							goal={progressData.macroProfile.fat}
							icon={FaOilCan}
							color="yellow.500"
						/>
					</VStack>
				</CardBody>
			</Card>

			{/* Nutrition Overview */}
			<Card animation={animationPresets.fadeIn}>
				<CardHeader>
					<Heading size="md">Nutrition Overview</Heading>
				</CardHeader>
				<Divider />
				<CardBody>
					<StatGroup>
						<Stat>
							<StatLabel>Total Calories</StatLabel>
							<StatNumber>
								{progressData.consumed.calories.toLocaleString()}
							</StatNumber>
							<StatHelpText>
								{Math.round(todayProgress.calories)}% of goal
							</StatHelpText>
						</Stat>

						<Stat>
							<StatLabel>Protein</StatLabel>
							<StatNumber>
								{progressData.consumed.protein}g
							</StatNumber>
							<StatHelpText>
								{progressData.consumed.protein * 4} cal
							</StatHelpText>
						</Stat>

						<Stat>
							<StatLabel>Carbs</StatLabel>
							<StatNumber>
								{progressData.consumed.carbs}g
							</StatNumber>
							<StatHelpText>
								{progressData.consumed.carbs * 4} cal
							</StatHelpText>
						</Stat>

						<Stat>
							<StatLabel>Fats</StatLabel>
							<StatNumber>
								{progressData.consumed.fat}g
							</StatNumber>
							<StatHelpText>
								{progressData.consumed.fat * 9} cal
							</StatHelpText>
						</Stat>
					</StatGroup>
				</CardBody>
			</Card>

			{/* Charts Section */}
			<Card animation={animationPresets.fadeIn}>
				<CardHeader>
					<Heading size="md">Tracking Charts</Heading>
				</CardHeader>
				<Divider />
				<CardBody>
					<Tabs
						variant="enclosed"
						colorScheme="blue">
						<TabList>
							<Tab>Daily Tracking</Tab>
							<Tab>Weekly Average</Tab>
							<Tab>Macro Distribution</Tab>
						</TabList>

						<TabPanels>
							{/* Daily Tracking Tab */}
							<TabPanel>
								<VStack
									spacing={8}
									align="stretch">
									{/* Calories Chart */}
									<Box>
										<Text
											fontWeight="semibold"
											mb={4}>
											Daily Calories (Last 7 Days)
										</Text>
										<ResponsiveContainer
											width="100%"
											height={250}>
											<LineChart data={dailyChartData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis
													dataKey="date"
													tickFormatter={(date) =>
														new Date(
															date,
														).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
															},
														)
													}
												/>
												<YAxis />
												<Tooltip
													labelFormatter={(date) =>
														new Date(
															date,
														).toLocaleDateString()
													}
												/>
												<Legend />
												<Line
													type="monotone"
													dataKey="calories"
													stroke="#F6AD55"
													strokeWidth={3}
													name="Calories"
												/>
											</LineChart>
										</ResponsiveContainer>
									</Box>

									{/* Macros Chart */}
									<Box>
										<Text
											fontWeight="semibold"
											mb={4}>
											Daily Macronutrients (Last 7 Days)
										</Text>
										<ResponsiveContainer
											width="100%"
											height={250}>
											<BarChart data={dailyChartData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis
													dataKey="date"
													tickFormatter={(date) =>
														new Date(
															date,
														).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
															},
														)
													}
												/>
												<YAxis />
												<Tooltip
													labelFormatter={(date) =>
														new Date(
															date,
														).toLocaleDateString()
													}
												/>
												<Legend />
												<Bar
													dataKey="protein"
													fill="#3182CE"
													name="Protein (g)"
												/>
												<Bar
													dataKey="carbs"
													fill="#38A169"
													name="Carbs (g)"
												/>
												<Bar
													dataKey="fats"
													fill="#D69E2E"
													name="Fats (g)"
												/>
											</BarChart>
										</ResponsiveContainer>
									</Box>
								</VStack>
							</TabPanel>

							{/* Weekly Average Tab */}
							<TabPanel>
								<VStack
									spacing={8}
									align="stretch">
									{/* Weekly Calories */}
									<Box>
										<Text
											fontWeight="semibold"
											mb={4}>
											Weekly Average Calories
										</Text>
										<ResponsiveContainer
											width="100%"
											height={250}>
											<BarChart data={weeklyChartData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="week" />
												<YAxis />
												<Tooltip />
												<Legend />
												<Bar
													dataKey="avgCalories"
													fill="#F6AD55"
													name="Avg Calories"
												/>
											</BarChart>
										</ResponsiveContainer>
									</Box>

									{/* Weekly Macros */}
									<Box>
										<Text
											fontWeight="semibold"
											mb={4}>
											Weekly Average Macronutrients
										</Text>
										<ResponsiveContainer
											width="100%"
											height={250}>
											<LineChart data={weeklyChartData}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="week" />
												<YAxis />
												<Tooltip />
												<Legend />
												<Line
													type="monotone"
													dataKey="avgProtein"
													stroke="#3182CE"
													strokeWidth={2}
													name="Avg Protein (g)"
												/>
												<Line
													type="monotone"
													dataKey="avgCarbs"
													stroke="#38A169"
													strokeWidth={2}
													name="Avg Carbs (g)"
												/>
												<Line
													type="monotone"
													dataKey="avgFats"
													stroke="#D69E2E"
													strokeWidth={2}
													name="Avg Fats (g)"
												/>
											</LineChart>
										</ResponsiveContainer>
									</Box>
								</VStack>
							</TabPanel>

							{/* Macro Distribution Tab */}
							<TabPanel>
								<Grid
									templateColumns={{
										base: "1fr",
										lg: "repeat(2, 1fr)",
									}}
									gap={8}>
									<GridItem>
										<Box>
											<Text
												fontWeight="semibold"
												mb={4}
												textAlign="center">
												Today's Macro Distribution
											</Text>
											<ResponsiveContainer
												width="100%"
												height={300}>
												<PieChart>
													<Pie
														data={macroDistribution}
														cx="50%"
														cy="50%"
														labelLine={false}
														label={({
															name,
															percent,
														}) =>
															`${name}: ${(
																Number(
																	percent,
																) * 100
															).toFixed(0)}%`
														}
														outerRadius={100}
														fill="#8884d8"
														dataKey="value">
														{macroDistribution.map(
															(entry, index) => (
																<Cell
																	key={`cell-${index}`}
																	fill={
																		entry.color
																	}
																/>
															),
														)}
													</Pie>
													<Tooltip />
												</PieChart>
											</ResponsiveContainer>
										</Box>
									</GridItem>

									<GridItem>
										<VStack
											spacing={4}
											align="stretch"
											justify="center"
											h="full">
											<Heading
												size="sm"
												mb={2}>
												Macro Breakdown
											</Heading>
											{macroDistribution.map((macro) => (
												<Box key={macro.name}>
													<HStack
														justify="space-between"
														mb={2}>
														<HStack>
															<Box
																w={4}
																h={4}
																bg={macro.color}
																borderRadius="sm"
															/>
															<Text fontWeight="medium">
																{macro.name}
															</Text>
														</HStack>
														<Text color="gray.600">
															{macro.value}g (
															{macro.value *
																(macro.name ===
																"Fats"
																	? 9
																	: 4)}{" "}
															cal)
														</Text>
													</HStack>
													<Progress
														value={
															(macro.value /
																(progressData
																	.consumed
																	.protein +
																	progressData
																		.consumed
																		.carbs +
																	progressData
																		.consumed
																		.fat)) *
															100
														}
														colorScheme={
															macro.color.split(
																".",
															)[0]
														}
														size="sm"
														borderRadius="full"
													/>
												</Box>
											))}

											<Divider my={2} />

											<Box>
												<HStack justify="space-between">
													<Text fontWeight="bold">
														Total
													</Text>
													<Text fontWeight="bold">
														{progressData.consumed
															.protein +
															progressData
																.consumed
																.carbs +
															progressData
																.consumed.fat}
														g (
														{
															progressData
																.consumed
																.calories
														}{" "}
														cal)
													</Text>
												</HStack>
											</Box>
										</VStack>
									</GridItem>
								</Grid>
							</TabPanel>
						</TabPanels>
					</Tabs>
				</CardBody>
			</Card>
		</VStack>
	);
};

export default TrackingSection;
