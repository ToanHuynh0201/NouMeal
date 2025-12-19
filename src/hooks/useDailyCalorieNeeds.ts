import { useState, useEffect } from "react";
import { authService } from "@/services";
import { calculateDailyCalorieNeeds } from "@/utils";
import type { DailyCalorieNeeds } from "@/types/profile";

interface UseDailyCalorieNeedsReturn {
	data: DailyCalorieNeeds | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

/**
 * Custom hook to calculate and manage daily calorie needs data from user profile
 * @returns {UseDailyCalorieNeedsReturn} Hook state and methods
 */
export const useDailyCalorieNeeds = (): UseDailyCalorieNeedsReturn => {
	const [data, setData] = useState<DailyCalorieNeeds | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const calculateCalorieNeeds = () => {
		setIsLoading(true);
		setError(null);

		try {
			const user = authService.getCurrentUser();

			if (!user) {
				setError("User not found. Please login.");
				setIsLoading(false);
				return;
			}

			// Calculate calorie needs from user profile
			const calorieNeeds = calculateDailyCalorieNeeds(user);
			setData(calorieNeeds);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to calculate daily calorie needs",
			);
		}

		setIsLoading(false);
	};

	useEffect(() => {
		calculateCalorieNeeds();
	}, []);

	return {
		data,
		isLoading,
		error,
		refetch: calculateCalorieNeeds,
	};
};

export default useDailyCalorieNeeds;
