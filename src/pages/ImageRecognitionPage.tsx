import {
	Box,
	Container,
	VStack,
	Heading,
	Text,
	Button,
	SimpleGrid,
	Card,
	CardBody,
	Image,
	Badge,
	HStack,
	Icon,
	Flex,
	Stat,
	StatLabel,
	StatNumber,
	StatGroup,
	useToast,
	Input,
	Center,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import {
	FiUpload,
	FiCamera,
	FiCheckCircle,
	FiAlertCircle,
	FiRefreshCw,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { ImageRecognitionResult, RecognizedFood } from "@/types/ai";
import { aiService } from "@/services";
import { useAuth } from "@/hooks/useAuth";

const ImageRecognitionPage = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [result, setResult] = useState<ImageRecognitionResult | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const toast = useToast();
	const { user } = useAuth();

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				toast({
					title: "File too large",
					description: "Please select an image smaller than 5MB.",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage(reader.result as string);
				console.log(reader.result as string);

				setResult(null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAnalyze = async () => {
		if (!selectedImage) return;

		setIsAnalyzing(true);

		try {
			// Get dietary goals and health condition from user profile
			const dietary_goals = user?.goal || "maintain_weight";
			const health_condition = user?.allergies?.length
				? user.allergies.join(", ")
				: "healthy";

			// Call the analyze-food API
			const response = await aiService.analyzeFood({
				dietary_goals,
				health_condition,
				image: selectedImage,
			});

			// Response structure: { success: true, data: { ... actual data ... } }
			if (response.success && response.data) {
				const apiData = response.data;

				// Transform API response to match ImageRecognitionResult format
				const transformedResult: ImageRecognitionResult = {
					id: apiData.session_id,
					imageUrl: selectedImage,
					recognizedFoods: apiData.recognized_foods.map(
						(food: RecognizedFood) => ({
							name: food.name,
							confidence: food.confidence,
							category: food.category,
							estimatedWeight: food.weight,
						}),
					),
					overallNutrition: {
						calories: apiData.nutrition_analysis.calories.value,
						protein: `${apiData.nutrition_analysis.protein.value}${apiData.nutrition_analysis.protein.unit}`,
						carbs: `${apiData.nutrition_analysis.carbs.value}${apiData.nutrition_analysis.carbs.unit}`,
						fat: `${apiData.nutrition_analysis.fat.value}${apiData.nutrition_analysis.fat.unit}`,
					},
					suggestions: apiData.recommendations,
					timestamp: new Date().toISOString(),
					processingTime: apiData.processing_time,
				};

				setResult(transformedResult);

				toast({
					title: "Analysis complete!",
					description: "Food items identified successfully.",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error: any) {
			toast({
				title: "Analysis failed",
				description:
					error?.message ||
					"Failed to analyze the image. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleReset = () => {
		setSelectedImage(null);
		setResult(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	// const convertImageUrlToBase64 = async (
	// 	imageUrl: string,
	// ): Promise<string> => {
	// 	try {
	// 		const response = await fetch(imageUrl);
	// 		const blob = await response.blob();

	// 		return new Promise((resolve, reject) => {
	// 			const reader = new FileReader();
	// 			reader.onloadend = () => resolve(reader.result as string);
	// 			reader.onerror = reject;
	// 			reader.readAsDataURL(blob);
	// 		});
	// 	} catch (error) {
	// 		console.error("Error converting image to base64:", error);
	// 		throw error;
	// 	}
	// };

	// const handleExampleImageClick = async (imageUrl: string) => {
	// 	try {
	// 		toast({
	// 			title: "Loading image...",
	// 			description: "Converting image to base64",
	// 			status: "info",
	// 			duration: 1000,
	// 			isClosable: true,
	// 		});

	// 		const base64Image = await convertImageUrlToBase64(imageUrl);
	// 		setSelectedImage(base64Image);
	// 		setResult(null);
	// 	} catch (error) {
	// 		toast({
	// 			title: "Error loading image",
	// 			description: "Failed to convert image. Please try again.",
	// 			status: "error",
	// 			duration: 3000,
	// 			isClosable: true,
	// 		});
	// 	}
	// };

	return (
		<MainLayout
			showHeader={true}
			showFooter={true}>
			<Container
				maxW="7xl"
				py={8}>
				<VStack
					spacing={8}
					align="stretch">
					{/* Header Section */}
					<Box
						textAlign="center"
						mb={4}>
						<Heading
							size="2xl"
							bgGradient="linear(to-r, blue.500, teal.500)"
							bgClip="text"
							mb={3}>
							Food Image Recognition
						</Heading>
						<Text
							fontSize="lg"
							color="gray.600">
							Upload a photo of your meal to identify ingredients
							and analyze nutrition
						</Text>
					</Box>

					{/* Upload Section */}
					{!selectedImage && !result && (
						<Card
							shadow="lg"
							borderRadius="2xl"
							bg="white"
							border="2px"
							borderColor="blue.100">
							<CardBody p={8}>
								<VStack spacing={6}>
									<Input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleImageSelect}
										display="none"
									/>

									<Center
										border="3px dashed"
										borderColor="blue.200"
										borderRadius="xl"
										p={12}
										bg="blue.50"
										width="100%"
										cursor="pointer"
										onClick={handleUploadClick}
										transition="all 0.3s"
										_hover={{
											borderColor: "blue.400",
											bg: "blue.100",
											transform: "scale(1.02)",
										}}>
										<VStack spacing={4}>
											<Icon
												as={FiCamera}
												boxSize={20}
												color="blue.500"
											/>
											<VStack spacing={2}>
												<Heading
													size="md"
													color="gray.700">
													Upload or Drop Your Food
													Image
												</Heading>
												<Text color="gray.500">
													Supports JPG, PNG up to 5MB
												</Text>
											</VStack>
											<Button
												leftIcon={
													<Icon as={FiUpload} />
												}
												colorScheme="blue"
												size="lg"
												pointerEvents="none">
												Choose Image
											</Button>
										</VStack>
									</Center>

									{/* Example Images Section */}
									<Box width="100%">
										<Text
											fontSize="sm"
											color="gray.600"
											mb={3}
											fontWeight="semibold">
											Or try with example images:
										</Text>
									</Box>
								</VStack>
							</CardBody>
						</Card>
					)}

					{/* Preview and Analyze Section */}
					{selectedImage && !result && !isAnalyzing && (
						<VStack spacing={6}>
							<Card
								shadow="lg"
								borderRadius="2xl"
								overflow="hidden"
								w="100%">
								<Image
									src={selectedImage}
									alt="Selected food"
									maxH="500px"
									w="100%"
									objectFit="contain"
									bg="gray.50"
								/>
								<CardBody>
									<HStack
										spacing={4}
										justify="center">
										<Button
											leftIcon={<Icon as={FiCamera} />}
											colorScheme="blue"
											size="lg"
											onClick={handleAnalyze}>
											Analyze Food
										</Button>
										<Button
											leftIcon={<Icon as={FiRefreshCw} />}
											variant="outline"
											colorScheme="gray"
											size="lg"
											onClick={handleReset}>
											Choose Different Image
										</Button>
									</HStack>
								</CardBody>
							</Card>
						</VStack>
					)}

					{/* Loading State */}
					{isAnalyzing && (
						<LoadingSpinner
							message="Analyzing food image..."
							minHeight="300px"
							variant="primary"
						/>
					)}

					{/* Results Section */}
					{result && !isAnalyzing && (
						<VStack
							spacing={6}
							align="stretch">
							{/* Image and Overview */}
							<SimpleGrid
								columns={{ base: 1, lg: 2 }}
								spacing={6}>
								{/* Image */}
								<Card
									shadow="lg"
									borderRadius="2xl"
									overflow="hidden">
									<Image
										src={result.imageUrl}
										alt="Analyzed food"
										h="400px"
										w="100%"
										objectFit="cover"
									/>
									<CardBody>
										<HStack justify="space-between">
											<Badge
												colorScheme="green"
												fontSize="sm"
												px={3}
												py={1}>
												<HStack>
													<Icon as={FiCheckCircle} />
													<Text>
														Analysis Complete
													</Text>
												</HStack>
											</Badge>
											<Text
												fontSize="xs"
												color="gray.500">
												Processed in{" "}
												{result.processingTime}
											</Text>
										</HStack>
									</CardBody>
								</Card>

								{/* Recognized Foods */}
								<Card
									shadow="lg"
									borderRadius="2xl">
									<CardBody>
										<VStack
											align="stretch"
											spacing={4}>
											<Heading
												size="md"
												color="gray.700">
												Recognized Foods
											</Heading>

											{result.recognizedFoods.map(
												(food, idx) => (
													<Box
														key={idx}
														p={4}
														bg="gray.50"
														borderRadius="lg"
														border="1px"
														borderColor="gray.200">
														<Flex
															justify="space-between"
															align="center"
															mb={2}>
															<Heading size="sm">
																{food.name}
															</Heading>
															<Badge
																colorScheme={
																	food.confidence >
																	90
																		? "green"
																		: food.confidence >
																			  80
																			? "blue"
																			: "orange"
																}>
																{
																	food.confidence
																}
																% confident
															</Badge>
														</Flex>
														<HStack
															spacing={4}
															fontSize="sm">
															<Text color="gray.600">
																Category:{" "}
																<Text
																	as="span"
																	fontWeight="semibold">
																	{
																		food.category
																	}
																</Text>
															</Text>
															{food.estimatedWeight && (
																<Text color="gray.600">
																	Weight:{" "}
																	<Text
																		as="span"
																		fontWeight="semibold">
																		{
																			food.estimatedWeight
																		}
																	</Text>
																</Text>
															)}
														</HStack>
													</Box>
												),
											)}
										</VStack>
									</CardBody>
								</Card>
							</SimpleGrid>

							{/* Nutrition Analysis */}
							<Card
								shadow="lg"
								borderRadius="2xl">
								<CardBody>
									<VStack
										align="stretch"
										spacing={6}>
										<Heading
											size="md"
											color="gray.700">
											Nutrition Analysis
										</Heading>

										<StatGroup>
											<Stat>
												<StatLabel>Calories</StatLabel>
												<StatNumber color="orange.500">
													{
														result.overallNutrition
															.calories
													}
												</StatNumber>
												<Text
													fontSize="xs"
													color="gray.500">
													kcal
												</Text>
											</Stat>
											<Stat>
												<StatLabel>Protein</StatLabel>
												<StatNumber color="purple.500">
													{
														result.overallNutrition
															.protein
													}
												</StatNumber>
											</Stat>
											<Stat>
												<StatLabel>Carbs</StatLabel>
												<StatNumber color="blue.500">
													{
														result.overallNutrition
															.carbs
													}
												</StatNumber>
											</Stat>
											<Stat>
												<StatLabel>Fat</StatLabel>
												<StatNumber color="yellow.600">
													{
														result.overallNutrition
															.fat
													}
												</StatNumber>
											</Stat>
										</StatGroup>
									</VStack>
								</CardBody>
							</Card>

							{/* AI Suggestions */}
							<Card
								shadow="lg"
								borderRadius="2xl"
								bg="blue.50"
								border="2px"
								borderColor="blue.200">
								<CardBody>
									<VStack
										align="stretch"
										spacing={4}>
										<HStack>
											<Icon
												as={FiAlertCircle}
												color="blue.500"
											/>
											<Heading
												size="md"
												color="blue.700">
												AI Insights & Suggestions
											</Heading>
										</HStack>

										{result.suggestions.map(
											(suggestion, idx) => (
												<Flex
													key={idx}
													p={4}
													bg="white"
													borderRadius="lg"
													align="flex-start"
													gap={3}>
													<Badge
														colorScheme="blue"
														fontSize="sm"
														px={2}
														py={1}
														borderRadius="full">
														{idx + 1}
													</Badge>
													<Text
														color="gray.700"
														flex={1}>
														{suggestion}
													</Text>
												</Flex>
											),
										)}
									</VStack>
								</CardBody>
							</Card>

							{/* Action Buttons */}
							<HStack
								justify="center"
								spacing={4}>
								<Button
									leftIcon={<Icon as={FiUpload} />}
									colorScheme="blue"
									size="lg"
									onClick={handleReset}>
									Analyze Another Image
								</Button>
							</HStack>
						</VStack>
					)}
				</VStack>
			</Container>
		</MainLayout>
	);
};

export default ImageRecognitionPage;
