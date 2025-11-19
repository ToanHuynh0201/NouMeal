import {
    Card,
    CardBody,
    Box,
    HStack,
    VStack,
    Text,
    Badge,
    Button,
} from "@chakra-ui/react";
import type {DailyMenu, Recipe} from "@/types/recipe";

interface WeeklyMenuCardProps {
    day: DailyMenu;
    formatDate: (dateString: string) => string;
    onRecipeClick: (recipe: Recipe) => void;
    onViewDetails: (day: DailyMenu) => void;
}

const WeeklyMenuCard = ({
    day,
    formatDate,
    onRecipeClick,
    onViewDetails,
}: WeeklyMenuCardProps) => {
    return (
        <Card
            bg="white"
            shadow="md"
            borderRadius="xl"
            overflow="hidden"
            border="1px"
            borderColor="gray.200"
            transition="all 0.3s"
            _hover={{
                shadow: "xl",
                transform: "translateY(-4px)",
            }}
        >
            <Box
                bg="gray.50"
                px={4}
                py={3}
                borderBottom="1px"
                borderColor="gray.200"
            >
                <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800">
                            {formatDate(day.date)}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                            {day.date}
                        </Text>
                    </VStack>
                    <Badge
                        colorScheme="purple"
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                    >
                        {day.totalCalories} cal
                    </Badge>
                </HStack>
            </Box>
            <CardBody p={4}>
                <VStack spacing={3} align="stretch">
                    {/* Breakfast */}
                    <HStack
                        spacing={3}
                        p={3}
                        bg="orange.50"
                        borderRadius="lg"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{bg: "orange.100"}}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRecipeClick(day.breakfast);
                        }}
                    >
                        <Text fontSize="xl">🌅</Text>
                        <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                                {day.breakfast.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                                {day.breakfast.nutrition.calories} cal
                            </Text>
                        </VStack>
                    </HStack>

                    {/* Lunch */}
                    <HStack
                        spacing={3}
                        p={3}
                        bg="green.50"
                        borderRadius="lg"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{bg: "green.100"}}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRecipeClick(day.lunch);
                        }}
                    >
                        <Text fontSize="xl">☀️</Text>
                        <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                                {day.lunch.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                                {day.lunch.nutrition.calories} cal
                            </Text>
                        </VStack>
                    </HStack>

                    {/* Dinner */}
                    <HStack
                        spacing={3}
                        p={3}
                        bg="purple.50"
                        borderRadius="lg"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{bg: "purple.100"}}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRecipeClick(day.dinner);
                        }}
                    >
                        <Text fontSize="xl">🌙</Text>
                        <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                                {day.dinner.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                                {day.dinner.nutrition.calories} cal
                            </Text>
                        </VStack>
                    </HStack>

                    {/* Snacks */}
                    {day.snacks && day.snacks.length > 0 && (
                        <HStack
                            spacing={3}
                            p={3}
                            bg="blue.50"
                            borderRadius="lg"
                            cursor="pointer"
                            transition="all 0.2s"
                            _hover={{bg: "blue.100"}}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRecipeClick(day.snacks![0]);
                            }}
                        >
                            <Text fontSize="xl">🍎</Text>
                            <VStack align="start" spacing={0} flex={1}>
                                <Text fontSize="sm" fontWeight="bold">
                                    {day.snacks.length} Snack(s)
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                    Healthy bites
                                </Text>
                            </VStack>
                        </HStack>
                    )}

                    {/* View Details Button */}
                    <Button
                        mt={2}
                        colorScheme="purple"
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(day)}
                    >
                        View Full Menu
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default WeeklyMenuCard;
