import {
    Card,
    CardBody,
    HStack,
    VStack,
    Text,
    Badge,
    Box,
    SimpleGrid,
} from "@chakra-ui/react";
import type { PopulatedFoodLog } from "@/types";
import { formatMealType } from "@/utils/food";

interface LoggedFoodCardProps {
    foodLog: PopulatedFoodLog;
}

function LoggedFoodCard({ foodLog }: LoggedFoodCardProps) {
    const { food, meal, servings, source, nutritionSnapshot } = foodLog;

    // Source badge color
    const sourceColor = source === "recommended" ? "green" : "blue";

    return (
        <Card
            shadow="sm"
            borderRadius="lg"
            border="1px"
            borderColor="gray.100"
            _hover={{
                shadow: "md",
                transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
        >
            <CardBody p={4}>
                {/* Food Info */}
                <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" fontSize="md" lineHeight="short">
                                {food.name}
                            </Text>
                            <HStack spacing={2}>
                                <Badge colorScheme="purple" textTransform="capitalize">
                                    {formatMealType(meal)}
                                </Badge>
                                <Badge colorScheme={sourceColor} textTransform="capitalize">
                                    {source === "recommended" ? "Recommended" : "Manual"}
                                </Badge>
                                {servings > 1 && (
                                    <Badge colorScheme="gray">
                                        {servings}x servings
                                    </Badge>
                                )}
                            </HStack>
                        </VStack>
                    </HStack>

                    {/* Nutrition Info */}
                    <SimpleGrid columns={4} spacing={2}>
                        <Box
                            bg="orange.50"
                            px={2}
                            py={1}
                            borderRadius="md"
                            textAlign="center"
                        >
                            <Text fontSize="xs" color="gray.600">
                                Calories
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="orange.600">
                                {nutritionSnapshot.calories}
                            </Text>
                        </Box>
                        <Box
                            bg="green.50"
                            px={2}
                            py={1}
                            borderRadius="md"
                            textAlign="center"
                        >
                            <Text fontSize="xs" color="gray.600">
                                Protein
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="green.600">
                                {nutritionSnapshot.protein}g
                            </Text>
                        </Box>
                        <Box
                            bg="blue.50"
                            px={2}
                            py={1}
                            borderRadius="md"
                            textAlign="center"
                        >
                            <Text fontSize="xs" color="gray.600">
                                Carbs
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="blue.600">
                                {nutritionSnapshot.carbs}g
                            </Text>
                        </Box>
                        <Box
                            bg="purple.50"
                            px={2}
                            py={1}
                            borderRadius="md"
                            textAlign="center"
                        >
                            <Text fontSize="xs" color="gray.600">
                                Fat
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color="purple.600">
                                {nutritionSnapshot.fat}g
                            </Text>
                        </Box>
                    </SimpleGrid>
                </VStack>
            </CardBody>
        </Card>
    );
}

export default LoggedFoodCard;
