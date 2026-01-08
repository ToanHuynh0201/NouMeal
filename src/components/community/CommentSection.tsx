import { useState, useEffect } from "react";
import {
	Box,
	Button,
	HStack,
	VStack,
	Text,
	Avatar,
	Flex,
	Textarea,
	useColorModeValue,
	Collapse,
	Spinner,
	Center,
	useToast,
} from "@chakra-ui/react";
import { FiSend, FiMessageCircle } from "react-icons/fi";
import type { Comment } from "../../types/community";
import { communityService } from "../../services/communityService";

interface CommentSectionProps {
	postId: string;
	initialCount?: number;
	onCommentAdded?: () => void;
}

const CommentItem = ({
	comment,
	level = 0,
}: {
	comment: Comment;
	level?: number;
}) => {
	const bgColor = useColorModeValue("gray.50", "gray.700");
	const textColor = useColorModeValue("gray.800", "white");
	const mutedTextColor = useColorModeValue("gray.600", "gray.400");

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
		<Box ml={level > 0 ? 8 : 0}>
			<Flex
				gap={3}
				mb={3}>
				<Avatar
					size="sm"
					name={comment.author.name}
					src={comment.author.avatar}
					bg="blue.500"
				/>
				<VStack
					align="start"
					spacing={1}
					flex={1}>
					<Box
						bg={bgColor}
						p={3}
						borderRadius="lg"
						w="full">
						<Text
							fontWeight="semibold"
							fontSize="sm"
							color={textColor}>
							{comment.author.name}
						</Text>
						<Text
							fontSize="sm"
							color={textColor}
							mt={1}>
							{comment.content.text}
						</Text>
					</Box>
					<HStack
						fontSize="xs"
						color={mutedTextColor}
						spacing={3}>
						<Text>{formatDate(comment.createdAt)}</Text>
					</HStack>
				</VStack>
			</Flex>

			{/* Nested Replies */}
			{comment.replies && comment.replies.length > 0 && (
				<VStack
					align="stretch"
					spacing={2}>
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply._id}
							comment={reply}
							level={level + 1}
						/>
					))}
				</VStack>
			)}
		</Box>
	);
};

export const CommentSection = ({
	postId,
	initialCount = 0,
	onCommentAdded,
}: CommentSectionProps) => {
	const [newComment, setNewComment] = useState("");
	const [showComments, setShowComments] = useState(false);
	const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [totalComments, setTotalComments] = useState(initialCount);
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const toast = useToast();

	// Fetch comments when expanding the section
	const fetchComments = async (pageNum: number = 1) => {
		if (!postId) return;

		try {
			setIsLoading(true);
			const response = await communityService.getComments(postId, {
				page: pageNum,
				limit: 10,
				sortBy: "createdAt",
				order: "asc",
			});

			if (response.success) {
				if (pageNum === 1) {
					setComments(response.data.comments);
				} else {
					setComments((prev) => [...prev, ...response.data.comments]);
				}
				setTotalComments(response.data.pagination.total);
				setHasMore(
					response.data.pagination.page < response.data.pagination.totalPages
				);
				setPage(pageNum);
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
			toast({
				title: "Lỗi",
				description: "Không thể tải bình luận",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleComments = () => {
		if (!showComments && comments.length === 0) {
			fetchComments(1);
		}
		setShowComments(!showComments);
	};

	const handleSubmit = async () => {
		if (!newComment.trim() || !postId) return;

		try {
			setIsSubmitting(true);
			const response = await communityService.createComment({
				post: postId,
				content: {
					text: newComment.trim(),
					media: [],
				},
				visibility: "public",
			});

			if (response.success) {
				toast({
					title: "Thành công",
					description: "Đã thêm bình luận",
					status: "success",
					duration: 2000,
					isClosable: true,
				});

				setNewComment("");
				// Refresh comments
				await fetchComments(1);

				// Notify parent component
				if (onCommentAdded) {
					onCommentAdded();
				}
			}
		} catch (error) {
			console.error("Error creating comment:", error);
			toast({
				title: "Lỗi",
				description: "Không thể thêm bình luận",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleLoadMore = () => {
		if (!isLoading && hasMore) {
			fetchComments(page + 1);
		}
	};

	return (
		<Box
			borderTop="1px"
			borderColor={borderColor}
			pt={3}
			onClick={(e) => e.stopPropagation()}>
			{/* Comment Count & Toggle */}
			<Flex
				justify="space-between"
				align="center"
				mb={3}
				px={4}>
				<Button
					size="sm"
					variant="ghost"
					leftIcon={<FiMessageCircle />}
					onClick={handleToggleComments}>
					{totalComments} bình luận
				</Button>
			</Flex>

			<Collapse
				in={showComments}
				animateOpacity>
				<VStack
					align="stretch"
					spacing={4}
					px={4}
					pb={3}>
					{/* Add Comment Form */}
					<HStack
						align="start"
						spacing={3}>
						<Avatar
							size="sm"
							bg="blue.500"
						/>
						<VStack
							flex={1}
							spacing={2}>
							<Textarea
								placeholder="Viết bình luận..."
								size="sm"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								resize="none"
								rows={2}
							/>
							<Flex
								justify="flex-end"
								w="full">
								<Button
									size="sm"
									colorScheme="blue"
									rightIcon={<FiSend />}
									onClick={handleSubmit}
									isDisabled={!newComment.trim()}
									isLoading={isSubmitting}>
									Bình luận
								</Button>
							</Flex>
						</VStack>
					</HStack>

					{/* Comments List */}
					{isLoading && comments.length === 0 ? (
						<Center py={4}>
							<Spinner size="md" color="blue.500" />
						</Center>
					) : comments.length > 0 ? (
						<VStack
							align="stretch"
							spacing={3}>
							{comments.map((comment) => (
								<CommentItem
									key={comment._id}
									comment={comment}
								/>
							))}

							{/* Load More Button */}
							{hasMore && (
								<Center>
									<Button
										size="sm"
										variant="ghost"
										onClick={handleLoadMore}
										isLoading={isLoading}>
										Xem thêm bình luận
									</Button>
								</Center>
							)}
						</VStack>
					) : (
						<Center py={4}>
							<Text fontSize="sm" color="gray.500">
								Chưa có bình luận nào
							</Text>
						</Center>
					)}
				</VStack>
			</Collapse>
		</Box>
	);
};
