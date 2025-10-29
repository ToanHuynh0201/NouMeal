import {loginSchema} from "@/lib/validationSchemas";
import {useAuth} from "./useAuth";
import useFormValidation from "./useFormValidation";
import {VALIDATION_MODES} from "@/constants/forms";
import {useCallback} from "react";

/**
 * Custom hook for managing login form state and actions
 * @param {Function} onSuccess - Callback function called on successful login
 * @param {Object} options - Additional options for form configuration
 * @returns {Object} Form state, handlers, and validation
 */
export const useLoginForm = (onSuccess: any, options: any = {}) => {
    const {login, isLoading, error, clearError} = useAuth();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, isValid},
        hasError,
        getError,
        reset,
    } = useFormValidation(
        loginSchema,
        {
            email: "",
            password: "",
        },
        {
            mode: options.validationMode || VALIDATION_MODES.onChange,
            ...options.formOptions,
        }
    );

    const onSubmit = useCallback(
        async (data: any) => {
            try {
                // Clear any previous errors
                clearError();

                await login(data.email, data.password);

                // Reset form on successful login
                reset();

                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                // Error is handled by the auth context
                console.error("Login error:", err);
            }
        },
        [login, clearError, reset, onSuccess]
    );

    // const onSubmit = () => {
    //     onSuccess();
    // };

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
