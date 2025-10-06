import {animationPresets} from "@/styles/animation";
import {Box, Container, Text, Divider, HStack, Link} from "@chakra-ui/react";

/**
 * Application footer component
 */
const AppFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box py={8} animation={animationPresets.fadeIn}>
            <Container maxW="7xl">
                <Divider mb={6} />
                <HStack justify="space-between" wrap="wrap" spacing={4}>
                    <Text fontSize="sm" color="gray.600">
                        © {currentYear} MealGenie
                    </Text>
                    <HStack spacing={6}>
                        <Link
                            href="#"
                            fontSize="sm"
                            color="gray.500"
                            _hover={{
                                color: "brand.500",
                                textDecoration: "underline",
                            }}
                        >
                            Github
                        </Link>
                        <Link
                            href="#"
                            fontSize="sm"
                            color="gray.500"
                            _hover={{
                                color: "brand.500",
                                textDecoration: "underline",
                            }}
                        >
                            Support
                        </Link>
                    </HStack>
                </HStack>
            </Container>
        </Box>
    );
};

export default AppFooter;
