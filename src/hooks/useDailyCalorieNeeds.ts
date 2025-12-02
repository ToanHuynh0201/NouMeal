import { useState, useEffect } from "react";
import { userService } from "@/services";
import type { DailyCalorieNeeds } from "@/types/profile";

interface UseDailyCalorieNeedsReturn {
	data: DailyCalorieNeeds | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage daily calorie needs data
 * @returns {UseDailyCalorieNeedsReturn} Hook state and methods
 */
export const useDailyCalorieNeeds = (): UseDailyCalorieNeedsReturn => {
	const [data, setData] = useState<DailyCalorieNeeds | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDailyCalorieNeeds = async () => {
		setIsLoading(true);
		setError(null);

		const result = await userService.getDailyCalorieNeeds();

		if (result.success) {
			setData(result.data);
		} else {
			setError(result.error || "Failed to fetch daily calorie needs");
		}

		setIsLoading(false);
	};

	useEffect(() => {
		fetchDailyCalorieNeeds();
	}, []);

	return {
		data,
		isLoading,
		error,
		refetch: fetchDailyCalorieNeeds,
	};
};

export default useDailyCalorieNeeds;
