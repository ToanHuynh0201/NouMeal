import {
    VStack,
    Text,
    Checkbox,
    Link,
    Select,
    HStack,
    Input,
    FormControl,
    FormLabel,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import FormField from "../common/FormField";
import SubmitButton from "../common/SubmitButton";
import AlertMessage from "../common/AlertMessage";
import PasswordToggle from "../common/PasswordToggle";
import {FIELD_PRESETS} from "@/constants/forms";
import {useRegisterForm} from "@/hooks/useRegisterForm";

interface RegisterFormProps {
    onSuccess: () => void;
    onSwitchToLogin?: () => void;
}

function RegisterForm({onSuccess, onSwitchToLogin}: RegisterFormProps) {
    const {
        isLoading,
        isValid,
        hasFormErrors,
        error,
        register,
        handleSubmit,
        hasError,
        getError,
        setValue,
    } = useRegisterForm(onSuccess);

    const {showPassword, button: passwordToggleButton} = PasswordToggle();

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

                <FormField
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    register={register as any}
                    error={getError("name")}
                    isInvalid={hasError("name")}
                />

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
                    placeholder={FIELD_PRESETS.newPassword.placeholder}
                    autoComplete={FIELD_PRESETS.newPassword.autoComplete}
                    register={register as any}
                    error={getError("password")}
                    isInvalid={hasError("password")}
                    rightElement={passwordToggleButton}
                />

                <FormField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={FIELD_PRESETS.confirmPassword.placeholder}
                    autoComplete={FIELD_PRESETS.confirmPassword.autoComplete}
                    register={register as any}
                    error={getError("confirmPassword")}
                    isInvalid={hasError("confirmPassword")}
                    rightElement={passwordToggleButton}
                />

                <HStack spacing={4} w="full">
                    <FormField
                        label="Age"
                        name="age"
                        type="number"
                        placeholder="e.g. 25"
                        register={register as any}
                        error={getError("age")}
                        isInvalid={hasError("age")}
                    />

                    <FormField
                        label="Height (cm)"
                        name="height"
                        type="number"
                        placeholder="e.g. 175"
                        register={register as any}
                        error={getError("height")}
                        isInvalid={hasError("height")}
                    />
                </HStack>

                <HStack spacing={4} w="full">
                    <FormField
                        label="Weight (kg)"
                        name="weight"
                        type="number"
                        placeholder="e.g. 70"
                        register={register as any}
                        error={getError("weight")}
                        isInvalid={hasError("weight")}
                    />

                    <FormControl isInvalid={hasError("gender")}> 
                        <FormLabel htmlFor="gender" fontSize="md" fontWeight="semibold" color="gray.700">
                            Gender
                        </FormLabel>
                        <Select id="gender" {...(register as any)("gender")} bg="gray.50">
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Select>
                        {hasError("gender") && (
                            <Text fontSize="sm" color="red.500">{getError("gender")}</Text>
                        )}
                    </FormControl>
                </HStack>

                <FormControl isInvalid={hasError("goal")}> 
                    <FormLabel htmlFor="goal" fontSize="md" fontWeight="semibold" color="gray.700">
                        Goal
                    </FormLabel>
                    <Select id="goal" {...(register as any)("goal")} bg="gray.50">
                        <option value="">Select goal</option>
                        <option value="lose_weight">Lose weight</option>
                        <option value="maintain_weight">Maintain weight</option>
                        <option value="gain_weight">Gain weight</option>
                        <option value="build_muscle">Build muscle</option>
                        <option value="improve_health">Improve health</option>
                    </Select>
                    {hasError("goal") && (
                        <Text fontSize="sm" color="red.500">{getError("goal")}</Text>
                    )}
                </FormControl>

                <FormControl>
                    <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                        Preferences (choose any)
                    </FormLabel>
                    <Wrap spacing={3} shouldWrapChildren>
                        <WrapItem minW="140px">
                            <Checkbox {...(register as any)("preferences")} value="vegetarian">Vegetarian</Checkbox>
                        </WrapItem>
                        <WrapItem minW="140px">
                            <Checkbox {...(register as any)("preferences")} value="vegan">Vegan</Checkbox>
                        </WrapItem>
                        <WrapItem minW="140px">
                            <Checkbox {...(register as any)("preferences")} value="pescatarian">Pescatarian</Checkbox>
                        </WrapItem>
                        <WrapItem minW="140px">
                            <Checkbox {...(register as any)("preferences")} value="high_protein">High protein</Checkbox>
                        </WrapItem>
                    </Wrap>
                </FormControl>

                <FormControl>
                    <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                        Allergies (comma separated)
                    </FormLabel>
                    <Input
                        placeholder="e.g. nuts, shellfish"
                        bg="gray.50"
                        {...(register as any)("_allergies_input")}
                        onBlur={(e: any) => {
                            const raw = e.target.value || "";
                            const arr = raw
                                .split(",")
                                .map((s: string) => s.trim())
                                .filter((s: string) => s.length > 0);
                            setValue("allergies", arr);
                        }}
                    />
                    <Text fontSize="sm" color="gray.500">Tip: separate multiple allergies with commas</Text>
                </FormControl>

                <VStack align="start" w="full" spacing={2}>
                    <Checkbox
                        {...register("agreeToTerms")}
                        colorScheme="blue"
                        size="sm"
                    >
                        <Text fontSize="sm" color="gray.600">
                            I agree to the{" "}
                            <Link color="blue.500" href="#" fontWeight="medium">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link color="blue.500" href="#" fontWeight="medium">
                                Privacy Policy
                            </Link>
                        </Text>
                    </Checkbox>
                    {hasError("agreeToTerms") && (
                        <Text fontSize="sm" color="red.500">
                            {getError("agreeToTerms")}
                        </Text>
                    )}
                </VStack>

                {hasFormErrors && (
                    <AlertMessage
                        status="warning"
                        message="Please fix the form errors above to continue."
                        isClosable={false}
                    />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    loadingText="Creating Account..."
                    isDisabled={!isValid}
                >
                    Create Account
                </SubmitButton>

                {onSwitchToLogin && (
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                        Already have an account?{" "}
                        <Link
                            color="blue.500"
                            fontWeight="semibold"
                            onClick={onSwitchToLogin}
                            cursor="pointer"
                            _hover={{
                                color: "blue.600",
                                textDecoration: "underline",
                            }}
                        >
                            Sign in
                        </Link>
                    </Text>
                )}
            </VStack>
        </form>
    );
}

export default RegisterForm;
