import {
	Box,
	Heading,
	Text,
	VStack,
	HStack,
	Badge,
	SimpleGrid,
	Card,
	CardBody,
	Image,
	Icon,
	Divider,
} from "@chakra-ui/react";
import { FiClock, FiUsers } from "react-icons/fi";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import type { Recipe, DailyMenu } from "@/types/recipe";

interface DayMenuViewProps {
	dailyMenu: DailyMenu;
	onRecipeClick: (recipe: Recipe) => void;
}

const DayMenuView = ({ dailyMenu, onRecipeClick }: DayMenuViewProps) => {
	const contentSection = useScrollAnimation({ threshold: 0.1 });

	const MealSection = ({
		recipe,
		emoji,
		title,
		subtitle,
		bgColor,
		delay = 0,
	}: {
		recipe: Recipe;
		emoji: string;
		title: string;
		subtitle: string;
		bgColor: string;
		delay?: number;
	}) => {
		const categoryColor = {
			breakfast: "orange",
			lunch: "green",
			dinner: "purple",
			snack: "blue",
		};

		return (
			<VStack
				align="stretch"
				spacing={3}>
				<HStack spacing={2}>
					<Box
						bg={bgColor}
						p={2}
						borderRadius="lg"
						display="flex"
						alignItems="center"
						justifyContent="center">
						<Text fontSize="xl">{emoji}</Text>
					</Box>
					<VStack
						align="start"
						spacing={0}>
						<Heading size="md">{title}</Heading>
						<Text
							color="gray.600"
							fontSize="xs">
							{subtitle}
						</Text>
					</VStack>
				</HStack>
				<Card
					cursor="pointer"
					onClick={() => onRecipeClick(recipe)}
					bg="white"
					shadow="md"
					borderRadius="xl"
					overflow="hidden"
					transition="all 0.3s ease"
					opacity={contentSection.isVisible ? 1 : 0}
					transform={
						contentSection.isVisible
							? "translateY(0)"
							: "translateY(20px)"
					}
					style={{
						transitionDelay: `${delay}s`,
					}}
					_hover={{
						transform: "translateY(-6px)",
						shadow: "xl",
					}}>
					<Box
						position="relative"
						h="180px"
						overflow="hidden">
						<Image
							src={recipe.image}
							alt={recipe.title}
							objectFit="cover"
							w="full"
							h="full"
							transition="transform 0.3s"
							_hover={{ transform: "scale(1.1)" }}
						/>
						<Badge
							position="absolute"
							top={2}
							right={2}
							colorScheme={categoryColor[recipe.category]}
							fontSize="xs"
							px={2.5}
							py={0.5}
							borderRadius="full"
							fontWeight="bold"
							textTransform="capitalize">
							{recipe.category}
						</Badge>
					</Box>
					<CardBody p={4}>
						<VStack
							align="start"
							spacing={2.5}>
							<Heading
								size="sm"
								noOfLines={2}
								lineHeight="1.3">
								{recipe.title}
							</Heading>
							<Text
								color="gray.600"
								fontSize="xs"
								noOfLines={2}
								lineHeight="1.4">
								{recipe.description}
							</Text>
							<HStack
								spacing={3}
								fontSize="xs"
								color="gray.600">
								<HStack spacing={1}>
									<Icon
										as={FiClock}
										boxSize={3.5}
									/>
									<Text>{recipe.cookingTime}</Text>
								</HStack>
								<HStack spacing={1}>
									<Icon
										as={FiUsers}
										boxSize={3.5}
									/>
									<Text>{recipe.servingSize}</Text>
								</HStack>
							</HStack>
							<Divider />
							<HStack
								justify="space-between"
								w="full">
								<VStack
									align="start"
									spacing={0}>
									<Text
										fontSize="xl"
										fontWeight="bold"
										color="brand.600">
										{recipe.nutrition.calories}
									</Text>
									<Text
										fontSize="2xs"
										color="gray.600">
										calories
									</Text>
								</VStack>
								<HStack
									spacing={2.5}
									fontSize="2xs">
									<VStack spacing={0}>
										<Text
											fontWeight="bold"
											fontSize="xs">
											{recipe.nutrition.protein}
										</Text>
										<Text color="gray.600">protein</Text>
									</VStack>
									<VStack spacing={0}>
										<Text
											fontWeight="bold"
											fontSize="xs">
											{recipe.nutrition.carbs}
										</Text>
										<Text color="gray.600">carbs</Text>
									</VStack>
									<VStack spacing={0}>
										<Text
											fontWeight="bold"
											fontSize="xs">
											{recipe.nutrition.fat}
										</Text>
										<Text color="gray.600">fat</Text>
									</VStack>
								</HStack>
							</HStack>
						</VStack>
					</CardBody>
				</Card>
			</VStack>
		);
	};

	return (
		<Box
			ref={contentSection.elementRef}
			opacity={contentSection.isVisible ? 1 : 0}
			transform={
				contentSection.isVisible ? "translateY(0)" : "translateY(20px)"
			}
			transition="all 0.6s ease-out">
			<VStack
				spacing={6}
				align="stretch">
				{/* Main Meals Grid - 3 columns on desktop, 1 on mobile */}
				<SimpleGrid
					columns={{ base: 1, md: 2, lg: 3 }}
					spacing={5}>
					<MealSection
						recipe={dailyMenu.breakfast}
						emoji="🌅"
						title="Breakfast"
						subtitle="Start your day"
						bgColor="orange.50"
						delay={0}
					/>
					<MealSection
						recipe={dailyMenu.lunch}
						emoji="☀️"
						title="Lunch"
						subtitle="Midday fuel"
						bgColor="green.50"
						delay={0.1}
					/>
					<MealSection
						recipe={dailyMenu.dinner}
						emoji="🌙"
						title="Dinner"
						subtitle="Evening nourishment"
						bgColor="purple.50"
						delay={0.2}
					/>
				</SimpleGrid>

				{/* Snacks Section - if exists */}
				{dailyMenu.snacks && dailyMenu.snacks.length > 0 && (
					<Box mt={2}>
						<HStack
							spacing={2}
							mb={3}>
							<Box
								bg="blue.50"
								p={2}
								borderRadius="lg"
								display="flex"
								alignItems="center"
								justifyContent="center">
								<Text fontSize="xl">🍎</Text>
							</Box>
							<VStack
								align="start"
								spacing={0}>
								<Heading size="md">Snacks</Heading>
								<Text
									color="gray.600"
									fontSize="xs">
									Healthy bites
								</Text>
							</VStack>
						</HStack>
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 3 }}
							spacing={5}>
							{dailyMenu.snacks.map((snack, index) => (
								<Card
									key={snack.id}
									cursor="pointer"
									onClick={() => onRecipeClick(snack)}
									bg="white"
									shadow="md"
									borderRadius="xl"
									overflow="hidden"
									transition="all 0.3s ease"
									opacity={contentSection.isVisible ? 1 : 0}
									transform={
										contentSection.isVisible
											? "translateY(0)"
											: "translateY(20px)"
									}
									style={{
										transitionDelay: `${
											0.3 + index * 0.1
										}s`,
									}}
									_hover={{
										transform: "translateY(-6px)",
										shadow: "xl",
									}}>
									<Box
										position="relative"
										h="180px"
										overflow="hidden">
										<Image
											src={snack.image}
											alt={snack.title}
											objectFit="cover"
											w="full"
											h="full"
											transition="transform 0.3s"
											_hover={{ transform: "scale(1.1)" }}
										/>
										<Badge
											position="absolute"
											top={2}
											right={2}
											colorScheme="blue"
											fontSize="xs"
											px={2.5}
											py={0.5}
											borderRadius="full"
											fontWeight="bold"
											textTransform="capitalize">
											{snack.category}
										</Badge>
									</Box>
									<CardBody p={4}>
										<VStack
											align="start"
											spacing={2.5}>
											<Heading
												size="sm"
												noOfLines={2}
												lineHeight="1.3">
												{snack.title}
											</Heading>
											<Text
												color="gray.600"
												fontSize="xs"
												noOfLines={2}
												lineHeight="1.4">
												{snack.description}
											</Text>
											<HStack
												spacing={3}
												fontSize="xs"
												color="gray.600">
												<HStack spacing={1}>
													<Icon
														as={FiClock}
														boxSize={3.5}
													/>
													<Text>
														{snack.cookingTime}
													</Text>
												</HStack>
												<HStack spacing={1}>
													<Icon
														as={FiUsers}
														boxSize={3.5}
													/>
													<Text>
														{snack.servingSize}
													</Text>
												</HStack>
											</HStack>
											<Divider />
											<HStack
												justify="space-between"
												w="full">
												<VStack
													align="start"
													spacing={0}>
													<Text
														fontSize="xl"
														fontWeight="bold"
														color="brand.600">
														{
															snack.nutrition
																.calories
														}
													</Text>
													<Text
														fontSize="2xs"
														color="gray.600">
														calories
													</Text>
												</VStack>
												<HStack
													spacing={2.5}
													fontSize="2xs">
													<VStack spacing={0}>
														<Text
															fontWeight="bold"
															fontSize="xs">
															{
																snack.nutrition
																	.protein
															}
														</Text>
														<Text color="gray.600">
															protein
														</Text>
													</VStack>
													<VStack spacing={0}>
														<Text
															fontWeight="bold"
															fontSize="xs">
															{
																snack.nutrition
																	.carbs
															}
														</Text>
														<Text color="gray.600">
															carbs
														</Text>
													</VStack>
													<VStack spacing={0}>
														<Text
															fontWeight="bold"
															fontSize="xs">
															{
																snack.nutrition
																	.fat
															}
														</Text>
														<Text color="gray.600">
															fat
														</Text>
													</VStack>
												</HStack>
											</HStack>
										</VStack>
									</CardBody>
								</Card>
							))}
						</SimpleGrid>
					</Box>
				)}
			</VStack>
		</Box>
	);
};

export default DayMenuView;
