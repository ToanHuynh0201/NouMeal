import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Divider,
	useToast,
} from "@chakra-ui/react";
import { animationPresets } from "@/styles/animation";
import { useThemeValues } from "@/styles/themeUtils";
import MultiStepRegisterForm from "./MultiStepRegisterForm";
import EmailVerificationModal from "./EmailVerificationModal";
import { useState } from "react";

interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
	const { cardBg } = useThemeValues();
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
				size={{ base: "full", sm: "md", md: "xl", lg: "2xl" }}
				isCentered
				motionPreset="slideInBottom"
				closeOnOverlayClick={true}
				closeOnEsc={true}
				blockScrollOnMount={true}
				trapFocus={true}
				autoFocus={true}
				returnFocusOnClose={true}>
				<ModalOverlay
					bg="blackAlpha.600"
					backdropFilter="blur(10px)"
				/>
				<ModalContent
					bg={cardBg}
					borderRadius="2xl"
					shadow="2xl"
					border="1px"
					borderColor="gray.200"
					mx={{ base: 0, sm: 4 }}
					maxH={{ base: "100vh", sm: "90vh" }}
					overflowY="auto"
					overflowX="hidden"
					animation={animationPresets.fadeIn}>
					<ModalCloseButton
						top={4}
						right={4}
						borderRadius="full"
						_hover={{ bg: "gray.100" }}
						onClick={(e) => {
							e.stopPropagation();
							handleClose();
						}}
					/>

					<Divider />

					<ModalBody
						py={{ base: 3, md: 4 }}
						px={{ base: 6, md: 8 }}>
						<MultiStepRegisterForm
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
