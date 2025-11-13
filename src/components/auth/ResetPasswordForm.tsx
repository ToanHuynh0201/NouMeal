import {VStack, Text, Link, Box, HStack, PinInput, PinInputField} from "@chakra-ui/react";
import FormField from "../common/FormField";
import SubmitButton from "../common/SubmitButton";
import AlertMessage from "../common/AlertMessage";
import {FIELD_PRESETS} from "@/constants/forms";
import {useResetPasswordForm} from "@/hooks/useResetPasswordForm";
import {useState} from "react";
import PasswordToggle from "../common/PasswordToggle";
import {authService} from "@/services/authService";

interface ResetPasswordFormProps {
    email: string;
    onSuccess: () => void;
    onBack?: () => void;
}

function ResetPasswordForm({email, onSuccess, onBack}: ResetPasswordFormProps) {
    const [otp, setOtp] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    const {
        isLoading,
        error,
        register,
        handleSubmit,
        hasError,
        getError,
        watch,
        setValue,
    } = useResetPasswordForm(email, onSuccess);

    const newPassword = watch("newPassword");
    const confirmNewPassword = watch("confirmNewPassword");

    const handleOtpChange = (value: string) => {
        setOtp(value);
        setValue("otp", value);
    };

    const {showPassword: showNewPassword, button: newPasswordToggleButton} =
        PasswordToggle();
    const {
        showPassword: showConfirmPassword,
        button: confirmPasswordToggleButton,
    } = PasswordToggle();

    const handleResend = async () => {
        try {
            setResendLoading(true);
            setResendMessage(null);
            await authService.forgotPassword(email);
            setResendMessage("OTP sent successfully! Please check your email.");
        } catch (err: any) {
            setResendMessage(err.message || "Failed to resend OTP. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

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

                {resendMessage && (
                    <AlertMessage
                        status={resendMessage.includes("success") ? "success" : "error"}
                        message={resendMessage}
                        isClosable={true}
                        onClose={() => setResendMessage(null)}
                    />
                )}

                <Box w="full">
                    <Text fontSize="sm" color="gray.600" mb={2} textAlign="center">
                        Enter the verification code sent to:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="blue.600" mb={4} textAlign="center">
                        {email}
                    </Text>
                </Box>

                {/* OTP Input */}
                <Box w="full">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        Verification Code
                    </Text>
                    <HStack spacing={3} justify="center" w="full">
                        <PinInput
                            otp
                            size="lg"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder=""
                            focusBorderColor="blue.500"
                            errorBorderColor="red.500"
                        >
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                    </HStack>
                    <Box textAlign="center" mt={2}>
                        <Text fontSize="xs" color="gray.600">
                            Didn't receive the code?{" "}
                            <Link
                                color="blue.500"
                                fontWeight="semibold"
                                onClick={handleResend}
                                cursor={resendLoading ? "not-allowed" : "pointer"}
                                opacity={resendLoading ? 0.6 : 1}
                                pointerEvents={resendLoading ? "none" : "auto"}
                                fontSize="xs"
                                _hover={{
                                    color: "blue.600",
                                    textDecoration: "underline",
                                }}
                            >
                                {resendLoading ? "Sending..." : "Resend"}
                            </Link>
                        </Text>
                    </Box>
                </Box>

                <FormField
                    label="New Password"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder={FIELD_PRESETS.newPassword.placeholder}
                    autoComplete={FIELD_PRESETS.newPassword.autoComplete}
                    register={register as any}
                    error={getError("newPassword")}
                    isInvalid={hasError("newPassword")}
                    rightElement={newPasswordToggleButton}
                />

                <FormField
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={FIELD_PRESETS.confirmPassword.placeholder}
                    autoComplete={FIELD_PRESETS.confirmPassword.autoComplete}
                    register={register as any}
                    error={getError("confirmNewPassword")}
                    isInvalid={hasError("confirmNewPassword")}
                    rightElement={confirmPasswordToggleButton}
                />

                <SubmitButton
                    isLoading={isLoading}
                    loadingText="Resetting Password..."
                    isDisabled={
                        otp.length !== 6 ||
                        !newPassword ||
                        !confirmNewPassword ||
                        hasError("newPassword") ||
                        hasError("confirmNewPassword")
                    }
                >
                    Reset Password
                </SubmitButton>

                {onBack && (
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                        <Link
                            color="gray.600"
                            fontWeight="medium"
                            onClick={onBack}
                            cursor="pointer"
                            _hover={{
                                color: "gray.700",
                                textDecoration: "underline",
                            }}
                        >
                            ← Back to email
                        </Link>
                    </Text>
                )}
            </VStack>
        </form>
    );
}

export default ResetPasswordForm;
