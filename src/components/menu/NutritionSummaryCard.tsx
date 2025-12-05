import { Box, VStack, HStack, Text, SimpleGrid, Icon } from "@chakra-ui/react";
import { FiActivity, FiZap, FiTrendingUp } from "react-icons/fi";

interface NutritionSummaryCardProps {
	calories: number;
	protein: string;
	carbs: string;
	fat: string;
}

const NutritionSummaryCard = ({
	calories,
	protein,
	carbs,
	fat,
}: NutritionSummaryCardProps) => {
	return (
		<Box
			bgGradient="linear(135deg, blue.500, pink.500)"
			borderRadius="2xl"
			p={8}
			shadow="xl"
			position="relative"
			overflow="hidden">
			{/* Background Pattern */}
			<Box
				position="absolute"
				top="-50%"
				right="-10%"
				w="400px"
				h="400px"
				bgGradient="radial(circle, whiteAlpha.200, transparent)"
				borderRadius="full"
			/>
			<Box
				position="absolute"
				bottom="-30%"
				left="-5%"
				w="300px"
				h="300px"
				bgGradient="radial(circle, whiteAlpha.100, transparent)"
				borderRadius="full"
			/>

			<VStack
				spacing={6}
				align="stretch"
				position="relative"
				zIndex={1}>
				{/* Header */}
				<HStack
					spacing={3}
					mb={2}>
					<Icon
						as={FiTrendingUp}
						boxSize={7}
						color="white"
					/>
					<VStack
						align="start"
						spacing={0}
						flex={1}>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							color="white">
							Today's Nutrition Summary
						</Text>
						<Text
							fontSize="sm"
							color="whiteAlpha.800">
							Your daily meal plan overview
						</Text>
					</VStack>
				</HStack>

				{/* Stats Grid */}
				<SimpleGrid
					columns={{ base: 2, md: 4 }}
					spacing={4}>
					{/* Total Calories */}
					<Box
						bg="whiteAlpha.200"
						backdropFilter="blur(10px)"
						p={5}
						borderRadius="xl"
						border="1px solid"
						borderColor="whiteAlpha.300"
						transition="all 0.3s"
						_hover={{
							bg: "whiteAlpha.300",
							transform: "translateY(-4px)",
							shadow: "lg",
						}}>
						<VStack
							spacing={2}
							align="start">
							<HStack>
								<Icon
									as={FiZap}
									boxSize={5}
									color="yellow.200"
								/>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="whiteAlpha.900"
									textTransform="uppercase"
									letterSpacing="wide">
									Calories
								</Text>
							</HStack>
							<Text
								fontSize="3xl"
								fontWeight="bold"
								color="white"
								lineHeight="1">
								{calories.toLocaleString()}
							</Text>
							<Text
								fontSize="xs"
								color="whiteAlpha.800">
								Total daily intake
							</Text>
						</VStack>
					</Box>

					{/* Protein */}
					<Box
						bg="whiteAlpha.200"
						backdropFilter="blur(10px)"
						p={5}
						borderRadius="xl"
						border="1px solid"
						borderColor="whiteAlpha.300"
						transition="all 0.3s"
						_hover={{
							bg: "whiteAlpha.300",
							transform: "translateY(-4px)",
							shadow: "lg",
						}}>
						<VStack
							spacing={2}
							align="start">
							<HStack>
								<Icon
									as={FiActivity}
									boxSize={5}
									color="green.200"
								/>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="whiteAlpha.900"
									textTransform="uppercase"
									letterSpacing="wide">
									Protein
								</Text>
							</HStack>
							<Text
								fontSize="3xl"
								fontWeight="bold"
								color="white"
								lineHeight="1">
								{protein}
							</Text>
							<Text
								fontSize="xs"
								color="whiteAlpha.800">
								Build & repair
							</Text>
						</VStack>
					</Box>

					{/* Carbs */}
					<Box
						bg="whiteAlpha.200"
						backdropFilter="blur(10px)"
						p={5}
						borderRadius="xl"
						border="1px solid"
						borderColor="whiteAlpha.300"
						transition="all 0.3s"
						_hover={{
							bg: "whiteAlpha.300",
							transform: "translateY(-4px)",
							shadow: "lg",
						}}>
						<VStack
							spacing={2}
							align="start">
							<HStack>
								<Text fontSize="lg">🌾</Text>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="whiteAlpha.900"
									textTransform="uppercase"
									letterSpacing="wide">
									Carbs
								</Text>
							</HStack>
							<Text
								fontSize="3xl"
								fontWeight="bold"
								color="white"
								lineHeight="1">
								{carbs}
							</Text>
							<Text
								fontSize="xs"
								color="whiteAlpha.800">
								Energy source
							</Text>
						</VStack>
					</Box>

					{/* Fat */}
					<Box
						bg="whiteAlpha.200"
						backdropFilter="blur(10px)"
						p={5}
						borderRadius="xl"
						border="1px solid"
						borderColor="whiteAlpha.300"
						transition="all 0.3s"
						_hover={{
							bg: "whiteAlpha.300",
							transform: "translateY(-4px)",
							shadow: "lg",
						}}>
						<VStack
							spacing={2}
							align="start">
							<HStack>
								<Text fontSize="lg">🥑</Text>
								<Text
									fontSize="xs"
									fontWeight="semibold"
									color="whiteAlpha.900"
									textTransform="uppercase"
									letterSpacing="wide">
									Fat
								</Text>
							</HStack>
							<Text
								fontSize="3xl"
								fontWeight="bold"
								color="white"
								lineHeight="1">
								{fat}
							</Text>
							<Text
								fontSize="xs"
								color="whiteAlpha.800">
								Essential nutrients
							</Text>
						</VStack>
					</Box>
				</SimpleGrid>
			</VStack>
		</Box>
	);
};

export default NutritionSummaryCard;
