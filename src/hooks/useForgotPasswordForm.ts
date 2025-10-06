import {forgotPasswordSchema} from "@/lib/validationSchemas";
import useFormValidation from "./useFormValidation";
import {VALIDATION_MODES} from "@/constants/forms";
import {useCallback, useState} from "react";

export const useForgotPasswordForm = (onSuccess: () => void, options: any = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isValid},
        hasError,
        getError,
        reset,
    } = useFormValidation(
        forgotPasswordSchema,
        {
            email: "",
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

                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500));

                console.log("Password reset email sent to:", data.email);

                reset();
                onSuccess();
            } catch (err: any) {
                setError(
                    err.message || "Failed to send reset email. Please try again."
                );
                console.error("Forgot password error:", err);
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
        handleSubmit: handleSubmit(onSubmit),
        hasError,
        getError,
        clearError,
        reset,
    };
};
