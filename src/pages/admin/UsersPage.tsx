import { Box, Heading } from "@chakra-ui/react";
import MainLayout from "@/components/layout/MainLayout";

const UsersPage = () => {
	return (
		<MainLayout>
			<Box p={8}>
				<Heading size="xl">Hello Users</Heading>
			</Box>
		</MainLayout>
	);
};

export default UsersPage;
