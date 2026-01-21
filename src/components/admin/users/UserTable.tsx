import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Box,
	IconButton,
	HStack,
	useBreakpointValue,
	Badge,
	Tooltip,
} from "@chakra-ui/react";
import type { User } from "@/types";
import { FiEye, FiUserX, FiUserCheck } from "react-icons/fi";

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
							<Td>
								<HStack
									spacing={2}
									justify="center">
									<Tooltip label="View Details">
										<IconButton
											aria-label="View user"
											icon={<FiEye />}
											size="sm"
											colorScheme="blue"
											variant="ghost"
											onClick={() => onView(user)}
										/>
									</Tooltip>
									<Tooltip label={user.isActive ? "Deactivate User" : "Activate User"}>
										<IconButton
											aria-label={user.isActive ? "Deactivate user" : "Activate user"}
											icon={user.isActive ? <FiUserX /> : <FiUserCheck />}
											size="sm"
											colorScheme={user.isActive ? "red" : "green"}
											variant="ghost"
											onClick={() => onToggleStatus(user)}
										/>
									</Tooltip>
								</HStack>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};
