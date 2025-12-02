import {
	Card,
	CardBody,
	Box,
	HStack,
	VStack,
	Text,
	Button,
	Icon,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
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
	return (
		<Card
			bg="white"
			shadow="sm"
			borderRadius="lg"
			overflow="hidden"
			border="1px solid"
			borderColor="gray.200"
			transition="all 0.2s"
			_hover={{
				shadow: "md",
				borderColor: "gray.300",
			}}>
			{/* Header */}
			<Box
				bg="gray.50"
				px={4}
				py={3}
				borderBottom="1px solid"
				borderColor="gray.200">
				<HStack justify="space-between">
					<VStack
						align="start"
						spacing={0}>
						<Text
							fontSize="md"
							fontWeight="bold"
							color="gray.800">
							{formatDate(day.date)}
						</Text>
						<Text
							fontSize="xs"
							color="gray.500">
							{day.date}
						</Text>
					</VStack>
					<Text
						fontSize="sm"
						fontWeight="semibold"
						color="gray.700">
						{day.totalCalories} cal
					</Text>
				</HStack>
			</Box>

			{/* Body */}
			<CardBody p={5}>
				<VStack
					spacing={4}
					align="stretch">
					{/* Meals Preview */}
					<VStack
						spacing={2.5}
						align="stretch">
						{/* Breakfast */}
						<HStack
							spacing={3}
							p={3}
							bg="orange.50"
							borderRadius="xl"
							cursor="pointer"
							transition="all 0.2s"
							border="1px solid"
							borderColor="orange.100"
							_hover={{
								bg: "orange.100",
								borderColor: "orange.200",
								transform: "translateX(4px)",
							}}
							onClick={(e) => {
								e.stopPropagation();
								onRecipeClick(day.breakfast);
							}}>
							<Box
								bg="orange.200"
								p={2}
								borderRadius="lg"
								display="flex"
								alignItems="center"
								justifyContent="center">
								<Text fontSize="xl">🌅</Text>
							</Box>
							<VStack
								align="start"
								spacing={0}
								flex={1}>
								<Text
									fontSize="sm"
									fontWeight="bold"
									color="gray.800"
									noOfLines={1}>
									{day.breakfast.title}
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									{day.breakfast.nutrition.calories} cal
								</Text>
							</VStack>
						</HStack>

						{/* Lunch */}
						<HStack
							spacing={3}
							p={3}
							bg="green.50"
							borderRadius="xl"
							cursor="pointer"
							transition="all 0.2s"
							border="1px solid"
							borderColor="green.100"
							_hover={{
								bg: "green.100",
								borderColor: "green.200",
								transform: "translateX(4px)",
							}}
							onClick={(e) => {
								e.stopPropagation();
								onRecipeClick(day.lunch);
							}}>
							<Box
								bg="green.200"
								p={2}
								borderRadius="lg"
								display="flex"
								alignItems="center"
								justifyContent="center">
								<Text fontSize="xl">☀️</Text>
							</Box>
							<VStack
								align="start"
								spacing={0}
								flex={1}>
								<Text
									fontSize="sm"
									fontWeight="bold"
									color="gray.800"
									noOfLines={1}>
									{day.lunch.title}
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									{day.lunch.nutrition.calories} cal
								</Text>
							</VStack>
						</HStack>

						{/* Dinner */}
						<HStack
							spacing={3}
							p={3}
							bg="purple.50"
							borderRadius="xl"
							cursor="pointer"
							transition="all 0.2s"
							border="1px solid"
							borderColor="purple.100"
							_hover={{
								bg: "purple.100",
								borderColor: "purple.200",
								transform: "translateX(4px)",
							}}
							onClick={(e) => {
								e.stopPropagation();
								onRecipeClick(day.dinner);
							}}>
							<Box
								bg="purple.200"
								p={2}
								borderRadius="lg"
								display="flex"
								alignItems="center"
								justifyContent="center">
								<Text fontSize="xl">🌙</Text>
							</Box>
							<VStack
								align="start"
								spacing={0}
								flex={1}>
								<Text
									fontSize="sm"
									fontWeight="bold"
									color="gray.800"
									noOfLines={1}>
									{day.dinner.title}
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									{day.dinner.nutrition.calories} cal
								</Text>
							</VStack>
						</HStack>

						{/* Snacks */}
						{day.snacks && day.snacks.length > 0 && (
							<HStack
								spacing={3}
								p={3}
								bg="blue.50"
								borderRadius="xl"
								cursor="pointer"
								transition="all 0.2s"
								border="1px solid"
								borderColor="blue.100"
								_hover={{
									bg: "blue.100",
									borderColor: "blue.200",
									transform: "translateX(4px)",
								}}
								onClick={(e) => {
									e.stopPropagation();
									onRecipeClick(day.snacks![0]);
								}}>
								<Box
									bg="blue.200"
									p={2}
									borderRadius="lg"
									display="flex"
									alignItems="center"
									justifyContent="center">
									<Text fontSize="xl">🍎</Text>
								</Box>
								<VStack
									align="start"
									spacing={0}
									flex={1}>
									<Text
										fontSize="sm"
										fontWeight="bold"
										color="gray.800">
										{day.snacks.length} Snack(s)
									</Text>
									<Text
										fontSize="xs"
										color="gray.600">
										Healthy bites
									</Text>
								</VStack>
							</HStack>
						)}
					</VStack>

					{/* Nutrition Summary */}
					<HStack
						spacing={3}
						fontSize="xs"
						color="gray.600"
						justify="space-between">
						<VStack spacing={0}>
							<Text fontWeight="semibold">
								{day.totalProtein}
							</Text>
							<Text color="gray.500">protein</Text>
						</VStack>
						<VStack spacing={0}>
							<Text fontWeight="semibold">{day.totalCarbs}</Text>
							<Text color="gray.500">carbs</Text>
						</VStack>
						<VStack spacing={0}>
							<Text fontWeight="semibold">{day.totalFat}</Text>
							<Text color="gray.500">fat</Text>
						</VStack>
					</HStack>

					{/* View Details Button */}
					<Button
						colorScheme="gray"
						variant="outline"
						size="sm"
						onClick={() => onViewDetails(day)}
						rightIcon={<Icon as={FiArrowRight} />}>
						View Full Menu
					</Button>
				</VStack>
			</CardBody>
		</Card>
	);
};

export default WeeklyMenuCard;
