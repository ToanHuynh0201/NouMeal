import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Box,
	IconButton,
	HStack,
	Badge,
	Image,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { FiEye, FiTrash2, FiEdit2 } from "react-icons/fi";
import type { Food } from "@/types/recipe";

interface FoodsTableProps {
	foods: Food[];
	onView: (food: Food) => void;
	onEdit: (food: Food) => void;
	onDelete: (food: Food) => void;
}

const categoryColors: { [key: string]: string } = {
	protein: "red",
	carbohydrate: "orange",
	vegetable: "green",
	fruit: "pink",
	dairy: "blue",
	fat: "yellow",
};

const mealColors: { [key: string]: string } = {
	breakfast: "purple",
	lunch: "blue",
	dinner: "orange",
	snack: "green",
};

export const FoodsTable = ({
	foods,
	onView,
	onEdit,
	onDelete,
}: FoodsTableProps) => {
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
						<Th
							textTransform="uppercase"
							textAlign="center">
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
									fallbackSrc="https://via.placeholder.com/50"
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
									colorScheme={
										categoryColors[food.category] || "gray"
									}
									textTransform="uppercase"
									px={3}
									py={1}
									borderRadius="md">
									{food.category}
								</Badge>
							</Td>
							<Td>
								<Badge
									colorScheme={
										mealColors[food.meal] || "gray"
									}
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
									colorScheme={
										food.isActive ? "green" : "red"
									}
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
											colorScheme="blue"
											variant="ghost"
											onClick={() => onView(food)}
										/>
									</Tooltip>
									<Tooltip label="Edit Food">
										<IconButton
											aria-label="Edit food"
											icon={<FiEdit2 />}
											size="sm"
											colorScheme="orange"
											variant="ghost"
											onClick={() => onEdit(food)}
										/>
									</Tooltip>
									<Tooltip label="Delete Food">
										<IconButton
											aria-label="Delete food"
											icon={<FiTrash2 />}
											size="sm"
											colorScheme="red"
											variant="ghost"
											onClick={() => onDelete(food)}
										/>
									</Tooltip>
								</HStack>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};
