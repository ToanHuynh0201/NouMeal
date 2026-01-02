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
	Spinner,
} from "@chakra-ui/react";
import { FiTrendingUp } from "react-icons/fi";
import type { UserProfile } from "@/types/recipe";
import type { DailyCalorieNeeds } from "@/types/profile";

interface UserProfileHeaderProps {
	userProfile: UserProfile;
	dailyCalorieNeeds?: DailyCalorieNeeds | null;
	isLoadingCalories?: boolean;
}

const UserProfileHeader = ({
	userProfile,
	dailyCalorieNeeds,
	isLoadingCalories = false,
}: UserProfileHeaderProps) => {
	// Use API data if available, otherwise fall back to userProfile
	const displayCalories = dailyCalorieNeeds?.totalCalories || 0;
	const macros = dailyCalorieNeeds?.macroDistribution;

	return (
		<Card
			bg="white"
			shadow="lg"
			borderRadius="2xl"
			overflow="hidden"
			border="1px"
			borderColor="gray.200">
			<Box
				bgGradient="linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)"
				p={8}>
				<Flex
					justify="space-between"
					align="center"
					color="white"
					flexDir={{ base: "column", md: "row" }}
					gap={4}>
					<HStack spacing={4}>
						<Avatar
							size="xl"
							name={userProfile.name}
							bg="white"
							color="purple.600"
						/>
						<VStack
							align="start"
							spacing={1}>
							<Heading size="lg">
								Hello, {userProfile.name}! 👋
							</Heading>
							<Text
								fontSize="md"
								opacity={0.9}>
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
						minW="200px">
						{isLoadingCalories ? (
							<>
								<Spinner size="md" />
								<Text
									fontSize="sm"
									fontWeight="medium">
									Loading...
								</Text>
							</>
						) : (
							<>
								<HStack>
									<Icon
										as={FiTrendingUp}
										boxSize={5}
									/>
									<Text
										fontSize="sm"
										fontWeight="medium">
										Daily Goal
									</Text>
								</HStack>
								<Text
									fontSize="3xl"
									fontWeight="bold">
									{displayCalories}
								</Text>
								<Text
									fontSize="sm"
									opacity={0.9}>
									calories/day
								</Text>
								{macros && (
									<VStack
										spacing={0}
										mt={2}
										fontSize="xs"
										opacity={0.9}>
										<Text>
											P: {macros.protein}g | C:{" "}
											{macros.carbohydrates}g | F:{" "}
											{macros.fat}g
										</Text>
									</VStack>
								)}
							</>
						)}
					</VStack>
				</Flex>
			</Box>
		</Card>
	);
};

export default UserProfileHeader;
