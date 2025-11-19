import {Card, CardBody, VStack, Heading, Text, SimpleGrid} from "@chakra-ui/react";

interface WeeklySummaryCardProps {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}

const WeeklySummaryCard = ({
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
}: WeeklySummaryCardProps) => {
    return (
        <Card
            bg="white"
            shadow="md"
            borderRadius="xl"
            border="1px"
            borderColor="gray.200"
        >
            <CardBody p={6}>
                <VStack spacing={4}>
                    <Heading size="md" color="gray.700">
                        Weekly Overview
                    </Heading>
                    <SimpleGrid columns={{base: 2, md: 4}} spacing={4} w="full">
                        <VStack>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="brand.600"
                            >
                                {totalCalories}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Total Calories
                            </Text>
                        </VStack>
                        <VStack>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="green.600"
                            >
                                {totalProtein}g
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Protein
                            </Text>
                        </VStack>
                        <VStack>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="orange.600"
                            >
                                {totalCarbs}g
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Carbs
                            </Text>
                        </VStack>
                        <VStack>
                            <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="purple.600"
                            >
                                {totalFat}g
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Fat
                            </Text>
                        </VStack>
                    </SimpleGrid>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default WeeklySummaryCard;
