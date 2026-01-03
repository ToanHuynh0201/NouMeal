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
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");

	// Initialize form with recipe data
	useEffect(() => {
		if (recipes.length > 0 && isOpen) {
			if (recipes.length === 1) {
				// Single recipe
				setDescription(`Thử món ${recipes[0].title} hôm nay! ${recipes[0].description}`);
				setTags(recipes[0].tags || []);
			} else {
				// Multiple recipes - create menu description
				const recipeNames = recipes.map(r => r.title).join(", ");
				setDescription(
					`Chia sẻ menu ${recipes.length} món ngon: ${recipeNames}`,
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

		if (!description.trim()) {
			toast({
				title: "Lỗi",
				description: "Vui lòng nhập nội dung bài viết",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Extract food IDs from recipes
			const foodIds = recipes.map((r) => r.id);

			// Build text content with hashtags
			let textContent = description.trim();

			// Add hashtags from tags if they don't already exist in text
			tags.forEach(tag => {
				if (!textContent.includes(`#${tag}`)) {
					textContent += ` #${tag}`;
				}
			});

			const postData: CreatePostData = {
				text: textContent,
				foods: foodIds,
				visibility: "public",
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

						{/* Description / Text Content */}
						<FormControl isRequired>
							<FormLabel>Nội dung bài viết</FormLabel>
							<Textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Chia sẻ cảm nghĩ của bạn về món ăn này... (Sử dụng #hashtag để thêm thẻ)"
								rows={5}
								resize="vertical"
							/>
							<Text fontSize="xs" color="gray.500" mt={1}>
								Gợi ý: Sử dụng #vietnamese #homecooking #healthy...
							</Text>
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
									📊 Thông tin món ăn:
								</Text>
								<Text
									fontSize="xs"
									color="gray.600">
									• Tổng calories: {totalCalories} kcal
								</Text>
								{recipes.length > 1 && (
									<Text
										fontSize="xs"
										color="gray.600">
										• Số lượng món: {recipes.length}
									</Text>
								)}
								<Text
									fontSize="xs"
									color="gray.500"
									fontStyle="italic">
									Bài viết sẽ hiển thị hình ảnh và thông tin chi tiết của món ăn
								</Text>
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
