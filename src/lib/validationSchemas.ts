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

    // Registration-specific password rule (aligned with backend in prompt):
    registrationPassword: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(VALIDATION.PASSWORD_MAX_LENGTH, "Password is too long")
        .matches(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
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

    // Use a generic 'name' rule that matches API constraints (2-50 chars)
    name: yup
        .string()
        .required("Name is required")
        .min(2, "Name must be between 2 and 50 characters")
        .max(50, "Name must be between 2 and 50 characters"),

    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),

    agreeToTerms: yup
        .boolean()
        .oneOf([true], "You must accept the terms and conditions"),
};

// Pre-built schemas for common forms
export const loginSchema = yup.object({
    email: validationRules.email,
    password: validationRules.loginPassword,
});

export const registerSchema = yup.object({
    // map to API body keys
    name: validationRules.name,

    email: validationRules.email,

    // use registration-specific password rule
    password: validationRules.registrationPassword,

    confirmPassword: validationRules.confirmPassword,

    age: yup
        .number()
        .typeError("Age must be a number")
        .required("Age is required")
        .min(13, "Age must be between 13 and 120")
        .max(120, "Age must be between 13 and 120"),

    gender: yup
        .string()
        .required("Gender is required")
        .oneOf(["male", "female", "other"], "Gender must be male, female, or other"),

    height: yup
        .number()
        .typeError("Height must be a number")
        .required("Height is required")
        .min(50, "Height must be between 50 and 300 cm")
        .max(300, "Height must be between 50 and 300 cm"),

    weight: yup
        .number()
        .typeError("Weight must be a number")
        .required("Weight is required")
        .min(20, "Weight must be between 20 and 500 kg")
        .max(500, "Weight must be between 20 and 500 kg"),

    goal: yup
        .string()
        .required("Goal is required")
        .oneOf(
            ["lose_weight", "maintain_weight", "gain_weight", "build_muscle", "improve_health"],
            "Goal must be one of: lose_weight, maintain_weight, gain_weight, build_muscle, improve_health"
        ),

    preferences: yup.array().of(yup.string()),

    allergies: yup.array().of(yup.string()),

    agreeToTerms: validationRules.agreeToTerms,
});

export const changePasswordSchema = yup.object({
    currentPassword: validationRules.password,
    newPassword: validationRules.password,
    confirmNewPassword: validationRules.confirmPassword,
});

export const forgotPasswordSchema = yup.object({
    email: validationRules.email,
});

// Custom validation helpers
export const createConditionalSchema = <T extends yup.AnySchema>(
    condition: string,
    schema: T
) =>
    yup.mixed().when(condition, {
        is: true,
        then: schema,
        otherwise: yup.mixed().notRequired(),
    } as any) as T | yup.MixedSchema;

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
    registerSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    createConditionalSchema,
    createArraySchema,
};
