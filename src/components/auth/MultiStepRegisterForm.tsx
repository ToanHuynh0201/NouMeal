import {useState} from "react";
import {
    VStack,
    Text,
    Checkbox,
    Link,
    Select,
    HStack,
    FormControl,
    FormLabel,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagCloseButton,
    Box,
    Button,
    useToast,
} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import FormField from "../common/FormField";
import SubmitButton from "../common/SubmitButton";
import AlertMessage from "../common/AlertMessage";
import PasswordToggle from "../common/PasswordToggle";
import StepProgressBar from "./StepProgressBar";
import {FIELD_PRESETS} from "@/constants/forms";
import {ACTIVITY_LEVELS, HEALTH_GOALS, GENDERS, ALLERGIES} from "@/constants/profile";
import {useRegisterForm} from "@/hooks/useRegisterForm";

interface MultiStepRegisterFormProps {
    onSuccess: (email: string, name: string) => void;
    onSwitchToLogin?: () => void;
}

const STEPS = [
    {
        number: 1,
        title: "Account Info",
        description: "Create your account",
    },
    {
        number: 2,
        title: "Personal Info",
        description: "Tell us about yourself",
    },
    {
        number: 3,
        title: "Goals & Preferences",
        description: "Customize your experience",
    },
];

const MultiStepRegisterForm = ({onSuccess, onSwitchToLogin}: MultiStepRegisterFormProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const toast = useToast();

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
        trigger,
        getValues,
    } = useRegisterForm(onSuccess);

    const {showPassword, button: passwordToggleButton} = PasswordToggle();
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

    // Validate current step fields before moving to next step
    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: string[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = ["name", "email", "password", "confirmPassword"];
                break;
            case 2:
                fieldsToValidate = ["age", "height", "weight", "gender"];
                break;
            case 3:
                fieldsToValidate = ["goal", "activity", "agreeToTerms"];
                break;
        }

        const result = await trigger(fieldsToValidate as any);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateStep(currentStep);

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        } else {
            toast({
                title: "Please fix the errors",
                description: "Fill in all required fields correctly before proceeding.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <VStack spacing={5}>
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
                    </VStack>
                );

            case 2:
                return (
                    <VStack spacing={5}>
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

                            <FormControl isInvalid={hasError("gender")}>
                                <FormLabel
                                    htmlFor="gender"
                                    fontSize="md"
                                    fontWeight="semibold"
                                    color="gray.700"
                                >
                                    Gender
                                </FormLabel>
                                <Select id="gender" {...(register as any)("gender")} bg="gray.50">
                                    <option value="">Select</option>
                                    {GENDERS.map((g) => (
                                        <option key={g.value} value={g.value}>
                                            {g.label}
                                        </option>
                                    ))}
                                </Select>
                                {hasError("gender") && (
                                    <Text fontSize="sm" color="red.500">
                                        {getError("gender")}
                                    </Text>
                                )}
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} w="full">
                            <FormField
                                label="Height (cm)"
                                name="height"
                                type="number"
                                placeholder="e.g. 175"
                                register={register as any}
                                error={getError("height")}
                                isInvalid={hasError("height")}
                            />

                            <FormField
                                label="Weight (kg)"
                                name="weight"
                                type="number"
                                placeholder="e.g. 70"
                                register={register as any}
                                error={getError("weight")}
                                isInvalid={hasError("weight")}
                            />
                        </HStack>

                        <Box
                            p={4}
                            bg="blue.50"
                            borderRadius="lg"
                            w="full"
                            border="1px solid"
                            borderColor="blue.100"
                        >
                            <Text fontSize="sm" color="blue.700" textAlign="center">
                                💡 This information helps us create personalized meal plans for you
                            </Text>
                        </Box>
                    </VStack>
                );

            case 3:
                return (
                    <VStack spacing={5}>
                        <FormControl isInvalid={hasError("goal")}>
                            <FormLabel
                                htmlFor="goal"
                                fontSize="md"
                                fontWeight="semibold"
                                color="gray.700"
                            >
                                Health Goal
                            </FormLabel>
                            <Select id="goal" {...(register as any)("goal")} bg="gray.50">
                                <option value="">Select your goal</option>
                                {HEALTH_GOALS.map((g) => (
                                    <option key={g.value} value={g.value}>
                                        {g.label}
                                    </option>
                                ))}
                            </Select>
                            {hasError("goal") && (
                                <Text fontSize="sm" color="red.500">
                                    {getError("goal")}
                                </Text>
                            )}
                        </FormControl>

                        <FormControl isInvalid={hasError("activity")}>
                            <FormLabel
                                htmlFor="activity"
                                fontSize="md"
                                fontWeight="semibold"
                                color="gray.700"
                            >
                                Activity Level
                            </FormLabel>
                            <Select id="activity" {...(register as any)("activity")} bg="gray.50">
                                <option value="">Select activity level</option>
                                {ACTIVITY_LEVELS.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </Select>
                            {hasError("activity") && (
                                <Text fontSize="sm" color="red.500">
                                    {getError("activity")}
                                </Text>
                            )}
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                                Dietary Preferences (optional)
                            </FormLabel>
                            <Wrap spacing={3} shouldWrapChildren>
                                <WrapItem minW="140px">
                                    <Checkbox {...(register as any)("preferences")} value="vegetarian">
                                        Vegetarian
                                    </Checkbox>
                                </WrapItem>
                                <WrapItem minW="140px">
                                    <Checkbox {...(register as any)("preferences")} value="vegan">
                                        Vegan
                                    </Checkbox>
                                </WrapItem>
                                <WrapItem minW="140px">
                                    <Checkbox {...(register as any)("preferences")} value="pescatarian">
                                        Pescatarian
                                    </Checkbox>
                                </WrapItem>
                                <WrapItem minW="140px">
                                    <Checkbox {...(register as any)("preferences")} value="high_protein">
                                        High protein
                                    </Checkbox>
                                </WrapItem>
                            </Wrap>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="md" fontWeight="semibold" color="gray.700">
                                Allergies (optional)
                            </FormLabel>
                            <Select
                                bg="gray.50"
                                placeholder="Select an allergy to add"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value && !selectedAllergies.includes(value)) {
                                        const newAllergies = [...selectedAllergies, value];
                                        setSelectedAllergies(newAllergies);
                                        (setValue as any)("allergies", newAllergies);
                                    }
                                    e.target.value = "";
                                }}
                            >
                                {ALLERGIES.filter((a) => !selectedAllergies.includes(a.value)).map(
                                    (allergy) => (
                                        <option key={allergy.value} value={allergy.value}>
                                            {allergy.label}
                                        </option>
                                    )
                                )}
                            </Select>

                            {selectedAllergies.length > 0 && (
                                <Box mt={2}>
                                    <Wrap spacing={2}>
                                        {selectedAllergies.map((allergy) => {
                                            const allergyLabel =
                                                ALLERGIES.find((a) => a.value === allergy)?.label ||
                                                allergy;
                                            return (
                                                <WrapItem key={allergy}>
                                                    <Tag
                                                        size="md"
                                                        borderRadius="full"
                                                        variant="solid"
                                                        colorScheme="blue"
                                                    >
                                                        <TagLabel>{allergyLabel}</TagLabel>
                                                        <TagCloseButton
                                                            onClick={() => {
                                                                const newAllergies =
                                                                    selectedAllergies.filter(
                                                                        (a) => a !== allergy
                                                                    );
                                                                setSelectedAllergies(newAllergies);
                                                                (setValue as any)(
                                                                    "allergies",
                                                                    newAllergies
                                                                );
                                                            }}
                                                        />
                                                    </Tag>
                                                </WrapItem>
                                            );
                                        })}
                                    </Wrap>
                                </Box>
                            )}
                        </FormControl>

                        <VStack align="start" w="full" spacing={2}>
                            <Checkbox {...register("agreeToTerms")} colorScheme="blue" size="sm">
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
                    </VStack>
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
                <StepProgressBar currentStep={currentStep} steps={STEPS} />

                {error && (
                    <AlertMessage status="error" message={error} isClosable={false} />
                )}

                {renderStepContent()}

                {/* Navigation Buttons */}
                <HStack spacing={3} w="full" pt={2}>
                    {currentStep > 1 && (
                        <Button
                            leftIcon={<ChevronLeftIcon />}
                            variant="outline"
                            colorScheme="gray"
                            onClick={handleBack}
                            flex={1}
                        >
                            Back
                        </Button>
                    )}

                    {currentStep < STEPS.length ? (
                        <Button
                            rightIcon={<ChevronRightIcon />}
                            colorScheme="blue"
                            onClick={handleNext}
                            flex={1}
                        >
                            Next
                        </Button>
                    ) : (
                        <SubmitButton
                            isLoading={isLoading}
                            loadingText="Creating Account..."
                            isDisabled={!isValid}
                            flex={1}
                        >
                            Create Account
                        </SubmitButton>
                    )}
                </HStack>

                {onSwitchToLogin && currentStep === 1 && (
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
};

export default MultiStepRegisterForm;
