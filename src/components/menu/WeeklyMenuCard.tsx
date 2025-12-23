import {
	Box,
	HStack,
	VStack,
	Text,
	Button,
	Icon,
	Image,
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

			{/* Horizontal Layout - Compact */}
			<HStack spacing={0} align="stretch">
				{/* Left Side - Featured Image */}
				<Box
					position="relative"
					w={{ base: "100px", md: "120px" }}
					minH="160px"
					overflow="hidden"
					bgGradient="linear(135deg, purple.50, pink.50)">
					{/* Background Images - 3 meal preview stacked vertically */}
					<VStack spacing={0} h="full">
						<Box
							flex={1}
							w="full"
							position="relative"
							_after={{
								content: '""',
								position: "absolute",
								inset: 0,
								bg: "blackAlpha.200",
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
							w="full"
							position="relative"
							_after={{
								content: '""',
								position: "absolute",
								inset: 0,
								bg: "blackAlpha.200",
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
							w="full"
							position="relative"
							_after={{
								content: '""',
								position: "absolute",
								inset: 0,
								bg: "blackAlpha.200",
							}}>
							<Image
								src={day.dinner.image}
								alt={day.dinner.title}
								w="full"
								h="full"
								objectFit="cover"
							/>
						</Box>
					</VStack>

					{/* Calorie Badge */}
					<Box
						position="absolute"
						bottom={2}
						left="50%"
						transform="translateX(-50%)"
						bg="blackAlpha.700"
						backdropFilter="blur(10px)"
						px={2}
						py={1}
						borderRadius="md">
						<Text
							fontSize="2xs"
							fontWeight="bold"
							color="white">
							{day.totalCalories} cal
						</Text>
					</Box>
				</Box>

				{/* Right Side - Content */}
				<VStack
					flex={1}
					p={3}
					spacing={2}
					align="stretch"
					justify="space-between">
					{/* Date Header */}
					<HStack spacing={2} align="center">
						<Icon
							as={FiCalendar}
							color="purple.500"
							boxSize={4}
						/>
						<VStack align="start" spacing={0} flex={1}>
							<Text
								fontSize="md"
								fontWeight="bold"
								color="gray.800"
								lineHeight="1.2">
								{formatDate(day.date)}
							</Text>
							<Text fontSize="2xs" color="gray.500">
								{new Date(day.date).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
							</Text>
						</VStack>
					</HStack>

					{/* Meals List - Compact */}
					<VStack spacing={1.5} align="stretch" flex={1}>
						{/* Breakfast */}
						<HStack
							spacing={1.5}
							p={1.5}
							bg="orange.50"
							borderRadius="md"
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
							<Text fontSize="sm">🌅</Text>
							<VStack align="start" spacing={0} flex={1}>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="gray.800"
									noOfLines={1}>
									{day.breakfast.title}
								</Text>
								<Text fontSize="2xs" color="gray.500">
									{day.breakfast.nutrition.calories} cal
								</Text>
							</VStack>
						</HStack>

						{/* Lunch */}
						<HStack
							spacing={1.5}
							p={1.5}
							bg="green.50"
							borderRadius="md"
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
							<Text fontSize="sm">☀️</Text>
							<VStack align="start" spacing={0} flex={1}>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="gray.800"
									noOfLines={1}>
									{day.lunch.title}
								</Text>
								<Text fontSize="2xs" color="gray.500">
									{day.lunch.nutrition.calories} cal
								</Text>
							</VStack>
						</HStack>

						{/* Dinner */}
						<HStack
							spacing={1.5}
							p={1.5}
							bg="purple.50"
							borderRadius="md"
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
							<Text fontSize="sm">🌙</Text>
							<VStack align="start" spacing={0} flex={1}>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="gray.800"
									noOfLines={1}>
									{day.dinner.title}
								</Text>
								<Text fontSize="2xs" color="gray.500">
									{day.dinner.nutrition.calories} cal
								</Text>
							</VStack>
						</HStack>

						{/* Snacks Badge */}
						{day.snacks && day.snacks.length > 0 && (
							<HStack spacing={1.5} p={1.5} bg="blue.50" borderRadius="md">
								<Text fontSize="sm">🍎</Text>
								<Text fontSize="xs" fontWeight="semibold" color="gray.700">
									{day.snacks.length} Snack{day.snacks.length > 1 ? "s" : ""}
								</Text>
							</HStack>
						)}
					</VStack>

					{/* Nutrition Summary - Compact */}
					<HStack spacing={2} justify="space-around" bg="gray.50" p={2} borderRadius="lg">
						<VStack spacing={0}>
							<Text
								fontWeight="bold"
								color="purple.600"
								fontSize="xs">
								{day.totalProtein}
							</Text>
							<Text color="gray.500" fontSize="2xs">
								Protein
							</Text>
						</VStack>
						<Box h="20px" w="1px" bg="gray.300" />
						<VStack spacing={0}>
							<Text
								fontWeight="bold"
								color="purple.600"
								fontSize="xs">
								{day.totalCarbs}
							</Text>
							<Text color="gray.500" fontSize="2xs">
								Carbs
							</Text>
						</VStack>
						<Box h="20px" w="1px" bg="gray.300" />
						<VStack spacing={0}>
							<Text
								fontWeight="bold"
								color="purple.600"
								fontSize="xs">
								{day.totalFat}
							</Text>
							<Text color="gray.500" fontSize="2xs">
								Fat
							</Text>
						</VStack>
					</HStack>

					{/* View Details Button - Compact */}
					<Button
						bgGradient="linear(135deg, purple.500, pink.500)"
						color="white"
						size="xs"
						w="full"
						onClick={() => onViewDetails(day)}
						rightIcon={<Icon as={FiArrowRight} boxSize={3} />}
						fontSize="xs"
						_hover={{
							bgGradient: "linear(135deg, purple.600, pink.600)",
							transform: "translateY(-1px)",
							shadow: "md",
						}}
						transition="all 0.2s">
						View Full Day
					</Button>
				</VStack>
			</HStack>
		</Box>
	);
};

export default WeeklyMenuCard;
