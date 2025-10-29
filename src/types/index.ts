export * from "./layout";
export * from "./props";

// Auth Types
export interface UserRegistrationRequest {
    email: string;
    password: string;
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    height: number;
    weight: number;
    goal:
        | "lose_weight"
        | "maintain_weight"
        | "gain_weight"
        | "build_muscle"
        | "improve_health";
    preferences?: string[];
    allergies?: string[];
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    email: string;
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    height: number;
    weight: number;
    goal:
        | "lose_weight"
        | "maintain_weight"
        | "gain_weight"
        | "build_muscle"
        | "improve_health";
    preferences?: string[];
    allergies?: string[];
    favoriteFoods?: string[];
    isActive: boolean;
    role?: string;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    data?: {
        user: User;
        accessToken?: string;
        refreshToken?: string;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    status?: string;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    error?: {
        details?: string;
    };
}
