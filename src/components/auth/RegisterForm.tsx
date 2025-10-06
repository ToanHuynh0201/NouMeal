import {VStack, Text, Checkbox, Link} from "@chakra-ui/react";
import FormField from "../common/FormField";
import SubmitButton from "../common/SubmitButton";
import AlertMessage from "../common/AlertMessage";
import PasswordToggle from "../common/PasswordToggle";
import {FIELD_PRESETS} from "@/constants/forms";
import {useRegisterForm} from "@/hooks/useRegisterForm";

interface RegisterFormProps {
    onSuccess: () => void;
    onSwitchToLogin?: () => void;
}

function RegisterForm({onSuccess, onSwitchToLogin}: RegisterFormProps) {
    const {
        isLoading,
        isValid,
        hasFormErrors,
        error,
        register,
        handleSubmit,
        hasError,
        getError,
    } = useRegisterForm(onSuccess);

    const {showPassword, button: passwordToggleButton} = PasswordToggle();

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
                {error && (
                    <AlertMessage
                        status="error"
                        message={error}
                        isClosable={false}
                    />
                )}

                <FormField
                    label="Full Name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    register={register as any}
                    error={getError("fullName")}
                    isInvalid={hasError("fullName")}
                />

                <FormField
                    label="Email Address"
                    name="email"
                    {...FIELD_PRESETS.email}
                    register={register as any}
                    error={getError("email")}
                    isInvalid={hasError("email")}
                />

                <FormField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={FIELD_PRESETS.newPassword.placeholder}
                    autoComplete={FIELD_PRESETS.newPassword.autoComplete}
                    register={register as any}
                    error={getError("password")}
                    isInvalid={hasError("password")}
                    rightElement={passwordToggleButton}
                />

                <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={FIELD_PRESETS.confirmPassword.placeholder}
                    autoComplete={FIELD_PRESETS.confirmPassword.autoComplete}
                    register={register as any}
                    error={getError("confirmPassword")}
                    isInvalid={hasError("confirmPassword")}
                    rightElement={passwordToggleButton}
                />

                <VStack align="start" w="full" spacing={2}>
                    <Checkbox
                        {...register("agreeToTerms")}
                        colorScheme="blue"
                        size="sm"
                    >
                        <Text fontSize="sm" color="gray.600">
                            I agree to the{" "}
                            <Link color="blue.500" href="#" fontWeight="medium">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link color="blue.500" href="#" fontWeight="medium">
                                Privacy Policy
                            </Link>
                        </Text>
                    </Checkbox>
                    {hasError("agreeToTerms") && (
                        <Text fontSize="sm" color="red.500">
                            {getError("agreeToTerms")}
                        </Text>
                    )}
                </VStack>

                {hasFormErrors && (
                    <AlertMessage
                        status="warning"
                        message="Please fix the form errors above to continue."
                        isClosable={false}
                    />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    loadingText="Creating Account..."
                    isDisabled={!isValid}
                >
                    Create Account
                </SubmitButton>

                {onSwitchToLogin && (
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                        Already have an account?{" "}
                        <Link
                            color="blue.500"
                            fontWeight="semibold"
                            onClick={onSwitchToLogin}
                            cursor="pointer"
                            _hover={{
                                color: "blue.600",
                                textDecoration: "underline",
                            }}
                        >
                            Sign in
                        </Link>
                    </Text>
                )}
            </VStack>
        </form>
    );
}

export default RegisterForm;
