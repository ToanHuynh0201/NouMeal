import { Card, CardBody, SimpleGrid, VStack, Text } from "@chakra-ui/react";

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
		<Card
			bg="white"
			shadow="md"
			borderRadius="xl"
			border="1px"
			borderColor="gray.200">
			<CardBody p={6}>
				<SimpleGrid
					columns={{ base: 2, md: 4 }}
					spacing={4}>
					<VStack>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							color="brand.600">
							{calories}
						</Text>
						<Text
							fontSize="sm"
							color="gray.600">
							Total Calories
						</Text>
					</VStack>
					<VStack>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							color="green.600">
							{protein}
						</Text>
						<Text
							fontSize="sm"
							color="gray.600">
							Protein
						</Text>
					</VStack>
					<VStack>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							color="orange.600">
							{carbs}
						</Text>
						<Text
							fontSize="sm"
							color="gray.600">
							Carbs
						</Text>
					</VStack>
					<VStack>
						<Text
							fontSize="2xl"
							fontWeight="bold"
							color="purple.600">
							{fat}
						</Text>
						<Text
							fontSize="sm"
							color="gray.600">
							Fat
						</Text>
					</VStack>
				</SimpleGrid>
			</CardBody>
		</Card>
	);
};

export default NutritionSummaryCard;
