import {
	Box,
	HStack,
	VStack,
	Text,
	Button,
	Icon,
	Image,
	Flex,
	Badge,
} from "@chakra-ui/react";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import type { DailyMenu, Recipe } from "@/types/recipe";

interface WeeklyMenuCardProps {
	day: DailyMenu;
	formatDate: (dateString: string) => string;
	onRecipeClick: (recipe: Recipe) => void;
	onViewDetails: (day: DailyMenu) => void;
}

const WeeklyMenuCard = ({
	day,
	formatDate,
	onRecipeClick,
	onViewDetails,
}: WeeklyMenuCardProps) => {
	const isToday = formatDate(day.date) === "Today";
	const isTomorrow = formatDate(day.date) === "Tomorrow";

	return (
		<Box
			bg="white"
			borderRadius="2xl"
			overflow="hidden"
			shadow="lg"
			border="2px solid"
			borderColor={isToday ? "purple.400" : "gray.100"}
			transition="all 0.3s ease"
			position="relative"
			h="full"
			display="flex"
			flexDirection="column"
			_hover={{
				shadow: "2xl",
				borderColor: isToday ? "purple.500" : "purple.200",
				transform: "translateY(-4px)",
			}}>
			{/* Today Badge */}
			{isToday && (
				<Badge
					position="absolute"
					top={3}
					right={3}
					colorScheme="purple"
					fontSize="xs"
					px={3}
					py={1}
					borderRadius="full"
					fontWeight="bold"
					zIndex={2}
					textTransform="uppercase">
					Today
				</Badge>
			)}
			{isTomorrow && (
				<Badge
					position="absolute"
					top={3}
					right={3}
					colorScheme="pink"
					fontSize="xs"
					px={3}
					py={1}
					borderRadius="full"
					fontWeight="bold"
					zIndex={2}
					textTransform="uppercase">
					Tomorrow
				</Badge>
			)}

			{/* Header with Featured Image */}
			<Box
				position="relative"
				h="180px"
				overflow="hidden"
				bgGradient="linear(135deg, purple.50, pink.50)">
				{/* Background Images - 3 meal preview */}
				<Flex
					position="absolute"
					top={0}
					left={0}
					right={0}
					bottom={0}
					gap={0}>
					<Box
						flex={1}
						h="full"
						position="relative"
						_after={{
							content: '""',
							position: "absolute",
							inset: 0,
							bg: "blackAlpha.300",
						}}>
						<Image
							src={day.breakfast.image}
							alt={day.breakfast.title}
							w="full"
							h="full"
							objectFit="cover"
						/>
					</Box>
					<Box
						flex={1}
						h="full"
						position="relative"
						_after={{
							content: '""',
							position: "absolute",
							inset: 0,
							bg: "blackAlpha.300",
						}}>
						<Image
							src={day.lunch.image}
							alt={day.lunch.title}
							w="full"
							h="full"
							objectFit="cover"
						/>
					</Box>
					<Box
						flex={1}
						h="full"
						position="relative"
						_after={{
							content: '""',
							position: "absolute",
							inset: 0,
							bg: "blackAlpha.300",
						}}>
						<Image
							src={day.dinner.image}
							alt={day.dinner.title}
							w="full"
							h="full"
							objectFit="cover"
						/>
					</Box>
				</Flex>

				{/* Overlay with Date */}
				<Box
					position="absolute"
					bottom={0}
					left={0}
					right={0}
					bgGradient="linear(to-t, blackAlpha.800, transparent)"
					p={4}>
					<HStack spacing={2}>
						<Icon
							as={FiCalendar}
							color="white"
							boxSize={5}
						/>
						<VStack
							align="start"
							spacing={0}
							flex={1}>
							<Text
								fontSize="lg"
								fontWeight="bold"
								color="white">
								{formatDate(day.date)}
							</Text>
							<Text
								fontSize="xs"
								color="whiteAlpha.900">
								{new Date(day.date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</Text>
						</VStack>
						<Box
							bg="whiteAlpha.300"
							backdropFilter="blur(10px)"
							px={3}
							py={2}
							borderRadius="lg">
							<Text
								fontSize="sm"
								fontWeight="bold"
								color="white">
								{day.totalCalories} cal
							</Text>
						</Box>
					</HStack>
				</Box>
			</Box>

			{/* Body */}
			<Box
				p={5}
				flex="1"
				display="flex"
				flexDirection="column">
				<VStack
					spacing={4}
					align="stretch"
					flex="1">
					{/* Quick Meal List */}
					<VStack
						spacing={2}
						align="stretch"
						flex="1"
						justify="space-between">
						<VStack
							spacing={2}
							align="stretch">
							{/* Breakfast */}
							<HStack
								spacing={2}
								p={2.5}
								bg="orange.50"
								borderRadius="lg"
								cursor="pointer"
								transition="all 0.2s"
								onClick={(e) => {
									e.stopPropagation();
									onRecipeClick(day.breakfast);
								}}
								_hover={{
									bg: "orange.100",
									transform: "translateX(2px)",
								}}>
								<Text fontSize="lg">🌅</Text>
								<VStack
									align="start"
									spacing={0}
									flex={1}>
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color="gray.800"
										noOfLines={1}>
										{day.breakfast.title}
									</Text>
									<Text
										fontSize="xs"
										color="gray.500">
										{day.breakfast.nutrition.calories} cal
									</Text>
								</VStack>
							</HStack>

							{/* Lunch */}
							<HStack
								spacing={2}
								p={2.5}
								bg="green.50"
								borderRadius="lg"
								cursor="pointer"
								transition="all 0.2s"
								onClick={(e) => {
									e.stopPropagation();
									onRecipeClick(day.lunch);
								}}
								_hover={{
									bg: "green.100",
									transform: "translateX(2px)",
								}}>
								<Text fontSize="lg">☀️</Text>
								<VStack
									align="start"
									spacing={0}
									flex={1}>
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color="gray.800"
										noOfLines={1}>
										{day.lunch.title}
									</Text>
									<Text
										fontSize="xs"
										color="gray.500">
										{day.lunch.nutrition.calories} cal
									</Text>
								</VStack>
							</HStack>

							{/* Dinner */}
							<HStack
								spacing={2}
								p={2.5}
								bg="purple.50"
								borderRadius="lg"
								cursor="pointer"
								transition="all 0.2s"
								onClick={(e) => {
									e.stopPropagation();
									onRecipeClick(day.dinner);
								}}
								_hover={{
									bg: "purple.100",
									transform: "translateX(2px)",
								}}>
								<Text fontSize="lg">🌙</Text>
								<VStack
									align="start"
									spacing={0}
									flex={1}>
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color="gray.800"
										noOfLines={1}>
										{day.dinner.title}
									</Text>
									<Text
										fontSize="xs"
										color="gray.500">
										{day.dinner.nutrition.calories} cal
									</Text>
								</VStack>
							</HStack>

							{/* Snacks Badge */}
							{day.snacks && day.snacks.length > 0 && (
								<HStack
									spacing={2}
									p={2.5}
									bg="blue.50"
									borderRadius="lg">
									<Text fontSize="lg">🍎</Text>
									<Text
										fontSize="sm"
										fontWeight="semibold"
										color="gray.700">
										{day.snacks.length} Snack
										{day.snacks.length > 1 ? "s" : ""}
									</Text>
								</HStack>
							)}
						</VStack>
					</VStack>

					{/* Nutrition Summary */}
					<Box
						bg="gray.50"
						p={3}
						borderRadius="xl">
						<HStack
							spacing={4}
							justify="space-around"
							fontSize="xs">
							<VStack spacing={0.5}>
								<Text
									fontWeight="bold"
									color="purple.600"
									fontSize="sm">
									{day.totalProtein}
								</Text>
								<Text
									color="gray.500"
									fontSize="xs">
									Protein
								</Text>
							</VStack>
							<Box
								h="30px"
								w="1px"
								bg="gray.300"
							/>
							<VStack spacing={0.5}>
								<Text
									fontWeight="bold"
									color="purple.600"
									fontSize="sm">
									{day.totalCarbs}
								</Text>
								<Text
									color="gray.500"
									fontSize="xs">
									Carbs
								</Text>
							</VStack>
							<Box
								h="30px"
								w="1px"
								bg="gray.300"
							/>
							<VStack spacing={0.5}>
								<Text
									fontWeight="bold"
									color="purple.600"
									fontSize="sm">
									{day.totalFat}
								</Text>
								<Text
									color="gray.500"
									fontSize="xs">
									Fat
								</Text>
							</VStack>
						</HStack>
					</Box>

					{/* View Details Button */}
					<Button
						bgGradient="linear(135deg, purple.500, pink.500)"
						color="white"
						size="md"
						w="full"
						onClick={() => onViewDetails(day)}
						rightIcon={<Icon as={FiArrowRight} />}
						_hover={{
							bgGradient: "linear(135deg, purple.600, pink.600)",
							transform: "translateY(-2px)",
							shadow: "lg",
						}}
						transition="all 0.2s">
						View Full Day
					</Button>
				</VStack>
			</Box>
		</Box>
	);
};

export default WeeklyMenuCard;
