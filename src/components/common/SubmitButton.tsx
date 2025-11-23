import { transitions } from "@/styles/animation";
import type { SubmitButtonProps } from "@/types";
import { Button } from "@chakra-ui/react";
const SubmitButton = ({
	children = "Submit",
	isLoading = false,
	isDisabled = false,
	loadingText = "Processing...",
	size = "lg",
	...props
}: SubmitButtonProps) => {
	return (
		<Button
			type="submit"
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
			bgGradient="linear(to-r, #64B5F6, #EC4899)"
			color="white"
			border="none"
			shadow="lg"
			_hover={{
				bgGradient: "linear(to-r, #42A5F5, #E91E63)",
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
			{...props}>
			{children}
		</Button>
	);
};

export default SubmitButton;
