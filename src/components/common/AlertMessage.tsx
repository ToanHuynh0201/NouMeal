import {animationPresets} from "@/styles/animation";
import type {AlertMessageProps} from "@/types";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    CloseButton,
} from "@chakra-ui/react";

const AlertMessage = ({
    status = "info",
    title,
    message,
    isClosable = true,
    onClose,
    variant = "subtle",
    size = "md",
}: AlertMessageProps) => {
    const getSizeProps = () => {
        switch (size) {
            case "sm":
                return {fontSize: "sm", p: 3};
            case "lg":
                return {fontSize: "lg", p: 6};
            default:
                return {fontSize: "md", p: 4};
        }
    };
    return (
        <Alert
            status={status}
            variant={variant}
            borderRadius="lg"
            animation={animationPresets.slideInLeft}
            position="relative"
            {...getSizeProps()}
        >
            <AlertIcon />

            <Box flex="1">
                {title && (
                    <AlertTitle fontWeight="bold" mb={title && message ? 1 : 0}>
                        {title}
                    </AlertTitle>
                )}
                {message && <AlertDescription>{message}</AlertDescription>}
            </Box>
            {isClosable && onClose && (
                <CloseButton
                    position="absolute"
                    right="8px"
                    top="8px"
                    onClick={onClose}
                    size="sm"
                />
            )}
        </Alert>
    );
};

export default AlertMessage;
