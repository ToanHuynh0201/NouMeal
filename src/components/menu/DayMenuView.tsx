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
	Button,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import { FiClock, FiUsers, FiCheck, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import type { Recipe, DailyMenu } from "@/types/recipe";

interface DayMenuViewProps {
	dailyMenu: DailyMenu;
	onRecipeClick: (recipe: Recipe) => void;
	onLogFood?: (foodId: string) => Promise<void>;
	remainingMeals?: string[];
}

const DayMenuView = ({ dailyMenu, onRecipeClick, onLogFood, remainingMeals = [] }: DayMenuViewProps) => {
	const contentSection = useScrollAnimation({ threshold: 0.1 });
	const toast = useToast();
	const [loggingFoods, setLoggingFoods] = useState<Set<string>>(new Set());
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedMeal, setSelectedMeal] = useState<{ foodId: string; name: string; mealType: string } | null>(null);

	const openConfirmModal = (foodId: string, name: string, mealType: string) => {
		setSelectedMeal({ foodId, name, mealType });
		onOpen();
	};

	const handleConfirmLog = async () => {
		if (!selectedMeal || !onLogFood) return;

		const { foodId } = selectedMeal;
		onClose();
		setLoggingFoods(prev => new Set(prev).add(foodId));

		try {
			await onLogFood(foodId);
			toast({
				title: "Food logged successfully",
				description: "This meal has been added to your diary.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Failed to log food",
				description: "Please try again later.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoggingFoods(prev => {
				const next = new Set(prev);
				next.delete(foodId);
				return next;
			});
			setSelectedMeal(null);
		}
	};

	const isMealRemaining = (mealType: string) => {
		return remainingMeals.includes(mealType);
	};

	const MealSection = ({
		recipe,
		emoji,
		title,
		subtitle,
		bgColor,
		delay = 0,
		mealType,
	}: {
		recipe: Recipe;
		emoji: string;
		title: string;
		subtitle: string;
		bgColor: string;
		delay?: number;
		mealType: "breakfast" | "lunch" | "dinner" | "snack";
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
							{onLogFood && (
								<>
									<Divider />
									<Button
										size="sm"
										colorScheme={categoryColor[recipe.category]}
										leftIcon={<Icon as={FiCheck} />}
										w="full"
										isLoading={loggingFoods.has(recipe.id)}
										isDisabled={!isMealRemaining(mealType)}
										onClick={(e) => {
											e.stopPropagation();
											openConfirmModal(recipe.id, recipe.title, mealType);
										}}
										_hover={{
											transform: "translateY(-2px)",
											shadow: "md",
										}}
										transition="all 0.2s">
										Log This Meal
									</Button>
								</>
							)}
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
						mealType="breakfast"
					/>
					<MealSection
						recipe={dailyMenu.lunch}
						emoji="☀️"
						title="Lunch"
						subtitle="Midday fuel"
						bgColor="green.50"
						delay={0.1}
						mealType="lunch"
					/>
					<MealSection
						recipe={dailyMenu.dinner}
						emoji="🌙"
						title="Dinner"
						subtitle="Evening nourishment"
						bgColor="purple.50"
						delay={0.2}
						mealType="dinner"
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
											{onLogFood && (
												<>
													<Divider />
													<Button
														size="sm"
														colorScheme="blue"
														leftIcon={<Icon as={FiCheck} />}
														w="full"
														isLoading={loggingFoods.has(snack.id)}
														isDisabled={!isMealRemaining("snack")}
														onClick={(e) => {
															e.stopPropagation();
															openConfirmModal(snack.id, snack.title, "snack");
														}}
														_hover={{
															transform: "translateY(-2px)",
															shadow: "md",
														}}
														transition="all 0.2s">
														Log This Snack
													</Button>
												</>
											)}
										</VStack>
									</CardBody>
								</Card>
							))}
						</SimpleGrid>
					</Box>
				)}
			</VStack>

			{/* Confirmation Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent borderRadius="2xl" mx={4}>
					<ModalHeader borderBottom="1px solid" borderColor="gray.100" pb={4}>
						<HStack spacing={2}>
							<Icon as={FiAlertCircle} color="purple.500" boxSize={6} />
							<Text>Confirm Meal Log</Text>
						</HStack>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody py={6}>
						<VStack spacing={4} align="start">
							<Text fontSize="md" color="gray.700">
								Are you sure you want to log this meal to your diary?
							</Text>
							{selectedMeal && (
								<Box
									w="full"
									p={4}
									bg="purple.50"
									borderRadius="xl"
									border="1px solid"
									borderColor="purple.200">
									<VStack align="start" spacing={2}>
										<HStack spacing={2}>
											<Text fontSize="sm" fontWeight="semibold" color="purple.700" textTransform="uppercase">
												Meal Type:
											</Text>
											<Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
												{selectedMeal.mealType}
											</Badge>
										</HStack>
										<Text fontSize="md" fontWeight="bold" color="gray.800">
											{selectedMeal.name}
										</Text>
									</VStack>
								</Box>
							)}
							<Text fontSize="sm" color="gray.600">
								This action will update your daily nutrition progress.
							</Text>
						</VStack>
					</ModalBody>
					<ModalFooter borderTop="1px solid" borderColor="gray.100" pt={4}>
						<HStack spacing={3} w="full" justify="flex-end">
							<Button
								variant="ghost"
								onClick={onClose}
								_hover={{ bg: "gray.100" }}>
								Cancel
							</Button>
							<Button
								bgGradient="linear(135deg, purple.500, pink.500)"
								color="white"
								onClick={handleConfirmLog}
								leftIcon={<Icon as={FiCheck} />}
								_hover={{
									bgGradient: "linear(135deg, purple.600, pink.600)",
									transform: "translateY(-2px)",
									shadow: "md",
								}}
								transition="all 0.2s">
								Confirm & Log
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default DayMenuView;
