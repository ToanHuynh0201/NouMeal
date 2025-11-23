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
		{ name: "Nam", value: demographics.genderDistribution.male },
		{ name: "Nữ", value: demographics.genderDistribution.female },
		{ name: "Khác", value: demographics.genderDistribution.other },
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
							Tổng Quan Hệ Thống
						</Heading>
						<Heading
							size="sm"
							fontWeight="normal"
							color="gray.500">
							Thống kê tổng quan về người dùng và nhân khẩu học
						</Heading>
					</Box>

					{/* Section 1: User Overview Stats */}
					<Box>
						<Heading
							size="md"
							mb={4}
							color="gray.700">
							📊 Tổng Quan Người Dùng
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
									title="Tổng số người dùng"
									value={userOverview.totalUsers}
									icon={FiUsers}
									colorScheme="blue"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Người dùng hoạt động"
									value={userOverview.activeUsers}
									helpText={`${(
										(userOverview.activeUsers /
											userOverview.totalUsers) *
										100
									).toFixed(1)}% tổng số`}
									icon={FiUserCheck}
									colorScheme="green"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Đăng nhập 24h"
									value={userOverview.loggedInLast24Hours}
									icon={FiClock}
									colorScheme="purple"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Đăng nhập 7 ngày"
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
							📈 Người Dùng Mới
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
									title="Hôm nay"
									value={userOverview.newUsersToday}
									icon={FiUserPlus}
									colorScheme="teal"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Tuần này"
									value={userOverview.newUsersThisWeek}
									icon={FiTrendingUp}
									colorScheme="cyan"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Tháng này"
									value={userOverview.newUsersThisMonth}
									icon={FiActivity}
									colorScheme="blue"
								/>
							</GridItem>
							<GridItem>
								<StatsCard
									title="Chưa xác minh email"
									value={userOverview.unverifiedEmails}
									helpText={`${(
										(userOverview.unverifiedEmails /
											userOverview.totalUsers) *
										100
									).toFixed(1)}% tổng số`}
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
							👥 Thống Kê Nhân Khẩu Học
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
									title="Phân Bố Giới Tính"
									data={genderData}
									colors={["#0073e6", "#ff69b4", "#9370db"]}
								/>
							</GridItem>
							<GridItem>
								<CustomBarChart
									title="Phân Bố Độ Tuổi"
									data={ageData}
									dataKey="value"
									xAxisKey="name"
									barName="Số người dùng"
									color="#0073e6"
								/>
							</GridItem>
						</Grid>

						{/* Height & Weight by Gender */}
						<Box mb={6}>
							<GroupedBarChart
								title="Chiều Cao & Cân Nặng Trung Bình Theo Giới"
								data={demographics.heightWeightByGender}
								bars={[
									{
										dataKey: "avgHeight",
										name: "Chiều cao (cm)",
										color: "#0073e6",
									},
									{
										dataKey: "avgWeight",
										name: "Cân nặng (kg)",
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
									title="Phân Bố Mục Tiêu"
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
									title="Phân Bố Mức Độ Hoạt Động"
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
