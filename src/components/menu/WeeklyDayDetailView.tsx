import {
	Box,
	VStack,
	HStack,
	Text,
	Card,
	CardBody,
	Image,
	SimpleGrid,
	Heading,
	Badge,
} from "@chakra-ui/react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import type { Recipe, DailyMenu } from "@/types/recipe";

interface WeeklyDayDetailViewProps {
	dailyMenu: DailyMenu;
	onRecipeClick: (recipe: Recipe) => void;
	formatDate: (dateString: string) => string;
}

const WeeklyDayDetailView = ({
	dailyMenu,
	onRecipeClick,
	formatDate,
}: WeeklyDayDetailViewProps) => {
	const contentSection = useScrollAnimation({ threshold: 0.1 });

	const MealCard = ({
		recipe,
		emoji,
		mealType,
		delay = 0,
	}: {
		recipe: Recipe;
		emoji: string;
		mealType: "breakfast" | "lunch" | "dinner" | "snack";
		delay?: number;
	}) => {
		const colorSchemes = {
			breakfast: {
				bg: "orange.500",
				accent: "orange.400",
			},
			lunch: {
				bg: "green.500",
				accent: "green.400",
			},
			dinner: {
				bg: "purple.500",
				accent: "purple.400",
			},
			snack: {
				bg: "blue.500",
				accent: "blue.400",
			},
		};

		const colors = colorSchemes[mealType];

		return (
			<Card
				cursor="pointer"
				onClick={() => onRecipeClick(recipe)}
				bg="white"
				shadow="lg"
				borderRadius="2xl"
				overflow="hidden"
				border="2px solid"
				borderColor="gray.100"
				transition="all 0.3s ease"
				opacity={contentSection.isVisible ? 1 : 0}
				transform={
					contentSection.isVisible
						? "translateY(0)"
						: "translateY(20px)"
				}
				style={{
					transitionDelay: `${delay}s`,
				}}
				_hover={{
					shadow: "2xl",
					borderColor: colors.accent,
					transform: "translateY(-8px)",
				}}>
				{/* Image */}
				<Box
					position="relative"
					h="200px"
					overflow="hidden">
					<Image
						src={recipe.image}
						alt={recipe.title}
						w="100%"
						h="100%"
						objectFit="cover"
						transition="transform 0.3s"
						_groupHover={{
							transform: "scale(1.1)",
						}}
					/>
					{/* Gradient Overlay */}
					<Box
						position="absolute"
						bottom={0}
						left={0}
						right={0}
						h="50%"
						bgGradient="linear(to-t, blackAlpha.700, transparent)"
					/>
					{/* Emoji Badge */}
					<Box
						position="absolute"
						top={3}
						right={3}
						bg={colors.bg}
						p={2}
						borderRadius="xl"
						shadow="lg">
						<Text fontSize="2xl">{emoji}</Text>
					</Box>
					{/* Meal Type Badge */}
					<Badge
						position="absolute"
						bottom={3}
						left={3}
						colorScheme={
							mealType === "breakfast"
								? "orange"
								: mealType === "lunch"
									? "green"
									: mealType === "dinner"
										? "purple"
										: "blue"
						}
						fontSize="xs"
						px={2}
						py={1}
						borderRadius="md"
						textTransform="capitalize">
						{mealType}
					</Badge>
				</Box>

				<CardBody p={5}>
					<VStack
						align="stretch"
						spacing={3}>
						{/* Title */}
						<Heading
							size="md"
							color="gray.800"
							noOfLines={2}
							minH="48px">
							{recipe.title}
						</Heading>

						{/* Description */}
						<Text
							fontSize="sm"
							color="gray.600"
							noOfLines={2}>
							{recipe.description}
						</Text>

						{/* Nutrition Info */}
						<HStack
							spacing={2}
							fontSize="sm"
							color="gray.700"
							flexWrap="wrap">
							<HStack
								spacing={1}
								bg="purple.50"
								px={2}
								py={1}
								borderRadius="md">
								<Text
									fontWeight="bold"
									color="purple.600">
									{recipe.nutrition.calories}
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									cal
								</Text>
							</HStack>
							<HStack
								spacing={1}
								bg="green.50"
								px={2}
								py={1}
								borderRadius="md">
								<Text
									fontWeight="bold"
									color="green.600">
									{recipe.nutrition.protein}
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									protein
								</Text>
							</HStack>
						</HStack>

						{/* Time and Difficulty */}
						<HStack
							spacing={3}
							fontSize="xs"
							color="gray.500"
							pt={2}
							borderTop="1px solid"
							borderColor="gray.100">
							<Text>•</Text>
							<Text
								textTransform="capitalize"
								fontWeight="medium">
								{recipe.difficulty}
							</Text>
						</HStack>
					</VStack>
				</CardBody>
			</Card>
		);
	};

	return (
		<VStack
			ref={contentSection.elementRef}
			spacing={6}
			align="stretch">
			{/* Day Header with Gradient */}
			<Box
				bgGradient="linear(135deg, purple.500, pink.500)"
				p={8}
				borderRadius="2xl"
				shadow="xl"
				position="relative"
				overflow="hidden">
				{/* Background Pattern */}
				<Box
					position="absolute"
					top="-20%"
					right="-10%"
					w="300px"
					h="300px"
					bgGradient="radial(circle, whiteAlpha.200, transparent)"
					borderRadius="full"
				/>

				<VStack
					align="start"
					spacing={4}
					position="relative"
					zIndex={1}>
					<VStack
						align="start"
						spacing={1}>
						<Heading
							size="xl"
							color="white">
							{formatDate(dailyMenu.date)}
						</Heading>
						<Text
							fontSize="md"
							color="whiteAlpha.900">
							{new Date(dailyMenu.date).toLocaleDateString(
								"en-US",
								{
									weekday: "long",
									month: "long",
									day: "numeric",
									year: "numeric",
								},
							)}
						</Text>
					</VStack>

					{/* Nutrition Summary Cards */}
					<SimpleGrid
						columns={{ base: 2, md: 4 }}
						spacing={3}
						w="full"
						mt={2}>
						<Box
							bg="whiteAlpha.200"
							backdropFilter="blur(10px)"
							p={4}
							borderRadius="xl"
							border="1px solid"
							borderColor="whiteAlpha.300">
							<VStack
								spacing={1}
								align="start">
								<Text
									fontSize="xs"
									color="whiteAlpha.800"
									textTransform="uppercase"
									fontWeight="semibold">
									Calories
								</Text>
								<Text
									fontSize="2xl"
									fontWeight="bold"
									color="white">
									{dailyMenu.totalCalories}
								</Text>
							</VStack>
						</Box>

						<Box
							bg="whiteAlpha.200"
							backdropFilter="blur(10px)"
							p={4}
							borderRadius="xl"
							border="1px solid"
							borderColor="whiteAlpha.300">
							<VStack
								spacing={1}
								align="start">
								<Text
									fontSize="xs"
									color="whiteAlpha.800"
									textTransform="uppercase"
									fontWeight="semibold">
									Protein
								</Text>
								<Text
									fontSize="2xl"
									fontWeight="bold"
									color="white">
									{dailyMenu.totalProtein}
								</Text>
							</VStack>
						</Box>

						<Box
							bg="whiteAlpha.200"
							backdropFilter="blur(10px)"
							p={4}
							borderRadius="xl"
							border="1px solid"
							borderColor="whiteAlpha.300">
							<VStack
								spacing={1}
								align="start">
								<Text
									fontSize="xs"
									color="whiteAlpha.800"
									textTransform="uppercase"
									fontWeight="semibold">
									Carbs
								</Text>
								<Text
									fontSize="2xl"
									fontWeight="bold"
									color="white">
									{dailyMenu.totalCarbs}
								</Text>
							</VStack>
						</Box>

						<Box
							bg="whiteAlpha.200"
							backdropFilter="blur(10px)"
							p={4}
							borderRadius="xl"
							border="1px solid"
							borderColor="whiteAlpha.300">
							<VStack
								spacing={1}
								align="start">
								<Text
									fontSize="xs"
									color="whiteAlpha.800"
									textTransform="uppercase"
									fontWeight="semibold">
									Fat
								</Text>
								<Text
									fontSize="2xl"
									fontWeight="bold"
									color="white">
									{dailyMenu.totalFat}
								</Text>
							</VStack>
						</Box>
					</SimpleGrid>
				</VStack>
			</Box>

			{/* Meals Grid */}
			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 3 }}
				spacing={6}>
				{/* Breakfast */}
				<MealCard
					recipe={dailyMenu.breakfast}
					emoji="🌅"
					mealType="breakfast"
					delay={0.1}
				/>

				{/* Lunch */}
				<MealCard
					recipe={dailyMenu.lunch}
					emoji="☀️"
					mealType="lunch"
					delay={0.2}
				/>

				{/* Dinner */}
				<MealCard
					recipe={dailyMenu.dinner}
					emoji="🌙"
					mealType="dinner"
					delay={0.3}
				/>

				{/* Snacks */}
				{dailyMenu.snacks &&
					dailyMenu.snacks.map((snack, index) => (
						<MealCard
							key={snack.id}
							recipe={snack}
							emoji="🍎"
							mealType="snack"
							delay={0.4 + index * 0.1}
						/>
					))}
			</SimpleGrid>
		</VStack>
	);
};

export default WeeklyDayDetailView;
