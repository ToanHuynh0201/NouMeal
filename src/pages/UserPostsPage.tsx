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
	Stat,
	StatLabel,
	StatNumber,
} from "@chakra-ui/react";
import { FiArrowLeft, FiUser, FiUserPlus, FiUserCheck } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { animationPresets } from "@/styles/animation";
import { communityService } from "@/services/communityService";
import { userService } from "@/services/userService";
import type { Post } from "@/types/community";
import PostDetailModal from "@/components/community/PostDetailModal";
import { useAuth } from "@/hooks/useAuth";

export default function UserPostsPage() {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const toast = useToast();
	const { user: currentUser, updateUser } = useAuth();

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const [followLoading, setFollowLoading] = useState(false);
	const [followerCount, setFollowerCount] = useState(0);
	const [followingCount, setFollowingCount] = useState(0);

	const authorInfo = posts.length > 0 ? posts[0].author : null;
	const isOwnProfile = currentUser?._id === userId;

	const loadUserProfile = async () => {
		if (!userId) {
			return;
		}

		try {
			const response = await userService.getUserProfile(userId);

			// Handle both direct data and nested data structures
			const userData = response.data || response;

			if (userData) {
				setFollowerCount(userData.NumberOfFollowers || 0);
				setFollowingCount(userData.followingUsers?.length || 0);
			}
		} catch (error) {
			console.error("Error loading user profile:", error);
			// Don't show error toast for profile stats failure
			// Keep current counts if API fails
		}
	};

	const loadUserPosts = async () => {
		if (!userId) {
			return;
		}

		setLoading(true);
		try {
			const { posts: userPosts, pagination } =
				await communityService.getUserPosts(userId, {
					page,
					limit: 12,
				});

			console.log("User posts loaded:", userPosts);
			console.log(
				"First post is_from_follower:",
				userPosts[0]?.is_from_follower,
			);

			setPosts(userPosts);
			setTotalPages(pagination.pages);

			// Determine if current user is following this user
			// Based on the log, is_from_follower indicates if the post author is being followed
			if (userPosts.length > 0) {
				setIsFollowing(userPosts[0].is_from_follower || false);
			}
		} catch (error) {
			console.error("Error loading user posts:", error);
			toast({
				title: "Error",
				description: "Failed to load user posts",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log(currentUser);

		loadUserPosts();
		loadUserProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, page]);

	const handleFollowToggle = async () => {
		if (!userId || !currentUser) {
			return;
		}

		const previousFollowing = isFollowing;
		const previousCount = followerCount;

		setFollowLoading(true);
		try {
			if (isFollowing) {
				console.log(userId);

				// Unfollow
				const data = await userService.unfollowUser(userId);

				if (data.success) {
					// Update state after successful API call
					setIsFollowing(false);
					setFollowerCount((prev) => Math.max(0, prev - 1));

					// Update current user profile
					const profileResponse = await userService.getUserProfile(
						currentUser._id,
					);
					if (profileResponse?.data) {
						updateUser(profileResponse.data);
					}

					toast({
						title: "Unfollowed",
						description: "You have unfollowed this user",
						status: "success",
						duration: 2000,
						isClosable: true,
					});
				} else {
					toast({
						title: "Error",
						description:
							data?.error || "Unable to perform this action",
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			} else {
				// Follow
				await userService.followUser(userId);

				// Update state after successful API call
				setIsFollowing(true);
				setFollowerCount((prev) => prev + 1);

				// Update current user profile
				const profileResponse = await userService.getUserProfile(
					currentUser._id,
				);
				if (profileResponse?.data) {
					updateUser(profileResponse.data);
				}

				toast({
					title: "Followed",
					description: "You are now following this user",
					status: "success",
					duration: 2000,
					isClosable: true,
				});
			}
		} catch (error: any) {
			console.error("Error toggling follow:", error);

			// Revert any optimistic updates on error
			setIsFollowing(previousFollowing);
			setFollowerCount(previousCount);

			toast({
				title: "Error",
				description:
					error?.message || "Unable to perform this action",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setFollowLoading(false);
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
						Back
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
							direction={{ base: "column", md: "row" }}
							align={{ base: "start", md: "center" }}
							justify="space-between"
							gap={6}>
							<Flex
								align="center"
								gap={6}
								flex={1}>
								<Avatar
									size="2xl"
									name={authorInfo?.name || "User"}
									src={authorInfo?.avatar}
									bg="blue.500"
								/>
								<VStack
									align="start"
									spacing={3}>
									<Heading
										as="h1"
										size="xl"
										color="gray.900">
										{authorInfo?.name || "User"}
									</Heading>
									<HStack
										spacing={6}
										divider={
											<Text color="gray.300">•</Text>
										}>
										<Stat size="sm">
											<StatLabel color="gray.600">
												Posts
											</StatLabel>
											<StatNumber fontSize="lg">
												{posts.length}
											</StatNumber>
										</Stat>
										<Stat size="sm">
											<StatLabel color="gray.600">
												Followers
											</StatLabel>
											<StatNumber fontSize="lg">
												{followerCount}
											</StatNumber>
										</Stat>
										<Stat size="sm">
											<StatLabel color="gray.600">
												Following
											</StatLabel>
											<StatNumber fontSize="lg">
												{followingCount}
											</StatNumber>
										</Stat>
									</HStack>
								</VStack>
							</Flex>

							{/* Follow/Unfollow Button - Only show if not own profile */}
							{!isOwnProfile && currentUser && (
								<Button
									leftIcon={
										<Icon
											as={
												isFollowing
													? FiUserCheck
													: FiUserPlus
											}
										/>
									}
									colorScheme={isFollowing ? "gray" : "blue"}
									variant={isFollowing ? "outline" : "solid"}
									onClick={handleFollowToggle}
									isLoading={followLoading}
									size="lg"
									minW="140px">
									{isFollowing ? "Following" : "Follow"}
								</Button>
							)}
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
									This user has no posts yet
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
										Previous
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
										Next
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
