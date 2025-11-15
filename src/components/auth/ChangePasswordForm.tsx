import {VStack, Text, Box} from "@chakra-ui/react";
import PasswordToggle from "../common/PasswordToggle";
import AlertMessage from "../common/AlertMessage";
import FormField from "../common/FormField";
import SubmitButton from "../common/SubmitButton";
import {useChangePasswordForm} from "@/hooks/useChangePasswordForm";

interface ChangePasswordFormProps {
    onSuccess: () => void;
}

const ChangePasswordForm = ({onSuccess}: ChangePasswordFormProps) => {
    const {
        isLoading,
        isValid,
        hasFormErrors,
        error,
        register,
        handleSubmit,
        hasError,
        getError,
    } = useChangePasswordForm(onSuccess);

    // Create separate password toggle instances for each field
    const currentPasswordToggle = PasswordToggle();
    const newPasswordToggle = PasswordToggle();
    const confirmPasswordToggle = PasswordToggle();

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
                {error && (
                    <AlertMessage
                        status="error"
                        message={error}
                        isClosable={false}
                    />
                )}

                <Box w="full">
                    <Text fontSize="sm" color="gray.600" mb={4}>
                        Please enter your current password and choose a new password
                        to secure your account.
                    </Text>
                </Box>

                <FormField
                    label="Current Password"
                    name="currentPassword"
                    type={currentPasswordToggle.showPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    register={register as any}
                    error={getError("currentPassword")}
                    isInvalid={hasError("currentPassword")}
                    rightElement={currentPasswordToggle.button}
                />

                <FormField
                    label="New Password"
                    name="newPassword"
                    type={newPasswordToggle.showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    register={register as any}
                    error={getError("newPassword")}
                    isInvalid={hasError("newPassword")}
                    rightElement={newPasswordToggle.button}
                />

                <FormField
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type={confirmPasswordToggle.showPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    register={register as any}
                    error={getError("confirmNewPassword")}
                    isInvalid={hasError("confirmNewPassword")}
                    rightElement={confirmPasswordToggle.button}
                />

                {hasFormErrors && (
                    <AlertMessage
                        status="warning"
                        message="Please fix the form errors above to continue."
                        isClosable={false}
                    />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    loadingText="Changing Password..."
                    isDisabled={!isValid}
                >
                    Change Password
                </SubmitButton>

                <Box textAlign="center" w="full">
                    <Text fontSize="xs" color="gray.500">
                        You will be logged out after changing your password
                    </Text>
                </Box>
            </VStack>
        </form>
    );
};

export default ChangePasswordForm;
