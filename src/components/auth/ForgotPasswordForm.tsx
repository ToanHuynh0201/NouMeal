import {VStack, Text, Link, Box} from "@chakra-ui/react";
import FormField from "../common/FormField";
import SubmitButton from "../common/SubmitButton";
import AlertMessage from "../common/AlertMessage";
import {FIELD_PRESETS} from "@/constants/forms";
import {useForgotPasswordForm} from "@/hooks/useForgotPasswordForm";

interface ForgotPasswordFormProps {
    onSuccess: () => void;
    onSwitchToLogin?: () => void;
}

const ForgotPasswordForm = ({
    onSuccess,
    onSwitchToLogin,
}: ForgotPasswordFormProps) => {
    const {
        isLoading,
        isValid,
        hasFormErrors,
        error,
        register,
        handleSubmit,
        hasError,
        getError,
    } = useForgotPasswordForm(onSuccess);

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

                <Box w="full">
                    <Text fontSize="sm" color="gray.600" mb={4} textAlign="center">
                        Enter your email address and we'll send you a link to reset
                        your password.
                    </Text>
                </Box>

                <FormField
                    label="Email Address"
                    name="email"
                    {...FIELD_PRESETS.email}
                    register={register as any}
                    error={getError("email")}
                    isInvalid={hasError("email")}
                />

                {hasFormErrors && (
                    <AlertMessage
                        status="warning"
                        message="Please fix the form errors above to continue."
                        isClosable={false}
                    />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    loadingText="Sending Reset Link..."
                    isDisabled={!isValid}
                >
                    Send Reset Link
                </SubmitButton>

                {onSwitchToLogin && (
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                        Remember your password?{" "}
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
};

export default ForgotPasswordForm;
