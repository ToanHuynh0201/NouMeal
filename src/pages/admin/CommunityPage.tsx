import { Box, Heading } from "@chakra-ui/react";
import MainLayout from "@/components/layout/MainLayout";

const CommunityPage = () => {
	return (
		<MainLayout>
			<Box p={8}>
				<Heading size="xl">Hello Community</Heading>
			</Box>
		</MainLayout>
	);
};

export default CommunityPage;
