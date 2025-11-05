import { Box, Container, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';
import { PostList } from '../components/community/PostList';
import MainLayout from '@/components/layout/MainLayout';
import { animationPresets } from '@/styles/animation';

export default function CommunityPage() {
  return (
    <MainLayout showHeader={true} showFooter={true}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch" animation={animationPresets.fadeInUp}>
          {/* Page Header */}
          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            shadow="md"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Flex align="center" gap={4}>
              <Flex
                p={3}
                bgGradient="linear(to-br, blue.500, purple.600)"
                borderRadius="xl"
                color="white"
                shadow="md"
              >
                <Icon as={FiUsers} boxSize={7} />
              </Flex>
              <VStack align="start" spacing={1}>
                <Heading as="h1" size="xl" color="gray.900">
                  Cộng Đồng MealGenie
                </Heading>
                <Text color="gray.600" fontSize="md">
                  Nơi chia sẻ công thức nấu ăn và thực đơn yêu thích của bạn
                </Text>
              </VStack>
            </Flex>
          </Box>

          {/* Posts List */}
          <Box>
            <PostList />
          </Box>
        </VStack>
      </Container>
    </MainLayout>
  );
}
