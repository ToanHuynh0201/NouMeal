import type { MealType, MealChangeRecord, DailyMealChanges } from "@/types";
import { getStorageItem, setStorageItem } from "@/utils/storage";

const STORAGE_KEY_PREFIX = "meal_changes_";

/**
 * Service to track meal changes with 1-change-per-day limit
 */
export class MealChangeService {
	/**
	 * Get current date in YYYY-MM-DD format
	 */
	private getTodayKey(): string {
		return new Date().toISOString().split("T")[0];
	}

	/**
	 * Get storage key for today's changes
	 */
	private getStorageKey(): string {
		return `${STORAGE_KEY_PREFIX}${this.getTodayKey()}`;
	}

	/**
	 * Get today's meal changes from localStorage
	 */
	private getTodayChanges(): DailyMealChanges[string] {
		const key = this.getStorageKey();
		const defaultChanges: DailyMealChanges[string] = {
			breakfast: { changed: false },
			lunch: { changed: false },
			dinner: { changed: false },
			snack: { changed: false },
		};

		const storedData = getStorageItem(key, null);
		return storedData || defaultChanges;
	}

	/**
	 * Save today's meal changes to localStorage
	 */
	private saveTodayChanges(changes: DailyMealChanges[string]): void {
		const key = this.getStorageKey();
		setStorageItem(key, changes);
	}

	/**
	 * Check if it's a new day (different from last stored date)
	 */
	isNewDay(): boolean {
		const todayKey = this.getTodayKey();
		const allKeys = Object.keys(localStorage);
		const changeKeys = allKeys.filter((key) =>
			key.startsWith(STORAGE_KEY_PREFIX),
		);

		// If no change records exist, it's not a "new" day, just first time
		if (changeKeys.length === 0) {
			return false;
		}

		// Check if today's key exists
		const todayStorageKey = this.getStorageKey();
		const hasTodayKey = changeKeys.includes(todayStorageKey);

		// If today's key doesn't exist but other keys do, it's a new day
		return !hasTodayKey && changeKeys.length > 0;
	}

	/**
	 * Reset all daily change counters (called on new day)
	 */
	resetDailyChanges(): void {
		const allKeys = Object.keys(localStorage);
		const oldKeys = allKeys.filter(
			(key) =>
				key.startsWith(STORAGE_KEY_PREFIX) && key !== this.getStorageKey(),
		);

		// Remove old change records (keep only today)
		oldKeys.forEach((key) => {
			localStorage.removeItem(key);
		});
	}

	/**
	 * Check if a meal can be changed today
	 * @param mealType - The type of meal to check
	 * @returns true if the meal hasn't been changed today, false otherwise
	 */
	canChangeMeal(mealType: MealType): boolean {
		const todayChanges = this.getTodayChanges();
		return !todayChanges[mealType]?.changed;
	}

	/**
	 * Record a meal change
	 * @param mealType - The type of meal being changed
	 * @param foodId - The ID of the new food
	 */
	recordMealChange(mealType: MealType, foodId: string): void {
		const todayChanges = this.getTodayChanges();

		todayChanges[mealType] = {
			changed: true,
			foodId,
			changedAt: new Date().toISOString(),
		};

		this.saveTodayChanges(todayChanges);
	}

	/**
	 * Get the change record for a specific meal type today
	 * @param mealType - The type of meal
	 * @returns The change record or null if not changed
	 */
	getMealChangeRecord(mealType: MealType): MealChangeRecord | null {
		const todayChanges = this.getTodayChanges();
		const record = todayChanges[mealType];

		return record?.changed ? record : null;
	}

	/**
	 * Get all meals that have been changed today
	 * @returns Array of meal types that have been changed
	 */
	getChangedMeals(): MealType[] {
		const todayChanges = this.getTodayChanges();
		const changedMeals: MealType[] = [];

		(Object.keys(todayChanges) as MealType[]).forEach((mealType) => {
			if (todayChanges[mealType]?.changed) {
				changedMeals.push(mealType);
			}
		});

		return changedMeals;
	}
}
