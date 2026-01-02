import { useState } from "react";
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
	const [isLoading, setIsLoading] = useState(false);
	const [currentPost, setCurrentPost] = useState(post);

	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const textColor = useColorModeValue("gray.800", "white");
	const mutedTextColor = useColorModeValue("gray.600", "gray.400");

	const handleReaction = async (reactionType: ReactionType) => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			const updatedPost = await communityService.toggleReaction(
				post.id,
				reactionType,
			);
			if (updatedPost) {
				setCurrentPost(updatedPost);
				onReactionUpdate?.(updatedPost);
			}
		} catch (error) {
			console.error("Error toggling reaction:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddComment = async (
		content: string,
		parentCommentId?: string,
	) => {
		try {
			const updatedPost = await communityService.addComment(
				post.id,
				content,
				parentCommentId,
			);
			if (updatedPost) {
				setCurrentPost(updatedPost);
				onReactionUpdate?.(updatedPost);
			}
		} catch (error) {
			console.error("Error adding comment:", error);
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

	const totalReactions = currentPost.reactions.reduce(
		(sum, r) => sum + r.count,
		0,
	);

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
				/>
				<VStack
					align="start"
					spacing={0}>
					<Text
						fontWeight="semibold"
						color={textColor}>
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
				<Text
					fontSize="xl"
					fontWeight="bold"
					color={textColor}
					mb={2}>
					{currentPost.title}
				</Text>
				<Text
					color={mutedTextColor}
					mb={3}>
					{currentPost.description}
				</Text>

				{/* Tags */}
				{currentPost.tags.length > 0 && (
					<Flex
						flexWrap="wrap"
						gap={2}
						mb={3}>
						{currentPost.tags.map((tag, index) => (
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

			{/* Images */}
			{currentPost.images.length > 0 && (
				<Grid
					templateColumns={
						currentPost.images.length === 1
							? "1fr"
							: "repeat(2, 1fr)"
					}
					gap={1}>
					{currentPost.images.map((image, index) => (
						<Box
							key={index}
							h={currentPost.images.length === 1 ? "96" : "64"}
							overflow="hidden">
							<Image
								src={image}
								alt={`${currentPost.title} - ${index + 1}`}
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

			{/* Reactions Summary */}
			<Box
				px={4}
				py={2}
				borderTop="1px"
				borderColor={borderColor}>
				<Text
					fontSize="sm"
					color={mutedTextColor}>
					{totalReactions > 0
						? `${totalReactions} lượt thả cảm xúc`
						: "Chưa có cảm xúc nào"}
				</Text>
			</Box>

			{/* Reaction Buttons */}
			<Box
				px={4}
				py={3}
				borderTop="1px"
				borderColor={borderColor}>
				<HStack
					spacing={2}
					justify="space-around">
					{(Object.keys(reactionIcons) as ReactionType[]).map(
						(reactionType) => {
							const reaction = currentPost.reactions.find(
								(r) => r.type === reactionType,
							);
							const config = reactionIcons[reactionType];
							const isActive = reaction?.userReacted || false;

							return (
								<Button
									key={reactionType}
									size="sm"
									variant={isActive ? "solid" : "ghost"}
									colorScheme={
										isActive ? config.colorScheme : "gray"
									}
									leftIcon={
										<Icon
											as={config.icon}
											boxSize={5}
										/>
									}
									onClick={() => handleReaction(reactionType)}
									isDisabled={isLoading}
									_hover={{ transform: "scale(1.05)" }}
									transition="all 0.2s">
									{reaction?.count || 0}
								</Button>
							);
						},
					)}
				</HStack>
			</Box>

			{/* Comments Section */}
			<CommentSection
				postId={currentPost.id}
				comments={currentPost.comments}
				onAddComment={handleAddComment}
			/>
		</Box>
	);
};
