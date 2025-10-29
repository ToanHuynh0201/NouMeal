import {
    Card,
    CardBody,
    Box,
    VStack,
    Heading,
    Text,
    SimpleGrid,
} from "@chakra-ui/react";
import type {DailyMenu} from "@/types/recipe";

interface DayHeaderProps {
    dayMenu: DailyMenu;
    formatDate: (dateString: string) => string;
}

const DayHeader = ({dayMenu, formatDate}: DayHeaderProps) => {
    return (
        <Card
            bg="white"
            shadow="md"
            borderRadius="xl"
            border="1px"
            borderColor="gray.200"
        >
            <Box
                bgGradient="linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)"
                p={6}
            >
                <VStack spacing={2} color="white">
                    <Heading size="lg">{formatDate(dayMenu.date)}</Heading>
                    <Text fontSize="md" opacity={0.9}>
                        {dayMenu.date}
                    </Text>
                </VStack>
            </Box>
            <CardBody p={6}>
                <SimpleGrid columns={{base: 2, md: 4}} spacing={4}>
                    <VStack>
                        <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                            {dayMenu.totalCalories}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Total Calories
                        </Text>
                    </VStack>
                    <VStack>
                        <Text fontSize="2xl" fontWeight="bold" color="green.600">
                            {dayMenu.totalProtein}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Protein
                        </Text>
                    </VStack>
                    <VStack>
                        <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                            {dayMenu.totalCarbs}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Carbs
                        </Text>
                    </VStack>
                    <VStack>
                        <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                            {dayMenu.totalFat}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Fat
                        </Text>
                    </VStack>
                </SimpleGrid>
            </CardBody>
        </Card>
    );
};

export default DayHeader;
