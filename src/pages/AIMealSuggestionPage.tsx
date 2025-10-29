import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Textarea,
    Button,
    SimpleGrid,
    Card,
    CardBody,
    Image,
    Badge,
    HStack,
    Icon,
    useDisclosure,
    Flex,
    Progress,
    Tag,
    TagLabel,
    TagLeftIcon,
} from "@chakra-ui/react";
import {useState} from "react";
import {
    FiSearch,
    FiStar,
    FiClock,
    FiUsers,
    FiTrendingUp,
    FiZap,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {mockMealSuggestions} from "@/data/mockData";
import type {Recipe} from "@/types/recipe";
import type {MealSuggestion} from "@/types/ai";

const AIMealSuggestionPage = () => {
    const [prompt, setPrompt] = useState("");
    const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const handleRecipeClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        onOpen();
    };

    const handleSearch = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simple keyword matching for demo
        const lowerPrompt = prompt.toLowerCase();
        let results: MealSuggestion[] = [];

        if (lowerPrompt.includes("breakfast")) {
            results = mockMealSuggestions["healthy breakfast"];
        } else if (
            lowerPrompt.includes("protein") ||
            lowerPrompt.includes("lunch")
        ) {
            results = mockMealSuggestions["high protein lunch"];
        } else if (
            lowerPrompt.includes("low carb") ||
            lowerPrompt.includes("keto") ||
            lowerPrompt.includes("dinner")
        ) {
            results = mockMealSuggestions["low carb dinner"];
        } else if (
            lowerPrompt.includes("vegan") ||
            lowerPrompt.includes("plant")
        ) {
            results = mockMealSuggestions["vegan meal"];
        } else if (
            lowerPrompt.includes("quick") ||
            lowerPrompt.includes("easy") ||
            lowerPrompt.includes("fast")
        ) {
            results = mockMealSuggestions["quick and easy"];
        } else {
            results = mockMealSuggestions.default;
        }

        setSuggestions(results);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <MainLayout showHeader={true} showFooter={true}>
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Header Section */}
                    <Box textAlign="center" mb={4}>
                        <Heading
                            size="2xl"
                            bgGradient="linear(to-r, purple.500, pink.500)"
                            bgClip="text"
                            mb={3}
                        >
                            AI Meal Suggestion
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Describe what you're craving, and let our AI suggest
                            the perfect meal for you!
                        </Text>
                    </Box>

                    {/* Search Box */}
                    <Card
                        shadow="lg"
                        borderRadius="2xl"
                        bg="white"
                        border="2px"
                        borderColor="purple.100"
                    >
                        <CardBody p={6}>
                            <VStack spacing={4}>
                                <Textarea
                                    placeholder="E.g., 'I want a healthy breakfast with eggs' or 'Suggest a high-protein lunch' or 'Quick vegan dinner ideas'..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    size="lg"
                                    rows={4}
                                    fontSize="md"
                                    borderColor="purple.200"
                                    _hover={{borderColor: "purple.300"}}
                                    _focus={{
                                        borderColor: "purple.500",
                                        boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
                                    }}
                                />
                                <Button
                                    leftIcon={<Icon as={FiSearch} />}
                                    colorScheme="purple"
                                    size="lg"
                                    width="full"
                                    onClick={handleSearch}
                                    isDisabled={!prompt.trim()}
                                    isLoading={isLoading}
                                    loadingText="Finding perfect meals..."
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: "lg",
                                    }}
                                    transition="all 0.2s"
                                >
                                    Get AI Suggestions
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Loading State */}
                    {isLoading && (
                        <Box textAlign="center" py={8}>
                            <LoadingSpinner
                                message="Analyzing your request..."
                                minHeight="200px"
                                variant="primary"
                            />
                        </Box>
                    )}

                    {/* Results Section */}
                    {!isLoading && hasSearched && suggestions.length > 0 && (
                        <VStack spacing={6} align="stretch">
                            <Flex
                                justify="space-between"
                                align="center"
                                flexWrap="wrap"
                            >
                                <Heading size="lg" color="gray.700">
                                    Suggested Meals ({suggestions.length})
                                </Heading>
                                <Text color="gray.500" fontSize="sm">
                                    Sorted by relevance
                                </Text>
                            </Flex>

                            <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={6}>
                                {suggestions.map((suggestion) => (
                                    <Card
                                        key={suggestion.id}
                                        cursor="pointer"
                                        onClick={() =>
                                            handleRecipeClick(suggestion.recipe)
                                        }
                                        transition="all 0.3s"
                                        _hover={{
                                            transform: "translateY(-8px)",
                                            boxShadow: "2xl",
                                        }}
                                        overflow="hidden"
                                        position="relative"
                                    >
                                        {/* Match Score Badge */}
                                        <Badge
                                            position="absolute"
                                            top={3}
                                            right={3}
                                            colorScheme="green"
                                            fontSize="sm"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                            zIndex={1}
                                        >
                                            <HStack spacing={1}>
                                                <Icon as={FiStar} />
                                                <Text>{suggestion.matchScore}% Match</Text>
                                            </HStack>
                                        </Badge>

                                        <Image
                                            src={suggestion.recipe.image}
                                            alt={suggestion.recipe.title}
                                            h="200px"
                                            w="100%"
                                            objectFit="cover"
                                        />

                                        <CardBody>
                                            <VStack align="stretch" spacing={3}>
                                                <Heading size="md" noOfLines={2}>
                                                    {suggestion.recipe.title}
                                                </Heading>

                                                <Progress
                                                    value={suggestion.matchScore}
                                                    size="sm"
                                                    colorScheme="green"
                                                    borderRadius="full"
                                                />

                                                <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                    noOfLines={3}
                                                >
                                                    {suggestion.matchReason}
                                                </Text>

                                                <HStack spacing={2} flexWrap="wrap">
                                                    <Tag size="sm" colorScheme="purple">
                                                        <TagLeftIcon as={FiClock} />
                                                        <TagLabel>
                                                            {suggestion.recipe.cookingTime}
                                                        </TagLabel>
                                                    </Tag>
                                                    <Tag size="sm" colorScheme="blue">
                                                        <TagLeftIcon as={FiUsers} />
                                                        <TagLabel>
                                                            {suggestion.recipe.servingSize}
                                                        </TagLabel>
                                                    </Tag>
                                                    <Tag size="sm" colorScheme="orange">
                                                        <TagLeftIcon as={FiZap} />
                                                        <TagLabel>
                                                            {suggestion.recipe.nutrition.calories}{" "}
                                                            cal
                                                        </TagLabel>
                                                    </Tag>
                                                </HStack>

                                                <HStack spacing={2} flexWrap="wrap">
                                                    {suggestion.recipe.tags
                                                        .slice(0, 3)
                                                        .map((tag, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                colorScheme="purple"
                                                                fontSize="xs"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                </HStack>

                                                <Box
                                                    bg="gray.50"
                                                    p={3}
                                                    borderRadius="lg"
                                                >
                                                    <HStack
                                                        spacing={4}
                                                        justify="space-around"
                                                        fontSize="sm"
                                                    >
                                                        <VStack spacing={0}>
                                                            <Text
                                                                fontWeight="bold"
                                                                color="purple.600"
                                                            >
                                                                {
                                                                    suggestion.recipe.nutrition
                                                                        .protein
                                                                }
                                                            </Text>
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray.600"
                                                            >
                                                                Protein
                                                            </Text>
                                                        </VStack>
                                                        <VStack spacing={0}>
                                                            <Text
                                                                fontWeight="bold"
                                                                color="orange.600"
                                                            >
                                                                {
                                                                    suggestion.recipe.nutrition
                                                                        .carbs
                                                                }
                                                            </Text>
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray.600"
                                                            >
                                                                Carbs
                                                            </Text>
                                                        </VStack>
                                                        <VStack spacing={0}>
                                                            <Text
                                                                fontWeight="bold"
                                                                color="yellow.600"
                                                            >
                                                                {
                                                                    suggestion.recipe.nutrition
                                                                        .fat
                                                                }
                                                            </Text>
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray.600"
                                                            >
                                                                Fat
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </Box>

                                                {suggestion.alternativeOptions &&
                                                    suggestion.alternativeOptions.length >
                                                        0 && (
                                                        <HStack
                                                            spacing={1}
                                                            fontSize="xs"
                                                            color="blue.600"
                                                        >
                                                            <Icon as={FiTrendingUp} />
                                                            <Text>
                                                                +
                                                                {
                                                                    suggestion
                                                                        .alternativeOptions
                                                                        .length
                                                                }{" "}
                                                                alternative
                                                                {suggestion.alternativeOptions
                                                                    .length > 1
                                                                    ? "s"
                                                                    : ""}{" "}
                                                                available
                                                            </Text>
                                                        </HStack>
                                                    )}
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    )}

                    {/* No Results */}
                    {!isLoading && hasSearched && suggestions.length === 0 && (
                        <Box textAlign="center" py={12}>
                            <Icon
                                as={FiSearch}
                                boxSize={16}
                                color="gray.300"
                                mb={4}
                            />
                            <Heading size="md" color="gray.500" mb={2}>
                                No results found
                            </Heading>
                            <Text color="gray.400">
                                Try a different description or be more specific
                            </Text>
                        </Box>
                    )}

                    {/* Example Prompts */}
                    {!hasSearched && (
                        <Box>
                            <Text
                                fontSize="sm"
                                color="gray.600"
                                mb={3}
                                fontWeight="semibold"
                            >
                                Try these examples:
                            </Text>
                            <Flex gap={2} flexWrap="wrap">
                                {[
                                    "Healthy breakfast with eggs",
                                    "High protein lunch",
                                    "Quick vegan dinner",
                                    "Low carb meal",
                                    "Easy recipe under 30 minutes",
                                ].map((example, idx) => (
                                    <Tag
                                        key={idx}
                                        size="md"
                                        colorScheme="purple"
                                        variant="subtle"
                                        cursor="pointer"
                                        onClick={() => setPrompt(example)}
                                        _hover={{
                                            bg: "purple.100",
                                            transform: "scale(1.05)",
                                        }}
                                        transition="all 0.2s"
                                    >
                                        {example}
                                    </Tag>
                                ))}
                            </Flex>
                        </Box>
                    )}
                </VStack>
            </Container>

            {/* Recipe Detail Modal */}
            <RecipeDetailModal
                isOpen={isOpen}
                onClose={onClose}
                recipe={selectedRecipe}
            />
        </MainLayout>
    );
};

export default AIMealSuggestionPage;
