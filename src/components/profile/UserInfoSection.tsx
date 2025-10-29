import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Input,
    Select,
    SimpleGrid,
    Tag,
    TagCloseButton,
    TagLabel,
    Text,
    VStack,
    Wrap,
    WrapItem,
    Avatar,
    HStack,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    IconButton,
    useToast,
} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";
import {useState, useEffect} from "react";
import {useAuth} from "@/hooks/useAuth";
import {userService} from "@/services/userService";
import {HEALTH_GOALS} from "@/constants/profile";
import {calculateBMI, calculateBMR} from "@/mocks/profileData";
import {animationPresets} from "@/styles/animation";

const UserInfoSection = () => {
    const {user, updateUser} = useAuth();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        name: "",
        email: "",
        age: 0,
        gender: "",
        height: 0,
        weight: 0,
        goal: "",
        preferences: [] as string[],
        allergies: [] as string[],
    });

    // Initialize editedData when user data changes
    useEffect(() => {
        if (user) {
            setEditedData({
                name: user.name || "",
                email: user.email || "",
                age: user.age || 0,
                gender: user.gender || "",
                height: user.height || 0,
                weight: user.weight || 0,
                goal: user.goal || "",
                preferences: user.preferences || [],
                allergies: user.allergies || [],
            });
        }
    }, [user]);

    if (!user) {
        return (
            <Card>
                <CardBody>
                    <Text>Loading user data...</Text>
                </CardBody>
            </Card>
        );
    }

    const bmi = user.height && user.weight ? calculateBMI(user.weight, user.height) : 0;
    const bmr =
        user.height && user.weight && user.age && user.gender
            ? calculateBMR(user.weight, user.height, user.age, user.gender)
            : 0;

    const getBMIStatus = (bmi: number) => {
        if (bmi < 18.5) return {label: "Underweight", color: "blue"};
        if (bmi < 25) return {label: "Normal", color: "green"};
        if (bmi < 30) return {label: "Overweight", color: "yellow"};
        return {label: "Obese", color: "red"};
    };

    const handleSave = async () => {
        try {
            setIsEditing(false); // Close edit mode immediately for better UX
            
            // Prepare update payload
            const updatePayload = {
                name: editedData.name,
                age: editedData.age,
                gender: editedData.gender as "male" | "female" | "other",
                height: editedData.height,
                weight: editedData.weight,
                goal: editedData.goal as any,
                preferences: editedData.preferences,
                allergies: editedData.allergies,
            };

            // Call API to update profile
            const result = await userService.updateProfile(updatePayload);

            if (result.success) {
                toast({
                    title: "Profile Updated",
                    description: result.message || "Your profile has been updated successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });

                // Update user in AuthContext
                if (result.data?.user) {
                    updateUser(result.data.user);
                } else {
                    // If no user data in response, update with edited data
                    updateUser({
                        ...user,
                        ...updatePayload,
                    });
                }
            } else {
                // Revert to original data on failure
                if (user) {
                    setEditedData({
                        name: user.name || "",
                        email: user.email || "",
                        age: user.age || 0,
                        gender: user.gender || "",
                        height: user.height || 0,
                        weight: user.weight || 0,
                        goal: user.goal || "",
                        preferences: user.preferences || [],
                        allergies: user.allergies || [],
                    });
                }

                toast({
                    title: "Update Failed",
                    description: result.error || "Failed to update profile. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            }
        } catch (error: any) {
            // Revert to original data on error
            if (user) {
                setEditedData({
                    name: user.name || "",
                    email: user.email || "",
                    age: user.age || 0,
                    gender: user.gender || "",
                    height: user.height || 0,
                    weight: user.weight || 0,
                    goal: user.goal || "",
                    preferences: user.preferences || [],
                    allergies: user.allergies || [],
                });
            }

            toast({
                title: "Update Failed",
                description: error?.message || "An error occurred while updating profile.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const handleCancel = () => {
        // Reset to original user data
        if (user) {
            setEditedData({
                name: user.name || "",
                email: user.email || "",
                age: user.age || 0,
                gender: user.gender || "",
                height: user.height || 0,
                weight: user.weight || 0,
                goal: user.goal || "",
                preferences: user.preferences || [],
                allergies: user.allergies || [],
            });
        }
        setIsEditing(false);
    };

    const addAllergen = (allergen: string) => {
        if (!editedData.allergies.includes(allergen)) {
            setEditedData({
                ...editedData,
                allergies: [...editedData.allergies, allergen],
            });
        }
    };

    const removeAllergen = (allergen: string) => {
        setEditedData({
            ...editedData,
            allergies: editedData.allergies.filter((a) => a !== allergen),
        });
    };

    const togglePreference = (preference: string) => {
        if (editedData.preferences.includes(preference)) {
            setEditedData({
                ...editedData,
                preferences: editedData.preferences.filter((p) => p !== preference),
            });
        } else {
            setEditedData({
                ...editedData,
                preferences: [...editedData.preferences, preference],
            });
        }
    };

    const bmiStatus = getBMIStatus(bmi);

    // Format goal label
    const getGoalLabel = (goal: string) => {
        const goalMap: Record<string, string> = {
            lose_weight: "Lose Weight",
            maintain_weight: "Maintain Weight",
            gain_weight: "Gain Weight",
            build_muscle: "Build Muscle",
            improve_health: "Improve Health",
        };
        return goalMap[goal] || goal;
    };

    // Get display data based on edit mode
    const displayData = isEditing ? editedData : {
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
        preferences: user.preferences || [],
        allergies: user.allergies || [],
    };

    return (
        <VStack spacing={6} align="stretch">
            {/* Profile Header Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardBody>
                    <HStack spacing={6} align="start">
                        <Avatar
                            size="2xl"
                            name={displayData.name}
                            bg="brand.500"
                            color="white"
                        />
                        <VStack align="start" spacing={2} flex={1}>
                            <HStack justify="space-between" w="full">
                                <Heading size="lg">{displayData.name}</Heading>
                                <IconButton
                                    aria-label="Edit profile"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => setIsEditing(!isEditing)}
                                />
                            </HStack>
                            <Text color="gray.600">{displayData.email}</Text>
                            <HStack spacing={2} mt={2}>
                                {displayData.goal && (
                                    <Tag colorScheme="purple" size="sm">
                                        {getGoalLabel(displayData.goal)}
                                    </Tag>
                                )}
                                <Tag colorScheme="green" size="sm">
                                    {displayData.age} years
                                </Tag>
                            </HStack>
                        </VStack>
                    </HStack>
                </CardBody>
            </Card>

            {/* Health Stats Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader>
                    <Heading size="md">Health Statistics</Heading>
                </CardHeader>
                <CardBody>
                    <SimpleGrid columns={{base: 1, md: 2, lg: 4}} spacing={6}>
                        <Stat>
                            <StatLabel>Current Weight</StatLabel>
                            <StatNumber>{displayData.weight} kg</StatNumber>
                            <StatHelpText>
                                {displayData.gender === "male" ? "Male" : displayData.gender === "female" ? "Female" : "Other"}
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>BMI</StatLabel>
                            <StatNumber>{bmi.toFixed(1)}</StatNumber>
                            <StatHelpText>
                                <Tag colorScheme={bmiStatus.color} size="sm">
                                    {bmiStatus.label}
                                </Tag>
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Height</StatLabel>
                            <StatNumber>{displayData.height} cm</StatNumber>
                            <StatHelpText>Age: {displayData.age} years</StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>BMR</StatLabel>
                            <StatNumber>{Math.round(bmr)}</StatNumber>
                            <StatHelpText>calories/day</StatHelpText>
                        </Stat>
                    </SimpleGrid>
                </CardBody>
            </Card>

            {/* Personal Information Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader>
                    <Heading size="md">Personal Information</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Grid
                        templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}}
                        gap={4}
                    >
                        <GridItem>
                            <FormControl>
                                <FormLabel>Full Name</FormLabel>
                                <Input
                                    value={displayData.name}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            name: e.target.value,
                                        })
                                    }
                                    isReadOnly={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    value={displayData.email}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            email: e.target.value,
                                        })
                                    }
                                    isReadOnly={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel>Age</FormLabel>
                                <Input
                                    type="number"
                                    value={displayData.age}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            age: Number(e.target.value),
                                        })
                                    }
                                    isReadOnly={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                    value={displayData.gender}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            gender: e.target.value,
                                        })
                                    }
                                    isDisabled={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Select>
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel>Height (cm)</FormLabel>
                                <Input
                                    type="number"
                                    value={displayData.height}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            height: Number(e.target.value),
                                        })
                                    }
                                    isReadOnly={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel>Current Weight (kg)</FormLabel>
                                <Input
                                    type="number"
                                    value={displayData.weight}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            weight: Number(e.target.value),
                                        })
                                    }
                                    isReadOnly={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                />
                            </FormControl>
                        </GridItem>
                    </Grid>

                    {isEditing && (
                        <HStack spacing={4} mt={6} justify="flex-end">
                            <Button variant="ghost" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </HStack>
                    )}
                </CardBody>
            </Card>

            {/* Health & Fitness Goals Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader>
                    <Heading size="md">Health & Fitness Goal</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>Current Goal</FormLabel>
                            <Select
                                value={displayData.goal}
                                onChange={(e) =>
                                    setEditedData({
                                        ...editedData,
                                        goal: e.target.value,
                                    })
                                }
                                isDisabled={!isEditing}
                                bg={isEditing ? "white" : "gray.50"}
                            >
                                {HEALTH_GOALS.map((goal) => (
                                    <option key={goal.value} value={goal.value}>
                                        {goal.icon} {goal.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </VStack>
                </CardBody>
            </Card>

            {/* Dietary Preferences Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader>
                    <Heading size="md">Dietary Preferences & Allergens</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <VStack spacing={6} align="stretch">
                        <Box>
                            <FormLabel>Dietary Preferences</FormLabel>
                            <Wrap spacing={2}>
                                {displayData.preferences && displayData.preferences.length > 0 ? (
                                    displayData.preferences.map((pref: string) => (
                                        <WrapItem key={pref}>
                                            <Tag
                                                size="md"
                                                variant="solid"
                                                colorScheme="green"
                                            >
                                                <TagLabel>{pref}</TagLabel>
                                                {isEditing && (
                                                    <TagCloseButton
                                                        onClick={() => togglePreference(pref)}
                                                    />
                                                )}
                                            </Tag>
                                        </WrapItem>
                                    ))
                                ) : (
                                    <Text color="gray.500" fontSize="sm">
                                        No dietary preferences set
                                    </Text>
                                )}
                            </Wrap>
                            {isEditing && (
                                <Input
                                    placeholder="Type a preference and press Enter"
                                    mt={3}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                            const value = e.currentTarget.value.trim();
                                            if (!editedData.preferences.includes(value)) {
                                                setEditedData({
                                                    ...editedData,
                                                    preferences: [...editedData.preferences, value],
                                                });
                                            }
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                            )}
                        </Box>

                        <Box>
                            <FormLabel>Allergens</FormLabel>
                            <Wrap spacing={2}>
                                {displayData.allergies && displayData.allergies.length > 0 ? (
                                    displayData.allergies.map((allergen: string) => (
                                        <WrapItem key={allergen}>
                                            <Tag
                                                size="md"
                                                colorScheme="red"
                                                variant="solid"
                                            >
                                                <TagLabel>{allergen}</TagLabel>
                                                {isEditing && (
                                                    <TagCloseButton
                                                        onClick={() => removeAllergen(allergen)}
                                                    />
                                                )}
                                            </Tag>
                                        </WrapItem>
                                    ))
                                ) : (
                                    <Text color="gray.500" fontSize="sm">
                                        No allergens reported
                                    </Text>
                                )}
                            </Wrap>
                            {isEditing && (
                                <Input
                                    placeholder="Type an allergen and press Enter"
                                    mt={3}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                            addAllergen(e.currentTarget.value.trim());
                                            e.currentTarget.value = "";
                                        }
                                    }}
                                />
                            )}
                        </Box>
                    </VStack>
                </CardBody>
            </Card>
        </VStack>
    );
};

export default UserInfoSection;
