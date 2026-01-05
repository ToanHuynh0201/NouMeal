import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	VStack,
	HStack,
	Text,
	Avatar,
	Badge,
	Box,
	Image,
	SimpleGrid,
	Divider,
	Spinner,
	Center,
	Tag,
	TagLabel,
	Wrap,
	WrapItem,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { communityService } from "@/services/communityService";
import { foodService } from "@/services/foodService";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import type { PostDetail, FoodInPost } from "@/types/community";
import type { Recipe } from "@/types/recipe";

interface PostDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	postId: string | null;
}

const PostDetailModal = ({ isOpen, onClose, postId }: PostDetailModalProps) => {
	const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedFood, setSelectedFood] = useState<Recipe | null>(null);
	const {
		isOpen: isRecipeOpen,
		onOpen: onRecipeOpen,
		onClose: onRecipeClose,
	} = useDisclosure();

	useEffect(() => {
		const fetchPostDetail = async () => {
			if (!postId || !isOpen) return;

			try {
				setIsLoading(true);
				const data = await communityService.getPostDetailById(postId);
				setPostDetail(data);
			} catch (error) {
				console.error("Error fetching post detail:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPostDetail();
	}, [postId, isOpen]);

	// Convert Food API response to Recipe format for RecipeDetailModal
	const convertFoodApiToRecipe = (foodData: any): Recipe => {
		return {
			id: foodData._id,
			title: foodData.name,
			description: foodData.description,
			cookingTime: "30 mins", // Default value
			servingSize: "1 serving", // Default value
			image: foodData.imageUrl,
			category: foodData.meal || "lunch",
			difficulty: "medium", // Default value
			nutrition: {
				calories: foodData.nutritionalInfo?.calories || 0,
				protein: `${foodData.nutritionalInfo?.protein || 0}g`,
				fat: `${foodData.nutritionalInfo?.fat || 0}g`,
				satFat: "0g",
				carbs: `${foodData.nutritionalInfo?.carbohydrates || 0}g`,
				cholesterol: `${foodData.nutritionalInfo?.cholesterol || 0}mg`,
				fiber: `${foodData.nutritionalInfo?.fiber || 0}g`,
				sugar: `${foodData.nutritionalInfo?.sugar || 0}g`,
				sodium: `${foodData.nutritionalInfo?.sodium || 0}mg`,
			},
			ingredients:
				foodData.ingredients?.map(
					(ing: any) => `${ing.name} - ${ing.amount}`,
				) || [],
			instructions:
				foodData.instructions?.map((inst: any) => inst.description) ||
				[],
			tags: foodData.tags || [],
		};
	};

	const handleFoodClick = async (food: FoodInPost) => {
		try {
			// Gọi API để lấy đầy đủ thông tin food
			const response = await foodService.getFoodById(food._id);
			const foodData = response.data.data || response.data;

			// Convert sang Recipe format
			const recipe = convertFoodApiToRecipe(foodData);
			setSelectedFood(recipe);
			onRecipeOpen();
		} catch (error) {
			console.error("Error fetching food details:", error);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) return "Vừa xong";
		if (diffInHours < 24) return `${diffInHours} giờ trước`;
		if (diffInHours < 48) return "Hôm qua";
		return date.toLocaleDateString("vi-VN");
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="3xl"
			scrollBehavior="inside">
			<ModalOverlay backdropFilter="blur(4px)" />
			<ModalContent>
				<ModalHeader>Chi tiết bài viết</ModalHeader>
				<ModalCloseButton />

				<ModalBody pb={6}>
					{isLoading ? (
						<Center py={10}>
							<Spinner
								size="xl"
								color="purple.500"
							/>
						</Center>
					) : postDetail ? (
						<VStack
							spacing={6}
							align="stretch">
							{/* Author Info */}
							<HStack spacing={3}>
								<Avatar
									size="md"
									// name={postDetail.author.name}
									src={postDetail.author.avatar}
								/>
								<VStack
									align="start"
									spacing={0}>
									<Text
										fontWeight="bold"
										fontSize="md">
										{postDetail.author.name}
									</Text>
									<Text
										fontSize="sm"
										color="gray.600">
										{postDetail.author.email}
									</Text>
									<Text
										fontSize="xs"
										color="gray.500">
										{formatDate(postDetail.createdAt)}
										{postDetail.is_edited &&
											" • Đã chỉnh sửa"}
									</Text>
								</VStack>
								<Badge
									ml="auto"
									colorScheme={
										postDetail.visibility === "public"
											? "green"
											: postDetail.visibility ===
											  "friends"
											? "blue"
											: "gray"
									}
									fontSize="sm"
									px={3}
									py={1}
									borderRadius="full">
									{postDetail.visibility === "public"
										? "Công khai"
										: postDetail.visibility === "friends"
										? "Bạn bè"
										: "Riêng tư"}
								</Badge>
							</HStack>

							<Divider />

							{/* Post Text Content */}
							<Box>
								<Text
									fontSize="md"
									whiteSpace="pre-wrap">
									{postDetail.text}
								</Text>
							</Box>

							{/* Hashtags */}
							{postDetail.hashtags?.length > 0 && (
								<Wrap spacing={2}>
									{postDetail.hashtags?.map((tag, index) => (
										<WrapItem key={index}>
											<Tag
												size="md"
												colorScheme="purple"
												borderRadius="full">
												<TagLabel>#{tag}</TagLabel>
											</Tag>
										</WrapItem>
									))}
								</Wrap>
							)}

							<Divider />

							{/* Foods Section */}
							{postDetail.foods?.length > 0 && (
								<Box>
									<Text
										fontSize="lg"
										fontWeight="bold"
										mb={4}
										color="purple.700">
										Món ăn ({postDetail.foods?.length})
									</Text>
									<SimpleGrid
										columns={{ base: 1, md: 2 }}
										spacing={4}>
										{postDetail.foods?.map((food) => (
											<Box
												key={food._id}
												borderWidth="1px"
												borderRadius="lg"
												overflow="hidden"
												bg="white"
												shadow="sm"
												_hover={{ shadow: "md" }}
												transition="all 0.2s"
												cursor="pointer"
												onClick={() =>
													handleFoodClick(food)
												}>
												<Image
													src={food.imageUrl}
													alt={food.name}
													h="200px"
													w="100%"
													objectFit="cover"
												/>
												<VStack
													p={4}
													spacing={3}
													align="stretch">
													<VStack
														align="start"
														spacing={1}>
														<Text
															fontWeight="bold"
															fontSize="lg"
															noOfLines={1}>
															{food.name}
														</Text>
														<Text
															fontSize="sm"
															color="gray.600"
															noOfLines={2}>
															{food.description}
														</Text>
													</VStack>

													<HStack
														spacing={2}
														flexWrap="wrap">
														<Badge colorScheme="purple">
															{food.category}
														</Badge>
														<Badge colorScheme="orange">
															{
																food
																	.nutritionalInfo
																	.calories
															}{" "}
															kcal
														</Badge>
													</HStack>

													{/* Nutritional Info */}
													<Box
														bg="gray.50"
														p={3}
														borderRadius="md">
														<Text
															fontSize="xs"
															fontWeight="semibold"
															color="gray.600"
															mb={2}>
															Thông tin dinh
															dưỡng:
														</Text>
														<SimpleGrid
															columns={2}
															spacing={2}>
															<HStack justify="space-between">
																<Text
																	fontSize="xs"
																	color="gray.600">
																	Protein:
																</Text>
																<Text
																	fontSize="xs"
																	fontWeight="medium">
																	{
																		food
																			.nutritionalInfo
																			.protein
																	}
																	g
																</Text>
															</HStack>
															<HStack justify="space-between">
																<Text
																	fontSize="xs"
																	color="gray.600">
																	Carbs:
																</Text>
																<Text
																	fontSize="xs"
																	fontWeight="medium">
																	{
																		food
																			.nutritionalInfo
																			.carbohydrates
																	}
																	g
																</Text>
															</HStack>
															<HStack justify="space-between">
																<Text
																	fontSize="xs"
																	color="gray.600">
																	Fat:
																</Text>
																<Text
																	fontSize="xs"
																	fontWeight="medium">
																	{
																		food
																			.nutritionalInfo
																			.fat
																	}
																	g
																</Text>
															</HStack>
															<HStack justify="space-between">
																<Text
																	fontSize="xs"
																	color="gray.600">
																	Fiber:
																</Text>
																<Text
																	fontSize="xs"
																	fontWeight="medium">
																	{
																		food
																			.nutritionalInfo
																			.fiber
																	}
																	g
																</Text>
															</HStack>
														</SimpleGrid>
													</Box>
												</VStack>
											</Box>
										))}
									</SimpleGrid>
								</Box>
							)}

							<Divider />

							{/* Engagement Stats */}
							<HStack
								justify="space-around"
								py={2}>
								<VStack spacing={0}>
									<Text
										fontSize="2xl"
										fontWeight="bold"
										color="purple.600">
										{postDetail.engagement?.likes_count}
									</Text>
									<Text
										fontSize="sm"
										color="gray.600">
										Lượt thích
									</Text>
								</VStack>
								<VStack spacing={0}>
									<Text
										fontSize="2xl"
										fontWeight="bold"
										color="blue.600">
										{postDetail.engagement?.comments_count}
									</Text>
									<Text
										fontSize="sm"
										color="gray.600">
										Bình luận
									</Text>
								</VStack>
								<VStack spacing={0}>
									<Text
										fontSize="2xl"
										fontWeight="bold"
										color="green.600">
										{postDetail.engagement?.shares_count}
									</Text>
									<Text
										fontSize="sm"
										color="gray.600">
										Chia sẻ
									</Text>
								</VStack>
							</HStack>
						</VStack>
					) : (
						<Center py={10}>
							<Text color="gray.500">Không thể tải bài viết</Text>
						</Center>
					)}
				</ModalBody>
			</ModalContent>

			{/* Recipe Detail Modal */}
			{selectedFood && (
				<RecipeDetailModal
					isOpen={isRecipeOpen}
					onClose={onRecipeClose}
					recipe={selectedFood}
					showSaveButton={true}
				/>
			)}
		</Modal>
	);
};

export default PostDetailModal;
