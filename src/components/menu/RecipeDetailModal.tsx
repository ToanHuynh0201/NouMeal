import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Box,
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
    useColorModeValue,
} from "@chakra-ui/react";
import {FiClock, FiUsers} from "react-icons/fi";
import {CheckCircleIcon} from "@chakra-ui/icons";
import {animationPresets} from "@/styles/animation";
import type {Recipe} from "@/types/recipe";

interface RecipeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe | null;
}

const RecipeDetailModal = ({isOpen, onClose, recipe}: RecipeDetailModalProps) => {
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    if (!recipe) return null;

    const difficultyColor = {
        easy: "green",
        medium: "yellow",
        hard: "red",
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
            <ModalContent
                bg={cardBg}
                borderRadius="2xl"
                maxH="90vh"
                animation={animationPresets.fadeInUp}
            >
                <ModalHeader borderBottom="1px" borderColor={borderColor} pb={4}>
                    <HStack spacing={3}>
                        <Heading size="lg">{recipe.title}</Heading>
                        <Badge
                            colorScheme={difficultyColor[recipe.difficulty]}
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                        >
                            {recipe.difficulty}
                        </Badge>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton
                    size="lg"
                    top={4}
                    right={4}
                    _hover={{
                        bg: "red.50",
                        color: "red.500",
                    }}
                />
                <ModalBody p={0}>
                    <Grid templateColumns={{base: "1fr", lg: "1fr 1fr"}} gap={0}>
                        {/* Image Section */}
                        <GridItem>
                            <Box
                                position="relative"
                                h={{base: "250px", md: "350px", lg: "full"}}
                                minH={{lg: "500px"}}
                            >
                                <Image
                                    src={recipe.image}
                                    alt={recipe.title}
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
                                    bgGradient="linear(to-b, transparent 50%, blackAlpha.700)"
                                />
                                <Box
                                    position="absolute"
                                    bottom={4}
                                    left={4}
                                    right={4}
                                    color="white"
                                >
                                    <Text fontSize="lg" fontWeight="medium" mb={2}>
                                        {recipe.description}
                                    </Text>
                                    <HStack spacing={4}>
                                        <HStack spacing={2}>
                                            <Icon as={FiClock} boxSize={5} />
                                            <Text fontWeight="bold">
                                                {recipe.cookingTime}
                                            </Text>
                                        </HStack>
                                        <HStack spacing={2}>
                                            <Icon as={FiUsers} boxSize={5} />
                                            <Text fontWeight="bold">
                                                {recipe.servingSize}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                </Box>
                            </Box>
                        </GridItem>

                        {/* Details Section */}
                        <GridItem>
                            <VStack
                                spacing={6}
                                align="stretch"
                                p={{base: 6, md: 8}}
                                h="full"
                                overflowY="auto"
                            >
                                {/* Tags */}
                                <HStack spacing={2} flexWrap="wrap">
                                    {recipe.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            colorScheme="purple"
                                            fontSize="xs"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </HStack>

                                <Divider />

                                {/* Nutrition Facts */}
                                <Box>
                                    <Heading size="md" mb={4} color="brand.600">
                                        Nutrition Facts
                                    </Heading>
                                    <Card
                                        bg="gray.50"
                                        borderRadius="xl"
                                        border="1px"
                                        borderColor={borderColor}
                                    >
                                        <CardBody p={4}>
                                            <SimpleGrid columns={2} spacing={3}>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="2xl"
                                                        fontWeight="bold"
                                                        color="brand.600"
                                                    >
                                                        {recipe.nutrition.calories}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                        fontWeight="medium"
                                                    >
                                                        Calories
                                                    </Text>
                                                </VStack>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="lg"
                                                        fontWeight="bold"
                                                    >
                                                        {recipe.nutrition.protein}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        Protein
                                                    </Text>
                                                </VStack>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="lg"
                                                        fontWeight="bold"
                                                    >
                                                        {recipe.nutrition.carbs}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        Carbs
                                                    </Text>
                                                </VStack>
                                                <VStack align="start" spacing={1}>
                                                    <Text
                                                        fontSize="lg"
                                                        fontWeight="bold"
                                                    >
                                                        {recipe.nutrition.fat}
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        Fat
                                                    </Text>
                                                </VStack>
                                            </SimpleGrid>
                                            <Divider my={3} />
                                            <SimpleGrid columns={2} spacing={2}>
                                                <HStack justify="space-between">
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        Fiber
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                    >
                                                        {recipe.nutrition.fiber}
                                                    </Text>
                                                </HStack>
                                                <HStack justify="space-between">
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        Sugar
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                    >
                                                        {recipe.nutrition.sugar}
                                                    </Text>
                                                </HStack>
                                                <HStack justify="space-between">
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        Sodium
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                    >
                                                        {recipe.nutrition.sodium}
                                                    </Text>
                                                </HStack>
                                                <HStack justify="space-between">
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.600"
                                                    >
                                                        Cholesterol
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="medium"
                                                    >
                                                        {
                                                            recipe.nutrition
                                                                .cholesterol
                                                        }
                                                    </Text>
                                                </HStack>
                                            </SimpleGrid>
                                        </CardBody>
                                    </Card>
                                </Box>

                                <Divider />

                                {/* Ingredients */}
                                <Box>
                                    <Heading size="md" mb={4} color="brand.600">
                                        Ingredients
                                    </Heading>
                                    <List spacing={2}>
                                        {recipe.ingredients.map(
                                            (ingredient, index) => (
                                                <ListItem
                                                    key={index}
                                                    fontSize="sm"
                                                    display="flex"
                                                    alignItems="start"
                                                >
                                                    <ListIcon
                                                        as={CheckCircleIcon}
                                                        color="green.500"
                                                        mt={1}
                                                    />
                                                    <Text>{ingredient}</Text>
                                                </ListItem>
                                            )
                                        )}
                                    </List>
                                </Box>

                                <Divider />

                                {/* Instructions */}
                                <Box pb={4}>
                                    <Heading size="md" mb={4} color="brand.600">
                                        Instructions
                                    </Heading>
                                    <List spacing={4}>
                                        {recipe.instructions.map((step, index) => (
                                            <ListItem
                                                key={index}
                                                display="flex"
                                                alignItems="start"
                                            >
                                                <Badge
                                                    colorScheme="brand"
                                                    borderRadius="full"
                                                    px={3}
                                                    py={1}
                                                    mr={3}
                                                    flexShrink={0}
                                                >
                                                    {index + 1}
                                                </Badge>
                                                <Text fontSize="sm" mt={1}>
                                                    {step}
                                                </Text>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </VStack>
                        </GridItem>
                    </Grid>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default RecipeDetailModal;
