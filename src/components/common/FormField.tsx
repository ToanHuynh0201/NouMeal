import {transitions} from "@/styles/animation";
import type {FormFieldProps} from "@/types";
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
        focusBorderColor: "blue.500",
        borderRadius: "lg",
        bg: "gray.50",
        _hover: {bg: "white", borderColor: "blue.300"},
        _focus: {bg: "white", transform: "translateY(-1px)", shadow: "lg"},
        transition: transitions.normal,
        ...register(name),
        ...props,
    };

    return (
        <FormControl isInvalid={isInvalid}>
            <FormLabel
                htmlFor={name}
                fontSize="md"
                fontWeight="semibold"
                color="gray.700"
            >
                {label}
            </FormLabel>
            {rightElement ? (
                <InputGroup>
                    <Input {...baseInputProps} />
                    <InputRightElement width="3rem" height="full">
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
