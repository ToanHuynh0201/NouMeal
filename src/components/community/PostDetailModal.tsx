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
	Button,
	Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { communityService } from "@/services/communityService";
import { foodService } from "@/services/foodService";
import RecipeDetailModal from "@/components/menu/RecipeDetailModal";
import { CommentSection } from "@/components/community/CommentSection";
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
	const [isLikeLoading, setIsLikeLoading] = useState(false);
	const [selectedFood, setSelectedFood] = useState<Recipe | null>(null);
	const [shouldReopenPostModal, setShouldReopenPostModal] = useState(false);
	const {
		isOpen: isRecipeOpen,
		onOpen: onRecipeOpen,
		onClose: onRecipeClose,
	} = useDisclosure();

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

	useEffect(() => {
		fetchPostDetail();
	}, [postId, isOpen]);

	const handleCommentAdded = () => {
		// Refresh post detail to update comment count
		fetchPostDetail();
	};

	const handleLike = async () => {
		if (!postDetail || isLikeLoading) return;

		setIsLikeLoading(true);
		try {
			const isCurrentlyLiked = postDetail.is_liked || false;
			const result = await communityService.toggleLike(
				postDetail._id,
				isCurrentlyLiked,
			);

			// Update local state with new like count and status
			setPostDetail({
				...postDetail,
				is_liked: !isCurrentlyLiked,
				engagement: {
					...postDetail.engagement,
					likes_count: result.likes_count,
				},
			});
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setIsLikeLoading(false);
		}
	};

	// Convert Food API response to Recipe format for RecipeDetailModal
	const convertFoodApiToRecipe = (foodData: any): Recipe => {
		return {
			id: foodData._id,
			title: foodData.name,
			description: foodData.description,
			image: foodData.imageUrl,
			category: foodData.meal || "lunch",
			difficulty: "medium", // Default value
			nutrition: {
				calories: foodData.nutritionalInfo?.calories || 0,
				protein: `${foodData.nutritionalInfo?.protein || 0}g`,
				fat: `${foodData.nutritionalInfo?.fat || 0}g`,
				carbs: `${foodData.nutritionalInfo?.carbohydrates || 0}g`,
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
			// Call API to get full food information
			const response = await foodService.getFoodById(food._id);
			const foodData = response.data.data || response.data;

			// Convert to Recipe format
			const recipe = convertFoodApiToRecipe(foodData);
			setSelectedFood(recipe);

			// Mark that we need to reopen PostDetailModal after closing RecipeDetailModal
			setShouldReopenPostModal(true);
			onRecipeOpen();
		} catch (error) {
			console.error("Error fetching food details:", error);
		}
	};

	const handleRecipeClose = () => {
		// Đóng RecipeDetailModal
		onRecipeClose();
		setSelectedFood(null);
		// Reset flag
		setShouldReopenPostModal(false);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours} hours ago`;
		if (diffInHours < 48) return "Yesterday";
		return date.toLocaleDateString("en-US");
	};

	return (
		<>
			<Modal
				isOpen={isOpen && !isRecipeOpen}
				onClose={onClose}
				size="3xl"
				scrollBehavior="inside">
				<ModalOverlay backdropFilter="blur(4px)" />
				<ModalContent>
					<ModalHeader>Post Details</ModalHeader>
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
												" • Edited"}
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
											? "Public"
											: postDetail.visibility ===
												  "friends"
												? "Friends"
												: "Private"}
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
										{postDetail.hashtags?.map(
											(tag, index) => (
												<WrapItem key={index}>
													<Tag
														size="md"
														colorScheme="purple"
														borderRadius="full">
														<TagLabel>
															#{tag}
														</TagLabel>
													</Tag>
												</WrapItem>
											),
										)}
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
											Dishes ({postDetail.foods?.length})
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
																{
																	food.description
																}
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
																Nutritional
																Info:
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
											Likes
										</Text>
									</VStack>
									<VStack spacing={0}>
										<Text
											fontSize="2xl"
											fontWeight="bold"
											color="blue.600">
											{
												postDetail.engagement
													?.comments_count
											}
										</Text>
										<Text
											fontSize="sm"
											color="gray.600">
											Comments
										</Text>
									</VStack>
									<VStack spacing={0}>
										<Text
											fontSize="2xl"
											fontWeight="bold"
											color="green.600">
											{
												postDetail.engagement
													?.shares_count
											}
										</Text>
										<Text
											fontSize="sm"
											color="gray.600">
											Shares
										</Text>
									</VStack>
								</HStack>

								<Divider />

								{/* Like Button */}
								<Box py={2}>
									<Button
										size="md"
										width="full"
										variant="ghost"
										colorScheme={
											postDetail.is_liked
												? "blue"
												: "gray"
										}
										leftIcon={
											<Icon
												as={FiThumbsUp}
												boxSize={5}
												color={
													postDetail.is_liked
														? "blue.500"
														: undefined
												}
											/>
										}
										onClick={handleLike}
										isLoading={isLikeLoading}
										_hover={{ transform: "scale(1.02)" }}
										transition="all 0.2s">
										{postDetail.is_liked ? "Liked" : "Like"}
									</Button>
								</Box>

								{/* Comment Section */}
								<CommentSection
									postId={postId || ""}
									initialCount={
										postDetail.engagement?.comments_count ||
										0
									}
									onCommentAdded={handleCommentAdded}
								/>
							</VStack>
						) : (
							<Center py={10}>
								<Text color="gray.500">
									Unable to load post
								</Text>
							</Center>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* Recipe Detail Modal */}
			{selectedFood && (
				<RecipeDetailModal
					isOpen={isRecipeOpen}
					onClose={handleRecipeClose}
					recipe={selectedFood}
					showSaveButton={true}
				/>
			)}
		</>
	);
};

export default PostDetailModal;
