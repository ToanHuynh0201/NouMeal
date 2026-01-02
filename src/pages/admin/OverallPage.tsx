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
	SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
	StatsCard,
	CustomPieChart,
	CustomBarChart,
	GroupedBarChart,
} from "@/components/admin/overview";
import { adminService } from "@/services/adminService";
import {
	FiUsers,
	FiUserPlus,
	FiUserCheck,
	FiActivity,
	FiMail,
	FiTrendingUp,
} from "react-icons/fi";
import type {
	PieChartData,
	BarChartData,
	AdminOverviewApiResponse,
	AdminDemographicsApiResponse,
	UserOverviewStats,
} from "@/types";

const OverallPage = () => {
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [overviewData, setOverviewData] =
		useState<AdminOverviewApiResponse | null>(null);
	const [demographicsData, setDemographicsData] =
		useState<AdminDemographicsApiResponse | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch both overview and demographics data in parallel
				const [overviewResponse, demographicsResponse] =
					await Promise.all([
						adminService.getOverview(),
						adminService.getDemographics(),
					]);

				if (overviewResponse.success) {
					setOverviewData(overviewResponse.data);
				} else {
					setError("Failed to load overview data");
				}

				if (demographicsResponse.success) {
					setDemographicsData(demographicsResponse.data);
				} else {
					setError("Failed to load demographics data");
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

	// Calculate stats from API data
	const userOverview: UserOverviewStats = overviewData
		? {
				totalUsers: overviewData.totalUsers.totalUsers,
				activeUsers: overviewData.activeSummary.active,
				newUsersToday:
					overviewData.newUsersSeries.length > 0
						? overviewData.newUsersSeries[
								overviewData.newUsersSeries.length - 1
						  ].count
						: 0,
				newUsersThisWeek: overviewData.newUsersSeries
					.slice(-7)
					.reduce((sum, item) => sum + item.count, 0),
				newUsersThisMonth: overviewData.newUsersSeries.reduce(
					(sum, item) => sum + item.count,
					0,
				),
				unverifiedEmails: overviewData.unverified.unverified,
				loggedInLast24Hours: 0, // Not provided by API
				loggedInLast7Days: 0, // Not provided by API
		  }
		: {
				totalUsers: 0,
				activeUsers: 0,
				newUsersToday: 0,
				newUsersThisWeek: 0,
				newUsersThisMonth: 0,
				unverifiedEmails: 0,
				loggedInLast24Hours: 0,
				loggedInLast7Days: 0,
		  };

	// Helper function to format gender labels
	const formatGenderLabel = (gender: string): string => {
		const genderMap: Record<string, string> = {
			male: "Male",
			female: "Female",
			other: "Other",
			null: "Not Specified",
			"": "Not Specified",
		};
		return genderMap[gender] || gender || "Not Specified";
	};

	// Helper function to format goal labels
	const formatGoalLabel = (goal: string): string => {
		const goalMap: Record<string, string> = {
			lose_weight: "Lose Weight",
			maintain_weight: "Maintain Weight",
			gain_weight: "Gain Weight",
			build_muscle: "Build Muscle",
			improve_health: "Improve Health",
			null: "Not Specified",
			"": "Not Specified",
		};
		return goalMap[goal] || goal || "Not Specified";
	};

	// Helper function to format activity labels
	const formatActivityLabel = (activity: string): string => {
		const activityMap: Record<string, string> = {
			sedentary: "Sedentary",
			lightly_active: "Lightly Active",
			moderately_active: "Moderately Active",
			very_active: "Very Active",
			extra_active: "Extra Active",
			null: "Not Specified",
			"": "Not Specified",
		};
		return activityMap[activity] || activity || "Not Specified";
	};

	// Prepare data for charts from API response
	const genderData: PieChartData[] = demographicsData
		? demographicsData.gender.breakdown.map((item) => ({
				name: formatGenderLabel(item.gender),
				value: item.count,
				percentage: item.percent,
		  }))
		: [];

	const ageData: BarChartData[] = demographicsData
		? demographicsData.age.breakdown.map((item) => ({
				name: item.bucket,
				value: item.count,
				percentage: item.percent,
		  }))
		: [];

	const heightWeightData = demographicsData
		? demographicsData.avgHeightWeightByGender.map((item) => ({
				gender: formatGenderLabel(item.gender),
				avgHeight: item.avgHeight,
				avgWeight: item.avgWeight,
				count: item.count,
		  }))
		: [];

	const goalData: PieChartData[] = demographicsData
		? demographicsData.goals.breakdown.map((item) => ({
				name: formatGoalLabel(item.goal),
				value: item.count,
				percentage: item.percent,
		  }))
		: [];

	const activityData: PieChartData[] = demographicsData
		? demographicsData.activities.breakdown.map((item) => ({
				name: formatActivityLabel(item.activity),
				value: item.count,
				percentage: item.percent,
		  }))
		: [];

	const allergyData: PieChartData[] = demographicsData
		? demographicsData.allergies.breakdown.map((item) => ({
				name: item.allergy || "Not Specified",
				value: item.count,
				percentage: item.percent,
		  }))
		: [];

	const newUsersChartData: BarChartData[] = overviewData
		? overviewData.newUsersSeries.map((item) => ({
				name: new Date(item.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
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
							Loading overview data...
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
					spacing={8}
					align="stretch">
					{/* Header */}
					<Box>
						<Heading
							size="xl"
							mb={2}>
							System Overview
						</Heading>
						<Heading
							size="sm"
							fontWeight="normal"
							color="gray.500">
							General statistics about users and demographics
						</Heading>
					</Box>

					{/* Section 1: User Overview Stats */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							📊 User Overview
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
									title="Total Users"
									value={userOverview.totalUsers}
									icon={FiUsers}
									colorScheme="blue"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Active Users"
									value={userOverview.activeUsers}
									helpText={`${
										overviewData?.activeSummary
											.activePercent || 0
									}% of total`}
									icon={FiUserCheck}
									colorScheme="green"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Unverified Emails"
									value={userOverview.unverifiedEmails}
									helpText={`${(
										(userOverview.unverifiedEmails /
											userOverview.totalUsers) *
										100
									).toFixed(1)}% of total`}
									icon={FiMail}
									colorScheme="orange"
								/>
							</GridItem>
						</Grid>
					</Box>

					{/* New Users Stats */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							📈 New Users Registration
						</Heading>
						<Grid
							templateColumns={{
								base: "1fr",
								md: "repeat(2, 1fr)",
								lg: "repeat(3, 1fr)",
							}}
							gap={6}
							mb={6}>
							<GridItem>
								<StatsCard
									title="Today"
									value={userOverview.newUsersToday}
									icon={FiUserPlus}
									colorScheme="teal"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="This Week"
									value={userOverview.newUsersThisWeek}
									icon={FiTrendingUp}
									colorScheme="cyan"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="This Month"
									value={userOverview.newUsersThisMonth}
									icon={FiActivity}
									colorScheme="blue"
								/>
							</GridItem>
						</Grid>
						<CustomBarChart
							title="New Users Over Time"
							data={newUsersChartData}
							dataKey="value"
							xAxisKey="name"
							barName="New Users"
							color="#0073e6"
						/>
					</Box>

					{/* Section 2: Demographics */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							👥 Demographics Statistics
						</Heading>

						{/* Summary Stats */}
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 4 }}
							spacing={6}
							mb={6}>
							<StatsCard
								title="Total Gender Records"
								value={demographicsData?.gender.total || 0}
								icon={FiUsers}
								colorScheme="purple"
							/>
							<StatsCard
								title="Total Age Records"
								value={demographicsData?.age.total || 0}
								icon={FiActivity}
								colorScheme="blue"
							/>
							<StatsCard
								title="Total Goal Records"
								value={demographicsData?.goals.total || 0}
								icon={FiTrendingUp}
								colorScheme="green"
							/>
							<StatsCard
								title="Total Activity Records"
								value={demographicsData?.activities.total || 0}
								icon={FiUserCheck}
								colorScheme="cyan"
							/>
						</SimpleGrid>

						{/* Gender and Age Distribution */}
						<Grid
							templateColumns={{
								base: "1fr",
								lg: "repeat(2, 1fr)",
							}}
							gap={6}
							mb={6}>
							<GridItem>
								<CustomPieChart
									title="Gender Distribution"
									data={genderData}
									colors={["#0073e6", "#ff69b4", "#9370db"]}
								/>
							</GridItem>
							<GridItem>
								<CustomBarChart
									title="Age Distribution"
									data={ageData}
									dataKey="value"
									xAxisKey="name"
									barName="Number of users"
									color="#0073e6"
								/>
							</GridItem>
						</Grid>

						{/* Height & Weight by Gender */}
						<Box mb={6}>
							<GroupedBarChart
								title="Average Height & Weight by Gender"
								data={heightWeightData}
								bars={[
									{
										dataKey: "avgHeight",
										name: "Height (cm)",
										color: "#0073e6",
									},
									{
										dataKey: "avgWeight",
										name: "Weight (kg)",
										color: "#00a8e6",
									},
									{
										dataKey: "count",
										name: "Sample Size",
										color: "#ff6b6b",
									},
								]}
								xAxisKey="gender"
								height={300}
							/>
						</Box>

						{/* Goal and Activity Distribution */}
						<Grid
							templateColumns={{
								base: "1fr",
								lg: "repeat(2, 1fr)",
							}}
							gap={6}
							mb={6}>
							<GridItem>
								<CustomPieChart
									title="Goal Distribution"
									data={goalData}
									colors={[
										"#ff6b6b",
										"#4ecdc4",
										"#45b7d1",
										"#f9ca24",
										"#6c5ce7",
									]}
									height={400}
								/>
							</GridItem>
							<GridItem>
								<CustomPieChart
									title="Activity Level Distribution"
									data={activityData}
									colors={[
										"#ff6b6b",
										"#feca57",
										"#48dbfb",
										"#1dd1a1",
										"#5f27cd",
									]}
									height={400}
								/>
							</GridItem>
						</Grid>

						{/* Allergy Distribution */}
						<Box>
							<CustomPieChart
								title="Allergy Distribution"
								data={allergyData}
								colors={[
									"#e74c3c",
									"#3498db",
									"#2ecc71",
									"#f39c12",
									"#9b59b6",
									"#1abc9c",
									"#e67e22",
									"#34495e",
								]}
								height={400}
							/>
							{demographicsData && (
								<Text
									mt={2}
									fontSize="sm"
									color="gray.600"
									textAlign="center">
									Total allergy records:{" "}
									{demographicsData.allergies.total}
								</Text>
							)}
						</Box>
					</Box>
				</VStack>
			</Box>
		</MainLayout>
	);
};

export default OverallPage;
