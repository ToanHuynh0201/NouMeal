import {transitions} from "@/styles/animation";
import type {SubmitButtonProps} from "@/types";
import {Button} from "@chakra-ui/react";
const SubmitButton = ({
    children = "Submit",
    isLoading = false,
    isDisabled = false,
    loadingText = "Processing...",
    size = "lg",
    colorScheme = "blue",
    ...props
}: SubmitButtonProps) => {
    return (
        <Button
            type="submit"
            colorScheme={colorScheme}
            size={size}
            w="full"
            isLoading={isLoading}
            loadingText={loadingText}
            isDisabled={isDisabled}
            mt={6}
            borderRadius="lg"
            fontWeight="bold"
            fontSize="md"
            py={6}
            bgGradient={`linear(to-r, ${colorScheme}.500, ${colorScheme}.600)`}
            _hover={{
                bgGradient: `linear(to-r, ${colorScheme}.600, ${colorScheme}.700)`,
                transform: "translateY(-2px)",
                shadow: "xl",
            }}
            _active={{
                transform: "translateY(0)",
                shadow: "lg",
            }}
            _disabled={{
                opacity: 0.6,
                cursor: "not-allowed",
                transform: "none",
                _hover: {
                    transform: "none",
                },
            }}
            transition={transitions.normal}
            {...props}
        >
            {children}
        </Button>
    );
};

export default SubmitButton;
