import { useState, useEffect, useCallback } from "react";
import { foodService } from "@/services";

export interface MacroProfile {
	protein: number;
	carb: number;
	fat: number;
}

export interface ConsumedNutrition {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface RemainingNutrition {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface TodayProgressData {
	totalCalories: number;
	macroProfile: MacroProfile;
	consumed: ConsumedNutrition;
	remaining: RemainingNutrition;
	remainingMeals: string[];
}

export interface UseTodayProgressReturn {
	data: TodayProgressData | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch today's nutrition progress
 */
export const useTodayProgress = (): UseTodayProgressReturn => {
	const [data, setData] = useState<TodayProgressData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTodayProgress = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const result = await foodService.getTodayProgress();

		if (result.success) {
			setData(result.data);
		} else {
			setError(result.error || "Failed to fetch today's progress");
		}

		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchTodayProgress();
	}, [fetchTodayProgress]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchTodayProgress,
	};
};
