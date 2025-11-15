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
import EmailVerificationForm from "./EmailVerificationForm";
import {EmailIcon, CheckCircleIcon} from "@chakra-ui/icons";

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    userName?: string;
}

const EmailVerificationModal = ({
    isOpen,
    onClose,
    email,
    userName,
}: EmailVerificationModalProps) => {
    const {cardBg} = useThemeValues();
    const toast = useToast();

    const handleSuccess = () => {
        toast({
            title: "Email Verified Successfully!",
            description: `Welcome ${userName || ""}! Your account is now active. Please sign in to continue.`,
            status: "success",
            duration: 6000,
            isClosable: true,
            position: "top",
            icon: <CheckCircleIcon />,
        });
        onClose();
        
        // User needs to login after email verification
        // Backend verify-email endpoint doesn't return tokens
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            isCentered
            motionPreset="slideInBottom"
            closeOnOverlayClick={false}
            closeOnEsc={false}
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
                            bg="green.50"
                            borderRadius="full"
                            animation={animationPresets.pulse}
                        >
                            <EmailIcon boxSize={8} color="green.500" />
                        </Box>
                        <Box>
                            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                                Verify Your Email
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                We've sent a verification code to your email
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
                        onClose();
                    }}
                />

                <Divider />

                <ModalBody py={6} px={8}>
                    <EmailVerificationForm
                        email={email}
                        onSuccess={handleSuccess}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EmailVerificationModal;
