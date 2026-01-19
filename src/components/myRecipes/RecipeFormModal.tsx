import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	VStack,
	HStack,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Select,
	Grid,
	GridItem,
	IconButton,
	Icon,
	Text,
	Box,
	useColorModeValue,
	useToast,
	Wrap,
	WrapItem,
	Tag,
	TagLabel,
	TagCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FiPlus, FiX, FiUpload, FiImage } from "react-icons/fi";
import type { Recipe } from "@/types/recipe";
import type { RecipeFormData } from "@/types/myRecipe";
import { ALLERGEN_VALUES, DIETARY_PREFERENCE_TAGS } from "@/constants";
import type { DietaryPreferenceTag } from "@/types";

interface RecipeFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (recipe: RecipeFormData) => void;
	editingRecipe?: Recipe | null;
}

const RecipeFormModal = ({
	isOpen,
	onClose,
	onSave,
	editingRecipe,
}: RecipeFormModalProps) => {
	const toast = useToast();
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const initialFormData: RecipeFormData = {
		title: "",
		description: "",
		image: "",
		foodCategory: "grains",
		category: "breakfast",
		difficulty: "easy",
		ingredients: [{ name: "", amount: "" }],
		instructions: [""],
		tags: [],
		allergens: [],
		nutrition: {
			calories: 0,
			protein: "0g",
			fat: "0g",
			carbs: "0g",
		},
	};

	// Helper function to extract numeric value from string like "15g" -> "15"
	const extractNumericValue = (value: string | undefined): string => {
		if (!value) return "";
		return value.replace(/[^0-9.]/g, "");
	};

	// Helper function to add unit to numeric value: "15" -> "15g"
	const addGramUnit = (value: string): string => {
		const numValue = value.replace(/[^0-9.]/g, "");
		return numValue ? `${numValue}g` : "0g";
	};

	const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Load editing recipe data
	useEffect(() => {
		if (isOpen && editingRecipe) {
			setFormData({
				_id: editingRecipe.id,
				title: editingRecipe.title,
				description: editingRecipe.description,
				image: editingRecipe.image,
				foodCategory: (editingRecipe as any).foodCategory || "grains",
				category: editingRecipe.category,
				difficulty: editingRecipe.difficulty,
				ingredients: editingRecipe.ingredients.map((ing) => {
					// Helper function để viết hoa chữ cái đầu
					const capitalizeFirstLetter = (str: string) => {
						return str.charAt(0).toUpperCase() + str.slice(1);
					};

					// Thử parse theo format "amount name" (ví dụ: "300g beef sirloin, sliced")
					// hoặc "name - amount" (ví dụ: "beef sirloin - 300g")

					// Kiểm tra format "name - amount"
					if (ing.includes(" - ")) {
						const parts = ing.split(" - ");
						return {
							name: capitalizeFirstLetter(parts[0].trim()),
							amount: parts[1]?.trim() || "",
						};
					}

					// Kiểm tra format "amount name"
					// Match: số (có thể có dấu / hoặc .) + đơn vị đo lường (tùy chọn, có thể dính liền hoặc cách nhau)
					// Ví dụ: "2", "1/2", "300g", "300 g", "4 cups", "1 tbsp", "500ml"
					const match = ing.match(
						/^([\d./]+(?:(?:\s+|(?=[a-z]))(?:cups?|tbsp|tsp|mg|g|kg|ml|l|oz|lb|piece|pieces|cloves?|wedges?))?)\s+(.+)$/i,
					);
					if (match) {
						return {
							name: capitalizeFirstLetter(match[2].trim()),
							amount: match[1].trim(),
						};
					}

					// Nếu không match được format nào, trả về toàn bộ làm name
					return { name: capitalizeFirstLetter(ing), amount: "" };
				}),
				instructions: editingRecipe.instructions,
				tags: editingRecipe.tags,
				allergens: (editingRecipe as any).allergens || [],
				nutrition: {
					calories: editingRecipe.nutrition.calories || 0,
					protein: editingRecipe.nutrition.protein || "0g",
					fat: editingRecipe.nutrition.fat || "0g",
					carbs: editingRecipe.nutrition.carbs || "0g",
				},
			});
			setImagePreview(editingRecipe.image || "");
		} else if (isOpen && !editingRecipe) {
			setFormData(initialFormData);
			setImagePreview("");
		}
	}, [editingRecipe, isOpen]);

	// Handle image file upload and convert to base64
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast({
				title: "Invalid file type",
				description:
					"Please select an image file (JPEG, PNG, GIF, etc.)",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			toast({
				title: "File too large",
				description: "Please select an image smaller than 5MB",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			setFormData((prev) => ({ ...prev, image: base64String }));
			setImagePreview(base64String);
		};
		reader.onerror = () => {
			toast({
				title: "Error reading file",
				description: "Failed to read the image file",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveImage = () => {
		setFormData((prev) => ({ ...prev, image: "" }));
		setImagePreview("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleInputChange = (
		field: keyof RecipeFormData,
		value: string | number,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleNutritionChange = (field: string, value: string | number) => {
		// For gram-based fields, convert input value to "Xg" format
		if (
			field === "protein" ||
			field === "fat" ||
			field === "carbs" ||
			field === "fiber" ||
			field === "sugar"
		) {
			const numValue = String(value).replace(/[^0-9.]/g, "");
			const formattedValue = numValue ? `${numValue}g` : "0g";
			setFormData((prev) => ({
				...prev,
				nutrition: { ...prev.nutrition, [field]: formattedValue },
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				nutrition: { ...prev.nutrition, [field]: value },
			}));
		}
	};

	const handleArrayChange = (
		field: "instructions" | "tags" | "allergens",
		index: number,
		value: string,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].map((item, i) => (i === index ? value : item)),
		}));
	};

	const handleIngredientChange = (
		index: number,
		field: "name" | "amount",
		value: string,
	) => {
		setFormData((prev) => ({
			...prev,
			ingredients: prev.ingredients.map((item, i) =>
				i === index ? { ...item, [field]: value } : item,
			),
		}));
	};

	const handleAddArrayItem = (
		field: "ingredients" | "instructions" | "tags",
	) => {
		if (field === "ingredients") {
			setFormData((prev) => ({
				...prev,
				ingredients: [...prev.ingredients, { name: "", amount: "" }],
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[field]: [...prev[field], ""],
			}));
		}
	};

	const handleRemoveArrayItem = (
		field: "ingredients" | "instructions" | "tags",
		index: number,
	) => {
		if (formData[field].length > 1) {
			setFormData((prev) => ({
				...prev,
				[field]: prev[field].filter((_, i) => i !== index),
			}));
		}
	};

	const handleAllergenToggle = (allergen: string) => {
		setFormData((prev) => {
			const isSelected = prev.allergens.includes(allergen);
			return {
				...prev,
				allergens: isSelected
					? prev.allergens.filter((a) => a !== allergen)
					: [...prev.allergens, allergen],
			};
		});
	};

	const handleSubmit = async () => {
		// Validation
		if (!formData.title.trim()) {
			toast({
				title: "Validation Error",
				description: "Recipe title is required",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (!formData.description.trim()) {
			toast({
				title: "Validation Error",
				description: "Recipe description is required",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		// Filter out empty items
		const cleanedData = {
			...formData,
			ingredients: formData.ingredients.filter(
				(item) => item.name.trim() !== "" && item.amount.trim() !== "",
			),
			instructions: formData.instructions.filter(
				(item) => item.trim() !== "",
			),
			// Tags and allergens are already validated (selected from predefined lists)
		};

		if (cleanedData.ingredients.length === 0) {
			toast({
				title: "Validation Error",
				description:
					"At least one ingredient with name and amount is required",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (cleanedData.instructions.length === 0) {
			toast({
				title: "Validation Error",
				description: "At least one instruction is required",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsLoading(true);
		try {
			await onSave(cleanedData);
			// Chỉ đóng modal khi onSave thành công
			handleClose();
		} catch (error) {
			console.error("RecipeFormModal - onSave error:", error);
			// Modal sẽ không đóng khi có lỗi
			toast({
				title: "Error",
				description: "Failed to save recipe. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setFormData(initialFormData);
		setImagePreview("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="4xl"
			scrollBehavior="inside">
			<ModalOverlay
				bg="blackAlpha.600"
				backdropFilter="blur(8px)"
			/>
			<ModalContent
				bg={cardBg}
				borderRadius="2xl"
				maxH="90vh">
				<ModalHeader
					borderBottom="1px"
					borderColor={borderColor}>
					{editingRecipe ? "Edit Recipe" : "Add New Recipe"}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody py={6}>
					<VStack
						spacing={6}
						align="stretch">
						{/* Basic Information */}
						<Box>
							<Text
								fontSize="lg"
								fontWeight="bold"
								mb={4}
								color="brand.600">
								Basic Information
							</Text>
							<VStack
								spacing={4}
								align="stretch">
								<FormControl isRequired>
									<FormLabel>Recipe Title</FormLabel>
									<Input
										value={formData.title}
										onChange={(e) =>
											handleInputChange(
												"title",
												e.target.value,
											)
										}
										placeholder="Enter recipe title"
									/>
								</FormControl>

								<FormControl isRequired>
									<FormLabel>Description</FormLabel>
									<Textarea
										value={formData.description}
										onChange={(e) =>
											handleInputChange(
												"description",
												e.target.value,
											)
										}
										placeholder="Enter recipe description"
										rows={3}
									/>
								</FormControl>

								<Grid
									templateColumns="repeat(2, 1fr)"
									gap={4}>
									<GridItem>
										<FormControl isRequired>
											<FormLabel>Meal Type</FormLabel>
											<Select
												value={formData.category}
												onChange={(e) =>
													handleInputChange(
														"category",
														e.target.value,
													)
												}>
												<option value="breakfast">
													Breakfast
												</option>
												<option value="lunch">
													Lunch
												</option>
												<option value="dinner">
													Dinner
												</option>
												<option value="snack">
													Snack
												</option>
											</Select>
										</FormControl>
									</GridItem>
									<GridItem>
										<FormControl isRequired>
											<FormLabel>Food Category</FormLabel>
											<Select
												value={formData.foodCategory}
												onChange={(e) =>
													handleInputChange(
														"foodCategory",
														e.target.value,
													)
												}>
												<option value="fruits">
													Fruits
												</option>
												<option value="vegetables">
													Vegetables
												</option>
												<option value="grains">
													Grains
												</option>
												<option value="protein">
													Protein
												</option>
												<option value="dairy">
													Dairy
												</option>
												<option value="fats">
													Fats
												</option>
												<option value="beverages">
													Beverages
												</option>
												<option value="snacks">
													Snacks
												</option>
												<option value="desserts">
													Desserts
												</option>
												<option value="spices">
													Spices
												</option>
											</Select>
										</FormControl>
									</GridItem>
								</Grid>

								<Grid
									templateColumns="repeat(2, 1fr)"
									gap={4}>
									<GridItem>
										<FormControl>
											<FormLabel>Difficulty</FormLabel>
											<Select
												value={formData.difficulty}
												onChange={(e) =>
													handleInputChange(
														"difficulty",
														e.target.value,
													)
												}>
												<option value="easy">
													Easy
												</option>
												<option value="medium">
													Medium
												</option>
												<option value="hard">
													Hard
												</option>
											</Select>
										</FormControl>
									</GridItem>
								</Grid>

								<FormControl>
									<FormLabel>Recipe Image</FormLabel>
									<Input
										type="file"
										accept="image/*"
										ref={fileInputRef}
										onChange={handleImageUpload}
										display="none"
									/>
									{imagePreview ? (
										<Box position="relative">
											<Box
												borderRadius="lg"
												overflow="hidden"
												border="2px solid"
												borderColor={borderColor}>
												<img
													src={imagePreview}
													alt="Recipe preview"
													style={{
														width: "100%",
														maxHeight: "200px",
														objectFit: "cover",
													}}
												/>
											</Box>
											<HStack
												mt={2}
												spacing={2}>
												<Button
													size="sm"
													leftIcon={
														<Icon as={FiUpload} />
													}
													variant="outline"
													onClick={() =>
														fileInputRef.current?.click()
													}>
													Change Image
												</Button>
												<IconButton
													aria-label="Remove image"
													icon={<Icon as={FiX} />}
													size="sm"
													colorScheme="red"
													variant="outline"
													onClick={handleRemoveImage}
												/>
											</HStack>
										</Box>
									) : (
										<Box
											border="2px dashed"
											borderColor={borderColor}
											borderRadius="lg"
											p={8}
											textAlign="center"
											cursor="pointer"
											_hover={{
												borderColor: "brand.500",
												bg: "gray.50",
											}}
											onClick={() =>
												fileInputRef.current?.click()
											}>
											<VStack spacing={2}>
												<Icon
													as={FiImage}
													boxSize={8}
													color="gray.400"
												/>
												<Text color="gray.500">
													Click to upload an image
												</Text>
												<Text
													fontSize="sm"
													color="gray.400">
													JPEG, PNG, GIF (max 5MB)
												</Text>
											</VStack>
										</Box>
									)}
								</FormControl>
							</VStack>
						</Box>

						{/* Nutrition Information */}
						<Box>
							<Text
								fontSize="lg"
								fontWeight="bold"
								mb={4}
								color="brand.600">
								Nutrition Information
							</Text>
							<Grid
								templateColumns="repeat(2, 1fr)"
								gap={4}>
								<GridItem>
									<FormControl>
										<FormLabel>Calories</FormLabel>
										<Input
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											value={
												formData.nutrition.calories ===
												0
													? ""
													: formData.nutrition
															.calories
											}
											onChange={(e) => {
												const value =
													e.target.value.replace(
														/[^0-9]/g,
														"",
													);
												handleNutritionChange(
													"calories",
													parseInt(value) || 0,
												);
											}}
											placeholder="0"
										/>
									</FormControl>
								</GridItem>
								<GridItem>
									<FormControl>
										<FormLabel>Protein (g)</FormLabel>
										<Input
											type="text"
											inputMode="decimal"
											pattern="[0-9]*\.?[0-9]*"
											value={extractNumericValue(
												formData.nutrition.protein,
											)}
											onChange={(e) => {
												const value =
													e.target.value.replace(
														/[^0-9.]/g,
														"",
													);
												handleNutritionChange(
													"protein",
													value,
												);
											}}
											placeholder="0"
										/>
									</FormControl>
								</GridItem>
								<GridItem>
									<FormControl>
										<FormLabel>Carbs (g)</FormLabel>
										<Input
											type="text"
											inputMode="decimal"
											pattern="[0-9]*\.?[0-9]*"
											value={extractNumericValue(
												formData.nutrition.carbs,
											)}
											onChange={(e) => {
												const value =
													e.target.value.replace(
														/[^0-9.]/g,
														"",
													);
												handleNutritionChange(
													"carbs",
													value,
												);
											}}
											placeholder="0"
										/>
									</FormControl>
								</GridItem>
								<GridItem>
									<FormControl>
										<FormLabel>Fat (g)</FormLabel>
										<Input
											type="text"
											inputMode="decimal"
											pattern="[0-9]*\.?[0-9]*"
											value={extractNumericValue(
												formData.nutrition.fat,
											)}
											onChange={(e) => {
												const value =
													e.target.value.replace(
														/[^0-9.]/g,
														"",
													);
												handleNutritionChange(
													"fat",
													value,
												);
											}}
											placeholder="0"
										/>
									</FormControl>
								</GridItem>
							</Grid>
						</Box>

						{/* Ingredients */}
						<Box>
							<HStack
								justify="space-between"
								mb={4}>
								<Text
									fontSize="lg"
									fontWeight="bold"
									color="brand.600">
									Ingredients
								</Text>
								<Button
									size="sm"
									leftIcon={<Icon as={FiPlus} />}
									colorScheme="purple"
									variant="outline"
									onClick={() =>
										handleAddArrayItem("ingredients")
									}>
									Add Ingredient
								</Button>
							</HStack>
							<VStack
								spacing={3}
								align="stretch">
								{formData.ingredients.map(
									(ingredient, index) => (
										<HStack
											key={index}
											spacing={3}>
											<Input
												value={ingredient.name}
												onChange={(e) =>
													handleIngredientChange(
														index,
														"name",
														e.target.value,
													)
												}
												placeholder="Ingredient name (e.g., Oats)"
												flex={2}
											/>
											<Input
												value={ingredient.amount}
												onChange={(e) =>
													handleIngredientChange(
														index,
														"amount",
														e.target.value,
													)
												}
												placeholder="Amount (e.g., 1 cup)"
												flex={1}
											/>
											<IconButton
												aria-label="Remove ingredient"
												icon={<Icon as={FiX} />}
												colorScheme="red"
												variant="ghost"
												onClick={() =>
													handleRemoveArrayItem(
														"ingredients",
														index,
													)
												}
												isDisabled={
													formData.ingredients
														.length === 1
												}
											/>
										</HStack>
									),
								)}
							</VStack>
						</Box>

						{/* Instructions */}
						<Box>
							<HStack
								justify="space-between"
								mb={4}>
								<Text
									fontSize="lg"
									fontWeight="bold"
									color="brand.600">
									Instructions
								</Text>
								<Button
									size="sm"
									leftIcon={<Icon as={FiPlus} />}
									colorScheme="purple"
									variant="outline"
									onClick={() =>
										handleAddArrayItem("instructions")
									}>
									Add Step
								</Button>
							</HStack>
							<VStack
								spacing={3}
								align="stretch">
								{formData.instructions.map(
									(instruction, index) => (
										<HStack
											key={index}
											align="start">
											<Text
												fontWeight="bold"
												color="brand.600"
												minW="30px"
												mt={2}>
												{index + 1}.
											</Text>
											<Textarea
												value={instruction}
												onChange={(e) =>
													handleArrayChange(
														"instructions",
														index,
														e.target.value,
													)
												}
												placeholder={`Step ${
													index + 1
												}`}
												rows={2}
											/>
											<IconButton
												aria-label="Remove instruction"
												icon={<Icon as={FiX} />}
												colorScheme="red"
												variant="ghost"
												onClick={() =>
													handleRemoveArrayItem(
														"instructions",
														index,
													)
												}
												isDisabled={
													formData.instructions
														.length === 1
												}
											/>
										</HStack>
									),
								)}
							</VStack>
						</Box>

						{/* Tags */}
						<Box>
							<Text
								fontSize="lg"
								fontWeight="bold"
								color="brand.600"
								mb={4}>
								Dietary Preference Tags
							</Text>
							<FormControl mb={3}>
								<Select
									placeholder="Select a dietary tag to add"
									onChange={(e) => {
										const selectedTag = e.target
											.value as DietaryPreferenceTag;
										if (
											selectedTag &&
											!formData.tags.includes(selectedTag)
										) {
											setFormData((prev) => ({
												...prev,
												tags: [
													...prev.tags,
													selectedTag,
												],
											}));
										}
										e.target.value = ""; // Reset select
									}}>
									{DIETARY_PREFERENCE_TAGS.map((tag) => (
										<option
											key={tag}
											value={tag}>
											{tag
												.replace(/_/g, " ")
												.replace(/\b\w/g, (l) =>
													l.toUpperCase(),
												)}
										</option>
									))}
								</Select>
							</FormControl>
							<Wrap spacing={3}>
								{formData.tags.map((tag) => (
									<WrapItem key={tag}>
										<Tag
											size="lg"
											borderRadius="full"
											variant="solid"
											colorScheme="purple">
											<TagLabel>
												{tag
													.replace(/_/g, " ")
													.replace(/\b\w/g, (l) =>
														l.toUpperCase(),
													)}
											</TagLabel>
											<TagCloseButton
												onClick={() => {
													setFormData((prev) => ({
														...prev,
														tags: prev.tags.filter(
															(t) => t !== tag,
														),
													}));
												}}
											/>
										</Tag>
									</WrapItem>
								))}
							</Wrap>
						</Box>

						{/* Allergens */}
						<Box>
							<Text
								fontSize="lg"
								fontWeight="bold"
								color="brand.600"
								mb={4}>
								Allergens
							</Text>
							<Text
								fontSize="sm"
								color="gray.600"
								mb={3}>
								Select all allergens present in this recipe
							</Text>
							<Wrap spacing={3}>
								{ALLERGEN_VALUES.map((allergen) => {
									const isSelected =
										formData.allergens.includes(allergen);
									const displayName = allergen
										.replace(/_/g, " ")
										.replace(/\b\w/g, (l) =>
											l.toUpperCase(),
										);

									return (
										<WrapItem key={allergen}>
											<Tag
												size="lg"
												borderRadius="full"
												variant={
													isSelected
														? "solid"
														: "outline"
												}
												colorScheme={
													isSelected ? "red" : "gray"
												}
												cursor="pointer"
												onClick={() =>
													handleAllergenToggle(
														allergen,
													)
												}
												_hover={{
													transform: "scale(1.05)",
													shadow: "md",
												}}
												transition="all 0.2s">
												<TagLabel>
													{displayName}
												</TagLabel>
												{isSelected && (
													<TagCloseButton />
												)}
											</Tag>
										</WrapItem>
									);
								})}
							</Wrap>
						</Box>
					</VStack>
				</ModalBody>

				<ModalFooter
					borderTop="1px"
					borderColor={borderColor}>
					<Button
						variant="ghost"
						mr={3}
						onClick={handleClose}
						isDisabled={isLoading}>
						Cancel
					</Button>
					<Button
						colorScheme="purple"
						onClick={handleSubmit}
						isLoading={isLoading}
						loadingText={
							editingRecipe ? "Updating..." : "Saving..."
						}>
						{editingRecipe ? "Update Recipe" : "Add to my recipes"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default RecipeFormModal;
