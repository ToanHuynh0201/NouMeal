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
import { FiThumbsUp, FiMessageCircle } from "react-icons/fi";
import type { Post } from "../../types/community";
import { communityService } from "../../services/communityService";
import { CommentSection } from "./CommentSection";
import { ROUTES } from "@/constants";

interface PostCardProps {
	post: Post;
	onReactionUpdate?: (updatedPost: Post) => void;
	onPostClick?: (postId: string) => void;
}

export const PostCard = ({
	post,
	onReactionUpdate,
	onPostClick,
}: PostCardProps) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [currentPost, setCurrentPost] = useState(post);
	const [showComments, setShowComments] = useState(false);

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const textColor = useColorModeValue("gray.800", "white");
	const mutedTextColor = useColorModeValue("gray.600", "gray.400");

	const handleLike = async (e?: React.MouseEvent) => {
		if (e) {
			e.stopPropagation();
		}
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

	const handleCommentAdded = () => {
		// Refresh post to update comment count
		// Update local comment count immediately for better UX
		const updatedPost = {
			...currentPost,
			engagement: {
				...currentPost.engagement,
				comments_count:
					(currentPost.engagement?.comments_count || 0) + 1,
			},
		};
		setCurrentPost(updatedPost);
		onReactionUpdate?.(updatedPost);
	};

	const handleNavigateToUserPosts = (e: React.MouseEvent) => {
		e.stopPropagation();
		const userId = currentPost.author._id;
		const userPostsPath = ROUTES.USER_POSTS.replace(":userId", userId);
		navigate(userPostsPath);
	};

	const handleCardClick = (e: React.MouseEvent) => {
		// Prevent navigation if clicking on interactive elements
		const target = e.target as HTMLElement;
		if (
			target.closest("button") ||
			target.closest("a") ||
			target.closest('[role="button"]')
		) {
			return;
		}
		onPostClick?.(currentPost._id);
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
			_hover={{ shadow: "lg", transform: "translateY(-2px)" }}
			transition="all 0.3s"
			cursor="pointer"
			onClick={handleCardClick}>
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
						_hover={{
							color: "blue.500",
							textDecoration: "underline",
						}}
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
									🥘 Ingredients:
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
									👨‍🍳 Instructions:
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
							? `${totalReactions} likes`
							: "No likes yet"}
					</Text>
					<Text
						fontSize="sm"
						color={mutedTextColor}>
						{currentPost.engagement?.comments_count || 0} comments
					</Text>
					<Text
						fontSize="sm"
						color={mutedTextColor}>
						{currentPost.engagement?.shares_count || 0} shares
					</Text>
				</HStack>
			</Box>

			{/* Action Buttons */}
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
								color={
									currentPost.is_liked
										? "blue.500"
										: undefined
								}
							/>
						}
						onClick={handleLike}
						isDisabled={isLoading}
						_hover={{ transform: "scale(1.05)" }}
						transition="all 0.2s"
						flex={1}>
						{currentPost.is_liked ? "Liked" : "Like"}
					</Button>
					<Button
						size="sm"
						variant="ghost"
						colorScheme="gray"
						leftIcon={
							<Icon
								as={FiMessageCircle}
								boxSize={5}
							/>
						}
						onClick={(e) => {
							e.stopPropagation();
							setShowComments(!showComments);
						}}
						_hover={{ transform: "scale(1.05)" }}
						transition="all 0.2s"
						flex={1}>
						Comment
					</Button>
				</HStack>
			</Box>

			{/* Comment Section */}
			<CommentSection
				postId={currentPost._id}
				initialCount={currentPost.engagement?.comments_count || 0}
				onCommentAdded={handleCommentAdded}
				showComments={showComments}
				onToggleComments={setShowComments}
			/>
		</Box>
	);
};
