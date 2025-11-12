import {VStack, Text, Link, Box, HStack, PinInput, PinInputField} from "@chakra-ui/react";
import AlertMessage from "../common/AlertMessage";
import SubmitButton from "../common/SubmitButton";
import {useVerifyEmailForm} from "@/hooks/useVerifyEmailForm";
import {useState} from "react";
import {authService} from "@/services/authService";

interface EmailVerificationFormProps {
    email: string;
    onSuccess: () => void;
    onBack?: () => void;
}

function EmailVerificationForm({email, onSuccess, onBack}: EmailVerificationFormProps) {
    const [otp, setOtp] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    const {
        isLoading,
        error,
        handleSubmit,
        setValue,
    } = useVerifyEmailForm(email, onSuccess);

    const handleOtpChange = (value: string) => {
        setOtp(value);
        setValue("otp", value);
    };

    const handleResend = async () => {
        try {
            setResendLoading(true);
            setResendMessage(null);
            await authService.resendVerificationEmail(email);
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
                        We've sent a 6-digit verification code to:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="blue.600" mb={4} textAlign="center">
                        {email}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={4} textAlign="center">
                        Please enter the code below to verify your email.
                    </Text>
                </Box>

                {/* OTP Input */}
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

                <SubmitButton
                    isLoading={isLoading}
                    loadingText="Verifying..."
                    isDisabled={otp.length !== 6}
                >
                    Verify Email
                </SubmitButton>

                <Box textAlign="center" w="full">
                    <Text fontSize="sm" color="gray.600">
                        Didn't receive the code?{" "}
                        <Link
                            color="blue.500"
                            fontWeight="semibold"
                            onClick={handleResend}
                            cursor={resendLoading ? "not-allowed" : "pointer"}
                            opacity={resendLoading ? 0.6 : 1}
                            pointerEvents={resendLoading ? "none" : "auto"}
                            _hover={{
                                color: "blue.600",
                                textDecoration: "underline",
                            }}
                        >
                            {resendLoading ? "Sending..." : "Resend"}
                        </Link>
                    </Text>
                </Box>

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

export default EmailVerificationForm;
