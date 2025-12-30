import { Box, HStack, Text, VStack, Circle } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

interface Step {
	number: number;
	title: string;
	description: string;
}

interface StepProgressBarProps {
	currentStep: number;
	steps: Step[];
}

const StepProgressBar = ({ currentStep, steps }: StepProgressBarProps) => {
	return (
		<Box
			w="full"
			py={{ base: 2, md: 3 }}>
			<HStack
				spacing={0}
				justify="space-between"
				position="relative">
				{/* Progress Line */}
				<Box
					position="absolute"
					top={{ base: "18px", md: "20px" }}
					left="10%"
					right="10%"
					h={{ base: "2px", md: "3px" }}
					bg="gray.200"
					zIndex={0}
				/>
				<Box
					position="absolute"
					top={{ base: "18px", md: "20px" }}
					left="10%"
					h={{ base: "2px", md: "3px" }}
					bg="blue.500"
					zIndex={0}
					transition="width 0.3s ease"
					w={`calc(${
						((currentStep - 1) / (steps.length - 1)) * 80
					}%)`}
				/>

				{/* Steps */}
				{steps.map((step, index) => {
					const isCompleted = currentStep > step.number;
					const isCurrent = currentStep === step.number;
					const isUpcoming = currentStep < step.number;

					return (
						<VStack
							key={step.number}
							spacing={{ base: 2, md: 3 }}
							flex={1}
							position="relative"
							zIndex={1}>
							<Circle
								size={{ base: "36px", md: "44px" }}
								bg={
									isCompleted
										? "blue.500"
										: isCurrent
										? "blue.500"
										: "gray.200"
								}
								color="white"
								border={{ base: "4px solid", md: "5px solid" }}
								borderColor={
									isCompleted || isCurrent
										? "blue.100"
										: "white"
								}
								transition="all 0.3s ease"
								transform={
									isCurrent ? "scale(1.1)" : "scale(1)"
								}
								shadow={isCurrent ? "lg" : "none"}>
								{isCompleted ? (
									<CheckIcon boxSize={{ base: 3, md: 4 }} />
								) : (
									<Text
										fontSize={{ base: "sm", md: "md" }}
										fontWeight="bold">
										{step.number}
									</Text>
								)}
							</Circle>

							<VStack
								spacing={0}
								minH={{ base: "40px", md: "50px" }}>
								<Text
									fontSize={{ base: "xs", md: "sm" }}
									fontWeight={isCurrent ? "bold" : "semibold"}
									color={
										isCompleted || isCurrent
											? "blue.600"
											: "gray.500"
									}
									textAlign="center"
									transition="all 0.3s ease">
									{step.title}
								</Text>
								{isCurrent && (
									<Text
										fontSize={{ base: "2xs", md: "xs" }}
										color="gray.500"
										textAlign="center"
										mt={1}
										display={{ base: "none", sm: "block" }}>
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
