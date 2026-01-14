import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Heading,
	Text,
	VStack,
	HStack,
	Badge,
	Grid,
	GridItem,
	Image,
	Divider,
	List,
	ListItem,
	ListIcon,
	Icon,
	SimpleGrid,
	Card,
	CardBody,
	useColorModeValue,
	Stack,
	Button,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { FiClock, FiUsers, FiBookmark } from "react-icons/fi";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { animationPresets } from "@/styles/animation";
import type { Recipe } from "@/types/recipe";
import RecipeFormModal from "../myRecipes/RecipeFormModal";
import { InappropriateFoodWarningModal } from "../myRecipes/InappropriateFoodWarningModal";
import { useState } from "react";
import type { RecipeFormData } from "@/types/myRecipe";
import { useMyRecipes } from "@/hooks/useMyRecipes";

interface RecipeDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	recipe: Recipe | null;
	showSaveButton?: boolean;
}

const RecipeDetailModal = ({
	isOpen,
	onClose,
	recipe,
	showSaveButton = false,
}: RecipeDetailModalProps) => {
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const {
		isOpen: isFormOpen,
		onOpen: onFormOpen,
		onClose: onFormClose,
	} = useDisclosure();
	const {
		isOpen: isWarningOpen,
		onOpen: onWarningOpen,
		onClose: onWarningClose,
	} = useDisclosure();
	const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [pendingRecipe, setPendingRecipe] = useState<RecipeFormData | null>(
		null,
	);

	const toast = useToast();
	const { addRecipe, createRecipe } = useMyRecipes();

	if (!recipe) return null;

	const handleSaveToMyRecipes = () => {
		setEditingRecipe(recipe);
		onFormOpen();
	};

	const handleFormClose = () => {
		// Đóng RecipeFormModal
		onFormClose();
		setEditingRecipe(null);
		setIsSaving(false);
	};

	const handleSaveRecipe = async (recipeData: RecipeFormData) => {
		try {
			setIsSaving(true);
			const result = await addRecipe(recipeData);
			console.log(recipeData);

			if (!result.isAllergyFree) {
				// Contains allergens - block completely
				toast({
					title: "Cannot Add Recipe",
					description:
						"This food contains allergens that you are allergic to. For your safety, we cannot add this recipe.",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
				return;
			}

			if (result.isAppropriate) {
				// Food is appropriate and allergy-free, create directly
				console.log(recipeData);

				await createRecipe(recipeData);
				handleFormClose();
			} else {
				// Food is not appropriate but allergy-free, show warning modal
				setPendingRecipe(recipeData);
				onWarningOpen();
			}
		} catch (error) {
			console.error("Error saving recipe:", error);
			toast({
				title: "Error",
				description: "Failed to save recipe. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleConfirmAddInappropriate = async () => {
		if (pendingRecipe) {
			await createRecipe(pendingRecipe);
			setPendingRecipe(null);
			onWarningClose();
			handleFormClose();
		}
	};

	const handleCancelAddInappropriate = () => {
		setPendingRecipe(null);
		onWarningClose();
	};

	const difficultyColor = {
		easy: "green",
		medium: "yellow",
		hard: "red",
	};

	// Check if recipe has a valid image (not the default Unsplash image)
	const hasImage = recipe.image && !recipe.image.includes("unsplash.com");

	return (
		<>
			<Modal
				isOpen={isOpen && !isFormOpen}
				onClose={onClose}
				size="6xl"
				scrollBehavior="inside">
				<ModalOverlay
					bg="blackAlpha.600"
					backdropFilter="blur(8px)"
				/>
				<ModalContent
					bg={cardBg}
					borderRadius="2xl"
					maxH="90vh"
					animation={animationPresets.fadeInUp}>
					<ModalHeader
						borderBottom="1px"
						borderColor={borderColor}
						pb={4}>
						<HStack spacing={3}>
							<Heading size="lg">{recipe.title}</Heading>
							<Badge
								colorScheme={difficultyColor[recipe.difficulty]}
								fontSize="sm"
								px={3}
								py={1}
								borderRadius="full">
								{recipe.difficulty}
							</Badge>
						</HStack>
					</ModalHeader>
					<ModalCloseButton
						size="lg"
						top={4}
						right={4}
						_hover={{
							bg: "red.50",
							color: "red.500",
						}}
					/>
					<ModalBody p={0}>
						<Grid
							templateColumns={
								hasImage
									? { base: "1fr", lg: "1fr 1fr" }
									: "1fr"
							}
							gap={0}>
							{/* Image Section - Only show if has image */}
							{hasImage && (
								<GridItem>
									<Box
										position="relative"
										h={{
											base: "250px",
											md: "350px",
											lg: "full",
										}}
										minH={{ lg: "500px" }}>
										<Image
											src={recipe.image}
											alt={recipe.title}
											objectFit="cover"
											w="full"
											h="full"
										/>
										<Box
											position="absolute"
											top={0}
											left={0}
											right={0}
											bottom={0}
											bgGradient="linear(to-b, transparent 50%, blackAlpha.700)"
										/>
										<Box
											position="absolute"
											bottom={4}
											left={4}
											right={4}
											color="white">
											<Text
												fontSize="lg"
												fontWeight="medium"
												mb={2}>
												{recipe.description}
											</Text>
											<HStack spacing={4}>
												<HStack spacing={2}>
													<Icon
														as={FiClock}
														boxSize={5}
													/>
													<Text fontWeight="bold">
														{recipe.cookingTime}
													</Text>
												</HStack>
												<HStack spacing={2}>
													<Icon
														as={FiUsers}
														boxSize={5}
													/>
													<Text fontWeight="bold">
														{recipe.servingSize}
													</Text>
												</HStack>
											</HStack>
										</Box>
									</Box>
								</GridItem>
							)}

							{/* Details Section */}
							<GridItem>
								<VStack
									spacing={6}
									align="stretch"
									p={{ base: 6, md: 8 }}
									h="full"
									overflowY="auto">
									{/* Show description and timing info if no image */}
									{!hasImage && (
										<>
											<Box
												bg="purple.50"
												p={4}
												borderRadius="xl"
												border="1px"
												borderColor="purple.100">
												<Text
													fontSize="md"
													color="gray.700"
													mb={3}>
													{recipe.description}
												</Text>
												<HStack spacing={4}>
													<HStack spacing={2}>
														<Icon
															as={FiClock}
															boxSize={5}
															color="purple.600"
														/>
														<Text
															fontWeight="bold"
															color="purple.600">
															{recipe.cookingTime}
														</Text>
													</HStack>
													<HStack spacing={2}>
														<Icon
															as={FiUsers}
															boxSize={5}
															color="purple.600"
														/>
														<Text
															fontWeight="bold"
															color="purple.600">
															{recipe.servingSize}
														</Text>
													</HStack>
												</HStack>
											</Box>
											<Divider />
										</>
									)}

									{/* Tags */}
									<HStack
										spacing={2}
										flexWrap="wrap">
										{recipe.tags.map((tag, index) => (
											<Badge
												key={index}
												colorScheme="purple"
												fontSize="xs"
												px={3}
												py={1}
												borderRadius="full">
												{tag}
											</Badge>
										))}
									</HStack>

									<Divider />

									{/* Nutrition Facts */}
									<Box>
										<Heading
											size="md"
											mb={4}
											color="brand.600">
											Nutrition Facts
										</Heading>
										<Card
											bg="gray.50"
											borderRadius="xl"
											border="1px"
											borderColor={borderColor}>
											<CardBody p={4}>
												<SimpleGrid
													columns={2}
													spacing={3}>
													<VStack
														align="start"
														spacing={1}>
														<Text
															fontSize="2xl"
															fontWeight="bold"
															color="brand.600">
															{
																recipe.nutrition
																	.calories
															}
														</Text>
														<Text
															fontSize="xs"
															color="gray.600"
															fontWeight="medium">
															Calories
														</Text>
													</VStack>
													<VStack
														align="start"
														spacing={1}>
														<Text
															fontSize="lg"
															fontWeight="bold">
															{
																recipe.nutrition
																	.protein
															}
														</Text>
														<Text
															fontSize="xs"
															color="gray.600">
															Protein
														</Text>
													</VStack>
													<VStack
														align="start"
														spacing={1}>
														<Text
															fontSize="lg"
															fontWeight="bold">
															{
																recipe.nutrition
																	.carbs
															}
														</Text>
														<Text
															fontSize="xs"
															color="gray.600">
															Carbs
														</Text>
													</VStack>
													<VStack
														align="start"
														spacing={1}>
														<Text
															fontSize="lg"
															fontWeight="bold">
															{
																recipe.nutrition
																	.fat
															}
														</Text>
														<Text
															fontSize="xs"
															color="gray.600">
															Fat
														</Text>
													</VStack>
												</SimpleGrid>
												<Divider my={3} />
												<SimpleGrid
													columns={2}
													spacing={2}>
													<HStack justify="space-between">
														<Text
															fontSize="xs"
															color="gray.600">
															Fiber
														</Text>
														<Text
															fontSize="xs"
															fontWeight="medium">
															{
																recipe.nutrition
																	.fiber
															}
														</Text>
													</HStack>
													<HStack justify="space-between">
														<Text
															fontSize="xs"
															color="gray.600">
															Sugar
														</Text>
														<Text
															fontSize="xs"
															fontWeight="medium">
															{
																recipe.nutrition
																	.sugar
															}
														</Text>
													</HStack>
													<HStack justify="space-between">
														<Text
															fontSize="xs"
															color="gray.600">
															Sodium
														</Text>
														<Text
															fontSize="xs"
															fontWeight="medium">
															{
																recipe.nutrition
																	.sodium
															}
														</Text>
													</HStack>
													<HStack justify="space-between">
														<Text
															fontSize="xs"
															color="gray.600">
															Cholesterol
														</Text>
														<Text
															fontSize="xs"
															fontWeight="medium">
															{
																recipe.nutrition
																	.cholesterol
															}
														</Text>
													</HStack>
												</SimpleGrid>
											</CardBody>
										</Card>
									</Box>

									<Divider />
									<Stack
										direction={hasImage ? "column" : "row"}
										align="stretch">
										{/* Ingredients */}
										<Box minW="400px">
											<Heading
												size="md"
												mb={4}
												color="brand.600">
												Ingredients
											</Heading>
											<List spacing={2}>
												{recipe.ingredients.map(
													(ingredient, index) => (
														<ListItem
															key={index}
															fontSize="md"
															display="flex"
															alignItems="start">
															<ListIcon
																as={
																	CheckCircleIcon
																}
																color="green.500"
																mt={1}
															/>
															<Text>
																{ingredient}
															</Text>
														</ListItem>
													),
												)}
											</List>
										</Box>
										<Divider
											orientation={
												hasImage
													? "horizontal"
													: "vertical"
											}
										/>
										{/* Instructions */}
										<Box pb={4}>
											<Heading
												size="md"
												mb={4}
												color="brand.600">
												Instructions
											</Heading>
											<List spacing={4}>
												{recipe.instructions.map(
													(step, index) => (
														<ListItem
															key={index}
															display="flex"
															alignItems="start">
															<Badge
																colorScheme="brand"
																borderRadius="full"
																px={3}
																py={1}
																mr={3}
																flexShrink={0}>
																{index + 1}
															</Badge>
															<Text
																fontSize="sm"
																mt={1}>
																{step}
															</Text>
														</ListItem>
													),
												)}
											</List>
										</Box>
									</Stack>
								</VStack>
							</GridItem>
						</Grid>
					</ModalBody>

					{showSaveButton && (
						<ModalFooter
							borderTop="1px"
							borderColor={borderColor}>
							<Button
								leftIcon={<Icon as={FiBookmark} />}
								colorScheme="purple"
								onClick={handleSaveToMyRecipes}
								isLoading={isSaving}
								size="lg">
								Save to My Recipes
							</Button>
						</ModalFooter>
					)}
				</ModalContent>
			</Modal>

			{/* Recipe Form Modal */}
			<RecipeFormModal
				isOpen={isFormOpen}
				onClose={handleFormClose}
				onSave={handleSaveRecipe}
				editingRecipe={editingRecipe}
			/>

			{/* Inappropriate Food Warning Modal */}
			<InappropriateFoodWarningModal
				isOpen={isWarningOpen}
				onClose={handleCancelAddInappropriate}
				onConfirm={handleConfirmAddInappropriate}
				foodName={pendingRecipe?.title || ""}
			/>
		</>
	);
};

export default RecipeDetailModal;
