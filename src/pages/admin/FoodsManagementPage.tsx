import { useEffect, useState } from "react";
import {
	Box,
	Heading,
	Spinner,
	Input,
	InputGroup,
	InputLeftElement,
	Select,
	Flex,
	Button,
	HStack,
	Text,
	useToast,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { FoodsTable } from "@/components/admin/foods/FoodsTable";
import { FoodDetailModal } from "@/components/admin/foods/FoodDetailModal";
import { adminService } from "@/services/adminService";

interface Food {
	_id: string;
	name: string;
	description: string;
	instructions: Array<{
		step: number;
		description: string;
	}>;
	imageUrl: string;
	category: string;
	meal: string;
	ingredients: Array<{
		name: string;
		amount: string;
	}>;
	nutritionalInfo: {
		calories: number;
		protein: number;
		carbohydrates: number;
		fat: number;
		fiber: number;
		sugar: number;
		sodium: number;
		cholesterol: number;
	};
	allergens: string[];
	isActive: boolean;
	tags?: string[];
	postedBy: string;
	createdAt: string;
	updatedAt: string;
}

interface PaginationInfo {
	currentPage: number;
	totalPages: number;
	totalFoods: number;
	limit: number;
}

const FoodsManagementPage = () => {
	const [foods, setFoods] = useState<Food[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [searchDebounced, setSearchDebounced] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("all");
	const [filterMeal, setFilterMeal] = useState<string>("all");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<PaginationInfo>({
		currentPage: 1,
		totalPages: 1,
		totalFoods: 0,
		limit: 10,
	});
	const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);
	const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement>(null);
	const toast = useToast();

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchDebounced(search);
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	const fetchFoods = async (page: number = 1) => {
		try {
			setLoading(true);

			// Build filters object
			const filters: {
				category?: string;
				meal?: string;
				isActive?: string;
				search?: string;
			} = {};

			if (filterCategory !== "all") {
				filters.category = filterCategory;
			}

			if (filterMeal !== "all") {
				filters.meal = filterMeal;
			}

			if (filterStatus !== "all") {
				filters.isActive = filterStatus === "active" ? "true" : "false";
			}

			if (searchDebounced.trim()) {
				filters.search = searchDebounced.trim();
			}

			const response = await adminService.getAllFoods(page, 10, filters);
			if (response && response.success) {
				// Assuming response structure similar to users
				const foodsData = response.data;

				// Handle different response structures
				if (Array.isArray(foodsData)) {
					setFoods(foodsData);
					setPagination({
						currentPage: page,
						totalPages: Math.ceil(foodsData.length / 10),
						totalFoods: foodsData.length,
						limit: 10,
					});
				} else if (foodsData.foods) {
					setFoods(foodsData.foods || []);
					setPagination(foodsData.pagination || {
						currentPage: page,
						totalPages: 1,
						totalFoods: foodsData.foods.length,
						limit: 10,
					});
				}
				setCurrentPage(page);
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
			toast({
				title: "Error",
				description: "Failed to fetch foods",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFoods(1);
	}, [searchDebounced, filterCategory, filterMeal, filterStatus]);

	const handleView = (food: Food) => {
		setSelectedFood(food);
		setModalOpen(true);
	};

	const handleToggleStatus = async (food: Food) => {
		try {
			setLoading(true);
			const response = await adminService.updateFoodStatus(
				food._id,
				!food.isActive,
			);

			if (response && response.success) {
				// Update the food in the list with new status
				setFoods((prev) =>
					prev.map((f) =>
						f._id === food._id
							? { ...f, isActive: !food.isActive }
							: f
					),
				);

				// Update selected food if it's the same one
				if (selectedFood?._id === food._id) {
					setSelectedFood({ ...food, isActive: !food.isActive });
				}

				toast({
					title: "Success",
					description: `Food ${!food.isActive ? "activated" : "deactivated"} successfully`,
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error updating food status:", error);
			toast({
				title: "Error",
				description: "Failed to update food status",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (food: Food) => {
		setFoodToDelete(food);
		onDeleteOpen();
	};

	const handleDeleteConfirm = async () => {
		if (!foodToDelete) return;

		try {
			setLoading(true);
			const response = await adminService.deleteFood(foodToDelete._id);

			if (response && response.success) {
				// Remove the food from the list
				setFoods((prev) => prev.filter((f) => f._id !== foodToDelete._id));

				// Close modal if it's the same food
				if (selectedFood?._id === foodToDelete._id) {
					setModalOpen(false);
					setSelectedFood(null);
				}

				toast({
					title: "Success",
					description: "Food deleted successfully",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Error deleting food:", error);
			toast({
				title: "Error",
				description: "Failed to delete food",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
			onDeleteClose();
			setFoodToDelete(null);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchFoods(newPage);
		}
	};

	return (
		<MainLayout>
			<Box
				p={8}
				minH="100vh"
				bg="gray.50">
				<Heading
					size="lg"
					mb={6}
					color="gray.700">
					Foods Management
				</Heading>
				<Flex
					mb={6}
					gap={4}
					direction={{ base: "column", md: "row" }}
					wrap="wrap">
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
					<Select
						maxW="200px"
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
						bg="white"
						borderRadius="lg">
						<option value="all">All Categories</option>
						<option value="protein">Protein</option>
						<option value="carbohydrate">Carbohydrate</option>
						<option value="vegetable">Vegetable</option>
						<option value="fruit">Fruit</option>
						<option value="dairy">Dairy</option>
						<option value="fat">Fat</option>
					</Select>
					<Select
						maxW="200px"
						value={filterMeal}
						onChange={(e) => setFilterMeal(e.target.value)}
						bg="white"
						borderRadius="lg">
						<option value="all">All Meals</option>
						<option value="breakfast">Breakfast</option>
						<option value="lunch">Lunch</option>
						<option value="dinner">Dinner</option>
						<option value="snack">Snack</option>
					</Select>
					<Select
						maxW="200px"
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						bg="white"
						borderRadius="lg">
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</Select>
				</Flex>
				{loading ? (
					<Box
						textAlign="center"
						py={10}>
						<Spinner
							size="xl"
							color="blue.500"
						/>
					</Box>
				) : (
					<>
						<FoodsTable
							foods={foods}
							onView={handleView}
							onToggleStatus={handleToggleStatus}
							onDelete={handleDeleteClick}
						/>

						{/* Pagination Controls */}
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
								{(currentPage - 1) * pagination.limit + 1} to{" "}
								{Math.min(
									currentPage * pagination.limit,
									pagination.totalFoods,
								)}{" "}
								of {pagination.totalFoods} foods
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
									colorScheme="blue">
									Previous
								</Button>

								<HStack spacing={1}>
									{[...Array(pagination.totalPages)].map(
										(_, index) => {
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
																? "blue"
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
										},
									)}
								</HStack>

								<Button
									size="sm"
									rightIcon={<FiChevronRight />}
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
									isDisabled={
										currentPage === pagination.totalPages
									}
									variant="outline"
									colorScheme="blue">
									Next
								</Button>
							</HStack>
						</Flex>
					</>
				)}

				{/* Food Detail Modal */}
				<FoodDetailModal
					food={selectedFood}
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					onToggleStatus={handleToggleStatus}
					onDelete={handleDeleteClick}
				/>

				{/* Delete Confirmation Dialog */}
				<AlertDialog
					isOpen={isDeleteOpen}
					leastDestructiveRef={cancelRef}
					onClose={onDeleteClose}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader fontSize="lg" fontWeight="bold">
								Delete Food
							</AlertDialogHeader>

							<AlertDialogBody>
								Are you sure you want to delete <strong>{foodToDelete?.name}</strong>?
								This action cannot be undone.
							</AlertDialogBody>

							<AlertDialogFooter>
								<Button ref={cancelRef} onClick={onDeleteClose}>
									Cancel
								</Button>
								<Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
									Delete
								</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</AlertDialog>
			</Box>
		</MainLayout>
	);
};

export default FoodsManagementPage;
