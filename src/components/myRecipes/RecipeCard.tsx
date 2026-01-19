import {
	Card,
	CardBody,
	Box,
	Image,
	HStack,
	VStack,
	Text,
	Badge,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
	useColorModeValue,
	Tooltip,
	Checkbox,
} from "@chakra-ui/react";
import {
	FiMoreVertical,
	FiEdit2,
	FiTrash2,
	FiEye,
	FiShare2,
} from "react-icons/fi";
import type { Recipe } from "@/types/recipe";

interface RecipeCardProps {
	recipe: Recipe;
	onView: (recipe: Recipe) => void;
	onEdit: (recipe: Recipe) => void;
	onDelete: (recipe: Recipe) => void;
	onShare?: (recipe: Recipe) => void;
	isSelectionMode?: boolean;
	isSelected?: boolean;
	onToggleSelect?: (recipe: Recipe) => void;
}

const RecipeCard = ({
	recipe,
	onView,
	onEdit,
	onDelete,
	onShare,
	isSelectionMode = false,
	isSelected = false,
	onToggleSelect,
}: RecipeCardProps) => {
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const overlayBg = useColorModeValue("blackAlpha.600", "blackAlpha.700");

	const handleCardClick = () => {
		if (isSelectionMode && onToggleSelect) {
			onToggleSelect(recipe);
		} else {
			onView(recipe);
		}
	};

	const difficultyColor = {
		easy: "green",
		medium: "yellow",
		hard: "red",
	};

	const categoryColor = {
		breakfast: "orange",
		lunch: "green",
		dinner: "purple",
		snack: "blue",
	};

	const categoryEmoji = {
		breakfast: "🌅",
		lunch: "☀️",
		dinner: "🌙",
		snack: "🍎",
	};

	return (
		<Card
			bg={cardBg}
			shadow="md"
			borderRadius="xl"
			overflow="hidden"
			border={isSelected ? "3px" : "1px"}
			borderColor={isSelected ? "purple.500" : borderColor}
			transition="all 0.3s"
			cursor="pointer"
			_hover={{
				shadow: "xl",
				transform: "translateY(-4px)",
			}}
			onClick={handleCardClick}
			position="relative">
			{/* Image Section */}
			<Box
				position="relative"
				h="200px"
				overflow="hidden">
				<Image
					src={recipe.image}
					alt={recipe.title}
					objectFit="cover"
					w="full"
					h="full"
					transition="all 0.3s"
					_hover={{ transform: "scale(1.05)" }}
				/>
				<Box
					position="absolute"
					top={0}
					left={0}
					right={0}
					bottom={0}
					bgGradient={`linear(to-b, transparent 40%, ${overlayBg})`}
				/>

				{/* Category Badge */}
				<Badge
					position="absolute"
					top={3}
					left={3}
					colorScheme={categoryColor[recipe.category]}
					fontSize="xs"
					px={3}
					py={1}
					borderRadius="full"
					display="flex"
					alignItems="center"
					gap={1}>
					<Text as="span">{categoryEmoji[recipe.category]}</Text>
					{recipe.category.charAt(0).toUpperCase() +
						recipe.category.slice(1)}
				</Badge>

				{/* Selection Checkbox */}
				{isSelectionMode && (
					<Box
						position="absolute"
						top={3}
						left={3}
						zIndex={2}
						onClick={(e) => e.stopPropagation()}>
						<Checkbox
							size="lg"
							colorScheme="purple"
							isChecked={isSelected}
							onChange={() => onToggleSelect?.(recipe)}
							bg="whiteAlpha.900"
							borderRadius="md"
							p={1}
						/>
					</Box>
				)}

				{/* Actions Menu */}
				{!isSelectionMode && (
					<Box
						position="absolute"
						top={3}
						right={3}>
						<Menu>
							<MenuButton
								as={IconButton}
								icon={<Icon as={FiMoreVertical} />}
								size="sm"
								colorScheme="whiteAlpha"
								bg="whiteAlpha.300"
								backdropFilter="blur(10px)"
								_hover={{ bg: "whiteAlpha.400" }}
								onClick={(e) => e.stopPropagation()}
							/>
							<MenuList onClick={(e) => e.stopPropagation()}>
								<MenuItem
									icon={<Icon as={FiEye} />}
									onClick={(e) => {
										e.stopPropagation();
										onView(recipe);
									}}>
									View Details
								</MenuItem>
								{onShare && (
									<MenuItem
										icon={<Icon as={FiShare2} />}
										color="purple.500"
										onClick={(e) => {
											e.stopPropagation();
											onShare(recipe);
										}}>
										Share to Community
									</MenuItem>
								)}
								<MenuItem
									icon={<Icon as={FiEdit2} />}
									onClick={(e) => {
										e.stopPropagation();
										onEdit(recipe);
									}}>
									Edit Recipe
								</MenuItem>
								<MenuItem
									icon={<Icon as={FiTrash2} />}
									color="red.500"
									onClick={(e) => {
										e.stopPropagation();
										onDelete(recipe);
									}}>
									Delete Recipe
								</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				)}

				{/* Calories Badge */}
				<Badge
					position="absolute"
					bottom={3}
					right={3}
					colorScheme="brand"
					fontSize="md"
					px={3}
					py={1}
					borderRadius="full"
					fontWeight="bold"
					bg="whiteAlpha.300"
					backdropFilter="blur(10px)"
					color="white">
					{recipe.nutrition.calories} cal
				</Badge>
			</Box>

			{/* Content Section */}
			<CardBody p={4}>
				<VStack
					spacing={3}
					align="stretch">
					{/* Title */}
					<Tooltip
						label={recipe.title}
						placement="top">
						<Text
							fontSize="lg"
							fontWeight="bold"
							noOfLines={1}
							color="gray.800">
							{recipe.title}
						</Text>
					</Tooltip>

					{/* Description */}
					<Text
						fontSize="sm"
						color="gray.600"
						noOfLines={2}
						minH="40px">
						{recipe.description}
					</Text>

					{/* Tags and Difficulty */}
					<HStack
						spacing={2}
						flexWrap="wrap"
						justify="space-between">
						<HStack
							spacing={1}
							flexWrap="wrap">
							{recipe.tags.slice(0, 2).map((tag, index) => (
								<Badge
									key={index}
									colorScheme="purple"
									fontSize="xs"
									px={2}
									py={0.5}
									borderRadius="md"
									variant="subtle">
									{tag}
								</Badge>
							))}
							{recipe.tags.length > 2 && (
								<Badge
									colorScheme="gray"
									fontSize="xs"
									px={2}
									py={0.5}
									borderRadius="md"
									variant="subtle">
									+{recipe.tags.length - 2}
								</Badge>
							)}
						</HStack>
						<Badge
							colorScheme={difficultyColor[recipe.difficulty]}
							fontSize="xs"
							px={2}
							py={1}
							borderRadius="md">
							{recipe.difficulty.charAt(0).toUpperCase() +
								recipe.difficulty.slice(1)}
						</Badge>
					</HStack>

					{/* Nutrition Summary */}
					<HStack
						spacing={3}
						pt={2}
						borderTop="1px"
						borderColor={borderColor}
						fontSize="xs">
						<VStack
							spacing={0}
							flex={1}>
							<Text
								fontWeight="bold"
								color="brand.600">
								{recipe.nutrition.protein}
							</Text>
							<Text color="gray.500">Protein</Text>
						</VStack>
						<VStack
							spacing={0}
							flex={1}>
							<Text
								fontWeight="bold"
								color="green.600">
								{recipe.nutrition.carbs}
							</Text>
							<Text color="gray.500">Carbs</Text>
						</VStack>
						<VStack
							spacing={0}
							flex={1}>
							<Text
								fontWeight="bold"
								color="orange.600">
								{recipe.nutrition.fat}
							</Text>
							<Text color="gray.500">Fat</Text>
						</VStack>
					</HStack>
				</VStack>
			</CardBody>
		</Card>
	);
};

export default RecipeCard;
