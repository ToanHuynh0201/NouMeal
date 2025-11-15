import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    VStack,
    Box,
    Divider,
    Text,
    useToast,
    Progress,
    HStack,
    Circle,
} from "@chakra-ui/react";
import {animationPresets} from "@/styles/animation";
import {useThemeValues} from "@/styles/themeUtils";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import {LockIcon, CheckIcon} from "@chakra-ui/icons";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ForgotPasswordStep = "email" | "reset";

const ForgotPasswordModal = ({isOpen, onClose}: ForgotPasswordModalProps) => {
    const {cardBg} = useThemeValues();
    const toast = useToast();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
    const [email, setEmail] = useState("");

    const handleEmailSuccess = (userEmail: string) => {
        setEmail(userEmail);
        setCurrentStep("reset");
        toast({
            title: "Verification Code Sent!",
            description: "Please check your email for the verification code.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
    };

    const handleResetSuccess = () => {
        toast({
            title: "Password Reset Successful!",
            description: "Your password has been reset. You are now logged in.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        onClose();
        navigate("/home");
    };

    const handleClose = () => {
        setCurrentStep("email");
        setEmail("");
        onClose();
    };

    const handleBack = () => {
        setCurrentStep("email");
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case "email":
                return "Forgot Password?";
            case "reset":
                return "Reset Password";
            default:
                return "Forgot Password?";
        }
    };

    const getStepSubtitle = () => {
        switch (currentStep) {
            case "email":
                return "No worries, we'll send you reset instructions";
            case "reset":
                return "Enter the code and create a new password";
            default:
                return "";
        }
    };

    const progressValue = currentStep === "email" ? 50 : 100;

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="md"
            isCentered
            motionPreset="slideInBottom"
            closeOnOverlayClick={true}
            closeOnEsc={true}
            blockScrollOnMount={true}
            trapFocus={true}
            autoFocus={true}
            returnFocusOnClose={true}
        >
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
            <ModalContent
                bg={cardBg}
                borderRadius="2xl"
                shadow="2xl"
                border="1px"
                borderColor="gray.200"
                mx={4}
                maxH="90vh"
                overflowY="auto"
                animation={animationPresets.fadeIn}
            >
                <ModalHeader pt={8} pb={4}>
                    <VStack spacing={3} textAlign="center">
                        <Box
                            p={3}
                            bg="orange.50"
                            borderRadius="full"
                            animation={animationPresets.pulse}
                        >
                            <LockIcon boxSize={8} color="orange.500" />
                        </Box>
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                                {getStepTitle()}
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                {getStepSubtitle()}
                            </Text>
                        </Box>

                        {/* Step Indicator */}
                        <HStack spacing={4} mt={4} w="full" justify="center">
                            <HStack spacing={2}>
                                <Circle
                                    size="32px"
                                    bg={currentStep === "email" ? "blue.500" : "green.500"}
                                    color="white"
                                    fontWeight="bold"
                                    fontSize="sm"
                                >
                                    {currentStep === "email" ? "1" : <CheckIcon boxSize={4} />}
                                </Circle>
                                <Text fontSize="xs" fontWeight="medium" color="gray.600">
                                    Email
                                </Text>
                            </HStack>

                            <Box w="40px" h="2px" bg="gray.300" position="relative">
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    h="100%"
                                    w={currentStep === "reset" ? "100%" : "0%"}
                                    bg="blue.500"
                                    transition="width 0.3s ease"
                                />
                            </Box>

                            <HStack spacing={2}>
                                <Circle
                                    size="32px"
                                    bg={currentStep === "reset" ? "blue.500" : "gray.200"}
                                    color={currentStep === "reset" ? "white" : "gray.500"}
                                    fontWeight="bold"
                                    fontSize="sm"
                                >
                                    2
                                </Circle>
                                <Text
                                    fontSize="xs"
                                    fontWeight="medium"
                                    color={currentStep === "reset" ? "gray.600" : "gray.400"}
                                >
                                    Reset
                                </Text>
                            </HStack>
                        </HStack>

                        {/* Progress Bar */}
                        <Progress
                            value={progressValue}
                            size="xs"
                            colorScheme="blue"
                            w="full"
                            borderRadius="full"
                            bg="gray.200"
                        />
                    </VStack>
                </ModalHeader>

                <ModalCloseButton
                    top={4}
                    right={4}
                    borderRadius="full"
                    _hover={{bg: "gray.100"}}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }}
                />

                <Divider />

                <ModalBody py={6} px={8}>
                    {currentStep === "email" && (
                        <ForgotPasswordForm
                            onSuccess={handleEmailSuccess}
                            onSwitchToLogin={handleClose}
                        />
                    )}

                    {currentStep === "reset" && (
                        <ResetPasswordForm
                            email={email}
                            onSuccess={handleResetSuccess}
                            onBack={handleBack}
                        />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ForgotPasswordModal;
