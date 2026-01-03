import { useEffect, useState } from "react";
import {
	VStack,
	Text,
	Spinner,
	Center,
	useToast,
	Button,
	HStack,
	Select,
	Box,
	Flex,
	useDisclosure,
} from "@chakra-ui/react";
import { PostCard } from "@/components/community/PostCard";
import PostDetailModal from "@/components/community/PostDetailModal";
import type { Post, PaginationInfo } from "@/types/community";
import { communityService } from "@/services/communityService";
import { useAuth } from "@/hooks/useAuth";

const UserPostsSection = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [pagination, setPagination] = useState<PaginationInfo>({
		page: 1,
		limit: 10,
		total: 0,
		pages: 0,
	});
	const [sortBy, setSortBy] = useState<string>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const { user } = useAuth();

	const fetchUserPosts = async () => {
		try {
			setIsLoading(true);
			const result = await communityService.getUserPosts(user._id, {
				page: pagination.page,
				limit: pagination.limit,
				sortBy,
				sortOrder,
			});

			setPosts(result.posts);
			setPagination(result.pagination);
		} catch (error) {
			console.error("Error fetching user posts:", error);
			toast({
				title: "Lỗi",
				description: "Không thể tải bài viết của bạn",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUserPosts();
	}, [pagination.page, sortBy, sortOrder]);

	const handlePostUpdate = (updatedPost: Post) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) =>
				post.id === updatedPost.id ? updatedPost : post,
			),
		);
	};

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSortChange = (value: string) => {
		setSortBy(value);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleSortOrderToggle = () => {
		setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handlePostClick = (postId: string) => {
		setSelectedPostId(postId);
		onOpen();
	};

	if (isLoading) {
		return (
			<Center py={10}>
				<Spinner
					size="xl"
					color="blue.500"
				/>
			</Center>
		);
	}

	if (posts.length === 0) {
		return (
			<Center py={10}>
				<VStack spacing={3}>
					<Text
						fontSize="xl"
						color="gray.500">
						Bạn chưa có bài viết nào
					</Text>
					<Text
						fontSize="md"
						color="gray.400">
						Hãy chia sẻ công thức nấu ăn hoặc thực đơn yêu thích của
						bạn!
					</Text>
				</VStack>
			</Center>
		);
	}

	return (
		<VStack
			spacing={6}
			align="stretch">
			{/* Header with sorting */}
			<Flex
				justify="space-between"
				align="center"
				flexWrap="wrap"
				gap={4}>
				<Text
					fontSize="lg"
					fontWeight="semibold"
					color="gray.700">
					Bài viết của tôi ({pagination.total})
				</Text>
				<HStack spacing={3}>
					<Select
						size="sm"
						value={sortBy}
						onChange={(e) => handleSortChange(e.target.value)}
						w="150px">
						<option value="createdAt">Ngày tạo</option>
						<option value="updatedAt">Cập nhật</option>
					</Select>
					<Button
						size="sm"
						variant="outline"
						onClick={handleSortOrderToggle}>
						{sortOrder === "desc" ? "↓ Mới nhất" : "↑ Cũ nhất"}
					</Button>
				</HStack>
			</Flex>

			{/* Posts List */}
			{posts.map((post) => (
				<Box
					key={post.id}
					onClick={() => handlePostClick(post.id)}
					cursor="pointer"
					_hover={{ bg: "gray.50" }}
					transition="background 0.2s"
					borderRadius="md">
					<PostCard
						post={post}
						onReactionUpdate={handlePostUpdate}
					/>
				</Box>
			))}

			{/* Post Detail Modal */}
			<PostDetailModal
				isOpen={isOpen}
				onClose={onClose}
				postId={selectedPostId}
			/>

			{/* Pagination */}
			{pagination.pages > 1 && (
				<Box
					py={4}
					borderTop="1px"
					borderColor="gray.200">
					<HStack
						justify="center"
						spacing={2}>
						<Button
							size="sm"
							onClick={() =>
								handlePageChange(pagination.page - 1)
							}
							isDisabled={pagination.page === 1}>
							Trước
						</Button>
						{Array.from(
							{ length: pagination.pages },
							(_, i) => i + 1,
						)
							.filter((page) => {
								// Show first, last, current, and adjacent pages
								return (
									page === 1 ||
									page === pagination.pages ||
									Math.abs(page - pagination.page) <= 1
								);
							})
							.map((page, index, array) => {
								// Add ellipsis
								const prevPage = array[index - 1];
								const showEllipsis =
									prevPage && page - prevPage > 1;

								return (
									<HStack
										key={page}
										spacing={2}>
										{showEllipsis && (
											<Text
												color="gray.500"
												px={2}>
												...
											</Text>
										)}
										<Button
											size="sm"
											colorScheme={
												page === pagination.page
													? "purple"
													: "gray"
											}
											variant={
												page === pagination.page
													? "solid"
													: "ghost"
											}
											onClick={() =>
												handlePageChange(page)
											}>
											{page}
										</Button>
									</HStack>
								);
							})}
						<Button
							size="sm"
							onClick={() =>
								handlePageChange(pagination.page + 1)
							}
							isDisabled={pagination.page === pagination.pages}>
							Sau
						</Button>
					</HStack>
					<Text
						textAlign="center"
						fontSize="sm"
						color="gray.600"
						mt={2}>
						Trang {pagination.page} / {pagination.pages}
					</Text>
				</Box>
			)}
		</VStack>
	);
};

export default UserPostsSection;
