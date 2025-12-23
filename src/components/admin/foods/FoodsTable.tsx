import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Box,
	Button,
	useBreakpointValue,
	Badge,
	Image,
	Text,
	VStack,
} from "@chakra-ui/react";
import { FiEye, FiTrash2 } from "react-icons/fi";

interface Food {
	_id: string;
	name: string;
	description: string;
	category: string;
	meal: string;
	imageUrl: string;
	nutritionalInfo: {
		calories: number;
		protein: number;
		carbohydrates: number;
		fat: number;
	};
	isActive: boolean;
	tags?: string[];
}

interface FoodsTableProps {
	foods: Food[];
	onView: (food: Food) => void;
	onToggleStatus: (food: Food) => void;
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
	onToggleStatus,
	onDelete,
}: FoodsTableProps) => {
	const isMobile = useBreakpointValue({ base: true, md: false });

	return (
		<Box
			overflowX="auto"
			borderRadius="xl"
			boxShadow="md"
			bg="white">
			<Table
				variant="simple"
				size={isMobile ? "sm" : "md"}>
				<Thead bg="gray.50">
					<Tr>
						<Th>Image</Th>
						<Th>Name</Th>
						<Th>Category</Th>
						<Th>Meal</Th>
						<Th>Calories</Th>
						<Th>Status</Th>
						<Th textAlign="center">Actions</Th>
					</Tr>
				</Thead>
				<Tbody>
					{foods.map((food) => (
						<Tr key={food._id}>
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
								<VStack align="start" spacing={0}>
									<Text fontWeight="medium">{food.name}</Text>
									<Text fontSize="xs" color="gray.600" noOfLines={1}>
										{food.description}
									</Text>
								</VStack>
							</Td>
							<Td>
								<Badge
									colorScheme={categoryColors[food.category] || "gray"}
									fontSize="sm"
									px={3}
									py={1}
									borderRadius="md"
									fontWeight="bold">
									{food.category.toUpperCase()}
								</Badge>
							</Td>
							<Td>
								<Badge
									colorScheme={mealColors[food.meal] || "gray"}
									fontSize="sm"
									px={3}
									py={1}
									borderRadius="md"
									fontWeight="bold">
									{food.meal.toUpperCase()}
								</Badge>
							</Td>
							<Td fontWeight="semibold">
								{food.nutritionalInfo.calories} kcal
							</Td>
							<Td>
								<Badge
									colorScheme={food.isActive ? "green" : "red"}
									fontSize="sm"
									px={3}
									py={1}
									borderRadius="md"
									fontWeight="bold">
									{food.isActive ? "Active" : "Inactive"}
								</Badge>
							</Td>
							<Td textAlign="center">
								<Button
									size="sm"
									leftIcon={<FiEye />}
									variant="outline"
									colorScheme="blue"
									mr={2}
									onClick={() => onView(food)}>
									View
								</Button>
								<Button
									size="sm"
									variant={
										food.isActive ? "outline" : "solid"
									}
									colorScheme={
										food.isActive ? "red" : "green"
									}
									mr={2}
									onClick={() => onToggleStatus(food)}>
									{food.isActive ? "Deactivate" : "Activate"}
								</Button>
								<Button
									size="sm"
									leftIcon={<FiTrash2 />}
									variant="outline"
									colorScheme="red"
									onClick={() => onDelete(food)}>
									Delete
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};
