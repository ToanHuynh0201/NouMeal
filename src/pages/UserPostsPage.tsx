import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Container,
	Flex,
	Heading,
	Icon,
	Text,
	VStack,
	Avatar,
	Button,
	Spinner,
	Center,
	useToast,
	SimpleGrid,
	HStack,
} from "@chakra-ui/react";
import { FiArrowLeft, FiUser } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { animationPresets } from "@/styles/animation";
import { communityService } from "@/services/communityService";
import type { Post } from "@/types/community";
import PostDetailModal from "@/components/community/PostDetailModal";

export default function UserPostsPage() {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const authorInfo = posts.length > 0 ? posts[0].author : null;

	useEffect(() => {
		loadUserPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, page]);

	const loadUserPosts = async () => {
		console.log('Loading user posts for userId:', userId);
		if (!userId) {
			console.warn('No userId provided');
			return;
		}

		setLoading(true);
		try {
			const { posts: userPosts, pagination } =
				await communityService.getUserPosts(userId, {
					page,
					limit: 12,
				});

			console.log('Loaded user posts:', { count: userPosts.length, pagination });
			setPosts(userPosts);
			setTotalPages(pagination.pages);
		} catch (error) {
			console.error("Error loading user posts:", error);
			toast({
				title: "Lỗi",
				description: "Không thể tải bài viết của người dùng",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePostClick = (post: Post) => {
		setSelectedPost(post);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedPost(null);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<MainLayout
			showHeader={true}
			showFooter={true}>
			<Container
				maxW="7xl"
				py={8}>
				<VStack
					spacing={8}
					align="stretch"
					animation={animationPresets.fadeInUp}>
					{/* Back Button */}
					<Button
						leftIcon={<Icon as={FiArrowLeft} />}
						variant="ghost"
						onClick={() => navigate(-1)}
						alignSelf="flex-start"
						size="md">
						Quay lại
					</Button>

					{/* User Header */}
					<Box
						bg="white"
						borderRadius="xl"
						p={8}
						shadow="md"
						borderWidth="1px"
						borderColor="gray.200">
						<Flex
							align="center"
							gap={6}>
							<Avatar
								size="2xl"
								name={authorInfo?.name || "User"}
								src={authorInfo?.avatar}
								bg="blue.500"
							/>
							<VStack
								align="start"
								spacing={2}>
								<Heading
									as="h1"
									size="xl"
									color="gray.900">
									{authorInfo?.name || "Người dùng"}
								</Heading>
								<HStack spacing={4}>
									<Text
										color="gray.600"
										fontSize="lg">
										<Text
											as="span"
											fontWeight="bold">
											{posts.length}
										</Text>{" "}
										bài viết
									</Text>
								</HStack>
							</VStack>
						</Flex>
					</Box>

					{/* Posts Grid */}
					{loading ? (
						<Center py={20}>
							<Spinner
								size="xl"
								color="blue.500"
								thickness="4px"
							/>
						</Center>
					) : posts.length === 0 ? (
						<Center py={20}>
							<VStack spacing={4}>
								<Icon
									as={FiUser}
									boxSize={16}
									color="gray.400"
								/>
								<Text
									fontSize="lg"
									color="gray.500">
									Người dùng chưa có bài viết nào
								</Text>
							</VStack>
						</Center>
					) : (
						<>
							<SimpleGrid
								columns={{ base: 1, md: 2, lg: 3 }}
								spacing={6}>
								{posts.map((post) => (
									<Box
										key={post._id}
										bg="white"
										borderRadius="lg"
										overflow="hidden"
										shadow="md"
										cursor="pointer"
										onClick={() => handlePostClick(post)}
										_hover={{
											shadow: "xl",
											transform: "translateY(-4px)",
										}}
										transition="all 0.3s">
										{/* Post Image */}
										{post.foods &&
										post.foods.length > 0 &&
										post.foods[0].imageUrl ? (
											<Box
												h="200px"
												overflow="hidden">
												<Box
													w="full"
													h="full"
													bgImage={`url(${post.foods[0].imageUrl})`}
													bgSize="cover"
													bgPosition="center"
													transition="transform 0.3s"
													_hover={{
														transform: "scale(1.1)",
													}}
												/>
											</Box>
										) : (
											<Box
												h="200px"
												bg="gray.100"
												display="flex"
												alignItems="center"
												justifyContent="center">
												<Icon
													as={FiUser}
													boxSize={12}
													color="gray.400"
												/>
											</Box>
										)}

										{/* Post Content */}
										<Box p={4}>
											<Text
												fontSize="md"
												fontWeight="semibold"
												color="gray.800"
												noOfLines={2}
												mb={2}>
												{post.foods?.[0]?.name ||
													post.text}
											</Text>

											<Text
												fontSize="sm"
												color="gray.600"
												noOfLines={2}
												mb={3}>
												{post.text}
											</Text>

											{/* Engagement Stats */}
											<HStack
												spacing={4}
												fontSize="sm"
												color="gray.500">
												<Text>
													❤️{" "}
													{post.engagement
														?.likes_count || 0}
												</Text>
												<Text>
													💬{" "}
													{post.engagement
														?.comments_count || 0}
												</Text>
											</HStack>
										</Box>
									</Box>
								))}
							</SimpleGrid>

							{/* Pagination */}
							{totalPages > 1 && (
								<Flex
									justify="center"
									gap={2}
									mt={8}>
									<Button
										onClick={() =>
											handlePageChange(page - 1)
										}
										isDisabled={page === 1}
										colorScheme="blue"
										variant="outline">
										Trang trước
									</Button>
									<HStack spacing={2}>
										{Array.from(
											{ length: totalPages },
											(_, i) => i + 1,
										).map((pageNum) => (
											<Button
												key={pageNum}
												onClick={() =>
													handlePageChange(pageNum)
												}
												colorScheme={
													page === pageNum
														? "blue"
														: "gray"
												}
												variant={
													page === pageNum
														? "solid"
														: "outline"
												}
												size="md">
												{pageNum}
											</Button>
										))}
									</HStack>
									<Button
										onClick={() =>
											handlePageChange(page + 1)
										}
										isDisabled={page === totalPages}
										colorScheme="blue"
										variant="outline">
										Trang sau
									</Button>
								</Flex>
							)}
						</>
					)}
				</VStack>
			</Container>

			{/* Post Detail Modal */}
			{selectedPost && (
				<PostDetailModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					postId={selectedPost._id}
				/>
			)}
		</MainLayout>
	);
}
