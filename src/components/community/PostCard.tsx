import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	HStack,
	VStack,
	Text,
	Image,
	Avatar,
	Flex,
	Tag,
	Grid,
	List,
	ListItem,
	OrderedList,
	useColorModeValue,
	Icon,
} from "@chakra-ui/react";
import { FiThumbsUp, FiHeart } from "react-icons/fi";
import { IoSparkles, IoStar } from "react-icons/io5";
import type { Post, ReactionType } from "../../types/community";
import { communityService } from "../../services/communityService";
import { CommentSection } from "./CommentSection";
import { ROUTES } from "@/constants";

interface PostCardProps {
	post: Post;
	onReactionUpdate?: (updatedPost: Post) => void;
}

const reactionIcons: Record<
	ReactionType,
	{ icon: any; label: string; colorScheme: string }
> = {
	like: { icon: FiThumbsUp, label: "Thích", colorScheme: "blue" },
	love: { icon: FiHeart, label: "Yêu thích", colorScheme: "red" },
	delicious: { icon: IoSparkles, label: "Ngon", colorScheme: "orange" },
	wow: { icon: IoStar, label: "Tuyệt vời", colorScheme: "yellow" },
};

export const PostCard = ({ post, onReactionUpdate }: PostCardProps) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [currentPost, setCurrentPost] = useState(post);

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const textColor = useColorModeValue("gray.800", "white");
	const mutedTextColor = useColorModeValue("gray.600", "gray.400");

	const handleLike = async () => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			const isCurrentlyLiked = currentPost.is_liked || false;
			const result = await communityService.toggleLike(
				currentPost._id,
				isCurrentlyLiked,
			);

			// Update local state with new like count and status
			const updatedPost = {
				...currentPost,
				is_liked: !isCurrentlyLiked,
				engagement: {
					...currentPost.engagement,
					likes_count: result.likes_count,
				},
			};

			setCurrentPost(updatedPost);
			onReactionUpdate?.(updatedPost);
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddComment = async (
		content: string,
		parentCommentId?: string,
	) => {
		try {
			const updatedPost = await communityService.addComment(post._id);
			if (updatedPost) {
				setCurrentPost(updatedPost);
				onReactionUpdate?.(updatedPost);
			}
		} catch (error) {
			console.error("Error adding comment:", error);
		}
	};

	const handleNavigateToUserPosts = () => {
		const userId = currentPost.author._id;
		const userPostsPath = ROUTES.USER_POSTS.replace(':userId', userId);
		navigate(userPostsPath);
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

	// Get total reactions from engagement
	const totalReactions = currentPost.engagement?.likes_count || 0;

	// Get images from foods
	const images = currentPost.foods?.map((food) => food.imageUrl) || [];

	// Get title from first food name or text preview
	const displayTitle =
		currentPost.foods?.[0]?.name ||
		(currentPost.text?.length > 50
			? currentPost.text.substring(0, 50) + "..."
			: currentPost.text);

	return (
		<Box
			bg={bgColor}
			borderRadius="lg"
			shadow="md"
			overflow="hidden"
			_hover={{ shadow: "lg" }}
			transition="all 0.3s">
			{/* Author Info */}
			<Flex
				p={4}
				align="center"
				gap={3}>
				<Avatar
					size="md"
					name={currentPost.author.name}
					src={currentPost.author.avatar}
					bg="blue.500"
					cursor="pointer"
					onClick={handleNavigateToUserPosts}
					_hover={{ opacity: 0.8, transform: "scale(1.05)" }}
					transition="all 0.2s"
				/>
				<VStack
					align="start"
					spacing={0}>
					<Text
						fontWeight="semibold"
						color={textColor}
						cursor="pointer"
						onClick={handleNavigateToUserPosts}
						_hover={{ color: "blue.500", textDecoration: "underline" }}
						transition="all 0.2s">
						{currentPost.author.name}
					</Text>
					<Text
						fontSize="sm"
						color={mutedTextColor}>
						{formatDate(currentPost.createdAt)}
					</Text>
				</VStack>
			</Flex>

			{/* Post Content */}
			<Box
				px={4}
				pb={3}>
				{displayTitle && (
					<Text
						fontSize="xl"
						fontWeight="bold"
						color={textColor}
						mb={2}>
						{displayTitle}
					</Text>
				)}
				<Text
					color={mutedTextColor}
					mb={3}>
					{currentPost.text}
				</Text>

				{/* Hashtags */}
				{currentPost.hashtags?.length > 0 && (
					<Flex
						flexWrap="wrap"
						gap={2}
						mb={3}>
						{currentPost.hashtags.map((tag, index) => (
							<Tag
								key={index}
								colorScheme="blue"
								size="md">
								#{tag}
							</Tag>
						))}
					</Flex>
				)}
			</Box>

			{/* Images from Foods */}
			{images.length > 0 && (
				<Grid
					templateColumns={
						images.length === 1 ? "1fr" : "repeat(2, 1fr)"
					}
					gap={1}>
					{images.map((image, index) => (
						<Box
							key={index}
							h={images.length === 1 ? "96" : "64"}
							overflow="hidden">
							<Image
								src={image}
								alt={`Food ${index + 1}`}
								w="full"
								h="full"
								objectFit="cover"
								transition="transform 0.3s"
								_hover={{ transform: "scale(1.05)" }}
							/>
						</Box>
					))}
				</Grid>
			)}

			{/* Ingredients & Instructions */}
			{(currentPost.ingredients || currentPost.instructions) && (
				<Box
					px={4}
					py={3}
					bg={useColorModeValue("gray.50", "gray.700")}>
					<VStack
						align="stretch"
						spacing={3}>
						{currentPost.ingredients && (
							<Box>
								<Text
									fontWeight="semibold"
									color={textColor}
									mb={2}>
									🥘 Nguyên liệu:
								</Text>
								<List spacing={1}>
									{currentPost.ingredients.map(
										(ingredient, index) => (
											<ListItem
												key={index}
												fontSize="sm"
												color={mutedTextColor}>
												• {ingredient}
											</ListItem>
										),
									)}
								</List>
							</Box>
						)}
						{currentPost.instructions && (
							<Box>
								<Text
									fontWeight="semibold"
									color={textColor}
									mb={2}>
									👨‍🍳 Cách làm:
								</Text>
								<OrderedList spacing={1}>
									{currentPost.instructions.map(
										(instruction, index) => (
											<ListItem
												key={index}
												fontSize="sm"
												color={mutedTextColor}>
												{instruction}
											</ListItem>
										),
									)}
								</OrderedList>
							</Box>
						)}
					</VStack>
				</Box>
			)}

			{/* Engagement Summary */}
			<Box
				px={4}
				py={2}
				borderTop="1px"
				borderColor={borderColor}>
				<HStack spacing={4}>
					<Text
						fontSize="sm"
						color={mutedTextColor}>
						{totalReactions > 0
							? `${totalReactions} lượt thích`
							: "Chưa có lượt thích"}
					</Text>
					<Text
						fontSize="sm"
						color={mutedTextColor}>
						{currentPost.engagement?.comments_count || 0} bình luận
					</Text>
					<Text
						fontSize="sm"
						color={mutedTextColor}>
						{currentPost.engagement?.shares_count || 0} chia sẻ
					</Text>
				</HStack>
			</Box>

			{/* Like Button */}
			<Box
				px={4}
				py={3}
				borderTop="1px"
				borderColor={borderColor}>
				<HStack
					spacing={2}
					justify="space-around">
					<Button
						size="sm"
						variant="ghost"
						colorScheme={currentPost.is_liked ? "blue" : "gray"}
						leftIcon={
							<Icon
								as={FiThumbsUp}
								boxSize={5}
								color={currentPost.is_liked ? "blue.500" : undefined}
							/>
						}
						onClick={handleLike}
						isDisabled={isLoading}
						_hover={{ transform: "scale(1.05)" }}
						transition="all 0.2s">
						{currentPost.is_liked ? "Đã thích" : "Thích"}
					</Button>
				</HStack>
			</Box>
		</Box>
	);
};
