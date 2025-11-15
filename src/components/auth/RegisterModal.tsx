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
} from "@chakra-ui/react";
import {animationPresets} from "@/styles/animation";
import {useThemeValues} from "@/styles/themeUtils";
import RegisterForm from "./RegisterForm";
import EmailVerificationModal from "./EmailVerificationModal";
import {useState} from "react";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegisterModal = ({isOpen, onClose}: RegisterModalProps) => {
    const {cardBg} = useThemeValues();
    const toast = useToast();
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [registeredName, setRegisteredName] = useState("");

    const handleSuccess = (email: string, name: string) => {
        setRegisteredEmail(email);
        setRegisteredName(name);
        setShowVerification(true);
        toast({
            title: "Registration Successful!",
            description: "Please check your email for the verification code.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
    };

    const handleClose = () => {
        setShowVerification(false);
        setRegisteredEmail("");
        setRegisteredName("");
        onClose();
    };

    const handleVerificationClose = () => {
        setShowVerification(false);
        setRegisteredEmail("");
        setRegisteredName("");
        onClose();
    };

    if (!isOpen && !showVerification) return null;

    return (
        <>
            <Modal
                isOpen={isOpen && !showVerification}
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
                                bg="blue.50"
                                borderRadius="full"
                                animation={animationPresets.pulse}
                            >
                                <img
                                    src="/vite.svg"
                                    alt="MealGenie Logo"
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        objectFit: "contain",
                                    }}
                                />
                            </Box>
                            <Box>
                                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                                    Join MealGenie
                                </Text>
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    Create your account to get started
                                </Text>
                            </Box>
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
                        <RegisterForm
                            onSuccess={handleSuccess}
                            onSwitchToLogin={handleClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            <EmailVerificationModal
                isOpen={showVerification}
                onClose={handleVerificationClose}
                email={registeredEmail}
                userName={registeredName}
            />
        </>
    );
};

export default RegisterModal;
