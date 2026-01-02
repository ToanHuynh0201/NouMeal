import type { LoginPageProps } from "@/types";
import { Box, Card, CardBody, Text, VStack, Link } from "@chakra-ui/react";
import PasswordToggle from "../common/PasswordToggle";
import BackgroundDecoration from "../common/BackgroundDecoration";
import { animationPresets } from "@/styles/animation";
import AuthHeader from "./AuthHeader";
import AlertMessage from "../common/AlertMessage";
import FormField from "../common/FormField";
import { FIELD_PRESETS } from "@/constants/forms";
import SubmitButton from "../common/SubmitButton";
import { useLoginForm } from "@/hooks/useLoginForm";

interface LoginFormProps extends LoginPageProps {
	onOpenForgotPassword?: () => void;
}

const LoginForm = ({
	onLoginSuccess,
	onOpenRegister,
	onOpenForgotPassword,
}: LoginFormProps) => {
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
	const { showPassword, button: passwordToggleButton } = PasswordToggle();

	return (
		<Box
			minH="100vh"
			display="flex"
			alignItems="center"
			justifyContent="center"
			bgGradient="linear(135deg, #64B5F6 0%, #9C27B0 90%, #EC4899 100%)"
			px={4}
			position="relative"
			overflow="hidden">
			<BackgroundDecoration />

			<Card
				maxW="md"
				w="full"
				shadow="2xl"
				bg="rgba(255, 255, 255, 0.95)"
				backdropFilter="blur(20px)"
				borderRadius="2xl"
				border="1px"
				borderColor="rgba(255, 255, 255, 0.3)"
				position="relative"
				zIndex={1}
				animation={animationPresets.fadeIn}>
				<CardBody p={10}>
					<VStack
						spacing={8}
						align="stretch">
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
									placeholder={
										FIELD_PRESETS.password.placeholder
									}
									autoComplete={
										FIELD_PRESETS.password.autoComplete
									}
									register={register as any}
									error={getError("password")}
									isInvalid={hasError("password")}
									rightElement={passwordToggleButton}
								/>

								{onOpenForgotPassword && (
									<Box
										textAlign="right"
										w="full"
										mt={-2}>
										<Link
											fontSize="sm"
											bgGradient="linear(to-r, #64B5F6, #EC4899)"
											bgClip="text"
											fontWeight="600"
											onClick={onOpenForgotPassword}
											cursor="pointer"
											_hover={{
												bgGradient:
													"linear(to-r, #42A5F5, #E91E63)",
												textDecoration: "underline",
											}}>
											Forgot password?
										</Link>
									</Box>
								)}

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
									isDisabled={!isValid}>
									Sign In
								</SubmitButton>
							</VStack>
						</form>

						{/* Sign Up Link */}
						<Box textAlign="center">
							<Text
								fontSize="sm"
								color="gray.600">
								Don't have an account?{" "}
								<Link
									bgGradient="linear(to-r, #64B5F6, #EC4899)"
									bgClip="text"
									fontWeight="semibold"
									onClick={onOpenRegister}
									cursor="pointer"
									_hover={{
										bgGradient:
											"linear(to-r, #42A5F5, #E91E63)",
										textDecoration: "underline",
									}}>
									Sign up
								</Link>
							</Text>
						</Box>

						<Box
							textAlign="center"
							mt={2}>
							<Text
								fontSize="xs"
								color="gray.500">
								Secure authentication powered by NouMeal
							</Text>
						</Box>
					</VStack>
				</CardBody>
			</Card>
		</Box>
	);
};

export default LoginForm;
