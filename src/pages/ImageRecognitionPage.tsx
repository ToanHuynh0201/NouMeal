import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Button,
    SimpleGrid,
    Card,
    CardBody,
    Image,
    Badge,
    HStack,
    Icon,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    useToast,
    Input,
    Center,
} from "@chakra-ui/react";
import {useState, useRef} from "react";
import {
    FiUpload,
    FiCamera,
    FiCheckCircle,
    FiAlertCircle,
    FiRefreshCw,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {mockImageRecognitionResults} from "@/data/mockData";
import type {ImageRecognitionResult} from "@/types/ai";

const ImageRecognitionPage = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ImageRecognitionResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB limit
                toast({
                    title: "File too large",
                    description: "Please select an image smaller than 5MB.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);

        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Randomly select a mock result
        const randomResult =
            mockImageRecognitionResults[
                Math.floor(Math.random() * mockImageRecognitionResults.length)
            ];

        // Use the selected image instead of mock image URL
        setResult({
            ...randomResult,
            imageUrl: selectedImage,
        });

        setIsAnalyzing(false);

        toast({
            title: "Analysis complete!",
            description: "Food items identified successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleReset = () => {
        setSelectedImage(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <MainLayout showHeader={true} showFooter={true}>
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Header Section */}
                    <Box textAlign="center" mb={4}>
                        <Heading
                            size="2xl"
                            bgGradient="linear(to-r, blue.500, teal.500)"
                            bgClip="text"
                            mb={3}
                        >
                            Food Image Recognition
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Upload a photo of your meal to identify ingredients and
                            analyze nutrition
                        </Text>
                    </Box>

                    {/* Upload Section */}
                    {!selectedImage && !result && (
                        <Card
                            shadow="lg"
                            borderRadius="2xl"
                            bg="white"
                            border="2px"
                            borderColor="blue.100"
                        >
                            <CardBody p={8}>
                                <VStack spacing={6}>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        display="none"
                                    />

                                    <Center
                                        border="3px dashed"
                                        borderColor="blue.200"
                                        borderRadius="xl"
                                        p={12}
                                        bg="blue.50"
                                        width="100%"
                                        cursor="pointer"
                                        onClick={handleUploadClick}
                                        transition="all 0.3s"
                                        _hover={{
                                            borderColor: "blue.400",
                                            bg: "blue.100",
                                            transform: "scale(1.02)",
                                        }}
                                    >
                                        <VStack spacing={4}>
                                            <Icon
                                                as={FiCamera}
                                                boxSize={20}
                                                color="blue.500"
                                            />
                                            <VStack spacing={2}>
                                                <Heading size="md" color="gray.700">
                                                    Upload or Drop Your Food Image
                                                </Heading>
                                                <Text color="gray.500">
                                                    Supports JPG, PNG up to 5MB
                                                </Text>
                                            </VStack>
                                            <Button
                                                leftIcon={<Icon as={FiUpload} />}
                                                colorScheme="blue"
                                                size="lg"
                                                onClick={handleUploadClick}
                                            >
                                                Choose Image
                                            </Button>
                                        </VStack>
                                    </Center>

                                    {/* Example Images Section */}
                                    <Box width="100%">
                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            mb={3}
                                            fontWeight="semibold"
                                        >
                                            Or try with example images:
                                        </Text>
                                        <SimpleGrid columns={{base: 2, md: 3}} spacing={4}>
                                            {mockImageRecognitionResults.map(
                                                (mockResult, idx) => (
                                                    <Card
                                                        key={idx}
                                                        cursor="pointer"
                                                        onClick={() => {
                                                            setSelectedImage(
                                                                mockResult.imageUrl
                                                            );
                                                            setResult(null);
                                                        }}
                                                        transition="all 0.2s"
                                                        _hover={{
                                                            transform: "scale(1.05)",
                                                            boxShadow: "lg",
                                                        }}
                                                    >
                                                        <Image
                                                            src={mockResult.imageUrl}
                                                            alt={`Example ${idx + 1}`}
                                                            h="120px"
                                                            w="100%"
                                                            objectFit="cover"
                                                            borderRadius="md"
                                                        />
                                                        <CardBody p={2}>
                                                            <Text
                                                                fontSize="xs"
                                                                color="gray.600"
                                                                textAlign="center"
                                                            >
                                                                Example {idx + 1}
                                                            </Text>
                                                        </CardBody>
                                                    </Card>
                                                )
                                            )}
                                        </SimpleGrid>
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Preview and Analyze Section */}
                    {selectedImage && !result && !isAnalyzing && (
                        <VStack spacing={6}>
                            <Card shadow="lg" borderRadius="2xl" overflow="hidden" w="100%">
                                <Image
                                    src={selectedImage}
                                    alt="Selected food"
                                    maxH="500px"
                                    w="100%"
                                    objectFit="contain"
                                    bg="gray.50"
                                />
                                <CardBody>
                                    <HStack spacing={4} justify="center">
                                        <Button
                                            leftIcon={<Icon as={FiCamera} />}
                                            colorScheme="blue"
                                            size="lg"
                                            onClick={handleAnalyze}
                                        >
                                            Analyze Food
                                        </Button>
                                        <Button
                                            leftIcon={<Icon as={FiRefreshCw} />}
                                            variant="outline"
                                            colorScheme="gray"
                                            size="lg"
                                            onClick={handleReset}
                                        >
                                            Choose Different Image
                                        </Button>
                                    </HStack>
                                </CardBody>
                            </Card>
                        </VStack>
                    )}

                    {/* Loading State */}
                    {isAnalyzing && (
                        <LoadingSpinner
                            message="Analyzing food image..."
                            minHeight="300px"
                            variant="primary"
                        />
                    )}

                    {/* Results Section */}
                    {result && !isAnalyzing && (
                        <VStack spacing={6} align="stretch">
                            {/* Image and Overview */}
                            <SimpleGrid columns={{base: 1, lg: 2}} spacing={6}>
                                {/* Image */}
                                <Card shadow="lg" borderRadius="2xl" overflow="hidden">
                                    <Image
                                        src={result.imageUrl}
                                        alt="Analyzed food"
                                        h="400px"
                                        w="100%"
                                        objectFit="cover"
                                    />
                                    <CardBody>
                                        <HStack justify="space-between">
                                            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                                                <HStack>
                                                    <Icon as={FiCheckCircle} />
                                                    <Text>Analysis Complete</Text>
                                                </HStack>
                                            </Badge>
                                            <Text fontSize="xs" color="gray.500">
                                                Processed in {result.processingTime}
                                            </Text>
                                        </HStack>
                                    </CardBody>
                                </Card>

                                {/* Recognized Foods */}
                                <Card shadow="lg" borderRadius="2xl">
                                    <CardBody>
                                        <VStack align="stretch" spacing={4}>
                                            <Heading size="md" color="gray.700">
                                                Recognized Foods
                                            </Heading>

                                            {result.recognizedFoods.map((food, idx) => (
                                                <Box
                                                    key={idx}
                                                    p={4}
                                                    bg="gray.50"
                                                    borderRadius="lg"
                                                    border="1px"
                                                    borderColor="gray.200"
                                                >
                                                    <Flex
                                                        justify="space-between"
                                                        align="center"
                                                        mb={2}
                                                    >
                                                        <Heading size="sm">
                                                            {food.name}
                                                        </Heading>
                                                        <Badge
                                                            colorScheme={
                                                                food.confidence > 90
                                                                    ? "green"
                                                                    : food.confidence > 80
                                                                    ? "blue"
                                                                    : "orange"
                                                            }
                                                        >
                                                            {food.confidence}% confident
                                                        </Badge>
                                                    </Flex>
                                                    <HStack spacing={4} fontSize="sm">
                                                        <Text color="gray.600">
                                                            Category:{" "}
                                                            <Text
                                                                as="span"
                                                                fontWeight="semibold"
                                                            >
                                                                {food.category}
                                                            </Text>
                                                        </Text>
                                                        {food.estimatedWeight && (
                                                            <Text color="gray.600">
                                                                Weight:{" "}
                                                                <Text
                                                                    as="span"
                                                                    fontWeight="semibold"
                                                                >
                                                                    {food.estimatedWeight}
                                                                </Text>
                                                            </Text>
                                                        )}
                                                    </HStack>
                                                </Box>
                                            ))}
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </SimpleGrid>

                            {/* Nutrition Analysis */}
                            <Card shadow="lg" borderRadius="2xl">
                                <CardBody>
                                    <VStack align="stretch" spacing={6}>
                                        <Heading size="md" color="gray.700">
                                            Nutrition Analysis
                                        </Heading>

                                        <StatGroup>
                                            <Stat>
                                                <StatLabel>Calories</StatLabel>
                                                <StatNumber color="orange.500">
                                                    {result.overallNutrition.calories}
                                                </StatNumber>
                                                <Text fontSize="xs" color="gray.500">
                                                    kcal
                                                </Text>
                                            </Stat>
                                            <Stat>
                                                <StatLabel>Protein</StatLabel>
                                                <StatNumber color="purple.500">
                                                    {result.overallNutrition.protein}
                                                </StatNumber>
                                            </Stat>
                                            <Stat>
                                                <StatLabel>Carbs</StatLabel>
                                                <StatNumber color="blue.500">
                                                    {result.overallNutrition.carbs}
                                                </StatNumber>
                                            </Stat>
                                            <Stat>
                                                <StatLabel>Fat</StatLabel>
                                                <StatNumber color="yellow.600">
                                                    {result.overallNutrition.fat}
                                                </StatNumber>
                                            </Stat>
                                        </StatGroup>

                                        <SimpleGrid columns={{base: 2, md: 4}} spacing={4}>
                                            <Box
                                                p={4}
                                                bg="gray.50"
                                                borderRadius="lg"
                                                textAlign="center"
                                            >
                                                <Text fontSize="xs" color="gray.600">
                                                    Fiber
                                                </Text>
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="green.600"
                                                >
                                                    {result.overallNutrition.fiber}
                                                </Text>
                                            </Box>
                                            <Box
                                                p={4}
                                                bg="gray.50"
                                                borderRadius="lg"
                                                textAlign="center"
                                            >
                                                <Text fontSize="xs" color="gray.600">
                                                    Sugar
                                                </Text>
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="pink.600"
                                                >
                                                    {result.overallNutrition.sugar}
                                                </Text>
                                            </Box>
                                            <Box
                                                p={4}
                                                bg="gray.50"
                                                borderRadius="lg"
                                                textAlign="center"
                                            >
                                                <Text fontSize="xs" color="gray.600">
                                                    Sodium
                                                </Text>
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="red.600"
                                                >
                                                    {result.overallNutrition.sodium}
                                                </Text>
                                            </Box>
                                            <Box
                                                p={4}
                                                bg="gray.50"
                                                borderRadius="lg"
                                                textAlign="center"
                                            >
                                                <Text fontSize="xs" color="gray.600">
                                                    Cholesterol
                                                </Text>
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="bold"
                                                    color="orange.600"
                                                >
                                                    {result.overallNutrition.cholesterol}
                                                </Text>
                                            </Box>
                                        </SimpleGrid>
                                    </VStack>
                                </CardBody>
                            </Card>

                            {/* AI Suggestions */}
                            <Card
                                shadow="lg"
                                borderRadius="2xl"
                                bg="blue.50"
                                border="2px"
                                borderColor="blue.200"
                            >
                                <CardBody>
                                    <VStack align="stretch" spacing={4}>
                                        <HStack>
                                            <Icon as={FiAlertCircle} color="blue.500" />
                                            <Heading size="md" color="blue.700">
                                                AI Insights & Suggestions
                                            </Heading>
                                        </HStack>

                                        {result.suggestions.map((suggestion, idx) => (
                                            <Flex
                                                key={idx}
                                                p={4}
                                                bg="white"
                                                borderRadius="lg"
                                                align="flex-start"
                                                gap={3}
                                            >
                                                <Badge
                                                    colorScheme="blue"
                                                    fontSize="sm"
                                                    px={2}
                                                    py={1}
                                                    borderRadius="full"
                                                >
                                                    {idx + 1}
                                                </Badge>
                                                <Text color="gray.700" flex={1}>
                                                    {suggestion}
                                                </Text>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </CardBody>
                            </Card>

                            {/* Action Buttons */}
                            <HStack justify="center" spacing={4}>
                                <Button
                                    leftIcon={<Icon as={FiUpload} />}
                                    colorScheme="blue"
                                    size="lg"
                                    onClick={handleReset}
                                >
                                    Analyze Another Image
                                </Button>
                            </HStack>
                        </VStack>
                    )}
                </VStack>
            </Container>
        </MainLayout>
    );
};

export default ImageRecognitionPage;
