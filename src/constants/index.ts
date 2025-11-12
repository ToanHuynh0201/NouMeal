/**
 * Application constants
 * Centralized location for all application constants
 */
// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};

export const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
};

// Auth Configuration
export const AUTH_CONFIG = {
    TOKEN_STORAGE_KEY: "access_token",
    REFRESH_TOKEN_STORAGE_KEY: "refresh_token",
    USER_STORAGE_KEY: "user",
    REQUIRED_ROLE: ROLES.ADMIN,
};

// Route Paths
export const ROUTES = {
    LOGIN: "/login",
    HOME: "/home",
    ROOT: "/",
};

// Form Validation
export const VALIDATION = {
    EMAIL_MAX_LENGTH: 254,
    PASSWORD_MAX_LENGTH: 128,
    STRONG_PASSWORD_MIN_LENGTH: 8,
    NAME_MAX_LENGTH: 100,
    PASSWORD_PATTERN:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
};

// Error Codes from Backend
export const ERROR_CODES = {
    BAD_REQUEST: "BAD_REQUEST",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    CONFLICT: "CONFLICT",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    INTERNAL_ERROR: "INTERNAL_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    UNAUTHORIZED: "You are not authorized to access this resource.",
    FORBIDDEN: "Access denied. Administrator privileges required.",
    SERVER_ERROR: "Server error. Please try again later.",
    VALIDATION_FAILED: "Please check your input and try again.",
    LOGIN_FAILED: "Invalid email or password. Please try again.",
    GENERIC_ERROR: "Something went wrong. Please try again.",
    BAD_REQUEST: "Invalid request. Please check your input and try again.",
    NOT_FOUND: "The requested resource was not found.",
    CONFLICT: "There was a conflict with your request. Please try again.",
    TOO_MANY_REQUESTS: "Too many requests. Please wait a moment and try again.",
    SERVICE_UNAVAILABLE:
        "Service is temporarily unavailable. Please try again later.",
    INTERNAL_ERROR: "An internal error occurred. Please try again later.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
    DATA_SAVED: "Data saved successfully!",
    ACTION_COMPLETED: "Action completed successfully!",
};

// User Options
export const ACTIVITY_LEVELS = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "lightly_active", label: "Lightly active (1-3 days/week)" },
    { value: "moderately_active", label: "Moderately active (3-5 days/week)" },
    { value: "very_active", label: "Very active (6-7 days/week)" },
    { value: "extra_active", label: "Extra active (intense daily exercise)" },
];

export const GOALS = [
    { value: "lose_weight", label: "Lose weight" },
    { value: "maintain_weight", label: "Maintain weight" },
    { value: "gain_weight", label: "Gain weight" },
    { value: "build_muscle", label: "Build muscle" },
    { value: "improve_health", label: "Improve health" },
];

export const GENDERS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

export const ALLERGIES = [
    { value: "peanuts", label: "Peanuts" },
    { value: "tree_nuts", label: "Tree nuts" },
    { value: "milk", label: "Milk" },
    { value: "eggs", label: "Eggs" },
    { value: "wheat_gluten", label: "Wheat/Gluten" },
    { value: "fish", label: "Fish" },
    { value: "shellfish", label: "Shellfish" },
    { value: "soy", label: "Soy" },
    { value: "corn", label: "Corn" },
    { value: "sesame", label: "Sesame" },
    { value: "pineapple", label: "Pineapple" },
    { value: "strawberry", label: "Strawberry" },
    { value: "banana", label: "Banana" },
    { value: "tomato", label: "Tomato" },
    { value: "apple", label: "Apple" },
    { value: "chocolate", label: "Chocolate" },
    { value: "honey", label: "Honey" },
    { value: "mustard", label: "Mustard" },
    { value: "other", label: "Other" },
];

export default {
    API_CONFIG,
    AUTH_CONFIG,
    ROUTES,
    VALIDATION,
    ERROR_CODES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ROLES,
    ACTIVITY_LEVELS,
    GOALS,
    GENDERS,
    ALLERGIES,
};
