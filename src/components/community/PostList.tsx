import { useState, useEffect } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import type { Post } from '../../types/community';
import { communityService } from '../../services/communityService';
import { PostCard } from './PostCard';
import LoadingSpinner from '../common/LoadingSpinner';

export const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await communityService.getPosts();
      setPosts(data);
    } catch (err) {
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      console.error('Error loading posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactionUpdate = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={20}>
        <LoadingSpinner message="Đang tải bài viết..." minHeight="200px" variant="default" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="red.500" mb={4}>
          {error}
        </Text>
        <Button onClick={loadPosts} colorScheme="blue">
          Thử lại
        </Button>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="gray.500" fontSize="lg">
          Chưa có bài viết nào trong cộng đồng.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onReactionUpdate={handleReactionUpdate} />
      ))}
    </VStack>
  );
};
