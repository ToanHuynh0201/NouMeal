import {
	Card,
	CardBody,
	VStack,
	Heading,
	Text,
	SimpleGrid,
	HStack,
} from "@chakra-ui/react";

interface WeeklySummaryCardProps {
	totalCalories: number;
	totalProtein: number;
	totalCarbs: number;
	totalFat: number;
}

const WeeklySummaryCard = ({
	totalCalories,
	totalProtein,
	totalCarbs,
	totalFat,
}: WeeklySummaryCardProps) => {
	return (
		<Card
			bg="white"
			shadow="sm"
			borderRadius="lg"
			border="1px solid"
			borderColor="gray.200">
			<CardBody p={6}>
				<VStack
					spacing={4}
					align="stretch">
					<Heading
						size="md"
						color="gray.800">
						Weekly Overview
					</Heading>

					{/* Stats Grid */}
					<SimpleGrid
						columns={{ base: 2, md: 4 }}
						spacing={4}>
						{/* Total Calories */}
						<VStack spacing={1}>
							<Text
								fontSize="2xl"
								fontWeight="bold"
								color="gray.800">
								{totalCalories}
							</Text>
							<Text
								fontSize="xs"
								color="gray.500">
								Total Calories
							</Text>
						</VStack>

						{/* Protein */}
						<VStack spacing={1}>
							<Text
								fontSize="2xl"
								fontWeight="bold"
								color="gray.800">
								{totalProtein}g
							</Text>
							<Text
								fontSize="xs"
								color="gray.500">
								Protein
							</Text>
						</VStack>

						{/* Carbs */}
						<VStack spacing={1}>
							<Text
								fontSize="2xl"
								fontWeight="bold"
								color="gray.800">
								{totalCarbs}g
							</Text>
							<Text
								fontSize="xs"
								color="gray.500">
								Carbs
							</Text>
						</VStack>

						{/* Fat */}
						<VStack spacing={1}>
							<Text
								fontSize="2xl"
								fontWeight="bold"
								color="gray.800">
								{totalFat}g
							</Text>
							<Text
								fontSize="xs"
								color="gray.500">
								Fat
							</Text>
						</VStack>
					</SimpleGrid>
				</VStack>
			</CardBody>
		</Card>
	);
};

export default WeeklySummaryCard;
