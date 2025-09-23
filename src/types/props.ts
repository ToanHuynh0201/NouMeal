import type {InputProps} from "@chakra-ui/react";
import type {ReactNode} from "react";
import type {UseFormRegister} from "react-hook-form";
export type MainLayoutProps = {
    children: ReactNode;
    showHeader: boolean;
    showFooter: boolean;
};

export type LoadingSpinnerProps = {
    size: string;
    message: string;
    minHeight: string;
    variant: string;
};

export interface FormFieldProps extends Omit<InputProps, "name"> {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<any>; // nếu muốn generic, có thể đổi <any> thành <TFieldValues>
    error?: string;
    isInvalid?: boolean;
    rightElement?: React.ReactNode;
    size?: string;
}
