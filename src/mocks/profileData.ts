import type {UserProfile, DailyTracking, WeeklyStats} from "@/types/profile";

export const mockUserProfile: UserProfile = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+84 123 456 789",
    dateOfBirth: "1995-05-15",
    gender: "male",

    // Health Information
    height: 175, // cm
    weight: 75, // kg
    targetWeight: 70, // kg
    activityLevel: "moderate",
    healthGoal: "lose",

    // Dietary Information
    dietaryPreferences: ["vegetarian"],
    allergens: ["Peanuts", "Shellfish"],

    // Tracking Goals
    caloriesGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatsGoal: 65,
    waterGoal: 2500,
};

// Generate last 7 days of tracking data
const generateDailyTracking = (): DailyTracking[] => {
    const data: DailyTracking[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        data.push({
            date: date.toISOString().split("T")[0],
            calories: Math.floor(1800 + Math.random() * 400),
            protein: Math.floor(120 + Math.random() * 60),
            carbs: Math.floor(180 + Math.random() * 40),
            fats: Math.floor(50 + Math.random() * 30),
            water: Math.floor(2000 + Math.random() * 1000),
            weight: 75 - i * 0.2 + Math.random() * 0.5,
        });
    }

    return data;
};

// Generate last 4 weeks of stats
const generateWeeklyStats = (): WeeklyStats[] => {
    const data: WeeklyStats[] = [];

    for (let i = 3; i >= 0; i--) {
        data.push({
            week: `Week ${4 - i}`,
            avgCalories: Math.floor(1900 + Math.random() * 200),
            avgProtein: Math.floor(130 + Math.random() * 40),
            avgCarbs: Math.floor(190 + Math.random() * 30),
            avgFats: Math.floor(60 + Math.random() * 20),
            avgWater: Math.floor(2200 + Math.random() * 600),
            avgWeight: 75.5 - i * 0.5,
        });
    }

    return data;
};

export const mockDailyTracking = generateDailyTracking();
export const mockWeeklyStats = generateWeeklyStats();

// BMI Calculation
export const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
};

// BMR Calculation (Mifflin-St Jeor Equation)
export const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: "male" | "female" | "other"
): number => {
    if (gender === "male") {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};
