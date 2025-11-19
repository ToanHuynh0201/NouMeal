import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    Text,
    VStack,
    Icon,
} from "@chakra-ui/react";
import {useRef} from "react";
import {FiAlertTriangle} from "react-icons/fi";
import type {Recipe} from "@/types/recipe";

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    recipe: Recipe | null;
}

const DeleteConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    recipe,
}: DeleteConfirmDialogProps) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(8px)">
                <AlertDialogContent borderRadius="xl">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        <VStack spacing={3} align="center">
                            <Icon
                                as={FiAlertTriangle}
                                boxSize={12}
                                color="red.500"
                            />
                            <Text>Delete Recipe</Text>
                        </VStack>
                    </AlertDialogHeader>

                    <AlertDialogBody textAlign="center">
                        <VStack spacing={2}>
                            <Text>
                                Are you sure you want to delete{" "}
                                <Text as="span" fontWeight="bold" color="brand.600">
                                    {recipe?.title}
                                </Text>
                                ?
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                This action cannot be undone. All recipe information will be
                                permanently deleted.
                            </Text>
                        </VStack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default DeleteConfirmDialog;
