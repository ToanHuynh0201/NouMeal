import {Box, VStack, Text, Icon, Button} from "@chakra-ui/react";
import {FiPlusCircle} from "react-icons/fi";

interface EmptyStateProps {
    onAddRecipe: () => void;
}

const EmptyState = ({onAddRecipe}: EmptyStateProps) => {
    return (
        <Box
            borderWidth="2px"
            borderStyle="dashed"
            borderColor="gray.300"
            borderRadius="xl"
            p={16}
            textAlign="center"
            bg="gray.50"
        >
            <VStack spacing={6}>
                <Box
                    fontSize="6xl"
                    opacity={0.3}
                    filter="grayscale(100%)"
                >
                    🍽️
                </Box>
                <VStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                        No Recipes Yet
                    </Text>
                    <Text fontSize="md" color="gray.600" maxW="md">
                        Start building your personal recipe collection by adding your
                        first recipe. Share your favorite dishes and keep them organized
                        in one place!
                    </Text>
                </VStack>
                <Button
                    leftIcon={<Icon as={FiPlusCircle} />}
                    colorScheme="purple"
                    size="lg"
                    onClick={onAddRecipe}
                    mt={4}
                >
                    Add Your First Recipe
                </Button>
            </VStack>
        </Box>
    );
};

export default EmptyState;
