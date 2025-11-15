import {resetPasswordSchema} from "@/lib/validationSchemas";
import useFormValidation from "./useFormValidation";
import {VALIDATION_MODES} from "@/constants/forms";
import {useCallback, useState} from "react";
import {authService} from "@/services/authService";

export const useResetPasswordForm = (
    email: string,
    onSuccess: () => void,
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
        watch,
    } = useFormValidation(
        resetPasswordSchema,
        {
            email: email,
            otp: "",
            newPassword: "",
            confirmNewPassword: "",
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

                await authService.resetPassword(data.email, data.otp, data.newPassword);

                reset();
                onSuccess();
            } catch (err: any) {
                setError(
                    err.message || "Failed to reset password. Please try again."
                );
                console.error("Reset password error:", err);
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
        setValue,
        watch,
    };
};
