import {
	Box,
	VStack,
	HStack,
	Text,
	Card,
	CardBody,
	Image,
	Icon,
	SimpleGrid,
	Heading,
} from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
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
		delay = 0,
	}: {
		recipe: Recipe;
		emoji: string;
		delay?: number;
	}) => {
		return (
			<Card
				cursor="pointer"
				onClick={() => onRecipeClick(recipe)}
				bg="white"
				shadow="sm"
				borderRadius="lg"
				overflow="hidden"
				border="1px solid"
				borderColor="gray.200"
				transition="all 0.2s ease"
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
					shadow: "md",
					borderColor: "gray.300",
				}}>
				{/* Image */}
				<Box
					position="relative"
					h="140px"
					overflow="hidden">
					<Image
						src={recipe.image}
						alt={recipe.title}
						w="100%"
						h="100%"
						objectFit="cover"
					/>
					{/* Emoji Badge */}
					<Box
						position="absolute"
						top={2}
						right={2}
						bg="white"
						p={1.5}
						borderRadius="md"
						shadow="sm">
						<Text fontSize="lg">{emoji}</Text>
					</Box>
				</Box>

				<CardBody p={4}>
					<VStack
						align="stretch"
						spacing={2}>
						{/* Title */}
						<Heading
							size="sm"
							color="gray.800"
							noOfLines={1}>
							{recipe.title}
						</Heading>

						{/* Nutrition Info */}
						<HStack
							spacing={3}
							fontSize="xs"
							color="gray.600">
							<Text fontWeight="medium">
								{recipe.nutrition.calories} cal
							</Text>
							<Text>•</Text>
							<Text>{recipe.nutrition.protein}g protein</Text>
						</HStack>

						{/* Time and Difficulty */}
						<HStack
							spacing={2}
							fontSize="xs"
							color="gray.500">
							<HStack spacing={1}>
								<Icon
									as={FiClock}
									boxSize={3}
								/>
								<Text>{recipe.cookingTime}</Text>
							</HStack>
							<Text>•</Text>
							<Text textTransform="capitalize">
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
			{/* Day Header */}
			<Box>
				<VStack
					align="start"
					spacing={1}
					mb={4}>
					<Heading
						size="lg"
						color="gray.800">
						{formatDate(dailyMenu.date)}
					</Heading>
					<Text
						fontSize="sm"
						color="gray.500">
						{dailyMenu.date}
					</Text>
				</VStack>

				{/* Nutrition Summary */}
				<HStack
					spacing={4}
					wrap="wrap"
					fontSize="sm"
					color="gray.600">
					<HStack spacing={1}>
						<Text fontWeight="semibold">
							{dailyMenu.totalCalories}
						</Text>
						<Text>cal</Text>
					</HStack>
					<Text color="gray.400">•</Text>
					<HStack spacing={1}>
						<Text fontWeight="semibold">
							{dailyMenu.totalProtein}g
						</Text>
						<Text>protein</Text>
					</HStack>
					<Text color="gray.400">•</Text>
					<HStack spacing={1}>
						<Text fontWeight="semibold">
							{dailyMenu.totalCarbs}g
						</Text>
						<Text>carbs</Text>
					</HStack>
					<Text color="gray.400">•</Text>
					<HStack spacing={1}>
						<Text fontWeight="semibold">{dailyMenu.totalFat}g</Text>
						<Text>fat</Text>
					</HStack>
				</HStack>
			</Box>

			{/* Meals Grid */}
			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 3 }}
				spacing={4}>
				{/* Breakfast */}
				<MealCard
					recipe={dailyMenu.breakfast}
					emoji="🌅"
					delay={0.1}
				/>

				{/* Lunch */}
				<MealCard
					recipe={dailyMenu.lunch}
					emoji="☀️"
					delay={0.2}
				/>

				{/* Dinner */}
				<MealCard
					recipe={dailyMenu.dinner}
					emoji="🌙"
					delay={0.3}
				/>

				{/* Snacks */}
				{dailyMenu.snacks && dailyMenu.snacks.length > 0 && (
					<MealCard
						recipe={dailyMenu.snacks[0]}
						emoji="🍎"
						delay={0.4}
					/>
				)}
			</SimpleGrid>
		</VStack>
	);
};

export default WeeklyDayDetailView;
