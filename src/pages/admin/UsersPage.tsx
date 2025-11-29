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
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserDetailModal } from "@/components/admin/users/UserDetailModal";
import { userService } from "@/services/userService";
import type { User } from "@/types";

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");

	useEffect(() => {
		userService.getUsers().then((data) => {
			setUsers(data);
			setLoading(false);
		});
	}, []);

	const handleView = (user: User) => {
		setSelectedUser(user);
		setModalOpen(true);
	};

	const handleToggleStatus = async (user: User) => {
		setLoading(true);
		const updated = await userService.updateUserStatus(
			user._id,
			!user.isActive,
		);
		if (updated) {
			setUsers((prev) =>
				prev.map((u) => (u._id === user._id ? updated : u)),
			);
		}
		setLoading(false);
	};

	// Lọc và tìm kiếm user
	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(search.toLowerCase()) ||
			user.email.toLowerCase().includes(search.toLowerCase());
		const matchesStatus =
			filterStatus === "all" ||
			(filterStatus === "active" && user.isActive) ||
			(filterStatus === "inactive" && !user.isActive);
		return matchesSearch && matchesStatus;
	});

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
					Quản lý người dùng
				</Heading>
				<Flex
					mb={6}
					gap={4}
					direction={{ base: "column", md: "row" }}>
					<InputGroup maxW="400px">
						<InputLeftElement pointerEvents="none">
							<FiSearch color="gray.400" />
						</InputLeftElement>
						<Input
							placeholder="Tìm kiếm theo tên hoặc email..."
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
						<option value="all">Tất cả trạng thái</option>
						<option value="active">Hoạt động</option>
						<option value="inactive">Vô hiệu hóa</option>
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
					<UserTable
						users={filteredUsers}
						onView={handleView}
						onToggleStatus={handleToggleStatus}
					/>
				)}
				<UserDetailModal
					user={selectedUser}
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					onToggleStatus={handleToggleStatus}
				/>
			</Box>
		</MainLayout>
	);
};

export default UsersPage;
