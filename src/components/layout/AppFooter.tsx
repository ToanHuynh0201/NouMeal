import { animationPresets } from "@/styles/animation";
import {
	Box,
	Container,
	Text,
	Divider,
	HStack,
	Link,
	useColorModeValue,
} from "@chakra-ui/react";

/**
 * Application footer component
 */
const AppFooter = () => {
	const currentYear = new Date().getFullYear();
	const bgGradient = useColorModeValue(
		"linear(to-r, rgba(249, 250, 251, 0.9), rgba(243, 232, 255, 0.9))",
		"linear(to-r, gray.900, gray.800)",
	);
	const borderColor = useColorModeValue("purple.100", "gray.700");

	return (
		<Box
			py={6}
			bgGradient={bgGradient}
			borderTop="1px"
			borderColor={borderColor}
			animation={animationPresets.fadeIn}
			mt="auto">
			<Container maxW="7xl">
				<HStack
					justify="space-between"
					wrap="wrap"
					spacing={4}>
					<Text
						fontSize="sm"
						fontWeight="500"
						bgGradient="linear(to-r, purple.600, pink.500)"
						bgClip="text">
						© {currentYear} MealGenie
					</Text>
					<HStack spacing={6}>
						<Link
							href="#"
							fontSize="sm"
							fontWeight="500"
							color="gray.600"
							position="relative"
							_hover={{
								color: "purple.600",
								_after: {
									width: "100%",
								},
							}}
							_after={{
								content: '""',
								position: "absolute",
								bottom: "-2px",
								left: 0,
								width: 0,
								height: "2px",
								bgGradient:
									"linear(to-r, purple.400, pink.400)",
								transition: "width 0.3s ease",
							}}
							transition="all 0.3s ease">
							Github
						</Link>
						<Link
							href="#"
							fontSize="sm"
							fontWeight="500"
							color="gray.600"
							position="relative"
							_hover={{
								color: "purple.600",
								_after: {
									width: "100%",
								},
							}}
							_after={{
								content: '""',
								position: "absolute",
								bottom: "-2px",
								left: 0,
								width: 0,
								height: "2px",
								bgGradient:
									"linear(to-r, purple.400, pink.400)",
								transition: "width 0.3s ease",
							}}
							transition="all 0.3s ease">
							Support
						</Link>
					</HStack>
				</HStack>
			</Container>
		</Box>
	);
};

export default AppFooter;
