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
} from "@chakra-ui/react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserDetailModal } from "@/components/admin/users/UserDetailModal";
import { adminService } from "@/services/adminService";
import type { User, PaginationInfo } from "@/types";

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [searchDebounced, setSearchDebounced] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [filterRole, setFilterRole] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [pagination, setPagination] = useState<PaginationInfo>({
		currentPage: 1,
		totalPages: 1,
		totalUsers: 0,
		limit: 10,
	});

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchDebounced(search);
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	const fetchUsers = async (page: number = 1) => {
		try {
			setLoading(true);

			// Build filters object
			const filters: {
				role?: string;
				isActive?: string;
				search?: string;
			} = {};

			if (filterStatus !== "all") {
				filters.isActive = filterStatus === "active" ? "true" : "false";
			}

			if (filterRole !== "all") {
				filters.role = filterRole;
			}

			if (searchDebounced.trim()) {
				filters.search = searchDebounced.trim();
			}

			const response = await adminService.getAllUsers(page, 10, filters);
			if (response && response.success) {
				// response.data contains { users, pagination }
				const { users, pagination } = response.data;
				setUsers(users || []);
				setPagination(pagination);
				setCurrentPage(page);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers(1);
	}, [searchDebounced, filterStatus, filterRole]);

	const handleView = (user: User) => {
		setSelectedUser(user);
		setModalOpen(true);
	};

	const handleToggleStatus = async (user: User) => {
		try {
			setLoading(true);
			const response = await adminService.updateUserStatus(
				user._id,
				!user.isActive,
			);

			if (response && response.success) {
				// Update the user in the list with new status
				setUsers((prev) =>
					prev.map((u) =>
						u._id === user._id
							? { ...u, isActive: !user.isActive }
							: u
					),
				);

				// Update selected user if it's the same one
				if (selectedUser?._id === user._id) {
					setSelectedUser({ ...user, isActive: !user.isActive });
				}
			}
		} catch (error) {
			console.error("Error updating user status:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePromoteToAdmin = async (user: User) => {
		try {
			setLoading(true);
			const response = await adminService.promoteToAdmin(
				user._id,
				user.email,
			);

			if (response && response.success) {
				// Update the user in the list with new role
				setUsers((prev) =>
					prev.map((u) =>
						u._id === user._id ? { ...u, role: "admin" } : u
					),
				);

				// Update selected user and close modal
				if (selectedUser?._id === user._id) {
					setSelectedUser({ ...user, role: "admin" });
				}
				setModalOpen(false);
			}
		} catch (error) {
			console.error("Error promoting user to admin:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			fetchUsers(newPage);
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
					User Management
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
							placeholder="Search by name or email..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							bg="white"
							borderRadius="lg"
						/>
					</InputGroup>
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
					<Select
						maxW="200px"
						value={filterRole}
						onChange={(e) => setFilterRole(e.target.value)}
						bg="white"
						borderRadius="lg">
						<option value="all">All Roles</option>
						<option value="user">User</option>
						<option value="admin">Admin</option>
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
						<UserTable
							users={users}
							onView={handleView}
							onToggleStatus={handleToggleStatus}
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
									pagination.totalUsers,
								)}{" "}
								of {pagination.totalUsers} users
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
				<UserDetailModal
					user={selectedUser}
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					onToggleStatus={handleToggleStatus}
					onPromoteToAdmin={handlePromoteToAdmin}
				/>
			</Box>
		</MainLayout>
	);
};

export default UsersPage;
