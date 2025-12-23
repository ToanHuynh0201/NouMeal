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
	Badge,
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
						<Th>Name</Th>
						<Th>Email</Th>
						<Th>Role</Th>
						<Th>Status</Th>
						<Th textAlign="center">Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{users.map((user) => (
						<Tr key={user._id}>
							<Td fontWeight="medium">{user.name}</Td>
							<Td>{user.email}</Td>
							<Td>
								<Badge
									colorScheme={user.role === "admin" ? "purple" : "blue"}
									fontSize="sm"
									px={3}
									py={1}
									borderRadius="md"
									fontWeight="bold">
									{user.role?.toUpperCase() || "USER"}
								</Badge>
							</Td>
							<Td>
								<Badge
									colorScheme={user.isActive ? "green" : "red"}
									fontSize="sm"
									px={3}
									py={1}
									borderRadius="md"
									fontWeight="bold">
									{user.isActive ? "Active" : "Inactive"}
								</Badge>
							</Td>
							<Td textAlign="center">
								<Button
									size="sm"
									leftIcon={<FiEye />}
									variant="outline"
									colorScheme="blue"
									mr={2}
									onClick={() => onView(user)}>
									View Detail
								</Button>
								<Button
									size="sm"
									minW={{ base: "100%", sm: "100px" }}
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
