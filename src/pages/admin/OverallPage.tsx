import {
	Box,
	Grid,
	GridItem,
	Heading,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import MainLayout from "@/components/layout/MainLayout";
import {
	StatsCard,
	CustomPieChart,
	CustomBarChart,
	GroupedBarChart,
} from "@/components/admin/overview";
import { mockAdminStatistics } from "@/mocks/adminData";
import {
	FiUsers,
	FiUserPlus,
	FiUserCheck,
	FiActivity,
	FiClock,
	FiCalendar,
	FiMail,
	FiTrendingUp,
} from "react-icons/fi";
import type { PieChartData, BarChartData } from "@/types";

const OverallPage = () => {
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const { userOverview, demographics } = mockAdminStatistics;

	// Prepare data for charts
	const genderData: PieChartData[] = [
		{ name: "Male", value: demographics.genderDistribution.male },
		{ name: "Female", value: demographics.genderDistribution.female },
		{ name: "Other", value: demographics.genderDistribution.other },
	];

	const ageData: BarChartData[] = demographics.ageDistribution.map(
		(item) => ({
			name: item.range,
			value: item.count,
			percentage: item.percentage,
		}),
	);

	const goalData: PieChartData[] = demographics.goalDistribution.map(
		(item) => ({
			name: item.goal,
			value: item.count,
		}),
	);

	const activityData: PieChartData[] = demographics.activityDistribution.map(
		(item) => ({
			name: item.activity,
			value: item.count,
		}),
	);

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
									helpText={`${(
										(userOverview.activeUsers /
											userOverview.totalUsers) *
										100
									).toFixed(1)}% of total`}
									icon={FiUserCheck}
									colorScheme="green"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Logged in Last 24h"
									value={userOverview.loggedInLast24Hours}
									icon={FiClock}
									colorScheme="purple"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Logged in Last 7 Days"
									value={userOverview.loggedInLast7Days}
									icon={FiCalendar}
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
							📈 New Users
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
									colorScheme="red"
								/>
							</GridItem>
						</Grid>
					</Box>

					{/* Section 2: Demographics */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							👥 Demographics Statistics
						</Heading>

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
								data={demographics.heightWeightByGender}
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
							gap={6}>
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
									height={350}
								/>
							</GridItem>
						</Grid>
					</Box>
				</VStack>
			</Box>
		</MainLayout>
	);
};

export default OverallPage;
