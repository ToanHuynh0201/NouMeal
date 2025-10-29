import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
    Icon,
    useDisclosure,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Button,
    SimpleGrid,
} from "@chakra-ui/react";
import {useState} from "react";
import {FiCalendar, FiArrowLeft} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import DayMenuView from "@/components/menu/DayMenuView";
import UserProfileHeader from "@/components/menu/UserProfileHeader";
import NutritionSummaryCard from "@/components/menu/NutritionSummaryCard";
import WeeklyMenuCard from "@/components/menu/WeeklyMenuCard";
import WeeklySummaryCard from "@/components/menu/WeeklySummaryCard";
import DayHeader from "@/components/menu/DayHeader";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import type {Recipe, DailyMenu} from "@/types/recipe";
import {mockDailyMenu, mockUserProfile, mockWeeklyMenu} from "@/data/mockData";

const MenuSuggestionPage = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [selectedDayMenu, setSelectedDayMenu] = useState<DailyMenu | null>(null);
    const headerSection = useScrollAnimation({threshold: 0.1});

    const handleRecipeClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        onOpen();
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return "Tomorrow";
        } else {
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
            });
        }
    };

    // Calculate weekly totals
    const weeklyTotals = mockWeeklyMenu.reduce(
        (acc, day) => ({
            calories: acc.calories + day.totalCalories,
            protein: acc.protein + parseInt(day.totalProtein),
            carbs: acc.carbs + parseInt(day.totalCarbs),
            fat: acc.fat + parseInt(day.totalFat),
        }),
        {calories: 0, protein: 0, carbs: 0, fat: 0}
    );

    return (
        <MainLayout showHeader={true} showFooter={true}>
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Header Section with User Info */}
                    <Box
                        ref={headerSection.elementRef}
                        opacity={headerSection.isVisible ? 1 : 0}
                        transform={
                            headerSection.isVisible
                                ? "translateY(0)"
                                : "translateY(30px)"
                        }
                        transition="all 0.6s ease-out"
                    >
                        <UserProfileHeader userProfile={mockUserProfile} />
                    </Box>

                    {/* Tabs for Today and This Week */}
                    <Tabs
                        variant="soft-rounded"
                        colorScheme="purple"
                        size="lg"
                        isLazy
                    >
                        <TabList
                            bg="white"
                            p={2}
                            borderRadius="xl"
                            shadow="md"
                            gap={2}
                        >
                            <Tab
                                fontWeight="semibold"
                                _selected={{
                                    bg: "purple.500",
                                    color: "white",
                                }}
                            >
                                <HStack spacing={2}>
                                    <Icon as={FiCalendar} />
                                    <Text>Today</Text>
                                </HStack>
                            </Tab>
                            <Tab
                                fontWeight="semibold"
                                _selected={{
                                    bg: "purple.500",
                                    color: "white",
                                }}
                            >
                                <HStack spacing={2}>
                                    <Icon as={FiCalendar} />
                                    <Text>This Week</Text>
                                </HStack>
                            </Tab>
                        </TabList>

                        <TabPanels mt={6}>
                            {/* Today's Menu */}
                            <TabPanel p={0}>
                                <VStack spacing={6} align="stretch">
                                    {/* Today's Nutrition Summary */}
                                    <NutritionSummaryCard
                                        calories={mockDailyMenu.totalCalories}
                                        protein={mockDailyMenu.totalProtein}
                                        carbs={mockDailyMenu.totalCarbs}
                                        fat={mockDailyMenu.totalFat}
                                    />

                                    {/* Today's Detailed Menu */}
                                    <DayMenuView
                                        dailyMenu={mockDailyMenu}
                                        onRecipeClick={handleRecipeClick}
                                    />
                                </VStack>
                            </TabPanel>

                            {/* Weekly Menu */}
                            <TabPanel p={0}>
                                <VStack spacing={6} align="stretch">
                                    {selectedDayMenu ? (
                                        // Detailed view for selected day
                                        <>
                                            {/* Back Button */}
                                            <Button
                                                leftIcon={<Icon as={FiArrowLeft} />}
                                                variant="ghost"
                                                colorScheme="purple"
                                                alignSelf="flex-start"
                                                onClick={() =>
                                                    setSelectedDayMenu(null)
                                                }
                                                mb={2}
                                            >
                                                Back to Weekly Overview
                                            </Button>

                                            {/* Selected Day Header */}
                                            <DayHeader
                                                dayMenu={selectedDayMenu}
                                                formatDate={formatDate}
                                            />

                                            {/* Detailed Menu View */}
                                            <DayMenuView
                                                dailyMenu={selectedDayMenu}
                                                onRecipeClick={handleRecipeClick}
                                            />
                                        </>
                                    ) : (
                                        // Weekly overview
                                        <>
                                            {/* Weekly Summary */}
                                            <WeeklySummaryCard
                                                totalCalories={
                                                    weeklyTotals.calories
                                                }
                                                totalProtein={weeklyTotals.protein}
                                                totalCarbs={weeklyTotals.carbs}
                                                totalFat={weeklyTotals.fat}
                                            />

                                            {/* Weekly Menu Cards */}
                                            <SimpleGrid
                                                columns={{
                                                    base: 1,
                                                    md: 2,
                                                    lg: 3,
                                                }}
                                                spacing={6}
                                            >
                                                {mockWeeklyMenu.map(
                                                    (day, index) => (
                                                        <WeeklyMenuCard
                                                            key={index}
                                                            day={day}
                                                            formatDate={formatDate}
                                                            onRecipeClick={
                                                                handleRecipeClick
                                                            }
                                                            onViewDetails={
                                                                setSelectedDayMenu
                                                            }
                                                        />
                                                    )
                                                )}
                                            </SimpleGrid>
                                        </>
                                    )}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
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

export default MenuSuggestionPage;
