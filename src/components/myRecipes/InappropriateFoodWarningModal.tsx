import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Text,
	VStack,
	Icon,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";

interface InappropriateFoodWarningModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	foodName: string;
}

export const InappropriateFoodWarningModal = ({
	isOpen,
	onClose,
	onConfirm,
	foodName,
}: InappropriateFoodWarningModalProps) => {
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
			<ModalContent bg={cardBg} borderRadius="2xl" mx={4}>
				<ModalHeader
					borderBottom="1px"
					borderColor={borderColor}
					pb={4}>
					<VStack spacing={3} align="center">
						<Icon
							as={FiAlertTriangle}
							boxSize={12}
							color="orange.500"
						/>
						<Text fontSize="xl" fontWeight="bold">
							Warning: Inappropriate Food
						</Text>
					</VStack>
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody py={6}>
					<VStack spacing={4} align="stretch">
						<Text fontSize="md" textAlign="center">
							The food <strong>"{foodName}"</strong> may not be
							appropriate for your dietary preferences, health
							goals, or allergen restrictions.
						</Text>
						<Text fontSize="sm" color="gray.600" textAlign="center">
							Are you sure you want to add this food to your
							collection?
						</Text>
					</VStack>
				</ModalBody>

				<ModalFooter
					borderTop="1px"
					borderColor={borderColor}
					pt={4}>
					<Button variant="ghost" mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="orange" onClick={onConfirm}>
						Add Anyway
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
