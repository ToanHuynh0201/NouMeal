import {animationPresets} from "@/styles/animation";
import type {AuthHeaderProps} from "@/types";
import {Box, Divider, Heading, Text, VStack} from "@chakra-ui/react";

const AuthHeader = ({
    title = "Meal Genie",
    subtitle = "What to eat? Let MealGenie decide.",
}: AuthHeaderProps) => {
    return (
        <VStack spacing={4} textAlign="center">
            <Box p={4} animation={animationPresets.pulse}>
                <img
                    src="/vite.svg"
                    alt="MealGenie Logo"
                    style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "contain",
                    }}
                />
            </Box>
            <Box>
                <Heading size="lg" color="gray.700" mb={2} fontWeight="bold">
                    {title}
                </Heading>
                <Text color="gray.500" fontSize="lg">
                    {subtitle}
                </Text>
            </Box>
            <Divider />
        </VStack>
    );
};

export default AuthHeader;
