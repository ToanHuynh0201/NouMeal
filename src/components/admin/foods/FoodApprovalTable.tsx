import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	IconButton,
	HStack,
	Image,
	Text,
	Box,
	Tooltip,
} from "@chakra-ui/react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import type { Food } from "@/types/recipe";

interface FoodApprovalTableProps {
	foods: Food[];
	onView: (food: Food) => void;
	onApprove: (foodId: string) => void;
	onReject: (foodId: string) => void;
}

export const FoodApprovalTable = ({
	foods,
	onView,
	onApprove,
	onReject,
}: FoodApprovalTableProps) => {
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
			borderRadius="lg"
			overflow="hidden"
			boxShadow="md">
			<Table variant="simple">
				<Thead bg="gray.50">
					<Tr>
						<Th textTransform="uppercase">Image</Th>
						<Th textTransform="uppercase">Name</Th>
						<Th textTransform="uppercase">Category</Th>
						<Th textTransform="uppercase">Meal</Th>
						<Th textTransform="uppercase">Calories</Th>
						<Th textTransform="uppercase">Status</Th>
						<Th textTransform="uppercase" textAlign="center">
							Actions
						</Th>
					</Tr>
				</Thead>
				<Tbody>
					{foods.map((food) => (
						<Tr
							key={food._id}
							_hover={{ bg: "gray.50" }}
							transition="all 0.2s">
							<Td>
								<Image
									src={food.imageUrl}
									alt={food.name}
									boxSize="50px"
									objectFit="cover"
									borderRadius="md"
								/>
							</Td>
							<Td>
								<Box maxW="250px">
									<Text
										fontWeight="medium"
										noOfLines={1}>
										{food.name}
									</Text>
									<Text
										fontSize="xs"
										color="gray.500"
										noOfLines={1}>
										{food.description}
									</Text>
								</Box>
							</Td>
							<Td>
								<Badge
									colorScheme={getCategoryColor(food.category)}
									textTransform="uppercase"
									px={3}
									py={1}
									borderRadius="md">
									{food.category}
								</Badge>
							</Td>
							<Td>
								<Badge
									colorScheme={getMealColor(food.meal)}
									textTransform="uppercase"
									px={3}
									py={1}
									borderRadius="md">
									{food.meal}
								</Badge>
							</Td>
							<Td>
								<Text fontWeight="medium">
									{food.nutritionalInfo.calories} kcal
								</Text>
							</Td>
							<Td>
								<Badge
									colorScheme={food.isActive ? "green" : "red"}
									textTransform="uppercase"
									px={3}
									py={1}
									borderRadius="md">
									{food.isActive ? "ACTIVE" : "INACTIVE"}
								</Badge>
							</Td>
							<Td>
								<HStack
									spacing={2}
									justify="center">
									<Tooltip label="View Details">
										<IconButton
											aria-label="View food"
											icon={<FiEye />}
											size="sm"
											colorScheme="purple"
											variant="ghost"
											onClick={() => onView(food)}
										/>
									</Tooltip>
									<Tooltip label="Approve for Recommendations">
										<IconButton
											aria-label="Approve food"
											icon={<FiCheck />}
											size="sm"
											colorScheme="green"
											variant="ghost"
											onClick={() => onApprove(food._id)}
										/>
									</Tooltip>
									<Tooltip label="Reject and Deactivate">
										<IconButton
											aria-label="Reject food"
											icon={<FiX />}
											size="sm"
											colorScheme="red"
											variant="ghost"
											onClick={() => onReject(food._id)}
										/>
									</Tooltip>
								</HStack>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>

			{foods.length === 0 && (
				<Box
					p={10}
					textAlign="center">
					<Text
						fontSize="lg"
						color="gray.500">
						No foods found
					</Text>
				</Box>
			)}
		</Box>
	);
};
