// Admin Statistics Types

// API Response Types
export interface AdminOverviewApiResponse {
	totalUsers: {
		totalUsers: number;
	};
	newUsersSeries: Array<{
		date: string;
		count: number;
	}>;
	activeSummary: {
		total: number;
		active: number;
		activePercent: number;
	};
	unverified: {
		unverified: number;
	};
}

export interface AdminOverviewResponse {
	success: boolean;
	data: AdminOverviewApiResponse;
}

// Demographics API Response Types
export interface AdminDemographicsApiResponse {
	gender: {
		total: number;
		breakdown: Array<{
			gender: string;
			count: number;
			percent: number;
		}>;
	};
	age: {
		total: number;
		breakdown: Array<{
			bucket: string;
			count: number;
			percent: number;
		}>;
	};
	avgHeightWeightByGender: Array<{
		gender: string;
		avgHeight: number;
		avgWeight: number;
		count: number;
	}>;
	goals: {
		total: number;
		breakdown: Array<{
			goal: string;
			count: number;
			percent: number;
		}>;
	};
	activities: {
		total: number;
		breakdown: Array<{
			activity: string;
			count: number;
			percent: number;
		}>;
	};
	allergies: {
		total: number;
		breakdown: Array<{
			allergy: string;
			count: number;
			percent: number;
		}>;
	};
}

export interface AdminDemographicsResponse {
	success: boolean;
	data: AdminDemographicsApiResponse;
}

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

// Food Overview API Response Types
export interface FoodOverviewApiResponse {
	total: {
		total: number;
	};
	byCategory: Array<{
		category: string;
		count: number;
	}>;
	byMeal: Array<{
		meal: string;
		count: number;
	}>;
	newPerMonth: Array<{
		date: string;
		count: number;
	}>;
}

export interface FoodOverviewResponse {
	success: boolean;
	data: FoodOverviewApiResponse;
}

// Top Foods API Response Types
export interface TopFoodItem {
	_id: string;
	name: string;
	calories: number;
	allergens: string[];
}

export interface TopFoodWithAllergensCount extends TopFoodItem {
	allergensCount: number;
}

export interface TopFoodsApiResponse {
	highest: TopFoodItem[];
	lowest: TopFoodItem[];
	allergens: TopFoodWithAllergensCount[];
}

export interface TopFoodsResponse {
	success: boolean;
	data: TopFoodsApiResponse;
}
