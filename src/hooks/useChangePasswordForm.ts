import {changePasswordSchema} from "@/lib/validationSchemas";
import {useAuth} from "./useAuth";
import useFormValidation from "./useFormValidation";
import {VALIDATION_MODES} from "@/constants/forms";
import {useCallback, useState} from "react";

/**
 * Custom hook for managing change password form state and actions
 * @param {Function} onSuccess - Callback function called on successful password change
 * @param {Object} options - Additional options for form configuration
 * @returns {Object} Form state, handlers, and validation
 */
export const useChangePasswordForm = (onSuccess: () => void, options: any = {}) => {
    const {changePassword, logout} = useAuth();
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
        changePasswordSchema,
        {
            currentPassword: "",
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

                // Call the change password API
                await changePassword(
                    data.currentPassword,
                    data.newPassword
                );

                // Reset form on successful password change
                reset();

                // Call success callback
                if (onSuccess) {
                    onSuccess();
                }

                // Logout user after successful password change
                // Using setTimeout to allow success message to be shown
                setTimeout(() => {
                    logout();
                }, 1500);
            } catch (err: any) {
                setError(
                    err.message || "Failed to change password. Please try again."
                );
                console.error("Change password error:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [changePassword, logout, reset, onSuccess]
    );

    const clearError = () => setError(null);

    // Check if form has validation errors
    const hasFormErrors = Object.keys(errors).length > 0 && !isValid;

    // Form state
    const formState = {
        isLoading: isLoading || isSubmitting,
        isValid,
        hasFormErrors,
        error,
        errors,
    };

    // Form handlers
    const formHandlers = {
        register,
        handleSubmit: handleSubmit(onSubmit),
        hasError,
        getError,
        clearError,
        reset,
    };

    return {
        ...formState,
        ...formHandlers,
    };
};
