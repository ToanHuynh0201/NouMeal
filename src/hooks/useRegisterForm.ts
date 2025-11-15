import {registerSchema} from "@/lib/validationSchemas";
import useFormValidation from "./useFormValidation";
import {VALIDATION_MODES} from "@/constants/forms";
import {useCallback, useState} from "react";
import {authService} from "@/services/authService";
import type {UserRegistrationRequest} from "@/types";

export const useRegisterForm = (
    onSuccess: (email: string, name: string) => void,
    options: any = {}
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting, isValid},
    hasError,
    getError,
    reset,
    setValue,
    } = useFormValidation(
        registerSchema,
        {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: undefined,
            gender: "",
            height: undefined,
            weight: undefined,
            activity: "",
            goal: "",
            preferences: [],
            allergies: [],
            agreeToTerms: false,
        },
        {
            mode: options.validationMode || VALIDATION_MODES.onChange,
            ...options.formOptions,
        }
    );

    const onSubmit = useCallback(
        async (data: any) => {
            try {
                setIsLoading(true);
                setError(null);

                // Prepare registration payload according to API specification
                const registrationData: UserRegistrationRequest = {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    age: Number(data.age),
                    gender: data.gender,
                    height: Number(data.height),
                    weight: Number(data.weight),
                    activity: data.activity,
                    goal: data.goal,
                    preferences: data.preferences || [],
                    allergies: data.allergies || [],
                };

                console.log("Sending registration data:", registrationData);

                // Call register API
                // Note: Backend will send OTP email automatically
                const response = await authService.register(registrationData);

                console.log("Registration successful:", response);

                // Reset form after successful registration
                reset();
                
                // Call success callback with email and name for verification step
                onSuccess(data.email, data.name);
            } catch (err: any) {
                const errorMessage =
                    err.message ||
                    err.error?.details ||
                    "Registration failed. Please try again.";
                setError(errorMessage);
                console.error("Registration error:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [reset, onSuccess]
    );

    const clearError = () => setError(null);

    const hasFormErrors = Object.keys(errors).length > 0 && !isValid;

    return {
        isLoading: isLoading || isSubmitting,
        isValid,
        hasFormErrors,
        error,
        errors,
        register,
        setValue,
        handleSubmit: handleSubmit(onSubmit),
        hasError,
        getError,
        clearError,
        reset,
    };
};
