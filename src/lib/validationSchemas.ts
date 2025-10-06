import * as yup from "yup";
import {VALIDATION} from "../constants";

// Common validation rules
export const validationRules = {
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address")
        .max(VALIDATION.EMAIL_MAX_LENGTH, "Email is too long"),

    password: yup
        .string()
        .required("Password is required")
        .min(
            VALIDATION.STRONG_PASSWORD_MIN_LENGTH,
            `Password must be at least ${VALIDATION.STRONG_PASSWORD_MIN_LENGTH} characters`
        )
        .max(VALIDATION.PASSWORD_MAX_LENGTH, "Password is too long")
        .matches(
            VALIDATION.PASSWORD_PATTERN,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)"
        ),

    // For login, we don't want to enforce the strong password pattern on existing passwords
    loginPassword: yup
        .string()
        .required("Password is required")
        .min(
            VALIDATION.STRONG_PASSWORD_MIN_LENGTH,
            `Password must be at least ${VALIDATION.STRONG_PASSWORD_MIN_LENGTH} characters`
        )
        .max(VALIDATION.PASSWORD_MAX_LENGTH, "Password is too long"),
};

// Pre-built schemas for common forms
export const loginSchema = yup.object({
    email: validationRules.email,
    password: validationRules.loginPassword,
});

export const registerSchema = yup.object({
    fullName: yup
        .string()
        .required("Full name is required")
        .min(2, "Name must be at least 2 characters")
        .max(VALIDATION.NAME_MAX_LENGTH, "Name is too long"),

    email: validationRules.email,

    password: validationRules.password,

    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),

    agreeToTerms: yup
        .boolean()
        .oneOf([true], "You must accept the terms and conditions"),
});

export const changePasswordSchema = yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: validationRules.password,
    confirmNewPassword: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

// Custom validation helpers
export const createConditionalSchema = <T extends yup.AnySchema>(
    condition: string,
    schema: T
) =>
    yup.mixed().when(
        condition,
        {
            is: true,
            then: schema,
            otherwise: yup.mixed().notRequired(),
        } as any // bypass type check
    ) as T | yup.MixedSchema;

export const createArraySchema = (
    itemSchema: any,
    minItems = 0,
    maxItems = null
) => {
    let schema = yup
        .array()
        .of(itemSchema)
        .min(minItems, `Must have at least ${minItems} items`);

    if (maxItems) {
        schema = schema.max(maxItems, `Cannot have more than ${maxItems} items`);
    }

    return schema;
};

export default {
    validationRules,
    loginSchema,
    changePasswordSchema,
    createConditionalSchema,
    createArraySchema,
};
