import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Grid,
    GridItem,
    Image,
    Divider,
    List,
    ListItem,
    ListIcon,
    Icon,
    SimpleGrid,
    Card,
    CardBody,
} from "@chakra-ui/react";
import {FiClock, FiUsers} from "react-icons/fi";
import {CheckCircleIcon} from "@chakra-ui/icons";
import MainLayout from "@/components/layout/MainLayout";
import {animationPresets} from "@/styles/animation";
import {useThemeValues} from "@/styles/themeUtils";

// Sample recipe data - replace with actual data from API
const recipeData = {
    title: "Avocado Sunrise Toast",
    description:
        "A delicious and nutritious breakfast option that will brighten up your morning with its vibrant colors and flavors.",
    cookingTime: "15 minutes",
    servingSize: "2 servings",
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&h=600&fit=crop",
    nutrition: {
        calories: 350,
        protein: "15g",
        fat: "20g",
        satFat: "5g",
        carbs: "30g",
        cholesterol: "185mg",
        fiber: "8g",
        sugar: "4g",
        sodium: "400mg",
    },
    ingredients: [
        "1 ripe avocado",
        "2 slices of whole grain bread",
        "2 eggs",
        "1 tomato, sliced",
        "1/4 cup of feta cheese",
        "Salt and pepper to taste",
        "Fresh herbs for garnish",
    ],
    instructions: [
        "Toast the bread until golden brown.",
        "Mash the avocado in a bowl and season with salt and pepper.",
        "Poach or fry the eggs to your liking.",
        "Spread the mashed avocado on the toasted bread slices.",
        "Top with sliced tomato, feta cheese, and the cooked eggs.",
        "Season with more salt and pepper if desired.",
        "Garnish with fresh herbs before serving.",
    ],
};

