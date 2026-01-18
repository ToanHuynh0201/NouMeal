import { useEffect, useState } from "react";
import {
	Box,
	Heading,
	Spinner,
	Input,
	InputGroup,
	InputLeftElement,
	Flex,
	Button,
	HStack,
	Text,
	useToast,
	Badge,
	VStack,
} from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { FoodDetailModal } from "@/components/admin/foods/FoodDetailModal";
import { FoodApprovalTable } from "@/components/admin/foods/FoodApprovalTable";
import { foodService } from "@/services/foodService";
import type { Food } from "@/types/recipe";

interface PaginationInfo {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

const FoodApprovalPage = () => {
	const [foods, setFoods] = useState<Food[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [searchDebounced, setSearchDebounced] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<PaginationInfo>({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		itemsPerPage: 10,
	});
	const toast = useToast();

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchDebounced(search);
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	// Fetch public foods from API
	const fetchPublicFoods = async () => {
		try {
			setLoading(true);

			const response = await foodService.getPublicFoods(
				currentPage,
				pagination.itemsPerPage,
			);

			if (response && response.success) {
				const foodsData = response.data;
				const meta = response.meta;

				if (Array.isArray(foodsData)) {
					setFoods(foodsData);
				}

				if (meta) {
					setPagination({
						currentPage: meta.currentPage,
						totalPages: meta.totalPages,
						totalItems: meta.totalItems,
						itemsPerPage: meta.itemsPerPage,
					});
				}
			}
		} catch (error) {
			console.error("Error fetching public foods:", error);
			toast({
				title: "Error",
				description: "Failed to fetch public foods",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	// Fetch public foods on mount and when page changes
	useEffect(() => {
		fetchPublicFoods();
	}, [currentPage]);

	// Client-side search filtering
	const filteredFoods = foods.filter((food) => {
		if (!searchDebounced.trim()) return true;
		const searchLower = searchDebounced.toLowerCase();
		return food.name.toLowerCase().includes(searchLower);
	});

	const handleView = (food: Food) => {
		setSelectedFood(food);
		setModalOpen(true);
	};

	const handleApprove = async (foodId: string) => {
		try {
			setLoading(true);
			const response = await foodService.updateFoodRecommendableStatus(
				foodId,
				true,
			);

			if (response && response.success) {
				// Remove approved food from the list
				setFoods((prev) => prev.filter((f) => f._id !== foodId));

				// Update pagination
				setPagination((prev) => ({
					...prev,
					totalItems: prev.totalItems - 1,
				}));

				toast({
					title: "Success",
					description: "Food approved for recommendations",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				// Close modal if it's the same food
				if (selectedFood?._id === foodId) {
					setModalOpen(false);
					setSelectedFood(null);
				}
			}
		} catch (error) {
			console.error("Error approving food:", error);
			toast({
				title: "Error",
				description: "Failed to approve food",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleReject = async (foodId: string) => {
		try {
			setLoading(true);
			const response = await foodService.updateFoodStatus(foodId, false);

			if (response && response.success) {
				// Remove rejected food from the list
				setFoods((prev) => prev.filter((f) => f._id !== foodId));

				// Update pagination
				setPagination((prev) => ({
					...prev,
					totalItems: prev.totalItems - 1,
				}));

				toast({
					title: "Success",
					description: "Food rejected and deactivated",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				// Close modal if it's the same food
				if (selectedFood?._id === foodId) {
					setModalOpen(false);
					setSelectedFood(null);
				}
			}
		} catch (error) {
			console.error("Error rejecting food:", error);
			toast({
				title: "Error",
				description: "Failed to reject food",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			setCurrentPage(newPage);
		}
	};

	return (
		<MainLayout>
			<Box
				p={8}
				minH="100vh"
				bg="gray.50">
				<VStack
					spacing={6}
					align="stretch">
					<Flex
						justify="space-between"
						align="center">
						<VStack
							align="flex-start"
							spacing={2}>
							<Heading
								size="lg"
								color="gray.700">
								Food Approval
							</Heading>
							<Text
								color="gray.600"
								fontSize="sm">
								Review and approve community-submitted foods for
								recommendations
							</Text>
						</VStack>
						<Badge
							colorScheme="purple"
							fontSize="md"
							px={4}
							py={2}
							borderRadius="lg">
							{pagination.totalItems} Pending
						</Badge>
					</Flex>

					<InputGroup maxW="400px">
						<InputLeftElement pointerEvents="none">
							<FiSearch color="gray.400" />
						</InputLeftElement>
						<Input
							placeholder="Search by name..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							bg="white"
							borderRadius="lg"
						/>
					</InputGroup>

					{loading ? (
						<Box
							textAlign="center"
							py={10}>
							<Spinner
								size="xl"
								color="purple.500"
							/>
						</Box>
					) : (
						<>
							<FoodApprovalTable
								foods={filteredFoods}
								onView={handleView}
								onApprove={handleApprove}
								onReject={handleReject}
							/>

							{/* Pagination Controls */}
							{filteredFoods.length > 0 && (
								<Flex
									mt={6}
									justify="space-between"
									align="center"
									bg="white"
									p={4}
									borderRadius="lg"
									boxShadow="md">
									<Text
										fontSize="sm"
										color="gray.600">
										Showing{" "}
										{(currentPage - 1) *
											pagination.itemsPerPage +
											1}{" "}
										to{" "}
										{Math.min(
											currentPage * pagination.itemsPerPage,
											pagination.totalItems,
										)}{" "}
										of {pagination.totalItems} foods
									</Text>

									<HStack spacing={2}>
										<Button
											size="sm"
											leftIcon={<FiChevronLeft />}
											onClick={() =>
												handlePageChange(currentPage - 1)
											}
											isDisabled={currentPage === 1}
											variant="outline"
											colorScheme="purple">
											Previous
										</Button>

										<HStack spacing={1}>
											{[
												...Array(pagination.totalPages),
											].map((_, index) => {
												const pageNumber = index + 1;
												// Show first page, last page, current page and adjacent pages
												if (
													pageNumber === 1 ||
													pageNumber ===
														pagination.totalPages ||
													(pageNumber >=
														currentPage - 1 &&
														pageNumber <=
															currentPage + 1)
												) {
													return (
														<Button
															key={pageNumber}
															size="sm"
															onClick={() =>
																handlePageChange(
																	pageNumber,
																)
															}
															colorScheme={
																currentPage ===
																pageNumber
																	? "purple"
																	: "gray"
															}
															variant={
																currentPage ===
																pageNumber
																	? "solid"
																	: "outline"
															}>
															{pageNumber}
														</Button>
													);
												} else if (
													pageNumber ===
														currentPage - 2 ||
													pageNumber === currentPage + 2
												) {
													return (
														<Text key={pageNumber}>
															...
														</Text>
													);
												}
												return null;
											})}
										</HStack>

										<Button
											size="sm"
											rightIcon={<FiChevronRight />}
											onClick={() =>
												handlePageChange(currentPage + 1)
											}
											isDisabled={
												currentPage ===
												pagination.totalPages
											}
											variant="outline"
											colorScheme="purple">
											Next
										</Button>
									</HStack>
								</Flex>
							)}
						</>
					)}
				</VStack>

				{/* Food Detail Modal */}
				<FoodDetailModal
					food={selectedFood}
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
				/>
			</Box>
		</MainLayout>
	);
};

export default FoodApprovalPage;
