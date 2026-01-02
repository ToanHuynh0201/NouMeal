import { useState } from "react";
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
} from "@chakra-ui/react";
import { FiSend, FiMessageCircle } from "react-icons/fi";
import type { Comment } from "../../types/community";

interface CommentSectionProps {
	postId: string;
	comments: Comment[];
	onAddComment: (content: string, parentCommentId?: string) => void;
}

const CommentItem = ({
	comment,
	onReply,
	level = 0,
}: {
	comment: Comment;
	onReply: (parentId: string) => void;
	level?: number;
}) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
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

	const handleReplyClick = () => {
		setShowReplyForm(!showReplyForm);
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
							{comment.content}
						</Text>
					</Box>
					<HStack
						fontSize="xs"
						color={mutedTextColor}
						spacing={3}>
						<Text>{formatDate(comment.createdAt)}</Text>
						{level < 2 && (
							<Button
								size="xs"
								variant="ghost"
								colorScheme="blue"
								onClick={handleReplyClick}>
								Trả lời
							</Button>
						)}
					</HStack>

					{showReplyForm && (
						<Box
							w="full"
							mt={2}>
							<ReplyForm
								onSubmit={(content) => {
									onReply(comment.id);
									setShowReplyForm(false);
								}}
								onCancel={() => setShowReplyForm(false)}
							/>
						</Box>
					)}
				</VStack>
			</Flex>

			{/* Nested Replies */}
			{comment.replies && comment.replies.length > 0 && (
				<VStack
					align="stretch"
					spacing={2}>
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply.id}
							comment={reply}
							onReply={onReply}
							level={level + 1}
						/>
					))}
				</VStack>
			)}
		</Box>
	);
};

const ReplyForm = ({
	onSubmit,
	onCancel,
}: {
	onSubmit: (content: string) => void;
	onCancel: () => void;
}) => {
	const [content, setContent] = useState("");

	const handleSubmit = () => {
		if (content.trim()) {
			onSubmit(content);
			setContent("");
		}
	};

	return (
		<VStack
			align="stretch"
			spacing={2}>
			<Textarea
				placeholder="Viết phản hồi..."
				size="sm"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				resize="none"
				rows={2}
			/>
			<HStack justify="flex-end">
				<Button
					size="sm"
					variant="ghost"
					onClick={onCancel}>
					Hủy
				</Button>
				<Button
					size="sm"
					colorScheme="blue"
					onClick={handleSubmit}
					isDisabled={!content.trim()}>
					Gửi
				</Button>
			</HStack>
		</VStack>
	);
};

export const CommentSection = ({
	postId,
	comments,
	onAddComment,
}: CommentSectionProps) => {
	const [newComment, setNewComment] = useState("");
	const [showComments, setShowComments] = useState(false);
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const handleSubmit = () => {
		if (newComment.trim()) {
			onAddComment(newComment);
			setNewComment("");
		}
	};

	const handleReply = (parentCommentId: string) => {
		// This will be handled by the ReplyForm component
	};

	return (
		<Box
			borderTop="1px"
			borderColor={borderColor}
			pt={3}>
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
					onClick={() => setShowComments(!showComments)}>
					{comments.length} bình luận
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
					{/* Comments List */}
					{comments.length > 0 && (
						<VStack
							align="stretch"
							spacing={3}
							maxH="400px"
							overflowY="auto">
							{comments.map((comment) => (
								<CommentItem
									key={comment.id}
									comment={comment}
									onReply={handleReply}
								/>
							))}
						</VStack>
					)}

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
									isDisabled={!newComment.trim()}>
									Bình luận
								</Button>
							</Flex>
						</VStack>
					</HStack>
				</VStack>
			</Collapse>
		</Box>
	);
};
