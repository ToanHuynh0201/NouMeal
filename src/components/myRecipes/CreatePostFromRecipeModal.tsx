import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	VStack,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	HStack,
	Text,
	Image,
	Box,
	Badge,
	useToast,
	Flex,
	Tag,
	TagLabel,
	TagCloseButton,
	Wrap,
	WrapItem,
	SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { Recipe } from "@/types/recipe";
import type { CreatePostData } from "@/types/community";
import { communityService } from "@/services/communityService";

interface CreatePostFromRecipeModalProps {
	isOpen: boolean;
	onClose: () => void;
	recipes: Recipe[];
	onSuccess?: () => void;
}

const CreatePostFromRecipeModal = ({
	isOpen,
	onClose,
	recipes,
	onSuccess,
}: CreatePostFromRecipeModalProps) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form state
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");

	// Initialize form with recipe data
	useEffect(() => {
		if (recipes.length > 0 && isOpen) {
			if (recipes.length === 1) {
				// Single recipe
				setTitle(recipes[0].title);
				setDescription(recipes[0].description);
				setTags(recipes[0].tags || []);
			} else {
				// Multiple recipes - create menu title
				setTitle(
					`Menu cho ngày ${new Date().toLocaleDateString("vi-VN")}`,
				);
				setDescription(
					`Thực đơn gồm ${recipes.length} món ngon cho cả ngày`,
				);
				// Combine unique tags from all recipes
				const allTags = recipes.flatMap((r) => r.tags || []);
				setTags([...new Set(allTags)]);
			}
		}
	}, [recipes, isOpen]);

	const handleAddTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSubmit = async () => {
		if (recipes.length === 0) return;

		if (!title.trim()) {
			toast({
				title: "Lỗi",
				description: "Vui lòng nhập tiêu đề",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Combine all images from recipes
			const allImages = recipes.map((r) => r.image).filter((img) => img);

			// Combine all ingredients from recipes
			const allIngredients: string[] = [];
			recipes.forEach((recipe, index) => {
				if (recipes.length > 1) {
					allIngredients.push(`--- ${recipe.title} ---`);
				}
				allIngredients.push(...recipe.ingredients);
			});

			// Combine all instructions from recipes
			const allInstructions: string[] = [];
			recipes.forEach((recipe, index) => {
				if (recipes.length > 1) {
					allInstructions.push(`${recipe.title}:`);
				}
				allInstructions.push(...recipe.instructions);
			});

			// Calculate total nutrition
			const totalNutrition = recipes.reduce(
				(acc, recipe) => {
					return {
						calories: acc.calories + recipe.nutrition.calories,
						protein:
							acc.protein +
								parseFloat(recipe.nutrition.protein) || 0,
						carbohydrates:
							acc.carbohydrates +
								parseFloat(recipe.nutrition.carbs) || 0,
						fat: acc.fat + parseFloat(recipe.nutrition.fat) || 0,
						fiber:
							acc.fiber + parseFloat(recipe.nutrition.fiber) || 0,
					};
				},
				{
					calories: 0,
					protein: 0,
					carbohydrates: 0,
					fat: 0,
					fiber: 0,
				},
			);

			const postData: CreatePostData = {
				title: title.trim(),
				description: description.trim(),
				images: allImages,
				tags: tags,
				ingredients: allIngredients,
				instructions: allInstructions,
				nutrition: totalNutrition,
			};

			await communityService.createPost(postData);

			toast({
				title: "Thành công!",
				description:
					recipes.length === 1
						? "Bài viết của bạn đã được chia sẻ lên cộng đồng"
						: `Menu ${recipes.length} món đã được chia sẻ lên cộng đồng`,
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			onSuccess?.();
			handleClose();
		} catch (error) {
			console.error("Error creating post:", error);
			toast({
				title: "Lỗi",
				description: "Không thể tạo bài viết. Vui lòng thử lại.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setTitle("");
		setDescription("");
		setTags([]);
		setNewTag("");
		onClose();
	};

	if (recipes.length === 0) return null;

	const totalCalories = recipes.reduce(
		(sum, r) => sum + r.nutrition.calories,
		0,
	);
	const totalIngredients = recipes.reduce(
		(sum, r) => sum + r.ingredients.length,
		0,
	);
	const totalInstructions = recipes.reduce(
		(sum, r) => sum + r.instructions.length,
		0,
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="xl"
			scrollBehavior="inside">
			<ModalOverlay backdropFilter="blur(4px)" />
			<ModalContent>
				<ModalHeader>
					{recipes.length === 1
						? "Chia sẻ công thức lên cộng đồng"
						: `Chia sẻ menu ${recipes.length} món lên cộng đồng`}
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					<VStack
						spacing={5}
						align="stretch">
						{/* Recipe Preview */}
						<Box
							borderWidth="1px"
							borderRadius="lg"
							p={4}
							bg="gray.50"
							borderColor="gray.200">
							<Text
								fontSize="sm"
								fontWeight="semibold"
								color="gray.600"
								mb={3}>
								{recipes.length === 1
									? "Món ăn được chọn:"
									: "Menu được chọn:"}
							</Text>
							{recipes.length === 1 ? (
								<Flex
									gap={3}
									align="center">
									<Image
										src={recipes[0].image}
										alt={recipes[0].title}
										boxSize="60px"
										borderRadius="md"
										objectFit="cover"
									/>
									<VStack
										align="start"
										spacing={1}
										flex={1}>
										<Text
											fontWeight="bold"
											fontSize="md">
											{recipes[0].title}
										</Text>
										<HStack>
											<Badge colorScheme="purple">
												{recipes[0].category}
											</Badge>
											<Badge colorScheme="green">
												{recipes[0].difficulty}
											</Badge>
										</HStack>
									</VStack>
								</Flex>
							) : (
								<SimpleGrid
									columns={2}
									spacing={3}>
									{recipes.map((recipe) => (
										<Flex
											key={recipe.id}
											gap={2}
											align="center"
											p={2}
											bg="white"
											borderRadius="md">
											<Image
												src={recipe.image}
												alt={recipe.title}
												boxSize="40px"
												borderRadius="md"
												objectFit="cover"
											/>
											<VStack
												align="start"
												spacing={0}
												flex={1}>
												<Text
													fontSize="xs"
													fontWeight="bold"
													noOfLines={1}>
													{recipe.title}
												</Text>
												<Badge
													size="xs"
													colorScheme="purple">
													{recipe.category}
												</Badge>
											</VStack>
										</Flex>
									))}
								</SimpleGrid>
							)}
						</Box>

						{/* Title */}
						<FormControl isRequired>
							<FormLabel>Tiêu đề bài viết</FormLabel>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Nhập tiêu đề cho bài viết..."
								size="lg"
							/>
						</FormControl>

						{/* Description */}
						<FormControl>
							<FormLabel>Mô tả</FormLabel>
							<Textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Chia sẻ thêm về món ăn này..."
								rows={4}
								resize="vertical"
							/>
						</FormControl>

						{/* Tags */}
						<FormControl>
							<FormLabel>Thẻ (Tags)</FormLabel>
							<HStack mb={2}>
								<Input
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddTag();
										}
									}}
									placeholder="Thêm thẻ..."
									size="sm"
								/>
								<Button
									size="sm"
									colorScheme="blue"
									onClick={handleAddTag}>
									Thêm
								</Button>
							</HStack>
							{tags.length > 0 && (
								<Wrap spacing={2}>
									{tags.map((tag) => (
										<WrapItem key={tag}>
											<Tag
												size="md"
												colorScheme="blue"
												borderRadius="full">
												<TagLabel>#{tag}</TagLabel>
												<TagCloseButton
													onClick={() =>
														handleRemoveTag(tag)
													}
												/>
											</Tag>
										</WrapItem>
									))}
								</Wrap>
							)}
						</FormControl>

						{/* Recipe Content Preview */}
						<Box
							borderWidth="1px"
							borderRadius="lg"
							p={4}
							bg="blue.50"
							borderColor="blue.200">
							<VStack
								align="start"
								spacing={2}>
								<Text
									fontSize="sm"
									fontWeight="semibold"
									color="blue.700">
									📋 Nội dung sẽ được chia sẻ:
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									• {totalIngredients} nguyên liệu
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									• {totalInstructions} bước thực hiện
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									• Tổng dinh dưỡng: {totalCalories} calo
								</Text>
								{recipes.length > 1 && (
									<Text
										fontSize="xs"
										color="gray.600">
										• {recipes.length} món ăn trong menu
									</Text>
								)}
							</VStack>
						</Box>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button
						variant="ghost"
						mr={3}
						onClick={handleClose}>
						Hủy
					</Button>
					<Button
						colorScheme="purple"
						onClick={handleSubmit}
						isLoading={isSubmitting}
						loadingText="Đang chia sẻ...">
						Chia sẻ lên cộng đồng
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreatePostFromRecipeModal;
