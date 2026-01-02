import { useEffect, useState } from "react";
import { VStack, Text, Spinner, Center, useToast } from "@chakra-ui/react";
import { PostCard } from "@/components/community/PostCard";
import type { Post } from "@/types/community";
import { communityService } from "@/services/communityService";

const UserPostsSection = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const toast = useToast();

	useEffect(() => {
		fetchUserPosts();
	}, []);

	const fetchUserPosts = async () => {
		try {
			setIsLoading(true);
			const userPosts = await communityService.getUserPosts();
			setPosts(userPosts);
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

	const handlePostUpdate = (updatedPost: Post) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) =>
				post.id === updatedPost.id ? updatedPost : post,
			),
		);
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
			<Text
				fontSize="lg"
				fontWeight="semibold"
				color="gray.700">
				Bài viết của tôi ({posts.length})
			</Text>
			{posts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
					onReactionUpdate={handlePostUpdate}
				/>
			))}
		</VStack>
	);
};

export default UserPostsSection;
