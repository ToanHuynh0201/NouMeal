import MainLayout from "@/components/layout/MainLayout";
import {animationPresets} from "@/styles/animation";
import {useScrollAnimation} from "@/hooks/useScrollAnimation";
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    SimpleGrid,
    Icon,
    Card,
    CardBody,
    Badge,
    Flex,
} from "@chakra-ui/react";
import {
    FaAppleAlt,
    FaChartLine,
    FaRobot,
    FaUtensils,
    FaHeart,
    FaCamera,
    FaBullseye,
    FaUsers,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/constants";

function HomePage() {
    const navigate = useNavigate();

    // Scroll animation refs
    const featuresSection = useScrollAnimation({threshold: 0.15});
    const statsSection = useScrollAnimation({threshold: 0.15});
    const howItWorksSection = useScrollAnimation({threshold: 0.15});
    const ctaSection = useScrollAnimation({threshold: 0.2});

    const features = [
        {
            icon: FaRobot,
            title: "AI-Powered Recommendations",
            description:
                "Get personalized meal suggestions based on your health goals, dietary preferences, and nutritional needs.",
            color: "blue.500",
        },
        {
            icon: FaCamera,
            title: "Food Recognition",
            description:
                "Simply take a photo of your meal and our AI will identify it and provide detailed nutritional information.",
            color: "purple.500",
        },
        {
            icon: FaChartLine,
            title: "Track Your Progress",
            description:
                "Monitor your daily calorie intake, macros, and weight progress with beautiful charts and insights.",
            color: "green.500",
        },
        {
            icon: FaBullseye,
            title: "Goal-Oriented Planning",
            description:
                "Whether you want to lose weight, gain muscle, or maintain - we've got you covered with tailored meal plans.",
            color: "orange.500",
        },
    ];

    const benefits = [
        {
            icon: FaAppleAlt,
            title: "Healthy Eating Made Easy",
            stat: "1000+",
            description: "Nutritious Recipes",
        },
        {
            icon: FaUsers,
            title: "Join Our Community",
            stat: "50K+",
            description: "Active Users",
        },
        {
            icon: FaHeart,
            title: "Improve Your Health",
            stat: "95%",
            description: "User Satisfaction",
        },
        {
            icon: FaUtensils,
            title: "Diverse Cuisine",
            stat: "30+",
            description: "Cuisine Types",
        },
    ];

    return (
        <MainLayout showHeader={true} showFooter={true}>
            {/* Hero Section */}
            <Box
                bgGradient="linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)"
                color="white"
                py={{base: 16, md: 24}}
                position="relative"
                overflow="hidden"
            >
                {/* Animated Background Elements */}
                <Box
                    position="absolute"
                    top="-20%"
                    right="-10%"
                    width="500px"
                    height="500px"
                    bgGradient="radial(circle, whiteAlpha.200 0%, transparent 70%)"
                    animation={animationPresets.float}
                    borderRadius="full"
                />
                <Box
                    position="absolute"
                    bottom="-20%"
                    left="-10%"
                    width="400px"
                    height="400px"
                    bgGradient="radial(circle, whiteAlpha.200 0%, transparent 70%)"
                    animation={`${animationPresets.float} reverse`}
                    borderRadius="full"
                />

                <Container maxW="7xl" position="relative" zIndex={1}>
                    <VStack
                        spacing={8}
                        textAlign="center"
                        animation={animationPresets.fadeInUp}
                    >
                        <Badge
                            colorScheme="whiteAlpha"
                            fontSize="md"
                            px={4}
                            py={2}
                            borderRadius="full"
                            textTransform="none"
                            fontWeight="semibold"
                        >
                            ✨ AI-Powered Meal Planning
                        </Badge>

                        <Heading
                            as="h1"
                            fontSize={{base: "4xl", md: "6xl", lg: "7xl"}}
                            fontWeight="extrabold"
                            lineHeight="1.2"
                            maxW="900px"
                        >
                            What to Eat?{" "}
                            <Text
                                as="span"
                                bgGradient="linear(to-r, yellow.300, orange.300)"
                                bgClip="text"
                            >
                                Let MealGenie
                            </Text>{" "}
                            Decide!
                        </Heading>

                        <Text
                            fontSize={{base: "lg", md: "xl"}}
                            maxW="700px"
                            color="whiteAlpha.900"
                            fontWeight="medium"
                        >
                            Your personal nutrition assistant powered by AI. Get
                            customized meal recommendations based on your health
                            goals, dietary preferences, and nutritional needs.
                        </Text>

                        <HStack spacing={4} pt={4}>
                            <Button
                                size="lg"
                                colorScheme="whiteAlpha"
                                bg="white"
                                color="purple.600"
                                fontSize="lg"
                                px={8}
                                py={7}
                                fontWeight="bold"
                                _hover={{
                                    transform: "translateY(-2px)",
                                    shadow: "2xl",
                                }}
                                onClick={() => navigate(ROUTES.PROFILE)}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                borderColor="white"
                                color="white"
                                fontSize="lg"
                                px={8}
                                py={7}
                                fontWeight="bold"
                                _hover={{
                                    bg: "whiteAlpha.200",
                                    transform: "translateY(-2px)",
                                }}
                            >
                                Learn More
                            </Button>
                        </HStack>

                        <HStack spacing={6} pt={8} fontSize="sm">
                            <HStack>
                                <Icon as={FaHeart} color="red.300" />
                                <Text>No Credit Card Required</Text>
                            </HStack>
                            <HStack>
                                <Icon as={FaBullseye} color="yellow.300" />
                                <Text>14-Day Free Trial</Text>
                            </HStack>
                        </HStack>
                    </VStack>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxW="7xl" py={{base: 16, md: 20}}>
                <VStack spacing={12} ref={featuresSection.elementRef}>
                    <VStack
                        spacing={4}
                        textAlign="center"
                        opacity={featuresSection.isVisible ? 1 : 0}
                        transform={
                            featuresSection.isVisible
                                ? "translateY(0)"
                                : "translateY(30px)"
                        }
                        transition="all 0.6s ease-out"
                    >
                        <Badge
                            colorScheme="purple"
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                        >
                            Features
                        </Badge>
                        <Heading size="2xl" fontWeight="bold">
                            Everything You Need for{" "}
                            <Text as="span" color="purple.500">
                                Healthy Living
                            </Text>
                        </Heading>
                        <Text fontSize="lg" color="gray.600" maxW="600px">
                            MealGenie combines cutting-edge AI technology with
                            nutrition science to help you achieve your health goals
                            effortlessly.
                        </Text>
                    </VStack>

                    <SimpleGrid
                        columns={{base: 1, md: 2, lg: 4}}
                        spacing={8}
                        w="full"
                        pt={8}
                    >
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                bg="white"
                                shadow="lg"
                                borderRadius="2xl"
                                border="1px"
                                borderColor="gray.100"
                                transition="all 0.3s"
                                opacity={featuresSection.isVisible ? 1 : 0}
                                transform={
                                    featuresSection.isVisible
                                        ? "translateY(0)"
                                        : "translateY(40px)"
                                }
                                style={{
                                    transitionDelay: featuresSection.isVisible
                                        ? `${index * 0.1 + 0.2}s`
                                        : "0s",
                                }}
                                _hover={{
                                    transform: "translateY(-8px)",
                                    shadow: "2xl",
                                    borderColor: feature.color,
                                }}
                            >
                                <CardBody p={8}>
                                    <VStack align="start" spacing={4}>
                                        <Box
                                            p={4}
                                            bg={`${feature.color.split(".")[0]}.50`}
                                            borderRadius="xl"
                                            display="inline-block"
                                        >
                                            <Icon
                                                as={feature.icon}
                                                boxSize={8}
                                                color={feature.color}
                                            />
                                        </Box>
                                        <Heading size="md" fontWeight="bold">
                                            {feature.title}
                                        </Heading>
                                        <Text color="gray.600" lineHeight="tall">
                                            {feature.description}
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>

            {/* Stats Section */}
            <Box bg="gray.50" py={{base: 16, md: 20}}>
                <Container maxW="7xl">
                    <VStack spacing={12} ref={statsSection.elementRef}>
                        <VStack
                            spacing={4}
                            textAlign="center"
                            opacity={statsSection.isVisible ? 1 : 0}
                            transform={
                                statsSection.isVisible
                                    ? "translateY(0)"
                                    : "translateY(30px)"
                            }
                            transition="all 0.6s ease-out"
                        >
                            <Badge
                                colorScheme="green"
                                fontSize="sm"
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                Our Impact
                            </Badge>
                            <Heading size="2xl" fontWeight="bold">
                                Trusted by Thousands
                            </Heading>
                            <Text fontSize="lg" color="gray.600" maxW="600px">
                                Join our growing community of health-conscious
                                individuals who have transformed their eating habits
                                with MealGenie.
                            </Text>
                        </VStack>

                        <SimpleGrid
                            columns={{base: 1, sm: 2, lg: 4}}
                            spacing={8}
                            w="full"
                            pt={8}
                        >
                            {benefits.map((benefit, index) => (
                                <Card
                                    key={index}
                                    bg="white"
                                    shadow="md"
                                    borderRadius="2xl"
                                    textAlign="center"
                                    transition="all 0.5s ease-out"
                                    opacity={statsSection.isVisible ? 1 : 0}
                                    transform={
                                        statsSection.isVisible
                                            ? "scale(1)"
                                            : "scale(0.9)"
                                    }
                                    style={{
                                        transitionDelay: statsSection.isVisible
                                            ? `${index * 0.15 + 0.2}s`
                                            : "0s",
                                    }}
                                    _hover={{
                                        transform: "scale(1.05)",
                                        shadow: "xl",
                                    }}
                                >
                                    <CardBody p={8}>
                                        <VStack spacing={4}>
                                            <Box
                                                p={4}
                                                bg="purple.50"
                                                borderRadius="full"
                                            >
                                                <Icon
                                                    as={benefit.icon}
                                                    boxSize={8}
                                                    color="purple.500"
                                                />
                                            </Box>
                                            <Heading
                                                size="2xl"
                                                color="purple.500"
                                                fontWeight="extrabold"
                                            >
                                                {benefit.stat}
                                            </Heading>
                                            <VStack spacing={1}>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="md"
                                                    color="gray.700"
                                                >
                                                    {benefit.title}
                                                </Text>
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.500"
                                                >
                                                    {benefit.description}
                                                </Text>
                                            </VStack>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Container maxW="7xl" py={{base: 16, md: 20}}>
                <VStack spacing={12} ref={howItWorksSection.elementRef}>
                    <VStack
                        spacing={4}
                        textAlign="center"
                        opacity={howItWorksSection.isVisible ? 1 : 0}
                        transform={
                            howItWorksSection.isVisible
                                ? "translateY(0)"
                                : "translateY(30px)"
                        }
                        transition="all 0.6s ease-out"
                    >
                        <Badge
                            colorScheme="blue"
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                        >
                            Simple Process
                        </Badge>
                        <Heading size="2xl" fontWeight="bold">
                            How MealGenie Works
                        </Heading>
                        <Text fontSize="lg" color="gray.600" maxW="600px">
                            Get started in three simple steps and begin your journey
                            to healthier eating today.
                        </Text>
                    </VStack>

                    <SimpleGrid
                        columns={{base: 1, md: 3}}
                        spacing={12}
                        w="full"
                        pt={8}
                    >
                        {[
                            {
                                step: "01",
                                title: "Set Your Profile",
                                description:
                                    "Tell us about your health goals, dietary preferences, allergies, and activity level.",
                                color: "blue",
                            },
                            {
                                step: "02",
                                title: "Get AI Recommendations",
                                description:
                                    "Our AI analyzes your profile and suggests personalized meals that fit your needs perfectly.",
                                color: "purple",
                            },
                            {
                                step: "03",
                                title: "Track & Achieve",
                                description:
                                    "Monitor your nutrition, track progress, and watch as you achieve your health goals.",
                                color: "pink",
                            },
                        ].map((step, index) => (
                            <VStack
                                key={index}
                                spacing={6}
                                align="start"
                                opacity={howItWorksSection.isVisible ? 1 : 0}
                                transform={
                                    howItWorksSection.isVisible
                                        ? "translateX(0)"
                                        : index % 2 === 0
                                        ? "translateX(-40px)"
                                        : "translateX(40px)"
                                }
                                transition="all 0.6s ease-out"
                                style={{
                                    transitionDelay: howItWorksSection.isVisible
                                        ? `${index * 0.2 + 0.2}s`
                                        : "0s",
                                }}
                            >
                                <Flex
                                    align="center"
                                    justify="center"
                                    w="full"
                                    position="relative"
                                >
                                    <Box
                                        fontSize="6xl"
                                        fontWeight="extrabold"
                                        bgGradient={`linear(to-br, ${step.color}.400, ${step.color}.600)`}
                                        bgClip="text"
                                        opacity={0.2}
                                    >
                                        {step.step}
                                    </Box>
                                </Flex>
                                <VStack align="start" spacing={3} pl={4}>
                                    <Heading size="lg" fontWeight="bold">
                                        {step.title}
                                    </Heading>
                                    <Text
                                        color="gray.600"
                                        fontSize="md"
                                        lineHeight="tall"
                                    >
                                        {step.description}
                                    </Text>
                                </VStack>
                            </VStack>
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>

            {/* CTA Section */}
            <Box
                bgGradient="linear(135deg, purple.500 0%, pink.500 100%)"
                color="white"
                py={{base: 16, md: 20}}
                ref={ctaSection.elementRef}
            >
                <Container maxW="4xl">
                    <VStack
                        spacing={8}
                        textAlign="center"
                        opacity={ctaSection.isVisible ? 1 : 0}
                        transform={
                            ctaSection.isVisible
                                ? "translateY(0) scale(1)"
                                : "translateY(30px) scale(0.95)"
                        }
                        transition="all 0.6s ease-out"
                    >
                        <Heading size="2xl" fontWeight="bold">
                            Ready to Transform Your Eating Habits?
                        </Heading>
                        <Text fontSize="xl" opacity={0.9}>
                            Join thousands of users who are already achieving their
                            health goals with MealGenie's AI-powered meal planning.
                        </Text>
                        <Button
                            size="lg"
                            bg="white"
                            color="purple.600"
                            fontSize="lg"
                            px={12}
                            py={7}
                            fontWeight="bold"
                            _hover={{
                                transform: "translateY(-2px)",
                                shadow: "2xl",
                            }}
                            onClick={() => navigate(ROUTES.PROFILE)}
                        >
                            Start Your Free Trial
                        </Button>
                        <Text fontSize="sm" opacity={0.8}>
                            No credit card required • 14-day free trial • Cancel
                            anytime
                        </Text>
                    </VStack>
                </Container>
            </Box>
        </MainLayout>
    );
}

export default HomePage;
