import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    SimpleGrid,
    Card,
    CardBody,
    Image,
    Icon,
    Divider,
} from "@chakra-ui/react";
import {FiClock, FiUsers} from "react-icons/fi";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import type {Recipe, DailyMenu} from "@/types/recipe";

interface DayMenuViewProps {
    dailyMenu: DailyMenu;
    onRecipeClick: (recipe: Recipe) => void;
}

const DayMenuView = ({dailyMenu, onRecipeClick}: DayMenuViewProps) => {
    const breakfastSection = useScrollAnimation({threshold: 0.1});
    const lunchSection = useScrollAnimation({threshold: 0.1});
    const dinnerSection = useScrollAnimation({threshold: 0.1});
    const snackSection = useScrollAnimation({threshold: 0.1});

    const RecipeCard = ({
        recipe,
        delay = 0,
        isVisible,
    }: {
        recipe: Recipe;
        delay?: number;
        isVisible: boolean;
    }) => {
        const categoryColor = {
            breakfast: "orange",
            lunch: "green",
            dinner: "purple",
            snack: "blue",
        };

        return (
            <Card
                cursor="pointer"
                onClick={() => onRecipeClick(recipe)}
                bg="white"
                shadow="md"
                borderRadius="2xl"
                overflow="hidden"
                transition="all 0.3s ease"
                opacity={isVisible ? 1 : 0}
                transform={isVisible ? "translateY(0)" : "translateY(30px)"}
                style={{
                    transitionDelay: `${delay}s`,
                }}
                _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                }}
            >
                <Box position="relative" h="200px" overflow="hidden">
                    <Image
                        src={recipe.image}
                        alt={recipe.title}
                        objectFit="cover"
                        w="full"
                        h="full"
                        transition="transform 0.3s"
                        _hover={{transform: "scale(1.1)"}}
                    />
                    <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme={categoryColor[recipe.category]}
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontWeight="bold"
                        textTransform="capitalize"
                    >
                        {recipe.category}
                    </Badge>
                </Box>
                <CardBody p={5}>
                    <VStack align="start" spacing={3}>
                        <Heading size="md" noOfLines={2}>
                            {recipe.title}
                        </Heading>
                        <Text color="gray.600" fontSize="sm" noOfLines={2}>
                            {recipe.description}
                        </Text>
                        <HStack spacing={4} fontSize="sm" color="gray.600">
                            <HStack spacing={1}>
                                <Icon as={FiClock} />
                                <Text>{recipe.cookingTime}</Text>
                            </HStack>
                            <HStack spacing={1}>
                                <Icon as={FiUsers} />
                                <Text>{recipe.servingSize}</Text>
                            </HStack>
                        </HStack>
                        <Divider />
                        <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={0}>
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    color="brand.600"
                                >
                                    {recipe.nutrition.calories}
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                    calories
                                </Text>
                            </VStack>
                            <HStack spacing={3} fontSize="xs">
                                <VStack spacing={0}>
                                    <Text fontWeight="bold">
                                        {recipe.nutrition.protein}
                                    </Text>
                                    <Text color="gray.600">protein</Text>
                                </VStack>
                                <VStack spacing={0}>
                                    <Text fontWeight="bold">
                                        {recipe.nutrition.carbs}
                                    </Text>
                                    <Text color="gray.600">carbs</Text>
                                </VStack>
                                <VStack spacing={0}>
                                    <Text fontWeight="bold">
                                        {recipe.nutrition.fat}
                                    </Text>
                                    <Text color="gray.600">fat</Text>
                                </VStack>
                            </HStack>
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>
        );
    };

    return (
        <VStack spacing={10} align="stretch">
            {/* Breakfast Section */}
            <Box ref={breakfastSection.elementRef}>
                <VStack
                    align="start"
                    spacing={4}
                    opacity={breakfastSection.isVisible ? 1 : 0}
                    transform={
                        breakfastSection.isVisible
                            ? "translateY(0)"
                            : "translateY(30px)"
                    }
                    transition="all 0.6s ease-out"
                >
                    <HStack spacing={3}>
                        <Box
                            bg="orange.50"
                            p={3}
                            borderRadius="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text fontSize="2xl">🌅</Text>
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Heading size="lg">Breakfast</Heading>
                            <Text color="gray.600" fontSize="sm">
                                Start your day with energy
                            </Text>
                        </VStack>
                    </HStack>
                    <RecipeCard
                        recipe={dailyMenu.breakfast}
                        delay={0.1}
                        isVisible={breakfastSection.isVisible}
                    />
                </VStack>
            </Box>

            {/* Lunch Section */}
            <Box ref={lunchSection.elementRef}>
                <VStack
                    align="start"
                    spacing={4}
                    opacity={lunchSection.isVisible ? 1 : 0}
                    transform={
                        lunchSection.isVisible
                            ? "translateY(0)"
                            : "translateY(30px)"
                    }
                    transition="all 0.6s ease-out"
                >
                    <HStack spacing={3}>
                        <Box
                            bg="green.50"
                            p={3}
                            borderRadius="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text fontSize="2xl">☀️</Text>
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Heading size="lg">Lunch</Heading>
                            <Text color="gray.600" fontSize="sm">
                                Power through your afternoon
                            </Text>
                        </VStack>
                    </HStack>
                    <RecipeCard
                        recipe={dailyMenu.lunch}
                        delay={0.1}
                        isVisible={lunchSection.isVisible}
                    />
                </VStack>
            </Box>

            {/* Dinner Section */}
            <Box ref={dinnerSection.elementRef}>
                <VStack
                    align="start"
                    spacing={4}
                    opacity={dinnerSection.isVisible ? 1 : 0}
                    transform={
                        dinnerSection.isVisible
                            ? "translateY(0)"
                            : "translateY(30px)"
                    }
                    transition="all 0.6s ease-out"
                >
                    <HStack spacing={3}>
                        <Box
                            bg="purple.50"
                            p={3}
                            borderRadius="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Text fontSize="2xl">🌙</Text>
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Heading size="lg">Dinner</Heading>
                            <Text color="gray.600" fontSize="sm">
                                End your day nutritiously
                            </Text>
                        </VStack>
                    </HStack>
                    <RecipeCard
                        recipe={dailyMenu.dinner}
                        delay={0.1}
                        isVisible={dinnerSection.isVisible}
                    />
                </VStack>
            </Box>

            {/* Snacks Section */}
            {dailyMenu.snacks && dailyMenu.snacks.length > 0 && (
                <Box ref={snackSection.elementRef}>
                    <VStack
                        align="start"
                        spacing={4}
                        opacity={snackSection.isVisible ? 1 : 0}
                        transform={
                            snackSection.isVisible
                                ? "translateY(0)"
                                : "translateY(30px)"
                        }
                        transition="all 0.6s ease-out"
                    >
                        <HStack spacing={3}>
                            <Box
                                bg="blue.50"
                                p={3}
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text fontSize="2xl">🍎</Text>
                            </Box>
                            <VStack align="start" spacing={0}>
                                <Heading size="lg">Snacks</Heading>
                                <Text color="gray.600" fontSize="sm">
                                    Healthy bites between meals
                                </Text>
                            </VStack>
                        </HStack>
                        <SimpleGrid columns={{base: 1, md: 2}} spacing={6} w="full">
                            {dailyMenu.snacks.map((snack, index) => (
                                <RecipeCard
                                    key={snack.id}
                                    recipe={snack}
                                    delay={0.1 + index * 0.1}
                                    isVisible={snackSection.isVisible}
                                />
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Box>
            )}
        </VStack>
    );
};

export default DayMenuView;
