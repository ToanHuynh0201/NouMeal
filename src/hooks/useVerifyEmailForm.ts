import {verifyEmailSchema} from "@/lib/validationSchemas";
import useFormValidation from "./useFormValidation";
import {VALIDATION_MODES} from "@/constants/forms";
import {useCallback, useState} from "react";
import {authService} from "@/services/authService";

export const useVerifyEmailForm = (
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
    } = useFormValidation(
        verifyEmailSchema,
        {
            email: email,
            otp: "",
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

                await authService.verifyEmail(data.email, data.otp);

                reset();
                onSuccess();
            } catch (err: any) {
                setError(
                    err.message || "Invalid or expired OTP. Please try again."
                );
                console.error("Verify email error:", err);
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
    };
};
