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

export const changePasswordSchema = yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: validationRules.password,
    confirmNewPassword: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

// OTA Update validation schema
export const otaUpdateSchema = yup.object({
    platform: yup
        .string()
        .required("Platform is required")
        .oneOf(["IOS", "ANDROID"], "Platform must be either IOS or ANDROID"),
    version: yup
        .string()
        .required("Version is required")
        .matches(
            /^\d+\.\d+\.\d+$/,
            "Version must follow semantic versioning (e.g., 1.2.3)"
        ),
    buildNumber: yup
        .string()
        .required("Build number is required")
        .matches(/^\d+$/, "Build number must be numeric"),
    status: yup
        .string()
        .required("Status is required")
        .oneOf(["DRAFT", "PUBLISHED", "ARCHIVED"], "Invalid status"),
    notes: yup.string().optional(),
    isForced: yup.boolean().default(false),
    minVersion: yup
        .string()
        .optional()
        .test(
            "is-valid-version",
            "Min version must follow semantic versioning (e.g., 1.0.0)",
            function (value) {
                if (!value || value.length === 0) return true;
                return /^\d+\.\d+\.\d+$/.test(value);
            }
        ),
    downloadUrl: yup
        .string()
        .optional()
        .test(
            "is-valid-url",
            "Download URL must be a valid HTTP/HTTPS URL",
            function (value) {
                if (!value || value.length === 0) return true;
                return /^https?:\/\/.+/.test(value);
            }
        ),
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
    otaUpdateSchema,
    createConditionalSchema,
    createArraySchema,
};
