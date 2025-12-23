import {Box, HStack, Text, VStack, Circle} from "@chakra-ui/react";
import {CheckIcon} from "@chakra-ui/icons";

interface Step {
    number: number;
    title: string;
    description: string;
}

interface StepProgressBarProps {
    currentStep: number;
    steps: Step[];
}

const StepProgressBar = ({currentStep, steps}: StepProgressBarProps) => {
    return (
        <Box w="full" py={4}>
            <HStack spacing={0} justify="space-between" position="relative">
                {/* Progress Line */}
                <Box
                    position="absolute"
                    top="16px"
                    left="0"
                    right="0"
                    h="2px"
                    bg="gray.200"
                    zIndex={0}
                    mx="32px"
                />
                <Box
                    position="absolute"
                    top="16px"
                    left="0"
                    h="2px"
                    bg="blue.500"
                    zIndex={0}
                    mx="32px"
                    transition="width 0.3s ease"
                    w={`calc(${((currentStep - 1) / (steps.length - 1)) * 100}%)`}
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;
                    const isUpcoming = currentStep < step.number;

                    return (
                        <VStack
                            key={step.number}
                            spacing={2}
                            flex={1}
                            position="relative"
                            zIndex={1}
                        >
                            <Circle
                                size="32px"
                                bg={
                                    isCompleted
                                        ? "blue.500"
                                        : isCurrent
                                        ? "blue.500"
                                        : "gray.200"
                                }
                                color="white"
                                border="4px solid"
                                borderColor={
                                    isCompleted || isCurrent ? "blue.100" : "white"
                                }
                                transition="all 0.3s ease"
                                transform={isCurrent ? "scale(1.1)" : "scale(1)"}
                                shadow={isCurrent ? "md" : "none"}
                            >
                                {isCompleted ? (
                                    <CheckIcon boxSize={3} />
                                ) : (
                                    <Text fontSize="sm" fontWeight="bold">
                                        {step.number}
                                    </Text>
                                )}
                            </Circle>

                            <VStack spacing={0} minH="40px">
                                <Text
                                    fontSize="xs"
                                    fontWeight={isCurrent ? "bold" : "semibold"}
                                    color={
                                        isCompleted || isCurrent
                                            ? "blue.600"
                                            : "gray.500"
                                    }
                                    textAlign="center"
                                    transition="all 0.3s ease"
                                >
                                    {step.title}
                                </Text>
                                {isCurrent && (
                                    <Text
                                        fontSize="2xs"
                                        color="gray.500"
                                        textAlign="center"
                                        mt={1}
                                    >
                                        {step.description}
                                    </Text>
                                )}
                            </VStack>
                        </VStack>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default StepProgressBar;
