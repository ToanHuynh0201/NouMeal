import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    Progress,
    SimpleGrid,
    Stat,
    StatGroup,
    StatLabel,
    StatNumber,
    StatHelpText,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    Icon,
} from "@chakra-ui/react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    FaFire,
    FaDrumstickBite,
    FaBreadSlice,
    FaOilCan,
    FaTint,
} from "react-icons/fa";
import {
    mockUserProfile,
    mockDailyTracking,
    mockWeeklyStats,
} from "@/mocks/profileData";
import {animationPresets} from "@/styles/animation";

const COLORS = ["#3182CE", "#38A169", "#D69E2E", "#E53E3E"];

const TrackingSection = () => {
    const profile = mockUserProfile;
    const todayData = mockDailyTracking[mockDailyTracking.length - 1];

    const todayProgress = {
        calories: todayData
            ? (todayData.calories / profile.caloriesGoal!) * 100
            : 0,
        protein: todayData ? (todayData.protein / profile.proteinGoal!) * 100 : 0,
        carbs: todayData ? (todayData.carbs / profile.carbsGoal!) * 100 : 0,
        fats: todayData ? (todayData.fats / profile.fatsGoal!) * 100 : 0,
        water: todayData ? (todayData.water / profile.waterGoal!) * 100 : 0,
    };

    const macroDistribution = [
        {name: "Protein", value: todayData?.protein || 0, color: "#3182CE"},
        {name: "Carbs", value: todayData?.carbs || 0, color: "#38A169"},
        {name: "Fats", value: todayData?.fats || 0, color: "#D69E2E"},
    ];

    const NutrientProgress = ({
        label,
        current,
        goal,
        icon,
        color,
    }: {
        label: string;
        current: number;
        goal: number;
        icon: any;
        color: string;
    }) => (
        <Box>
            <HStack justify="space-between" mb={2}>
                <HStack spacing={2}>
                    <Icon as={icon} color={color} />
                    <Text fontWeight="semibold" fontSize="sm">
                        {label}
                    </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                    {current} / {goal}
                </Text>
            </HStack>
            <Progress
                value={(current / goal) * 100}
                colorScheme={color.split(".")[0]}
                borderRadius="full"
                size="sm"
            />
        </Box>
    );

    return (
        <VStack spacing={6} align="stretch">
            {/* Today's Progress Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader>
                    <Heading size="md">Today's Progress</Heading>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </CardHeader>
                <Divider />
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <NutrientProgress
                            label="Calories"
                            current={todayData?.calories || 0}
                            goal={profile.caloriesGoal!}
                            icon={FaFire}
                            color="orange.500"
                        />
                        <NutrientProgress
                            label="Protein"
                            current={todayData?.protein || 0}
                            goal={profile.proteinGoal!}
                            icon={FaDrumstickBite}
                            color="blue.500"
                        />
                        <NutrientProgress
                            label="Carbs"
                            current={todayData?.carbs || 0}
                            goal={profile.carbsGoal!}
                            icon={FaBreadSlice}
                            color="green.500"
                        />
                        <NutrientProgress
                            label="Fats"
                            current={todayData?.fats || 0}
                            goal={profile.fatsGoal!}
                            icon={FaOilCan}
                            color="yellow.500"
                        />
                        <NutrientProgress
                            label="Water (ml)"
                            current={todayData?.water || 0}
                            goal={profile.waterGoal!}
                            icon={FaTint}
                            color="cyan.500"
                        />
                    </VStack>
                </CardBody>
            </Card>

            {/* Nutrition Overview */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader>
                    <Heading size="md">Nutrition Overview</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <StatGroup>
                        <Stat>
                            <StatLabel>Total Calories</StatLabel>
                            <StatNumber>{todayData?.calories || 0}</StatNumber>
                            <StatHelpText>
                                {todayProgress.calories.toFixed(0)}% of goal
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Protein</StatLabel>
                            <StatNumber>{todayData?.protein || 0}g</StatNumber>
                            <StatHelpText>
                                {(todayData?.protein || 0) * 4} cal
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Carbs</StatLabel>
                            <StatNumber>{todayData?.carbs || 0}g</StatNumber>
                            <StatHelpText>
                                {(todayData?.carbs || 0) * 4} cal
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Fats</StatLabel>
                            <StatNumber>{todayData?.fats || 0}g</StatNumber>
                            <StatHelpText>
                                {(todayData?.fats || 0) * 9} cal
                            </StatHelpText>
                        </Stat>
                    </StatGroup>
                </CardBody>
            </Card>

            {/* Charts Section */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader>
                    <Heading size="md">Tracking Charts</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Tabs variant="enclosed" colorScheme="blue">
                        <TabList>
                            <Tab>Daily Tracking</Tab>
                            <Tab>Weekly Average</Tab>
                            <Tab>Macro Distribution</Tab>
                        </TabList>

                        <TabPanels>
                            {/* Daily Tracking Tab */}
                            <TabPanel>
                                <VStack spacing={8} align="stretch">
                                    {/* Calories Chart */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={4}>
                                            Daily Calories (Last 7 Days)
                                        </Text>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <LineChart data={mockDailyTracking}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(date) =>
                                                        new Date(
                                                            date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )
                                                    }
                                                />
                                                <YAxis />
                                                <Tooltip
                                                    labelFormatter={(date) =>
                                                        new Date(
                                                            date
                                                        ).toLocaleDateString()
                                                    }
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="calories"
                                                    stroke="#F6AD55"
                                                    strokeWidth={3}
                                                    name="Calories"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>

                                    {/* Macros Chart */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={4}>
                                            Daily Macronutrients (Last 7 Days)
                                        </Text>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart data={mockDailyTracking}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(date) =>
                                                        new Date(
                                                            date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )
                                                    }
                                                />
                                                <YAxis />
                                                <Tooltip
                                                    labelFormatter={(date) =>
                                                        new Date(
                                                            date
                                                        ).toLocaleDateString()
                                                    }
                                                />
                                                <Legend />
                                                <Bar
                                                    dataKey="protein"
                                                    fill="#3182CE"
                                                    name="Protein (g)"
                                                />
                                                <Bar
                                                    dataKey="carbs"
                                                    fill="#38A169"
                                                    name="Carbs (g)"
                                                />
                                                <Bar
                                                    dataKey="fats"
                                                    fill="#D69E2E"
                                                    name="Fats (g)"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>

                                    {/* Weight & Water Chart */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={4}>
                                            Weight & Water Tracking
                                        </Text>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <LineChart data={mockDailyTracking}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={(date) =>
                                                        new Date(
                                                            date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )
                                                    }
                                                />
                                                <YAxis yAxisId="left" />
                                                <YAxis
                                                    yAxisId="right"
                                                    orientation="right"
                                                />
                                                <Tooltip
                                                    labelFormatter={(date) =>
                                                        new Date(
                                                            date
                                                        ).toLocaleDateString()
                                                    }
                                                />
                                                <Legend />
                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="weight"
                                                    stroke="#E53E3E"
                                                    strokeWidth={3}
                                                    name="Weight (kg)"
                                                />
                                                <Line
                                                    yAxisId="right"
                                                    type="monotone"
                                                    dataKey="water"
                                                    stroke="#0BC5EA"
                                                    strokeWidth={3}
                                                    name="Water (ml)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </VStack>
                            </TabPanel>

                            {/* Weekly Average Tab */}
                            <TabPanel>
                                <VStack spacing={8} align="stretch">
                                    {/* Weekly Calories */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={4}>
                                            Weekly Average Calories
                                        </Text>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart data={mockWeeklyStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="week" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar
                                                    dataKey="avgCalories"
                                                    fill="#F6AD55"
                                                    name="Avg Calories"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>

                                    {/* Weekly Macros */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={4}>
                                            Weekly Average Macronutrients
                                        </Text>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <LineChart data={mockWeeklyStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="week" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="avgProtein"
                                                    stroke="#3182CE"
                                                    strokeWidth={2}
                                                    name="Avg Protein (g)"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="avgCarbs"
                                                    stroke="#38A169"
                                                    strokeWidth={2}
                                                    name="Avg Carbs (g)"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="avgFats"
                                                    stroke="#D69E2E"
                                                    strokeWidth={2}
                                                    name="Avg Fats (g)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>

                                    {/* Weekly Weight Progress */}
                                    <Box>
                                        <Text fontWeight="semibold" mb={4}>
                                            Weekly Weight Progress
                                        </Text>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <LineChart data={mockWeeklyStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="week" />
                                                <YAxis
                                                    domain={[
                                                        "dataMin - 1",
                                                        "dataMax + 1",
                                                    ]}
                                                />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="avgWeight"
                                                    stroke="#E53E3E"
                                                    strokeWidth={3}
                                                    name="Avg Weight (kg)"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </VStack>
                            </TabPanel>

                            {/* Macro Distribution Tab */}
                            <TabPanel>
                                <Grid
                                    templateColumns={{
                                        base: "1fr",
                                        lg: "repeat(2, 1fr)",
                                    }}
                                    gap={8}
                                >
                                    <GridItem>
                                        <Box>
                                            <Text
                                                fontWeight="semibold"
                                                mb={4}
                                                textAlign="center"
                                            >
                                                Today's Macro Distribution
                                            </Text>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={macroDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({name, percent}) =>
                                                            `${name}: ${(
                                                                Number(percent) *
                                                                100
                                                            ).toFixed(0)}%`
                                                        }
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {macroDistribution.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        entry.color
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </GridItem>

                                    <GridItem>
                                        <VStack
                                            spacing={4}
                                            align="stretch"
                                            justify="center"
                                            h="full"
                                        >
                                            <Heading size="sm" mb={2}>
                                                Macro Breakdown
                                            </Heading>
                                            {macroDistribution.map((macro) => (
                                                <Box key={macro.name}>
                                                    <HStack
                                                        justify="space-between"
                                                        mb={2}
                                                    >
                                                        <HStack>
                                                            <Box
                                                                w={4}
                                                                h={4}
                                                                bg={macro.color}
                                                                borderRadius="sm"
                                                            />
                                                            <Text fontWeight="medium">
                                                                {macro.name}
                                                            </Text>
                                                        </HStack>
                                                        <Text color="gray.600">
                                                            {macro.value}g (
                                                            {macro.value *
                                                                (macro.name ===
                                                                "Fats"
                                                                    ? 9
                                                                    : 4)}{" "}
                                                            cal)
                                                        </Text>
                                                    </HStack>
                                                    <Progress
                                                        value={
                                                            (macro.value /
                                                                (todayData?.protein! +
                                                                    todayData?.carbs! +
                                                                    todayData?.fats!)) *
                                                            100
                                                        }
                                                        colorScheme={
                                                            macro.color.split(
                                                                "."
                                                            )[0]
                                                        }
                                                        size="sm"
                                                        borderRadius="full"
                                                    />
                                                </Box>
                                            ))}

                                            <Divider my={2} />

                                            <Box>
                                                <HStack justify="space-between">
                                                    <Text fontWeight="bold">
                                                        Total
                                                    </Text>
                                                    <Text fontWeight="bold">
                                                        {todayData?.protein! +
                                                            todayData?.carbs! +
                                                            todayData?.fats!}
                                                        g ({todayData?.calories}{" "}
                                                        cal)
                                                    </Text>
                                                </HStack>
                                            </Box>
                                        </VStack>
                                    </GridItem>
                                </Grid>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CardBody>
            </Card>
        </VStack>
    );
};

export default TrackingSection;
