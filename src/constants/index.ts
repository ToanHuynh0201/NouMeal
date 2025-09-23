/**
 * Application constants
 * Centralized location for all application constants
 */
// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    LOCATION_URL:
        import.meta.env.VITE_API_LOCATION_URL || "http://localhost:3030/api",
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};

export const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
};

export const VERIFICATION_STATUS = {
    VERIFIED: "VERIFIED",
    UNVERIFIED: "UNVERIFIED",
};
export const ENTITY_STATUSES = {
    ACTIVE: "ACTIVE",
    DELETED: "DELETED",
    BANNED: "BANNED",
};

export const USER_STATUSES = {
    ACTIVE: ENTITY_STATUSES.ACTIVE,
    DELETED: ENTITY_STATUSES.DELETED,
    BANNED: ENTITY_STATUSES.BANNED,
};

export const POST_STATUSES = {
    ACTIVE: ENTITY_STATUSES.ACTIVE,
    DELETED: ENTITY_STATUSES.DELETED,
};

export const GROUP_VISIBILITY = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
};

// Report Configuration
export const ENTITY_TYPES = {
    POST: "POST",
    COMMENT: "COMMENT",
    USER: "USER",
    GROUP: "GROUP",
    OTHER: "OTHER",
};

export const REPORT_REASONS = {
    SPAM: "SPAM",
    FAKE: "FAKE",
    INAPPROPRIATE_CONTENT: "INAPPROPRIATE_CONTENT",
    IDENTITY_BASED_HATE: "IDENTITY_BASED_HATE",
    UNDERAGE: "UNDERAGE",
    JUST_NOT_INTERESTED: "JUST_NOT_INTERESTED",
    OTHER: "OTHER",
};

export const REPORT_STATUSES = {
    PENDING: "PENDING",
    RESOLVED: "RESOLVED",
    DISMISSED: "DISMISSED",
};

// OTA Update Configuration
export const OTA_PLATFORMS = {
    IOS: "IOS",
    ANDROID: "ANDROID",
};

export const OTA_STATUSES = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
};

// Auth Configuration
export const AUTH_CONFIG = {
    TOKEN_STORAGE_KEY: "lifebff_access_token",
    REFRESH_TOKEN_STORAGE_KEY: "lifebff_refresh_token",
    USER_STORAGE_KEY: "lifebff_user",
    REQUIRED_ROLE: ROLES.ADMIN,
};

// Route Paths
export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    USERS: "/users",
    GROUPS: "/groups",
    POSTS: "/posts",
    REPORTS: "/reports",
    BROADCAST: "/broadcast",
    MAP: "/map",
    OTA: "/ota",
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

export default {
    API_CONFIG,
    AUTH_CONFIG,
    ROUTES,
    VALIDATION,
    ERROR_CODES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ROLES,
    VERIFICATION_STATUS,
    ENTITY_STATUSES,
    USER_STATUSES,
    POST_STATUSES,
    GROUP_VISIBILITY,
    ENTITY_TYPES,
    REPORT_REASONS,
    REPORT_STATUSES,
    OTA_PLATFORMS,
    OTA_STATUSES,
};
