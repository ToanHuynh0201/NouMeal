import {animationPresets} from "@/styles/animation";
import {useThemeGradients} from "@/styles/themeUtils";
import type {LoadingSpinnerProps} from "@/types";
import {Box, Center, Spinner, Text, VStack} from "@chakra-ui/react";

export default function LoadingSpinner({
    size = "xl",
    message = "Loading...",
    minHeight = "200px",
    variant = "default",
}: LoadingSpinnerProps) {
    const {subtleBgGradient: bgGradient} = useThemeGradients();

    const getSpinnerColor = () => {
        switch (variant) {
            case "primary":
                return "blue.500";
            case "success":
                return "green.500";
            case "warning":
                return "orange.500";
            case "error":
                return "red.500";
            default:
                return "blue.500";
        }
    };

    return (
        <Center
            minH={minHeight}
            bgGradient={bgGradient}
            animation={animationPresets.fadeIn}
        >
            <VStack spacing={6} textAlign="center">
                <Box
                    p={6}
                    bg={getSpinnerColor()}
                    borderRadius="full"
                    color="white"
                    shadow="xl"
                    animation={animationPresets.pulse}
                >
                    <Spinner size={size} thickness="4px" speed="0.8s" />
                </Box>
                {message && (
                    <VStack spacing={2}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.700">
                            {message}
                        </Text>
                    </VStack>
                )}
            </VStack>
        </Center>
    );
}
