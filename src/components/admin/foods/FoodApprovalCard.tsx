import {
	Box,
	Image,
	Text,
	Badge,
	VStack,
	HStack,
	Button,
	Icon,
	Divider,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import type { Food } from "@/types/recipe";

interface FoodApprovalCardProps {
	food: Food;
	onView: (food: Food) => void;
	onApprove: (foodId: string) => void;
	onReject: (foodId: string) => void;
}

const FoodApprovalCard = ({
	food,
	onView,
	onApprove,
	onReject,
}: FoodApprovalCardProps) => {
	const getCategoryColor = (category: string) => {
		const colors: Record<string, string> = {
			protein: "red",
			carbohydrate: "orange",
			vegetable: "green",
			fruit: "pink",
			dairy: "blue",
			fat: "yellow",
		};
		return colors[category] || "gray";
	};

	const getMealColor = (meal: string) => {
		const colors: Record<string, string> = {
			breakfast: "purple",
			lunch: "blue",
			dinner: "orange",
			snack: "green",
		};
		return colors[meal] || "gray";
	};

	return (
		<Box
			bg="white"
			borderRadius="xl"
			overflow="hidden"
			boxShadow="md"
			transition="all 0.3s"
			_hover={{
				transform: "translateY(-4px)",
				boxShadow: "xl",
			}}>
			{/* Food Image */}
			<Box
				position="relative"
				h="200px"
				overflow="hidden">
				<Image
					src={food.imageUrl}
					alt={food.name}
					w="100%"
					h="100%"
					objectFit="cover"
				/>
				<Box
					position="absolute"
					top={3}
					right={3}>
					<Badge
						colorScheme={getCategoryColor(food.category)}
						fontSize="xs"
						px={2}
						py={1}
						borderRadius="md"
						textTransform="capitalize">
						{food.category}
					</Badge>
				</Box>
				<Box
					position="absolute"
					top={3}
					left={3}>
					<Badge
						colorScheme={getMealColor(food.meal)}
						fontSize="xs"
						px={2}
						py={1}
						borderRadius="md"
						textTransform="capitalize">
						{food.meal}
					</Badge>
				</Box>
			</Box>

			{/* Food Details */}
			<VStack
				p={4}
				spacing={3}
				align="stretch">
				<Text
					fontSize="lg"
					fontWeight="bold"
					color="gray.800"
					noOfLines={1}>
					{food.name}
				</Text>

				<Text
					fontSize="sm"
					color="gray.600"
					noOfLines={2}
					minH="40px">
					{food.description}
				</Text>

				<Divider />

				{/* Nutritional Info */}
				<HStack
					spacing={4}
					justify="space-between">
					<VStack
						spacing={0}
						align="center">
						<Text
							fontSize="xs"
							color="gray.500">
							Calories
						</Text>
						<Text
							fontSize="sm"
							fontWeight="bold"
							color="orange.500">
							{food.nutritionalInfo.calories}
						</Text>
					</VStack>
					<VStack
						spacing={0}
						align="center">
						<Text
							fontSize="xs"
							color="gray.500">
							Protein
						</Text>
						<Text
							fontSize="sm"
							fontWeight="bold"
							color="green.500">
							{food.nutritionalInfo.protein}g
						</Text>
					</VStack>
					<VStack
						spacing={0}
						align="center">
						<Text
							fontSize="xs"
							color="gray.500">
							Carbs
						</Text>
						<Text
							fontSize="sm"
							fontWeight="bold"
							color="blue.500">
							{food.nutritionalInfo.carbohydrates}g
						</Text>
					</VStack>
					<VStack
						spacing={0}
						align="center">
						<Text
							fontSize="xs"
							color="gray.500">
							Fat
						</Text>
						<Text
							fontSize="sm"
							fontWeight="bold"
							color="purple.500">
							{food.nutritionalInfo.fat}g
						</Text>
					</VStack>
				</HStack>

				{/* Tags */}
				{food.tags && food.tags.length > 0 && (
					<Wrap>
						{food.tags.slice(0, 3).map((tag, index) => (
							<WrapItem key={index}>
								<Badge
									colorScheme="gray"
									fontSize="xs"
									textTransform="lowercase">
									#{tag}
								</Badge>
							</WrapItem>
						))}
						{food.tags.length > 3 && (
							<WrapItem>
								<Badge
									colorScheme="gray"
									fontSize="xs">
									+{food.tags.length - 3}
								</Badge>
							</WrapItem>
						)}
					</Wrap>
				)}

				<Divider />

				{/* Action Buttons */}
				<HStack spacing={2}>
					<Button
						size="sm"
						variant="outline"
						colorScheme="purple"
						leftIcon={<Icon as={FiEye} />}
						onClick={() => onView(food)}
						flex={1}>
						View
					</Button>
					<Button
						size="sm"
						colorScheme="green"
						leftIcon={<Icon as={FiCheck} />}
						onClick={() => onApprove(food._id)}
						flex={1}>
						Approve
					</Button>
					<Button
						size="sm"
						colorScheme="red"
						leftIcon={<Icon as={FiX} />}
						onClick={() => onReject(food._id)}
						flex={1}>
						Reject
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};

export default FoodApprovalCard;
