import { transitions } from "@/styles/animation";
import type { FormFieldProps } from "@/types";
import {
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	FormErrorMessage,
} from "@chakra-ui/react";

/**
 * Reusable form field component with consistent styling
 */
const FormField = ({
	label,
	name,
	type = "text",
	placeholder,
	register,
	error,
	isInvalid,
	rightElement,
	size = "lg",
	...props
}: FormFieldProps) => {
	const baseInputProps = {
		id: name,
		type,
		placeholder,
		size,
		borderRadius: "lg",
		bg: "white",
		border: "2px solid",
		borderColor: "gray.200",
		_hover: {
			borderColor: "rgba(100, 181, 246, 0.5)",
			shadow: "sm",
		},
		_focus: {
			bg: "white",
			borderColor: "transparent",
			boxShadow:
				"0 0 0 2px rgba(100, 181, 246, 0.3), 0 0 0 4px rgba(236, 72, 153, 0.2)",
			transform: "translateY(-1px)",
		},
		transition: transitions.normal,
		...register(name),
		...props,
	};

	return (
		<FormControl isInvalid={isInvalid}>
			<FormLabel
				htmlFor={name}
				fontSize="md"
				fontWeight="600"
				bgGradient="linear(to-r, #64B5F6, #EC4899)"
				bgClip="text"
				mb={2}>
				{label}
			</FormLabel>
			{rightElement ? (
				<InputGroup>
					<Input {...baseInputProps} />
					<InputRightElement
						width="3rem"
						height="full">
						{rightElement}
					</InputRightElement>
				</InputGroup>
			) : (
				<Input {...baseInputProps} />
			)}
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	);
};

export default FormField;
