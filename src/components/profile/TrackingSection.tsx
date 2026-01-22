import {
	Box,
	Card,
	CardBody,
	CardHeader,
	Divider,
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
		const today = new Date();
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

		// Format dates using local timezone (YYYY-MM-DD)
		const formatLocalDate = (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		};

		const params = {
			startDate: formatLocalDate(sevenDaysAgo),
			endDate: formatLocalDate(today),
			groupBy: "day" as const,
		};
		return params;
	}, []);

	const weeklyParams = useMemo(() => {
		const today = new Date();
		const fourWeeksAgo = new Date();
		fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

		// Format dates using local timezone (YYYY-MM-DD)
		const formatLocalDate = (date: Date) => {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		};

		const params = {
			startDate: formatLocalDate(fourWeeksAgo),
			endDate: formatLocalDate(today),
			groupBy: "week" as const,
		};
		return params;
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
						</TabPanels>
					</Tabs>
				</CardBody>
			</Card>
		</VStack>
	);
};

export default TrackingSection;
