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

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegisterModal = ({isOpen, onClose}: RegisterModalProps) => {
    const {cardBg} = useThemeValues();
    const toast = useToast();

    const handleSuccess = () => {
        toast({
            title: "Registration Successful!",
            description: "Please check your email to verify your account.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                        console.log("Close button clicked");
                        onClose();
                    }}
                />

                <Divider />

                <ModalBody py={6} px={8}>
                    <RegisterForm
                        onSuccess={handleSuccess}
                        onSwitchToLogin={onClose}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default RegisterModal;
