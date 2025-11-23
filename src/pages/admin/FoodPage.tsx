import { Box, Heading } from "@chakra-ui/react";
import MainLayout from "@/components/layout/MainLayout";

const FoodPage = () => {
	return (
		<MainLayout>
			<Box p={8}>
				<Heading size="xl">Hello Food</Heading>
			</Box>
		</MainLayout>
	);
};

export default FoodPage;
