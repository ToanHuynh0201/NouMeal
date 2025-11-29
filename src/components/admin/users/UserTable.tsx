import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Box,
	Button,
	useBreakpointValue,
} from "@chakra-ui/react";
import type { User } from "@/types";
import { FiEye } from "react-icons/fi";

interface UserTableProps {
	users: User[];
	onView: (user: User) => void;
	onToggleStatus: (user: User) => void;
}

export const UserTable = ({
	users,
	onView,
	onToggleStatus,
}: UserTableProps) => {
	const isMobile = useBreakpointValue({ base: true, md: false });

	return (
		<Box
			overflowX="auto"
			borderRadius="xl"
			boxShadow="md"
			bg="white">
			<Table
				variant="simple"
				size={isMobile ? "sm" : "md"}>
				<Thead bg="gray.50">
					<Tr>
						<Th>Họ tên</Th>
						<Th>Email</Th>
						<Th>Giới tính</Th>
						<Th>Tuổi</Th>
						<Th>Trạng thái</Th>
						<Th textAlign="center">Thao tác</Th>
					</Tr>
				</Thead>
				<Tbody>
					{users.map((user) => (
						<Tr key={user._id}>
							<Td fontWeight="medium">{user.name}</Td>
							<Td>{user.email}</Td>
							<Td>
								{user.gender === "male"
									? "Nam"
									: user.gender === "female"
									? "Nữ"
									: "Khác"}
							</Td>
							<Td>{user.age}</Td>
							<Td
								color={user.isActive ? "green.500" : "red.500"}
								fontWeight="bold">
								{user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
							</Td>
							<Td textAlign="center">
								<Button
									size="sm"
									leftIcon={<FiEye />}
									variant="outline"
									colorScheme="blue"
									mr={2}
									onClick={() => onView(user)}>
									Xem
								</Button>
								<Button
									size="sm"
									variant={
										user.isActive ? "outline" : "solid"
									}
									colorScheme={
										user.isActive ? "red" : "green"
									}
									onClick={() => onToggleStatus(user)}>
									{user.isActive ? "Deactivate" : "Activate"}
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};
