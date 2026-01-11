import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import {
	FiSend,
	FiMoreVertical,
	FiEdit2,
	FiTrash2,
	FiThumbsUp,
} from "react-icons/fi";
import type { Comment } from "../../types/community";
import { communityService } from "../../services/communityService";
import { ROUTES, AUTH_CONFIG } from "@/constants";
import { getStorageItem } from "@/utils";

interface CommentSectionProps {
	postId: string;
	initialCount?: number;
	onCommentAdded?: () => void;
	showComments?: boolean;
	onToggleComments?: (show: boolean) => void;
}

const CommentItem = ({
	comment,
	level = 0,
	onEdit,
	onDelete,
	onLike,
	onReply,
}: {
	comment: Comment;
	level?: number;
	onEdit?: (commentId: string, newText: string) => void;
	onDelete?: (commentId: string) => void;
	onLike?: (commentId: string, isLiked: boolean) => void;
	onReply?: (parentCommentId: string, replyText: string) => Promise<void>;
}) => {
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [showReplies, setShowReplies] = useState(false);
	const [replies, setReplies] = useState<Comment[]>([]);
	const [isLoadingReplies, setIsLoadingReplies] = useState(false);
	const [hasLoadedReplies, setHasLoadedReplies] = useState(false);
	const [replyPage, setReplyPage] = useState(1);
	const [hasMoreReplies, setHasMoreReplies] = useState(false);
	const [editText, setEditText] = useState(comment.content.text);
	const [replyText, setReplyText] = useState("");
	const [localComment, setLocalComment] = useState(comment);
	const [isSubmittingReply, setIsSubmittingReply] = useState(false);
	const bgColor = useColorModeValue("gray.50", "gray.700");
	const textColor = useColorModeValue("gray.800", "white");
	const mutedTextColor = useColorModeValue("gray.600", "gray.400");
	const toast = useToast();

	// Get current user
	const currentUser = getStorageItem(AUTH_CONFIG.USER_STORAGE_KEY);
	const isOwner = currentUser && currentUser._id === comment.author._id;

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

	const handleNavigateToUserPosts = (e: React.MouseEvent) => {
		e.stopPropagation();
		const userId = comment.author._id;
		const userPostsPath = ROUTES.USER_POSTS.replace(":userId", userId);
		navigate(userPostsPath);
	};

	const handleEditClick = () => {
		setIsEditing(true);
		setEditText(comment.content.text);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditText(comment.content.text);
	};

	const handleSaveEdit = () => {
		if (!editText.trim()) {
			toast({
				title: "Lỗi",
				description: "Nội dung bình luận không được để trống",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
			return;
		}
		onEdit?.(comment._id, editText.trim());
		setIsEditing(false);
	};

	const handleDeleteClick = () => {
		onDelete?.(comment._id);
	};

	const handleLikeClick = () => {
		const isLiked = localComment.has_liked || false;
		onLike?.(comment._id, isLiked);
	};

	const handleReplyClick = () => {
		setIsReplying(true);
	};

	const handleCancelReply = () => {
		setIsReplying(false);
		setReplyText("");
	};

	const fetchReplies = async (pageNum: number = 1) => {
		try {
			setIsLoadingReplies(true);
			const response = await communityService.getReplies(comment._id, {
				page: pageNum,
				limit: 10,
				sortBy: "createdAt",
				order: "asc",
			});

			if (response.success) {
				if (pageNum === 1) {
					setReplies(response.data.replies);
				} else {
					setReplies((prev) => [...prev, ...response.data.replies]);
				}
				setHasMoreReplies(
					response.data.pagination.page <
						response.data.pagination.pages,
				);
				setReplyPage(pageNum);
				setHasLoadedReplies(true);
			}
		} catch (error) {
			console.error("Error fetching replies:", error);
			toast({
				title: "Lỗi",
				description: "Không thể tải phản hồi",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		} finally {
			setIsLoadingReplies(false);
		}
	};

	const handleToggleReplies = () => {
		const newShowReplies = !showReplies;
		setShowReplies(newShowReplies);

		// Fetch replies when showing them for the first time
		if (
			newShowReplies &&
			!hasLoadedReplies &&
			(localComment.replies_count || 0) > 0
		) {
			fetchReplies(1);
		}
	};

	const handleLoadMoreReplies = () => {
		if (!isLoadingReplies && hasMoreReplies) {
			fetchReplies(replyPage + 1);
		}
	};

	const handleSubmitReply = async () => {
		if (!replyText.trim()) {
			toast({
				title: "Lỗi",
				description: "Nội dung phản hồi không được để trống",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
			return;
		}

		try {
			setIsSubmittingReply(true);
			await onReply?.(comment._id, replyText.trim());
			setReplyText("");
			setIsReplying(false);

			// Refresh replies after adding new one
			if (showReplies) {
				await fetchReplies(1);
			}

			// Update local comment replies_count
			setLocalComment((prev) => ({
				...prev,
				replies_count: (prev.replies_count || 0) + 1,
			}));

			toast({
				title: "Thành công",
				description: "Đã thêm phản hồi",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch (error) {
			console.error("Error submitting reply:", error);
			toast({
				title: "Lỗi",
				description: "Không thể thêm phản hồi",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		} finally {
			setIsSubmittingReply(false);
		}
	};

	// Update local comment when parent comment changes
	useEffect(() => {
		setLocalComment(comment);
	}, [comment]);

	return (
		<Box ml={level > 0 ? 8 : 0}>
			<Flex
				gap={3}
				mb={3}
				align="start">
				<Avatar
					size="sm"
					name={comment.author.name}
					src={comment.author.avatar}
					bg="blue.500"
					cursor="pointer"
					onClick={handleNavigateToUserPosts}
					_hover={{ opacity: 0.8, transform: "scale(1.05)" }}
					transition="all 0.2s"
					flexShrink={0}
				/>
				<VStack
					align="start"
					spacing={1}
					flex={1}>
					<Box
						bg={bgColor}
						p={3}
						borderRadius="lg"
						w="full"
						position="relative">
						<Flex
							justify="space-between"
							align="start"
							mb={isEditing ? 0 : 1}>
							<Text
								fontWeight="semibold"
								fontSize="sm"
								color={textColor}
								cursor="pointer"
								onClick={handleNavigateToUserPosts}
								_hover={{
									color: "blue.500",
									textDecoration: "underline",
								}}
								transition="all 0.2s"
								display="inline-block">
								{comment.author.name}
							</Text>
							{isOwner && !isEditing && (
								<Menu>
									<MenuButton
										as={IconButton}
										icon={<FiMoreVertical />}
										variant="ghost"
										size="xs"
										aria-label="Options"
									/>
									<MenuList>
										<MenuItem
											icon={<FiEdit2 />}
											onClick={handleEditClick}>
											Chỉnh sửa
										</MenuItem>
										<MenuItem
											icon={<FiTrash2 />}
											onClick={handleDeleteClick}
											color="red.500">
											Xóa
										</MenuItem>
									</MenuList>
								</Menu>
							)}
						</Flex>
						{isEditing ? (
							<VStack
								spacing={2}
								align="stretch"
								mt={2}>
								<Textarea
									value={editText}
									onChange={(e) =>
										setEditText(e.target.value)
									}
									size="sm"
									resize="none"
									rows={2}
								/>
								<HStack justify="flex-end">
									<Button
										size="xs"
										variant="ghost"
										onClick={handleCancelEdit}>
										Hủy
									</Button>
									<Button
										size="xs"
										colorScheme="blue"
										onClick={handleSaveEdit}>
										Lưu
									</Button>
								</HStack>
							</VStack>
						) : (
							<Text
								fontSize="sm"
								color={textColor}>
								{comment.content.text}
							</Text>
						)}
					</Box>
					<HStack
						fontSize="xs"
						color={mutedTextColor}
						spacing={3}>
						<Text>{formatDate(localComment.createdAt)}</Text>
						<Button
							size="xs"
							variant="ghost"
							leftIcon={<FiThumbsUp />}
							onClick={handleLikeClick}
							colorScheme={
								localComment.has_liked ? "blue" : "gray"
							}
							_hover={{ transform: "scale(1.05)" }}
							transition="all 0.2s">
							{localComment.likes_count || 0}
						</Button>
						{/* Only show Reply button on top-level comments (level 0) */}
						{level === 0 && (
							<Button
								size="xs"
								variant="ghost"
								onClick={handleReplyClick}
								_hover={{ color: "blue.500" }}
								transition="all 0.2s">
								Phản hồi
							</Button>
						)}
						{/* Only show replies count on top-level comments */}
						{level === 0 &&
							(localComment.replies_count || 0) > 0 && (
								<Button
									size="xs"
									variant="ghost"
									onClick={handleToggleReplies}
									isLoading={
										isLoadingReplies && !hasLoadedReplies
									}
									_hover={{ color: "blue.500" }}
									transition="all 0.2s">
									{showReplies ? "Ẩn" : "Xem"}{" "}
									{localComment.replies_count} phản hồi
								</Button>
							)}
					</HStack>

					{/* Reply Input Form */}
					{isReplying && (
						<Box
							mt={2}
							pl={4}
							borderLeft="2px"
							borderColor="blue.300">
							<VStack
								spacing={2}
								align="stretch">
								<Textarea
									value={replyText}
									onChange={(e) =>
										setReplyText(e.target.value)
									}
									placeholder="Viết phản hồi..."
									size="sm"
									resize="none"
									rows={2}
								/>
								<HStack justify="flex-end">
									<Button
										size="xs"
										variant="ghost"
										onClick={handleCancelReply}>
										Hủy
									</Button>
									<Button
										size="xs"
										colorScheme="blue"
										onClick={handleSubmitReply}
										isLoading={isSubmittingReply}
										isDisabled={!replyText.trim()}>
										Gửi
									</Button>
								</HStack>
							</VStack>
						</Box>
					)}
				</VStack>
			</Flex>

			{/* Nested Replies */}
			{showReplies && (
				<Box mt={2}>
					{isLoadingReplies && replies.length === 0 ? (
						<Center py={2}>
							<Spinner
								size="sm"
								color="blue.500"
							/>
						</Center>
					) : replies.length > 0 ? (
						<VStack
							align="stretch"
							spacing={2}>
							{replies.map((reply) => (
								<CommentItem
									key={reply._id}
									comment={reply}
									level={level + 1}
									onEdit={onEdit}
									onDelete={onDelete}
									onLike={onLike}
									onReply={onReply}
								/>
							))}

							{/* Load More Replies Button */}
							{hasMoreReplies && (
								<Center>
									<Button
										size="xs"
										variant="ghost"
										onClick={handleLoadMoreReplies}
										isLoading={isLoadingReplies}>
										Xem thêm phản hồi
									</Button>
								</Center>
							)}
						</VStack>
					) : null}
				</Box>
			)}
		</Box>
	);
};

export const CommentSection = ({
	postId,
	initialCount = 0,
	onCommentAdded,
	showComments: externalShowComments,
	onToggleComments,
}: CommentSectionProps) => {
	const [newComment, setNewComment] = useState("");
	const [internalShowComments, setInternalShowComments] = useState(false);
	const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [totalComments, setTotalComments] = useState(initialCount);
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const toast = useToast();

	// Use external showComments if provided, otherwise use internal state
	const showComments =
		externalShowComments !== undefined
			? externalShowComments
			: internalShowComments;

	// Fetch comments when expanding the section
	const fetchComments = async (pageNum: number = 1) => {
		if (!postId) return;

		try {
			setIsLoading(true);
			const response = await communityService.getComments(postId, {
				page: pageNum,
				limit: 10,
				sortBy: "createdAt",
				order: "desc",
			});

			if (response.success) {
				if (pageNum === 1) {
					setComments(response.data.comments);
				} else {
					setComments((prev) => [...prev, ...response.data.comments]);
				}
				setTotalComments(response.data.pagination.total);
				setHasMore(
					response.data.pagination.page <
						response.data.pagination.totalPages,
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

	// Fetch comments when showComments changes to true
	useEffect(() => {
		if (showComments && comments.length === 0) {
			fetchComments(1);
		}
	}, [showComments]);

	const handleToggleComments = () => {
		if (!showComments && comments.length === 0) {
			fetchComments(1);
		}
		if (onToggleComments) {
			onToggleComments(!showComments);
		} else {
			setInternalShowComments(!showComments);
		}
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

	const handleEditComment = async (commentId: string, newText: string) => {
		try {
			const response = await communityService.updateComment(commentId, {
				text: newText,
				media: [],
			});

			if (response.success) {
				toast({
					title: "Thành công",
					description: "Đã cập nhật bình luận",
					status: "success",
					duration: 2000,
					isClosable: true,
				});

				// Update comment in local state
				setComments((prev) =>
					prev.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									content: {
										...comment.content,
										text: newText,
									},
							  }
							: comment,
					),
				);
			}
		} catch (error) {
			console.error("Error updating comment:", error);
			toast({
				title: "Lỗi",
				description: "Không thể cập nhật bình luận",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		try {
			const response = await communityService.deleteComment(commentId);

			if (response.success) {
				toast({
					title: "Thành công",
					description: "Đã xóa bình luận",
					status: "success",
					duration: 2000,
					isClosable: true,
				});

				// Remove comment from local state
				setComments((prev) =>
					prev.filter((comment) => comment._id !== commentId),
				);
				setTotalComments((prev) => prev - 1);

				// Notify parent component to update comment count
				if (onCommentAdded) {
					// This will trigger a re-fetch or decrement in parent
					onCommentAdded();
				}
			}
		} catch (error) {
			console.error("Error deleting comment:", error);
			toast({
				title: "Lỗi",
				description: "Không thể xóa bình luận",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleLikeComment = async (commentId: string, isLiked: boolean) => {
		try {
			const response = isLiked
				? await communityService.unlikeComment(commentId)
				: await communityService.likeComment(commentId);

			if (response.success) {
				// Update comment in local state
				setComments((prev) =>
					prev.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									likes_count: response.data.likes_count,
									has_liked: response.data.has_liked,
							  }
							: comment,
					),
				);
			}
		} catch (error) {
			console.error("Error liking/unliking comment:", error);
			toast({
				title: "Lỗi",
				description: "Không thể thực hiện thao tác",
				status: "error",
				duration: 2000,
				isClosable: true,
			});
		}
	};

	const handleReplyComment = async (
		parentCommentId: string,
		replyText: string,
	) => {
		try {
			const response = await communityService.createComment({
				post: postId,
				content: {
					text: replyText,
					media: [],
				},
				visibility: "public",
				parent_comment: parentCommentId,
			});

			if (response.success) {
				// Refresh comments to show the new reply
				await fetchComments(1);

				// Notify parent component
				if (onCommentAdded) {
					onCommentAdded();
				}
			}
		} catch (error) {
			console.error("Error creating reply:", error);
			throw error; // Re-throw to let CommentItem handle the error toast
		}
	};

	const handleLoadMore = () => {
		if (!isLoading && hasMore) {
			fetchComments(page + 1);
		}
	};

	return (
		<Box
			onClick={(e) => e.stopPropagation()}
			borderTop={showComments ? "1px" : "none"}
			borderColor={borderColor}>
			<Collapse
				in={showComments}
				animateOpacity>
				<VStack
					align="stretch"
					spacing={4}
					px={4}
					pb={3}
					pt={3}>
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
							<Spinner
								size="md"
								color="blue.500"
							/>
						</Center>
					) : comments.length > 0 ? (
						<VStack
							align="stretch"
							spacing={3}>
							{comments.map((comment) => (
								<CommentItem
									key={comment._id}
									comment={comment}
									onEdit={handleEditComment}
									onDelete={handleDeleteComment}
									onLike={handleLikeComment}
									onReply={handleReplyComment}
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
							<Text
								fontSize="sm"
								color="gray.500">
								Chưa có bình luận nào
							</Text>
						</Center>
					)}
				</VStack>
			</Collapse>
		</Box>
	);
};
