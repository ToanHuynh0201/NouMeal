// Admin Statistics Types

// 1. Tổng quan người dùng
export interface UserOverviewStats {
	totalUsers: number;
	newUsersToday: number;
	newUsersThisWeek: number;
	newUsersThisMonth: number;
	activeUsers: number;
	loggedInLast24Hours: number;
	loggedInLast7Days: number;
	unverifiedEmails: number;
}

// 2. Thống kê theo nhân khẩu học
export interface GenderDistribution {
	male: number;
	female: number;
	other: number;
}

export interface AgeDistribution {
	range: string;
	count: number;
	percentage: number;
}

export interface HeightWeightByGender {
	gender: string;
	avgHeight: number;
	avgWeight: number;
}

export interface GoalDistribution {
	goal: string;
	count: number;
	percentage: number;
}

export interface ActivityDistribution {
	activity: string;
	count: number;
	percentage: number;
}

export interface DemographicStats {
	genderDistribution: GenderDistribution;
	ageDistribution: AgeDistribution[];
	heightWeightByGender: HeightWeightByGender[];
	goalDistribution: GoalDistribution[];
	activityDistribution: ActivityDistribution[];
}

// Combined admin statistics
export interface AdminStatistics {
	userOverview: UserOverviewStats;
	demographics: DemographicStats;
}

// Chart data types
export interface PieChartData {
	name: string;
	value: number;
	color?: string;
	[key: string]: string | number | undefined;
}

export interface BarChartData {
	name: string;
	value: number;
	[key: string]: string | number;
}

export interface LineChartData {
	date: string;
	value: number;
}
