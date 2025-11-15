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
    useToast,
    Fade,
    IconButton,
    Tooltip,
    SlideFade,
} from "@chakra-ui/react";
import {EditIcon, CheckIcon, CloseIcon} from "@chakra-ui/icons";
import {useState, useEffect, useRef} from "react";
import {useAuth} from "@/hooks/useAuth";
import {userService} from "@/services/userService";
import {HEALTH_GOALS, DIETARY_PREFERENCES, ALLERGIES, ACTIVITY_LEVELS} from "@/constants/profile";
import {calculateBMI, calculateBMR} from "@/mocks/profileData";
import {animationPresets} from "@/styles/animation";

const UserInfoSection = () => {
    const {user, updateUser} = useAuth();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [showFloatingButtons, setShowFloatingButtons] = useState(false);
    const buttonHeaderRef = useRef<HTMLDivElement>(null);
    const [editedData, setEditedData] = useState({
        name: "",
        email: "",
        age: 0,
        gender: "",
        height: 0,
        weight: 0,
        goal: "",
        activity: "",
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
                activity: user.activity || "",
                preferences: user.preferences || [],
                allergies: user.allergies || [],
            });
        }
    }, [user]);

    // Scroll detection for floating buttons
    useEffect(() => {
        const handleScroll = () => {
            if (buttonHeaderRef.current) {
                const rect = buttonHeaderRef.current.getBoundingClientRect();
                // Show floating button when header buttons are out of view
                setShowFloatingButtons(rect.bottom < 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                activity: editedData.activity as any,
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
                        activity: user.activity || "",
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
                    activity: user.activity || "",
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
                activity: user.activity || "",
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
        activity: user.activity,
        preferences: user.preferences || [],
        allergies: user.allergies || [],
    };

    return (
        <VStack spacing={8} align="stretch">
            {/* Edit/Save Buttons */}
            <HStack ref={buttonHeaderRef} justify="space-between" align="center">
                <Heading size="lg">My Profile</Heading>
                <Box position="relative" minW="200px" h="48px">
                    <SlideFade
                        in={!isEditing}
                        offsetY="-20px"
                        unmountOnExit
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    >
                        <Button
                            leftIcon={<EditIcon />}
                            colorScheme="blue"
                            onClick={() => setIsEditing(true)}
                            size="lg"
                            fontSize="md"
                        >
                            Edit Profile
                        </Button>
                    </SlideFade>
                    <SlideFade
                        in={isEditing}
                        offsetY="-20px"
                        unmountOnExit
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    >
                        <HStack spacing={4}>
                            <Button 
                                size="lg" 
                                fontSize="md"
                                variant="outline" 
                                onClick={handleCancel}
                                minW="120px"
                            >
                                Cancel
                            </Button>
                            <Button 
                                size="lg" 
                                fontSize="md"
                                colorScheme="blue" 
                                onClick={handleSave}
                                minW="150px"
                            >
                                Save Changes
                            </Button>
                        </HStack>
                    </SlideFade>
                </Box>
            </HStack>

            {/* Profile Header Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardBody p={8}>
                    <HStack spacing={6} align="start">
                        <Avatar
                            size="2xl"
                            name={displayData.name}
                            bg="brand.500"
                            color="white"
                        />
                        <VStack align="start" spacing={3} flex={1}>
                            <Heading size="lg">{displayData.name}</Heading>
                            <Text fontSize="md" color="gray.600">{displayData.email}</Text>
                            <HStack spacing={3} mt={2} flexWrap="wrap">
                                {displayData.goal && (
                                    <Tag colorScheme="purple" size="lg" fontSize="sm">
                                        {getGoalLabel(displayData.goal)}
                                    </Tag>
                                )}
                                <Tag colorScheme="green" size="lg" fontSize="sm">
                                    {displayData.age} years old
                                </Tag>
                            </HStack>
                        </VStack>
                    </HStack>
                </CardBody>
            </Card>

            {/* Health Stats Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader pb={2}>
                    <Heading size="md">Health Statistics</Heading>
                </CardHeader>
                <CardBody pt={4}>
                    <SimpleGrid columns={{base: 1, sm: 2, lg: 4}} spacing={8}>
                        <Stat>
                            <StatLabel fontSize="md" mb={2}>Current Weight</StatLabel>
                            <StatNumber fontSize="3xl">{displayData.weight} kg</StatNumber>
                            <StatHelpText fontSize="md" mt={2}>
                                {displayData.gender === "male" ? "Male" : displayData.gender === "female" ? "Female" : "Other"}
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel fontSize="md" mb={2}>BMI</StatLabel>
                            <StatNumber fontSize="3xl">{bmi.toFixed(1)}</StatNumber>
                            <StatHelpText mt={2}>
                                <Tag colorScheme={bmiStatus.color} size="md" fontSize="sm">
                                    {bmiStatus.label}
                                </Tag>
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel fontSize="md" mb={2}>Height</StatLabel>
                            <StatNumber fontSize="3xl">{displayData.height} cm</StatNumber>
                            <StatHelpText fontSize="md" mt={2}>Age: {displayData.age} years</StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel fontSize="md" mb={2}>BMR</StatLabel>
                            <StatNumber fontSize="3xl">{Math.round(bmr)}</StatNumber>
                            <StatHelpText fontSize="md" mt={2}>calories/day</StatHelpText>
                        </Stat>
                    </SimpleGrid>
                </CardBody>
            </Card>

            {/* Personal Information Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader pb={2}>
                    <Heading size="md">Personal Information</Heading>
                </CardHeader>
                <Divider />
                <CardBody pt={6}>
                    <Grid
                        templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}}
                        gap={6}
                    >
                        <GridItem>
                            <FormControl>
                                <FormLabel fontSize="md" fontWeight="semibold" mb={3}>Full Name</FormLabel>
                                <Input
                                    size="lg"
                                    fontSize="md"
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
                                <FormLabel fontSize="md" fontWeight="semibold" mb={3}>Email</FormLabel>
                                <Input
                                    size="lg"
                                    fontSize="md"
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
                                <FormLabel fontSize="md" fontWeight="semibold" mb={3}>Age (years)</FormLabel>
                                <Input
                                    size="lg"
                                    fontSize="md"
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
                                <FormLabel fontSize="md" fontWeight="semibold" mb={3}>Gender</FormLabel>
                                <Select
                                    size="lg"
                                    fontSize="md"
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
                                <FormLabel fontSize="md" fontWeight="semibold" mb={3}>Height (cm)</FormLabel>
                                <Input
                                    size="lg"
                                    fontSize="md"
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
                                <FormLabel fontSize="md" fontWeight="semibold" mb={3}>Current Weight (kg)</FormLabel>
                                <Input
                                    size="lg"
                                    fontSize="md"
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
                </CardBody>
            </Card>

            {/* Health & Fitness Goals Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader pb={2}>
                    <Heading size="md">Health & Fitness Goal</Heading>
                </CardHeader>
                <Divider />
                <CardBody pt={6}>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel fontSize="md" fontWeight="semibold" mb={3}>What is your main goal?</FormLabel>
                            <Select
                                size="lg"
                                fontSize="md"
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

            {/* Activity Level Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader pb={2}>
                    <Heading size="md">Activity Level</Heading>
                </CardHeader>
                <Divider />
                <CardBody pt={6}>
                    <VStack spacing={5} align="stretch">
                        <FormControl>
                            <FormLabel fontSize="md" fontWeight="semibold" mb={3}>How active are you?</FormLabel>
                            {isEditing ? (
                                <VStack align="stretch" spacing={4}>
                                    <Text fontSize="sm" color="gray.600">
                                        Click on your typical daily activity level:
                                    </Text>
                                    <VStack spacing={3} align="stretch">
                                        {ACTIVITY_LEVELS.map((level) => {
                                            const isSelected = editedData.activity === level.value;
                                            return (
                                                <Box
                                                    key={level.value}
                                                    as="button"
                                                    type="button"
                                                    w="full"
                                                    p={5}
                                                    borderWidth="3px"
                                                    borderRadius="lg"
                                                    borderColor={isSelected ? "blue.500" : "gray.200"}
                                                    bg={isSelected ? "blue.50" : "white"}
                                                    cursor="pointer"
                                                    onClick={() =>
                                                        setEditedData({
                                                            ...editedData,
                                                            activity: level.value,
                                                        })
                                                    }
                                                    transition="all 0.2s"
                                                    _hover={{
                                                        borderColor: isSelected ? "blue.600" : "gray.300",
                                                        shadow: "md",
                                                    }}
                                                >
                                                    <HStack justify="space-between" align="center">
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="semibold"
                                                            color={isSelected ? "blue.700" : "gray.800"}
                                                            textAlign="left"
                                                        >
                                                            {level.label}
                                                        </Text>
                                                        {isSelected && (
                                                            <Tag colorScheme="blue" size="md" fontSize="sm">
                                                                ✓ Selected
                                                            </Tag>
                                                        )}
                                                    </HStack>
                                                </Box>
                                            );
                                        })}
                                    </VStack>
                                </VStack>
                            ) : (
                                <Box
                                    p={5}
                                    borderWidth="2px"
                                    borderRadius="lg"
                                    bg="gray.50"
                                >
                                    {displayData.activity ? (
                                        <Tag colorScheme="blue" size="lg" fontSize="md" p={3}>
                                            {ACTIVITY_LEVELS.find(l => l.value === displayData.activity)?.label || displayData.activity}
                                        </Tag>
                                    ) : (
                                        <Text color="gray.500" fontSize="md">
                                            No activity level set
                                        </Text>
                                    )}
                                </Box>
                            )}
                        </FormControl>
                    </VStack>
                </CardBody>
            </Card>

            {/* Dietary Preferences Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardHeader pb={2}>
                    <Heading size="md">Dietary Preferences & Allergens</Heading>
                </CardHeader>
                <Divider />
                <CardBody pt={6}>
                    <VStack spacing={8} align="stretch">
                        <Box>
                            <FormLabel fontSize="md" fontWeight="semibold" mb={3}>What are your dietary preferences?</FormLabel>
                            {isEditing ? (
                                <VStack align="stretch" spacing={4}>
                                    <Text fontSize="sm" color="gray.600">
                                        Click to select or deselect options:
                                    </Text>
                                    <Wrap spacing={3}>
                                        {DIETARY_PREFERENCES.map((pref) => {
                                            const isSelected = editedData.preferences.includes(pref.value);
                                            return (
                                                <WrapItem key={pref.value}>
                                                    <Tag
                                                        size="lg"
                                                        fontSize="md"
                                                        px={4}
                                                        py={2}
                                                        variant={isSelected ? "solid" : "outline"}
                                                        colorScheme={isSelected ? "green" : "gray"}
                                                        cursor="pointer"
                                                        onClick={() => togglePreference(pref.value)}
                                                        _hover={{ opacity: 0.8 }}
                                                        borderWidth="2px"
                                                    >
                                                        <TagLabel>{isSelected ? "✓ " : ""}{pref.label}</TagLabel>
                                                    </Tag>
                                                </WrapItem>
                                            );
                                        })}
                                    </Wrap>
                                </VStack>
                            ) : (
                                <Wrap spacing={3}>
                                    {displayData.preferences && displayData.preferences.length > 0 ? (
                                        displayData.preferences.map((prefValue: string) => {
                                            const pref = DIETARY_PREFERENCES.find(p => p.value === prefValue);
                                            return (
                                                <WrapItem key={prefValue}>
                                                    <Tag
                                                        size="lg"
                                                        fontSize="md"
                                                        px={4}
                                                        py={2}
                                                        variant="solid"
                                                        colorScheme="green"
                                                    >
                                                        <TagLabel>{pref?.label || prefValue}</TagLabel>
                                                    </Tag>
                                                </WrapItem>
                                            );
                                        })
                                    ) : (
                                        <Text color="gray.500" fontSize="md">
                                            No dietary preferences set
                                        </Text>
                                    )}
                                </Wrap>
                            )}
                        </Box>

                        <Box>
                            <FormLabel fontSize="md" fontWeight="semibold" mb={3}>Do you have any food allergies?</FormLabel>
                            {isEditing ? (
                                <VStack align="stretch" spacing={4}>
                                    <Text fontSize="sm" color="gray.600">
                                        Click to select foods you are allergic to:
                                    </Text>
                                    <Wrap spacing={3}>
                                        {ALLERGIES.map((allergen) => {
                                            const isSelected = editedData.allergies.includes(allergen.value);
                                            return (
                                                <WrapItem key={allergen.value}>
                                                    <Tag
                                                        size="lg"
                                                        fontSize="md"
                                                        px={4}
                                                        py={2}
                                                        variant={isSelected ? "solid" : "outline"}
                                                        colorScheme={isSelected ? "red" : "gray"}
                                                        cursor="pointer"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                removeAllergen(allergen.value);
                                                            } else {
                                                                addAllergen(allergen.value);
                                                            }
                                                        }}
                                                        _hover={{ opacity: 0.8 }}
                                                        borderWidth="2px"
                                                    >
                                                        <TagLabel>{isSelected ? "✓ " : ""}{allergen.label}</TagLabel>
                                                    </Tag>
                                                </WrapItem>
                                            );
                                        })}
                                    </Wrap>
                                </VStack>
                            ) : (
                                <Wrap spacing={3}>
                                    {displayData.allergies && displayData.allergies.length > 0 ? (
                                        displayData.allergies.map((allergenValue: string) => {
                                            const allergen = ALLERGIES.find(a => a.value === allergenValue);
                                            return (
                                                <WrapItem key={allergenValue}>
                                                    <Tag
                                                        size="lg"
                                                        fontSize="md"
                                                        px={4}
                                                        py={2}
                                                        colorScheme="red"
                                                        variant="solid"
                                                    >
                                                        <TagLabel>{allergen?.label || allergenValue}</TagLabel>
                                                    </Tag>
                                                </WrapItem>
                                            );
                                        })
                                    ) : (
                                        <Text color="gray.500" fontSize="md">
                                            No allergens reported
                                        </Text>
                                    )}
                                </Wrap>
                            )}
                        </Box>
                    </VStack>
                </CardBody>
            </Card>

            {/* Floating Action Buttons */}
            <Fade in={showFloatingButtons}>
                <Box
                    position="fixed"
                    bottom={6}
                    right={6}
                    zIndex={1000}
                    display={showFloatingButtons ? "block" : "none"}
                >
                    <Box position="relative" width="60px">
                        <SlideFade
                            in={!isEditing}
                            offsetY="20px"
                            unmountOnExit
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            <Tooltip label="Edit Profile" placement="left" hasArrow fontSize="md">
                                <IconButton
                                    aria-label="Edit Profile"
                                    icon={<EditIcon boxSize={5} />}
                                    colorScheme="blue"
                                    onClick={() => setIsEditing(true)}
                                    size="lg"
                                    isRound
                                    shadow="2xl"
                                    _hover={{
                                        transform: "scale(1.1)",
                                        shadow: "dark-lg",
                                    }}
                                    _active={{
                                        transform: "scale(0.95)",
                                    }}
                                    transition="all 0.2s"
                                    width="60px"
                                    height="60px"
                                />
                            </Tooltip>
                        </SlideFade>
                        <SlideFade
                            in={isEditing}
                            offsetY="20px"
                            unmountOnExit
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            <VStack spacing={3} align="stretch">
                                <Tooltip label="Save Changes" placement="left" hasArrow fontSize="md">
                                    <IconButton
                                        aria-label="Save Changes"
                                        icon={<CheckIcon boxSize={5} />}
                                        colorScheme="green"
                                        onClick={handleSave}
                                        size="lg"
                                        isRound
                                        shadow="2xl"
                                        _hover={{
                                            transform: "scale(1.1)",
                                            shadow: "dark-lg",
                                        }}
                                        _active={{
                                            transform: "scale(0.95)",
                                        }}
                                        transition="all 0.2s"
                                        width="60px"
                                        height="60px"
                                    />
                                </Tooltip>
                                <Tooltip label="Cancel" placement="left" hasArrow fontSize="md">
                                    <IconButton
                                        aria-label="Cancel"
                                        icon={<CloseIcon boxSize={4} />}
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={handleCancel}
                                        size="lg"
                                        isRound
                                        bg="white"
                                        shadow="2xl"
                                        _hover={{
                                            transform: "scale(1.1)",
                                            shadow: "dark-lg",
                                            bg: "red.50",
                                        }}
                                        _active={{
                                            transform: "scale(0.95)",
                                        }}
                                        transition="all 0.2s"
                                        width="60px"
                                        height="60px"
                                    />
                                </Tooltip>
                            </VStack>
                        </SlideFade>
                    </Box>
                </Box>
            </Fade>
        </VStack>
    );
};

export default UserInfoSection;