const RecipeDetailPage = () => {
    const {cardBg, cardShadow} = useThemeValues();

    return (
        <MainLayout showHeader={true} showFooter={true}>
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Hero Section */}
                    <Box animation={animationPresets.fadeInUp}>
                        <Card
                            bg={cardBg}
                            shadow={cardShadow}
                            borderRadius="2xl"
                            overflow="hidden"
                            border="1px"
                            borderColor="gray.200"
                        >
                            <Grid
                                templateColumns={{base: "1fr", lg: "1fr 1fr"}}
                                gap={0}
                            >
                                {/* Image Section */}
                                <GridItem>
                                    <Box
                                        position="relative"
                                        h={{base: "300px", md: "400px", lg: "full"}}
                                        minH={{lg: "500px"}}
                                    >
                                        <Image
                                            src={recipeData.image}
                                            alt={recipeData.title}
                                            objectFit="cover"
                                            w="full"
                                            h="full"
                                        />
                                        <Box
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            right={0}
                                            bottom={0}
                                            bgGradient="linear(to-t, blackAlpha.600, transparent)"
                                        />
                                    </Box>
                                </GridItem>

                                {/* Info Section */}
                                <GridItem>
                                    <VStack
                                        align="stretch"
                                        spacing={6}
                                        p={{base: 6, md: 8, lg: 10}}
                                        h="full"
                                        justify="space-between"
                                    >
                                        <Box>
                                            <Heading
                                                size="2xl"
                                                mb={4}
                                                color="gray.800"
                                                fontWeight="bold"
                                            >
                                                {recipeData.title}
                                            </Heading>
                                            <Text
                                                fontSize="lg"
                                                color="gray.600"
                                                lineHeight="tall"
                                            >
                                                {recipeData.description}
                                            </Text>
                                        </Box>

                                        <Divider />

                                        {/* Quick Info */}
                                        <SimpleGrid columns={2} spacing={4}>
                                            <HStack
                                                spacing={3}
                                                p={4}
                                                bg="blue.50"
                                                borderRadius="lg"
                                                border="1px"
                                                borderColor="blue.100"
                                            >
                                                <Icon
                                                    as={FiClock}
                                                    boxSize={6}
                                                    color="blue.500"
                                                />
                                                <Box>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                        fontWeight="semibold"
                                                        textTransform="uppercase"
                                                    >
                                                        Cooking Time
                                                    </Text>
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                        color="gray.700"
                                                    >
                                                        {recipeData.cookingTime}
                                                    </Text>
                                                </Box>
                                            </HStack>

                                            <HStack
                                                spacing={3}
                                                p={4}
                                                bg="purple.50"
                                                borderRadius="lg"
                                                border="1px"
                                                borderColor="purple.100"
                                            >
                                                <Icon
                                                    as={FiUsers}
                                                    boxSize={6}
                                                    color="purple.500"
                                                />
                                                <Box>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                        fontWeight="semibold"
                                                        textTransform="uppercase"
                                                    >
                                                        Serving Size
                                                    </Text>
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                        color="gray.700"
                                                    >
                                                        {recipeData.servingSize}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                        </SimpleGrid>
                                    </VStack>
                                </GridItem>
                            </Grid>
                        </Card>
                    </Box>

                    {/* Nutrition & Ingredients Section */}
                    <Grid
                        templateColumns={{base: "1fr", lg: "1fr 2fr"}}
                        gap={6}
                        animation={animationPresets.fadeIn}
                    >
                        {/* Nutrition Facts */}
                        <GridItem>
                            <Card
                                bg={cardBg}
                                shadow={cardShadow}
                                borderRadius="2xl"
                                border="1px"
                                borderColor="gray.200"
                                h="full"
                            >
                                <CardBody p={6}>
                                    <Heading
                                        size="md"
                                        mb={4}
                                        color="gray.800"
                                        fontWeight="bold"
                                    >
                                        Nutrition Per Serving
                                    </Heading>
                                    <VStack spacing={3} align="stretch">
                                        {Object.entries(recipeData.nutrition).map(
                                            ([key, value]) => (
                                                <HStack
                                                    key={key}
                                                    justify="space-between"
                                                    p={3}
                                                    bg="gray.50"
                                                    borderRadius="lg"
                                                    _hover={{
                                                        bg: "brand.50",
                                                        transform:
                                                            "translateX(4px)",
                                                    }}
                                                    transition="all 0.2s"
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="semibold"
                                                        color="gray.700"
                                                        textTransform="capitalize"
                                                    >
                                                        {key
                                                            .replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )
                                                            .trim()}
                                                    </Text>
                                                    <Badge
                                                        colorScheme="brand"
                                                        fontSize="sm"
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                    >
                                                        {value}
                                                    </Badge>
                                                </HStack>
                                            )
                                        )}
                                    </VStack>
                                </CardBody>
                            </Card>
                        </GridItem>

                        {/* Ingredients */}
                        <GridItem>
                            <Card
                                bg={cardBg}
                                shadow={cardShadow}
                                borderRadius="2xl"
                                border="1px"
                                borderColor="gray.200"
                                h="full"
                            >
                                <CardBody p={6}>
                                    <Heading
                                        size="md"
                                        mb={4}
                                        color="gray.800"
                                        fontWeight="bold"
                                    >
                                        Ingredients
                                    </Heading>
                                    <List spacing={3}>
                                        {recipeData.ingredients.map(
                                            (ingredient, index) => (
                                                <ListItem
                                                    key={index}
                                                    p={3}
                                                    bg="gray.50"
                                                    borderRadius="lg"
                                                    display="flex"
                                                    alignItems="center"
                                                    _hover={{
                                                        bg: "green.50",
                                                        borderColor: "green.200",
                                                    }}
                                                    transition="all 0.2s"
                                                    border="1px"
                                                    borderColor="transparent"
                                                >
                                                    <ListIcon
                                                        as={CheckCircleIcon}
                                                        color="green.500"
                                                        boxSize={5}
                                                    />
                                                    <Text
                                                        fontSize="md"
                                                        color="gray.700"
                                                    >
                                                        {ingredient}
                                                    </Text>
                                                </ListItem>
                                            )
                                        )}
                                    </List>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </Grid>

                    {/* Instructions Section */}
                    <Box animation={animationPresets.fadeIn}>
                        <Card
                            bg={cardBg}
                            shadow={cardShadow}
                            borderRadius="2xl"
                            border="1px"
                            borderColor="gray.200"
                        >
                            <CardBody p={{base: 6, md: 8}}>
                                <Heading
                                    size="md"
                                    mb={6}
                                    color="gray.800"
                                    fontWeight="bold"
                                >
                                    Instructions
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    {recipeData.instructions.map((step, index) => (
                                        <HStack
                                            key={index}
                                            align="start"
                                            p={5}
                                            bg="gray.50"
                                            borderRadius="xl"
                                            border="2px"
                                            borderColor="transparent"
                                            _hover={{
                                                bg: "blue.50",
                                                borderColor: "brand.200",
                                                transform: "translateX(8px)",
                                            }}
                                            transition="all 0.3s"
                                            spacing={4}
                                        >
                                            <Badge
                                                colorScheme="brand"
                                                fontSize="lg"
                                                px={4}
                                                py={2}
                                                borderRadius="full"
                                                fontWeight="bold"
                                                minW="48px"
                                                textAlign="center"
                                            >
                                                {index + 1}
                                            </Badge>
                                            <Text
                                                fontSize="md"
                                                color="gray.700"
                                                lineHeight="tall"
                                                flex="1"
                                            >
                                                {step}
                                            </Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    </Box>
                </VStack>
            </Container>
        </MainLayout>
    );
};

export default RecipeDetailPage;
