import {useThemeValues} from "@/styles/themeUtils";
import type {LoginPageProps} from "@/types";
import {Box, Card, CardBody, Text, VStack} from "@chakra-ui/react";
import PasswordToggle from "../common/PasswordToggle";
import BackgroundDecoration from "../common/BackgroundDecoration";
import {animationPresets} from "@/styles/animation";
import AuthHeader from "./AuthHeader";
import AlertMessage from "../common/AlertMessage";
import FormField from "../common/FormField";
import {FIELD_PRESETS} from "@/constants/forms";
import SubmitButton from "../common/SubmitButton";
import {useLoginForm} from "@/hooks/useLoginForm";

function LoginForm({onLoginSuccess}: LoginPageProps) {
    const {
        isLoading,
        isValid,
        hasFormErrors,
        error,
        register,
        handleSubmit,
        hasError,
        getError,
    } = useLoginForm(onLoginSuccess);
    const {mainBgGradient: bgGradient, cardBg, cardShadow} = useThemeValues();
    const {showPassword, button: passwordToggleButton} = PasswordToggle();
    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgGradient={bgGradient}
            px={4}
            position="relative"
            overflow="hidden"
        >
            <BackgroundDecoration />

            <Card
                maxW="md"
                w="full"
                shadow={cardShadow}
                bg={cardBg}
                borderRadius="2xl"
                border="1px"
                borderColor="gray.200"
                position="relative"
                zIndex={1}
                animation={animationPresets.fadeIn}
            >
                <CardBody p={10}>
                    <VStack spacing={8} align="stretch">
                        <AuthHeader />

                        {error && (
                            <AlertMessage
                                status="error"
                                message={error}
                                isClosable={false}
                            />
                        )}

                        <form onSubmit={handleSubmit}>
                            <VStack spacing={6}>
                                <FormField
                                    label="Email Address"
                                    name="email"
                                    {...FIELD_PRESETS.email}
                                    register={register as any}
                                    error={getError("email")}
                                    isInvalid={hasError("email")}
                                />

                                <FormField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={FIELD_PRESETS.password.placeholder}
                                    autoComplete={
                                        FIELD_PRESETS.password.autoComplete
                                    }
                                    register={register as any}
                                    error={getError("password")}
                                    isInvalid={hasError("password")}
                                    rightElement={passwordToggleButton}
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
                                    loadingText="Authenticating..."
                                    isDisabled={!isValid}
                                >
                                    Sign In
                                </SubmitButton>
                            </VStack>
                        </form>

                        <Box textAlign="center" mt={6}>
                            <Text fontSize="xs" color="gray.500">
                                Secure authentication powered by MealGenie
                            </Text>
                        </Box>
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
}

export default LoginForm;
