import {
    useForm,
    type DefaultValues,
    type FieldValues,
    type UseFormProps,
} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {VALIDATION_MODES} from "../constants/forms";
import type {ObjectSchema} from "yup";

/**
 * Custom hook for form validation with Yup schema
 */
export const useFormValidation = <TFieldValues extends FieldValues = FieldValues>(
    validationSchema: ObjectSchema<any>,
    defaultValues: UseFormProps<TFieldValues>["defaultValues"] = {} as any,
    options: Omit<UseFormProps<TFieldValues>, "resolver" | "defaultValues"> = {}
) => {
    const {
        register,
        handleSubmit,
        formState,
        reset,
        watch,
        setValue,
        getValues,
        trigger,
        clearErrors: rhfClearErrors,
        ...rest
    } = useForm<TFieldValues>({
        resolver: yupResolver(validationSchema),
        defaultValues,
        mode: VALIDATION_MODES.onChange,
        ...options,
    });

    const {errors, isSubmitting, isValid, isDirty, touchedFields} = formState;

    // Helper function to check if a field has an error
    const hasError = (fieldName: keyof TFieldValues) => {
        return !!errors[fieldName];
    };

    // Helper function to get error message for a field
    const getError = (fieldName: keyof TFieldValues) => {
        const error = errors[fieldName];
        return error?.message as string | undefined;
    };

    // Helper function to set field values
    const setFieldValue = <TFieldName extends keyof TFieldValues>(
        fieldName: TFieldName,
        value: TFieldValues[TFieldName],
        options = {}
    ) => {
        setValue(fieldName as any, value, {
            shouldValidate: true,
            shouldDirty: true,
            ...options,
        });
    };

    // Helper function to reset form with new values
    const resetForm = (newValues?: DefaultValues<TFieldValues>) => {
        reset(newValues);
    };

    return {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
            isValid,
            isDirty,
            touchedFields,
        },
        reset: resetForm,
        watch,
        setValue: setFieldValue,
        getValues,
        trigger,
        clearErrors: rhfClearErrors, // Sử dụng clearErrors từ react-hook-form
        // Helper methods
        hasError,
        getError,
        // Additional methods
        ...rest,
    };
};

export default useFormValidation;
