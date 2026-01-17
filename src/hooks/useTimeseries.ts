import { useState, useEffect, useCallback, useRef } from "react";
import { userService, type TimeseriesParams } from "@/services/userService";

export interface TimeseriesDataPoint {
	date: string; // ISO format
	calories: number;
	protein: number;
	carb: number;
	fat: number;
	pct: {
		protein: number;
		carbs: number;
		fat: number;
	};
}

export interface UseTimeseriesReturn {
	data: TimeseriesDataPoint[];
	isLoading: boolean;
	error: string | null;
	refetch: (params?: TimeseriesParams) => Promise<void>;
}

/**
 * Custom hook to fetch timeseries nutrition data
 * @param initialParams - Initial query parameters
 */
export const useTimeseries = (
	initialParams: TimeseriesParams = {},
): UseTimeseriesReturn => {
	const [data, setData] = useState<TimeseriesDataPoint[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const paramsRef = useRef(initialParams);

	// Update ref when params change
	useEffect(() => {
		paramsRef.current = initialParams;
	}, [initialParams]);

	const fetchTimeseries = useCallback(
		async (params?: TimeseriesParams) => {
			setIsLoading(true);
			setError(null);

			const queryParams = params || paramsRef.current;

			const result = await userService.getTimeseries(queryParams);

			if (result.success && result.data) {
				setData(result.data);
			} else {
				setError(result.error || "Failed to fetch timeseries data");
				setData([]);
			}

			setIsLoading(false);
		},
		[], // No dependencies - use ref instead
	);

	useEffect(() => {
		fetchTimeseries();
	}, [fetchTimeseries]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchTimeseries,
	};
};
