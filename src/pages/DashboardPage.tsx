import MainLayout from "@/components/layout/MainLayout";
import {useAuth} from "@/hooks/useAuth";
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    SimpleGrid,
    Card,
    CardBody,
    Icon,
    Badge,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Progress,
} from "@chakra-ui/react";
import {
    FaAppleAlt,
    FaFire,
    FaChartLine,
    FaBullseye,
    FaUtensils,
    FaHeart,
} from "react-icons/fa";

function DashboardPage() {
    const {user} = useAuth();

    // Mock data - replace with real data from API
    const stats = [
        {
            label: "Calories Today",
            value: "1,450",
            goal: "2,200",
            icon: FaFire,
            color: "orange.500",
            progress: 66,
        },
        {
            label: "Protein",
            value: "85g",
            goal: "150g",
            icon: FaAppleAlt,
            color: "green.500",
            progress: 57,
        },
        {
            label: "Water",
            value: "6",
            goal: "8 glasses",
            icon: FaHeart,
            color: "blue.500",
            progress: 75,
        },
        {
            label: "Meals Logged",
            value: "2",
            goal: "3 today",
            icon: FaUtensils,
            color: "purple.500",
            progress: 67,
        },
    ];

    const todaysMeals = [
        {
            name: "Breakfast",
            meal: "Oatmeal with Berries",
            calories: 350,
            time: "8:30 AM",
        },
        {
            name: "Lunch",
            meal: "Grilled Chicken Salad",
            calories: 450,
            time: "12:30 PM",
        },
    ];

    return (
        <MainLayout showHeader={true} showSidebar={true}>
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Welcome Section */}
                    <Box>
                        <Heading size="xl" mb={2}>
                            Welcome back, {user?.name || "User"}! 👋
                        </Heading>
                        <Text color="gray.600" fontSize="lg">
                            Here's your nutrition overview for today
                        </Text>
                    </Box>

                    {/* Stats Grid */}
                    <SimpleGrid columns={{base: 1, md: 2, lg: 4}} spacing={6}>
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                shadow="md"
                                borderRadius="xl"
                                border="1px"
                                borderColor="gray.100"
                                _hover={{
                                    shadow: "lg",
                                    transform: "translateY(-2px)",
                                }}
                                transition="all 0.2s"
                            >
                                <CardBody>
                                    <VStack align="stretch" spacing={4}>
                                        <HStack justify="space-between">
                                            <Box
                                                p={3}
                                                bg={`${stat.color.split(".")[0]}.50`}
                                                borderRadius="lg"
                                            >
                                                <Icon
                                                    as={stat.icon}
                                                    boxSize={6}
                                                    color={stat.color}
                                                />
                                            </Box>
                                            <Badge
                                                colorScheme={
                                                    stat.progress >= 80
                                                        ? "green"
                                                        : stat.progress >= 50
                                                        ? "yellow"
                                                        : "red"
                                                }
                                            >
                                                {stat.progress}%
                                            </Badge>
                                        </HStack>
                                        <Stat>
                                            <StatLabel color="gray.600">
                                                {stat.label}
                                            </StatLabel>
                                            <StatNumber fontSize="2xl">
                                                {stat.value}
                                            </StatNumber>
                                            <StatHelpText mb={2}>
                                                of {stat.goal}
                                            </StatHelpText>
                                            <Progress
                                                value={stat.progress}
                                                size="sm"
                                                colorScheme={
                                                    stat.color.split(".")[0]
                                                }
                                                borderRadius="full"
                                            />
                                        </Stat>
                                    </VStack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>

                    {/* Today's Meals */}
                    <Card
                        shadow="md"
                        borderRadius="xl"
                        border="1px"
                        borderColor="gray.100"
                    >
                        <CardBody>
                            <VStack align="stretch" spacing={6}>
                                <HStack justify="space-between">
                                    <Heading size="md">Today's Meals</Heading>
                                    <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                                        {todaysMeals.length} meals logged
                                    </Badge>
                                </HStack>

                                <VStack align="stretch" spacing={4}>
                                    {todaysMeals.map((meal, index) => (
                                        <Card
                                            key={index}
                                            bg="gray.50"
                                            borderRadius="lg"
                                        >
                                            <CardBody>
                                                <HStack justify="space-between">
                                                    <VStack align="start" spacing={1}>
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray.600"
                                                            fontWeight="medium"
                                                        >
                                                            {meal.name}
                                                        </Text>
                                                        <Text
                                                            fontSize="lg"
                                                            fontWeight="semibold"
                                                        >
                                                            {meal.meal}
                                                        </Text>
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray.500"
                                                        >
                                                            {meal.time}
                                                        </Text>
                                                    </VStack>
                                                    <VStack>
                                                        <Badge
                                                            colorScheme="orange"
                                                            fontSize="md"
                                                            px={4}
                                                            py={2}
                                                            borderRadius="full"
                                                        >
                                                            {meal.calories} cal
                                                        </Badge>
                                                    </VStack>
                                                </HStack>
                                            </CardBody>
                                        </Card>
                                    ))}

                                    {todaysMeals.length === 0 && (
                                        <Box
                                            py={12}
                                            textAlign="center"
                                            color="gray.500"
                                        >
                                            <Icon
                                                as={FaUtensils}
                                                boxSize={12}
                                                mb={4}
                                                opacity={0.3}
                                            />
                                            <Text>No meals logged yet today</Text>
                                        </Box>
                                    )}
                                </VStack>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Quick Actions */}
                    <SimpleGrid columns={{base: 1, md: 2}} spacing={6}>
                        <Card
                            shadow="md"
                            borderRadius="xl"
                            border="1px"
                            borderColor="gray.100"
                            bg="gradient.to-br"
                            bgGradient="linear(to-br, purple.50, pink.50)"
                            cursor="pointer"
                            _hover={{
                                shadow: "lg",
                                transform: "translateY(-2px)",
                            }}
                            transition="all 0.2s"
                        >
                            <CardBody>
                                <HStack spacing={4}>
                                    <Box
                                        p={4}
                                        bg="purple.100"
                                        borderRadius="xl"
                                    >
                                        <Icon
                                            as={FaBullseye}
                                            boxSize={8}
                                            color="purple.600"
                                        />
                                    </Box>
                                    <VStack align="start" spacing={1}>
                                        <Heading size="sm" color="purple.900">
                                            Get AI Recommendations
                                        </Heading>
                                        <Text fontSize="sm" color="purple.700">
                                            Let AI suggest your next meal
                                        </Text>
                                    </VStack>
                                </HStack>
                            </CardBody>
                        </Card>

                        <Card
                            shadow="md"
                            borderRadius="xl"
                            border="1px"
                            borderColor="gray.100"
                            bg="gradient.to-br"
                            bgGradient="linear(to-br, green.50, teal.50)"
                            cursor="pointer"
                            _hover={{
                                shadow: "lg",
                                transform: "translateY(-2px)",
                            }}
                            transition="all 0.2s"
                        >
                            <CardBody>
                                <HStack spacing={4}>
                                    <Box p={4} bg="green.100" borderRadius="xl">
                                        <Icon
                                            as={FaChartLine}
                                            boxSize={8}
                                            color="green.600"
                                        />
                                    </Box>
                                    <VStack align="start" spacing={1}>
                                        <Heading size="sm" color="green.900">
                                            View Progress
                                        </Heading>
                                        <Text fontSize="sm" color="green.700">
                                            Track your nutrition journey
                                        </Text>
                                    </VStack>
                                </HStack>
                            </CardBody>
                        </Card>
                    </SimpleGrid>
                </VStack>
            </Container>
        </MainLayout>
    );
}

export default DashboardPage;
