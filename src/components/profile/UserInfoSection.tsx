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
    Progress,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    IconButton,
} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";
import {useState} from "react";
import type {UserProfile} from "@/types/profile";
import {
    ACTIVITY_LEVELS,
    DIETARY_PREFERENCES,
    HEALTH_GOALS,
    ALLERGENS,
} from "@/constants/profile";
import {
    mockUserProfile,
    calculateBMI,
    calculateBMR,
    calculateAge,
} from "@/mocks/profileData";
import {animationPresets} from "@/styles/animation";

const UserInfoSection = () => {
    const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

    const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : 0;
    const bmi =
        profile.height && profile.weight
            ? calculateBMI(profile.weight, profile.height)
            : 0;
    const bmr =
        profile.height && profile.weight && profile.dateOfBirth && profile.gender
            ? calculateBMR(profile.weight, profile.height, age, profile.gender)
            : 0;

    const getBMIStatus = (bmi: number) => {
        if (bmi < 18.5) return {label: "Underweight", color: "blue"};
        if (bmi < 25) return {label: "Normal", color: "green"};
        if (bmi < 30) return {label: "Overweight", color: "yellow"};
        return {label: "Obese", color: "red"};
    };

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const addAllergen = (allergen: string) => {
        if (!editedProfile.allergens?.includes(allergen)) {
            setEditedProfile({
                ...editedProfile,
                allergens: [...(editedProfile.allergens || []), allergen],
            });
        }
    };

    const removeAllergen = (allergen: string) => {
        setEditedProfile({
            ...editedProfile,
            allergens: editedProfile.allergens?.filter((a) => a !== allergen) || [],
        });
    };

    const bmiStatus = getBMIStatus(bmi);
    const progressToTarget =
        profile.weight && profile.targetWeight
            ? Math.min(
                  100,
                  ((profile.weight - profile.targetWeight) / profile.weight) * 100
              )
            : 0;

    return (
        <VStack spacing={6} align="stretch">
            {/* Profile Header Card */}
            <Card animation={animationPresets.fadeIn}>
                <CardBody>
                    <HStack spacing={6} align="start">
                        <Avatar
                            size="2xl"
                            name={profile.name}
                            src={profile.avatar}
                            bg="brand.500"
                            color="white"
                        />
                        <VStack align="start" spacing={2} flex={1}>
                            <HStack justify="space-between" w="full">
                                <Heading size="lg">{profile.name}</Heading>
                                <IconButton
                                    aria-label="Edit profile"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => setIsEditing(!isEditing)}
                                />
                            </HStack>
                            <Text color="gray.600">{profile.email}</Text>
                            <Text color="gray.500">{profile.phone}</Text>
                            <HStack spacing={2} mt={2}>
                                {profile.healthGoal && (
                                    <Tag colorScheme="purple" size="sm">
                                        {
                                            HEALTH_GOALS.find(
                                                (g) =>
                                                    g.value === profile.healthGoal
                                            )?.label
                                        }
                                    </Tag>
                                )}
                                {profile.activityLevel && (
                                    <Tag colorScheme="green" size="sm">
                                        {
                                            ACTIVITY_LEVELS.find(
                                                (a) =>
                                                    a.value ===
                                                    profile.activityLevel
                                            )?.label.split(" ")[0]
                                        }
                                    </Tag>
                                )}
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
                            <StatNumber>{profile.weight} kg</StatNumber>
                            <StatHelpText>
                                Target: {profile.targetWeight} kg
                            </StatHelpText>
                            <Progress
                                value={progressToTarget}
                                colorScheme="blue"
                                size="sm"
                                mt={2}
                                borderRadius="full"
                            />
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
                            <StatNumber>{profile.height} cm</StatNumber>
                            <StatHelpText>Age: {age} years</StatHelpText>
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
                                    value={
                                        isEditing
                                            ? editedProfile.name
                                            : profile.name
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
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
                                    value={
                                        isEditing
                                            ? editedProfile.email
                                            : profile.email
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
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
                                <FormLabel>Phone</FormLabel>
                                <Input
                                    value={
                                        isEditing
                                            ? editedProfile.phone
                                            : profile.phone
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
                                            phone: e.target.value,
                                        })
                                    }
                                    isReadOnly={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel>Date of Birth</FormLabel>
                                <Input
                                    type="date"
                                    value={
                                        isEditing
                                            ? editedProfile.dateOfBirth
                                            : profile.dateOfBirth
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
                                            dateOfBirth: e.target.value,
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
                                    value={
                                        isEditing
                                            ? editedProfile.gender
                                            : profile.gender
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
                                            gender: e.target.value as any,
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
                                    value={
                                        isEditing
                                            ? editedProfile.height
                                            : profile.height
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
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
                                    value={
                                        isEditing
                                            ? editedProfile.weight
                                            : profile.weight
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
                                            weight: Number(e.target.value),
                                        })
                                    }
                                    isReadOnly={!isEditing}
                                    bg={isEditing ? "white" : "gray.50"}
                                />
                            </FormControl>
                        </GridItem>

                        <GridItem>
                            <FormControl>
                                <FormLabel>Target Weight (kg)</FormLabel>
                                <Input
                                    type="number"
                                    value={
                                        isEditing
                                            ? editedProfile.targetWeight
                                            : profile.targetWeight
                                    }
                                    onChange={(e) =>
                                        setEditedProfile({
                                            ...editedProfile,
                                            targetWeight: Number(e.target.value),
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
                    <Heading size="md">Health & Fitness Goals</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>Health Goal</FormLabel>
                            <Select
                                value={
                                    isEditing
                                        ? editedProfile.healthGoal
                                        : profile.healthGoal
                                }
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        healthGoal: e.target.value,
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

                        <FormControl>
                            <FormLabel>Activity Level</FormLabel>
                            <Select
                                value={
                                    isEditing
                                        ? editedProfile.activityLevel
                                        : profile.activityLevel
                                }
                                onChange={(e) =>
                                    setEditedProfile({
                                        ...editedProfile,
                                        activityLevel: e.target.value,
                                    })
                                }
                                isDisabled={!isEditing}
                                bg={isEditing ? "white" : "gray.50"}
                            >
                                {ACTIVITY_LEVELS.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
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
                                {DIETARY_PREFERENCES.map((pref) => {
                                    const isSelected =
                                        profile.dietaryPreferences?.includes(
                                            pref.value
                                        );
                                    return (
                                        <WrapItem key={pref.value}>
                                            <Tag
                                                size="md"
                                                variant={
                                                    isSelected ? "solid" : "outline"
                                                }
                                                colorScheme={
                                                    isSelected ? "green" : "gray"
                                                }
                                            >
                                                {pref.label}
                                            </Tag>
                                        </WrapItem>
                                    );
                                })}
                            </Wrap>
                        </Box>

                        <Box>
                            <FormLabel>Allergens</FormLabel>
                            {isEditing && (
                                <Select
                                    placeholder="Add allergen"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addAllergen(e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                    mb={3}
                                >
                                    {ALLERGENS.filter(
                                        (a) => !editedProfile.allergens?.includes(a)
                                    ).map((allergen) => (
                                        <option key={allergen} value={allergen}>
                                            {allergen}
                                        </option>
                                    ))}
                                </Select>
                            )}
                            <Wrap spacing={2}>
                                {(isEditing
                                    ? editedProfile.allergens
                                    : profile.allergens
                                )?.map((allergen) => (
                                    <WrapItem key={allergen}>
                                        <Tag
                                            size="md"
                                            colorScheme="red"
                                            variant="solid"
                                        >
                                            <TagLabel>{allergen}</TagLabel>
                                            {isEditing && (
                                                <TagCloseButton
                                                    onClick={() =>
                                                        removeAllergen(allergen)
                                                    }
                                                />
                                            )}
                                        </Tag>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        </Box>
                    </VStack>
                </CardBody>
            </Card>
        </VStack>
    );
};

export default UserInfoSection;
