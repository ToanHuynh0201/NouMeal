import type { AdminStatistics } from "../types";

// Mock data for admin statistics
export const mockAdminStatistics: AdminStatistics = {
	userOverview: {
		totalUsers: 1247,
		newUsersToday: 23,
		newUsersThisWeek: 156,
		newUsersThisMonth: 542,
		activeUsers: 1089,
		loggedInLast24Hours: 342,
		loggedInLast7Days: 876,
		unverifiedEmails: 158,
	},
	demographics: {
		genderDistribution: {
			male: 567,
			female: 623,
			other: 57,
		},
		ageDistribution: [
			{ range: "13-18", count: 124, percentage: 9.9 },
			{ range: "18-25", count: 387, percentage: 31.0 },
			{ range: "25-35", count: 456, percentage: 36.6 },
			{ range: "35-50", count: 198, percentage: 15.9 },
			{ range: "50+", count: 82, percentage: 6.6 },
		],
		heightWeightByGender: [
			{ gender: "Nam", avgHeight: 172.5, avgWeight: 68.3 },
			{ gender: "Nữ", avgHeight: 160.2, avgWeight: 55.7 },
			{ gender: "Khác", avgHeight: 165.8, avgWeight: 61.5 },
		],
		goalDistribution: [
			{ goal: "Giảm cân", count: 487, percentage: 39.1 },
			{ goal: "Duy trì", count: 298, percentage: 23.9 },
			{ goal: "Tăng cân", count: 156, percentage: 12.5 },
			{ goal: "Tăng cơ", count: 187, percentage: 15.0 },
			{ goal: "Cải thiện sức khỏe", count: 119, percentage: 9.5 },
		],
		activityDistribution: [
			{ activity: "Ít vận động", count: 342, percentage: 27.4 },
			{ activity: "Nhẹ", count: 456, percentage: 36.6 },
			{ activity: "Trung bình", count: 298, percentage: 23.9 },
			{ activity: "Nặng", count: 112, percentage: 9.0 },
			{ activity: "Rất nặng", count: 39, percentage: 3.1 },
		],
	},
};
