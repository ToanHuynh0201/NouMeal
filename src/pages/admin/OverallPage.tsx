import { Box, Heading } from "@chakra-ui/react";
import MainLayout from "@/components/layout/MainLayout";

const OverallPage = () => {
	return (
		<MainLayout>
			<Box p={8}>
				<Heading size="xl">Hello Overall</Heading>
			</Box>
		</MainLayout>
	);
};

export default OverallPage;
