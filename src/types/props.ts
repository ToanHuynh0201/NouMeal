import type {InputProps} from "@chakra-ui/react";
import type {ReactNode} from "react";
import type {FieldValues, UseFormRegister} from "react-hook-form";

export type MainLayoutProps = {
    children: ReactNode;
    showHeader: boolean;
    showFooter: boolean;
};

export type LoginPageProps = {
    onLoginSuccess: () => void;
    onOpenRegister?: any;
};

export type AlertMessageProps = {
    status: "error" | "warning" | "info" | "success" | "loading" | undefined;
    title?: string;
    message: string;
    isClosable: boolean;
    onClose?: () => void;
    variant?: string;
    size?: string;
};

export type SubmitButtonProps = {
    children?: React.ReactNode;
    isLoading?: boolean;
    isDisabled?: boolean;
    loadingText?: string;
    size?: "sm" | "md" | "lg" | "xl";
    colorScheme?: "blue" | "red" | "green" | "gray" | "purple" | "pink" | "yellow";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type AuthHeaderProps = {
    title?: string;
    subtitle?: string;
};

export type LoadingSpinnerProps = {
    size?: string;
    message: string;
    minHeight: string;
    variant: string;
};

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<InputProps, "name"> {
    label: string;
    name: string;
    register: UseFormRegister<TFieldValues>;
    error?: string;
    isInvalid?: boolean;
    rightElement?: React.ReactNode;
}
