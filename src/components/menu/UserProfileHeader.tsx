import {
    Card,
    Box,
    Flex,
    HStack,
    VStack,
    Avatar,
    Heading,
    Text,
    Icon,
} from "@chakra-ui/react";
import {FiTrendingUp} from "react-icons/fi";
import type {UserProfile} from "@/types/recipe";

interface UserProfileHeaderProps {
    userProfile: UserProfile;
}

const UserProfileHeader = ({userProfile}: UserProfileHeaderProps) => {
    return (
        <Card
            bg="white"
            shadow="lg"
            borderRadius="2xl"
            overflow="hidden"
            border="1px"
            borderColor="gray.200"
        >
            <Box
                bgGradient="linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)"
                p={8}
            >
                <Flex
                    justify="space-between"
                    align="center"
                    color="white"
                    flexDir={{base: "column", md: "row"}}
                    gap={4}
                >
                    <HStack spacing={4}>
                        <Avatar
                            size="xl"
                            name={userProfile.name}
                            bg="white"
                            color="purple.600"
                        />
                        <VStack align="start" spacing={1}>
                            <Heading size="lg">
                                Hello, {userProfile.name}! 👋
                            </Heading>
                            <Text fontSize="md" opacity={0.9}>
                                Here's your personalized meal plan
                            </Text>
                        </VStack>
                    </HStack>
                    <VStack
                        bg="whiteAlpha.200"
                        backdropFilter="blur(8px)"
                        borderRadius="xl"
                        p={4}
                        spacing={1}
                        minW="200px"
                    >
                        <HStack>
                            <Icon as={FiTrendingUp} boxSize={5} />
                            <Text fontSize="sm" fontWeight="medium">
                                Daily Goal
                            </Text>
                        </HStack>
                        <Text fontSize="3xl" fontWeight="bold">
                            {userProfile.dailyCalorieTarget}
                        </Text>
                        <Text fontSize="sm" opacity={0.9}>
                            calories/day
                        </Text>
                    </VStack>
                </Flex>
            </Box>
        </Card>
    );
};

export default UserProfileHeader;
