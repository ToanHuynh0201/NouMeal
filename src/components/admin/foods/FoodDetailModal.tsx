import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	Text,
	Badge,
	Stack,
	useBreakpointValue,
	Divider,
	Wrap,
	WrapItem,
	Grid,
	Image,
	OrderedList,
	ListItem,
	UnorderedList,
} from "@chakra-ui/react";
import type { Food } from "@/types/recipe";

interface FoodDetailModalProps {
	food: Food | null;
	isOpen: boolean;
	onClose: () => void;
	onToggleStatus?: (food: Food) => void;
	onDelete?: (food: Food) => void;
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

const InfoField = ({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) => (
	<Box>
		<Text
			fontWeight="bold"
			color="gray.600"
			fontSize="sm"
			mb={1}>
			{label}
		</Text>
		<Text
			fontSize="md"
			color="gray.800">
			{value}
		</Text>
	</Box>
);

export const FoodDetailModal = ({
	food,
	isOpen,
	onClose,
	onToggleStatus,
	onDelete,
}: FoodDetailModalProps) => {
	const isMobile = useBreakpointValue({ base: true, md: false });
	if (!food) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={isMobile ? "full" : "4xl"}>
			<ModalOverlay />
			<ModalContent
				maxW="1000px"
				borderRadius="2xl">
				<ModalHeader
					fontSize="2xl"
					fontWeight="bold"
					color="gray.700"
					pb={2}>
					Food Details
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody
					px={{ base: 4, md: 8 }}
					py={4}>
					{/* Food Image & Basic Info */}
					<Box mb={6}>
						<Grid
							templateColumns={{ base: "1fr", md: "200px 1fr" }}
							gap={6}>
							<Image
								src={food.imageUrl}
								alt={food.name}
								borderRadius="lg"
								objectFit="cover"
								w="100%"
								h="200px"
								fallbackSrc="https://via.placeholder.com/200"
							/>
							<Box>
								<Text
									fontSize="2xl"
									fontWeight="bold"
									color="gray.800"
									mb={2}>
									{food.name}
								</Text>
								<Text
									fontSize="md"
									color="gray.600"
									mb={3}>
									{food.description}
								</Text>
								<Stack
									direction="row"
									spacing={2}
									mb={2}>
									<Badge
										colorScheme={
											categoryColors[food.category] ||
											"gray"
										}
										fontSize="sm"
										px={3}
										py={1}
										borderRadius="md">
										{food.category.toUpperCase()}
									</Badge>
									<Badge
										colorScheme={
											mealColors[food.meal] || "gray"
										}
										fontSize="sm"
										px={3}
										py={1}
										borderRadius="md">
										{food.meal.toUpperCase()}
									</Badge>
									<Badge
										colorScheme={
											food.isActive ? "green" : "red"
										}
										fontSize="sm"
										px={3}
										py={1}
										borderRadius="md">
										{food.isActive ? "Active" : "Inactive"}
									</Badge>
								</Stack>
								{food.tags && food.tags.length > 0 && (
									<Wrap
										spacing={2}
										mt={2}>
										{food.tags.map((tag, index) => (
											<WrapItem key={index}>
												<Badge
													colorScheme="cyan"
													fontSize="xs"
													px={2}
													py={1}>
													{tag
														.replace(/_/g, " ")
														.toUpperCase()}
												</Badge>
											</WrapItem>
										))}
									</Wrap>
								)}
							</Box>
						</Grid>
					</Box>

					<Divider my={4} />

					{/* Nutritional Information */}
					<Box mb={6}>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="gray.700"
							mb={4}>
							Nutritional Information
						</Text>
						<Grid
							templateColumns={{
								base: "repeat(2, 1fr)",
								md: "repeat(4, 1fr)",
							}}
							gap={4}>
							<InfoField
								label="Calories"
								value={`${food.nutritionalInfo.calories} kcal`}
							/>
							<InfoField
								label="Protein"
								value={`${food.nutritionalInfo.protein}g`}
							/>
							<InfoField
								label="Carbohydrates"
								value={`${food.nutritionalInfo.carbohydrates}g`}
							/>
							<InfoField
								label="Fat"
								value={`${food.nutritionalInfo.fat}g`}
							/>
						</Grid>
					</Box>

					<Divider my={4} />

					{/* Ingredients */}
					<Box mb={6}>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="gray.700"
							mb={4}>
							Ingredients
						</Text>
						<UnorderedList
							spacing={2}
							pl={4}>
							{food.ingredients.map((ingredient, index) => (
								<ListItem
									key={index}
									fontSize="md"
									color="gray.700">
									<Text
										as="span"
										fontWeight="semibold">
										{ingredient.name}
									</Text>
									{" - "}
									<Text
										as="span"
										color="gray.600">
										{ingredient.amount}
									</Text>
								</ListItem>
							))}
						</UnorderedList>
					</Box>

					<Divider my={4} />

					{/* Instructions */}
					<Box mb={6}>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="gray.700"
							mb={4}>
							Cooking Instructions
						</Text>
						<OrderedList
							spacing={3}
							pl={4}>
							{food.instructions.map((instruction) => (
								<ListItem
									key={instruction.step}
									fontSize="md"
									color="gray.700">
									{instruction.description}
								</ListItem>
							))}
						</OrderedList>
					</Box>

					<Divider my={4} />

					{/* Allergens */}
					<Box mb={6}>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="gray.700"
							mb={4}>
							Allergens
						</Text>
						{food.allergens && food.allergens.length > 0 ? (
							<Wrap spacing={2}>
								{food.allergens.map((allergen, index) => (
									<WrapItem key={index}>
										<Badge
											colorScheme="red"
											fontSize="sm"
											px={3}
											py={1}>
											{allergen.toUpperCase()}
										</Badge>
									</WrapItem>
								))}
							</Wrap>
						) : (
							<Text
								fontSize="sm"
								color="gray.500">
								No allergens specified
							</Text>
						)}
					</Box>

					<Divider my={4} />

					{/* Metadata */}
					<Box>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="gray.700"
							mb={4}>
							Metadata
						</Text>
						<Grid
							templateColumns={{
								base: "1fr",
								md: "repeat(2, 1fr)",
							}}
							gap={4}>
							<InfoField
								label="Created At"
								value={new Date(food.createdAt).toLocaleString(
									"en-US",
									{
										dateStyle: "medium",
										timeStyle: "short",
									},
								)}
							/>
							<InfoField
								label="Updated At"
								value={new Date(food.updatedAt).toLocaleString(
									"en-US",
									{
										dateStyle: "medium",
										timeStyle: "short",
									},
								)}
							/>
						</Grid>
					</Box>
				</ModalBody>
				<ModalFooter>
					{onDelete && (
						<Button
							colorScheme="red"
							variant="outline"
							mr="auto"
							onClick={() => onDelete(food)}
							fontWeight="bold"
							fontSize="md"
							px={6}
							py={2}
							borderRadius="lg">
							Delete Food
						</Button>
					)}
					{onToggleStatus && (
						<Button
							colorScheme={food.isActive ? "red" : "green"}
							variant={food.isActive ? "outline" : "solid"}
							mr={3}
							onClick={() => onToggleStatus(food)}
							fontWeight="bold"
							fontSize="md"
							px={6}
							py={2}
							borderRadius="lg">
							{food.isActive ? "Deactivate" : "Activate"}
						</Button>
					)}
					<Button
						onClick={onClose}
						fontWeight="bold"
						fontSize="md"
						px={6}
						py={2}
						borderRadius="lg">
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
