// Profile related constants
export const PROFILE_TABS = {
    USER_INFO: "user-info",
    TRACKING: "tracking",
} as const;

export const ACTIVITY_LEVELS = [
    {
        value: "sedentary",
        label: "Sedentary (little or no exercise)",
        multiplier: 1.2,
    },
    {value: "light", label: "Light (exercise 1-3 days/week)", multiplier: 1.375},
    {
        value: "moderate",
        label: "Moderate (exercise 3-5 days/week)",
        multiplier: 1.55,
    },
    {value: "active", label: "Active (exercise 6-7 days/week)", multiplier: 1.725},
    {
        value: "very-active",
        label: "Very Active (intense exercise daily)",
        multiplier: 1.9,
    },
];

export const DIETARY_PREFERENCES = [
    {value: "none", label: "No Restrictions"},
    {value: "vegetarian", label: "Vegetarian"},
    {value: "vegan", label: "Vegan"},
    {value: "pescatarian", label: "Pescatarian"},
    {value: "gluten-free", label: "Gluten-Free"},
    {value: "dairy-free", label: "Dairy-Free"},
    {value: "keto", label: "Keto"},
    {value: "paleo", label: "Paleo"},
];

export const HEALTH_GOALS = [
    {value: "maintain", label: "Maintain Weight", icon: "⚖️"},
    {value: "lose", label: "Lose Weight", icon: "📉"},
    {value: "gain", label: "Gain Weight", icon: "📈"},
    {value: "muscle", label: "Build Muscle", icon: "💪"},
    {value: "health", label: "Improve Health", icon: "❤️"},
];

export const ALLERGENS = [
    "Peanuts",
    "Tree Nuts",
    "Milk",
    "Eggs",
    "Fish",
    "Shellfish",
    "Soy",
    "Wheat",
    "Sesame",
];

export default {
    PROFILE_TABS,
    ACTIVITY_LEVELS,
    DIETARY_PREFERENCES,
    HEALTH_GOALS,
    ALLERGENS,
};
