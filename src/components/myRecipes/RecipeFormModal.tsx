import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Grid,
    GridItem,
    IconButton,
    Icon,
    Text,
    Box,
    useColorModeValue,
    useToast,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    TagCloseButton,
} from "@chakra-ui/react";
import {useState, useEffect} from "react";
import {FiPlus, FiX} from "react-icons/fi";
import type {Recipe} from "@/types/recipe";
import type {RecipeFormData} from "@/types/myRecipe";
import {ALLERGEN_VALUES} from "@/constants";

interface RecipeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipe: RecipeFormData) => void;
    editingRecipe?: Recipe | null;
}

const RecipeFormModal = ({
    isOpen,
    onClose,
    onSave,
    editingRecipe,
}: RecipeFormModalProps) => {
    const toast = useToast();
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const initialFormData: RecipeFormData = {
        title: "",
        description: "",
        cookingTime: "",
        servingSize: "",
        image: "",
        foodCategory: "grains",
        category: "breakfast",
        difficulty: "easy",
        ingredients: [{ name: "", amount: "" }],
        instructions: [""],
        tags: [""],
        allergens: [],
        nutrition: {
            calories: 0,
            protein: "0g",
            fat: "0g",
            satFat: "0g",
            carbs: "0g",
            cholesterol: "0mg",
            fiber: "0g",
            sugar: "0g",
            sodium: "0mg",
        },
    };

    const [formData, setFormData] = useState<RecipeFormData>(initialFormData);

    // Load editing recipe data
    useEffect(() => {
        if (editingRecipe) {
            setFormData({
                title: editingRecipe.title,
                description: editingRecipe.description,
                cookingTime: editingRecipe.cookingTime,
                servingSize: editingRecipe.servingSize,
                image: editingRecipe.image,
                foodCategory: (editingRecipe as any).foodCategory || "grains",
                category: editingRecipe.category,
                difficulty: editingRecipe.difficulty,
                ingredients: editingRecipe.ingredients.map(ing => {
                    const parts = ing.split(" - ");
                    return { name: parts[0] || ing, amount: parts[1] || "" };
                }),
                instructions: editingRecipe.instructions,
                tags: editingRecipe.tags,
                allergens: (editingRecipe as any).allergens || [],
                nutrition: editingRecipe.nutrition,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editingRecipe, isOpen]);

    const handleInputChange = (
        field: keyof RecipeFormData,
        value: string | number
    ) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

    const handleNutritionChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            nutrition: {...prev.nutrition, [field]: value},
        }));
    };

    const handleArrayChange = (
        field: "instructions" | "tags" | "allergens",
        index: number,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }));
    };

    const handleIngredientChange = (
        index: number,
        field: "name" | "amount",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            ingredients: prev.ingredients.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleAddArrayItem = (field: "ingredients" | "instructions" | "tags") => {
        if (field === "ingredients") {
            setFormData((prev) => ({
                ...prev,
                ingredients: [...prev.ingredients, { name: "", amount: "" }],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: [...prev[field], ""],
            }));
        }
    };

    const handleRemoveArrayItem = (
        field: "ingredients" | "instructions" | "tags",
        index: number
    ) => {
        if (formData[field].length > 1) {
            setFormData((prev) => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index),
            }));
        }
    };

    const handleAllergenToggle = (allergen: string) => {
        setFormData((prev) => {
            const isSelected = prev.allergens.includes(allergen);
            return {
                ...prev,
                allergens: isSelected
                    ? prev.allergens.filter((a) => a !== allergen)
                    : [...prev.allergens, allergen],
            };
        });
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.title.trim()) {
            toast({
                title: "Validation Error",
                description: "Recipe title is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!formData.description.trim()) {
            toast({
                title: "Validation Error",
                description: "Recipe description is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Filter out empty items
        const cleanedData = {
            ...formData,
            ingredients: formData.ingredients.filter((item) => item.name.trim() !== "" && item.amount.trim() !== ""),
            instructions: formData.instructions.filter((item) => item.trim() !== ""),
            tags: formData.tags.filter((item) => item.trim() !== ""),
            // Allergens are already validated (selected from predefined list)
        };

        if (cleanedData.ingredients.length === 0) {
            toast({
                title: "Validation Error",
                description: "At least one ingredient with name and amount is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (cleanedData.instructions.length === 0) {
            toast({
                title: "Validation Error",
                description: "At least one instruction is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        onSave(cleanedData);
        handleClose();
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
            <ModalContent bg={cardBg} borderRadius="2xl" maxH="90vh">
                <ModalHeader borderBottom="1px" borderColor={borderColor}>
                    {editingRecipe ? "Edit Recipe" : "Add New Recipe"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Basic Information */}
                        <Box>
                            <Text fontSize="lg" fontWeight="bold" mb={4} color="brand.600">
                                Basic Information
                            </Text>
                            <VStack spacing={4} align="stretch">
                                <FormControl isRequired>
                                    <FormLabel>Recipe Title</FormLabel>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) =>
                                            handleInputChange("title", e.target.value)
                                        }
                                        placeholder="Enter recipe title"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            handleInputChange("description", e.target.value)
                                        }
                                        placeholder="Enter recipe description"
                                        rows={3}
                                    />
                                </FormControl>

                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <GridItem>
                                        <FormControl isRequired>
                                            <FormLabel>Meal Type</FormLabel>
                                            <Select
                                                value={formData.category}
                                                onChange={(e) =>
                                                    handleInputChange("category", e.target.value)
                                                }
                                            >
                                                <option value="breakfast">Breakfast</option>
                                                <option value="lunch">Lunch</option>
                                                <option value="dinner">Dinner</option>
                                                <option value="snack">Snack</option>
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem>
                                        <FormControl isRequired>
                                            <FormLabel>Food Category</FormLabel>
                                            <Select
                                                value={formData.foodCategory}
                                                onChange={(e) =>
                                                    handleInputChange("foodCategory", e.target.value)
                                                }
                                            >
                                                <option value="fruits">Fruits</option>
                                                <option value="vegetables">Vegetables</option>
                                                <option value="grains">Grains</option>
                                                <option value="protein">Protein</option>
                                                <option value="dairy">Dairy</option>
                                                <option value="fats">Fats</option>
                                                <option value="beverages">Beverages</option>
                                                <option value="snacks">Snacks</option>
                                                <option value="desserts">Desserts</option>
                                                <option value="spices">Spices</option>
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel>Difficulty</FormLabel>
                                            <Select
                                                value={formData.difficulty}
                                                onChange={(e) =>
                                                    handleInputChange("difficulty", e.target.value)
                                                }
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    <GridItem>
                                        <FormControl isRequired>
                                            <FormLabel>Cooking Time</FormLabel>
                                            <Input
                                                value={formData.cookingTime}
                                                onChange={(e) =>
                                                    handleInputChange("cookingTime", e.target.value)
                                                }
                                                placeholder="e.g., 30 minutes"
                                            />
                                        </FormControl>
                                    </GridItem>
                                    <GridItem>
                                        <FormControl isRequired>
                                            <FormLabel>Serving Size</FormLabel>
                                            <Input
                                                value={formData.servingSize}
                                                onChange={(e) =>
                                                    handleInputChange("servingSize", e.target.value)
                                                }
                                                placeholder="e.g., 2 servings"
                                            />
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                <FormControl>
                                    <FormLabel>Image URL</FormLabel>
                                    <Input
                                        value={formData.image}
                                        onChange={(e) =>
                                            handleInputChange("image", e.target.value)
                                        }
                                        placeholder="Enter image URL"
                                    />
                                </FormControl>
                            </VStack>
                        </Box>

                        {/* Nutrition Information */}
                        <Box>
                            <Text fontSize="lg" fontWeight="bold" mb={4} color="brand.600">
                                Nutrition Information
                            </Text>
                            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Calories</FormLabel>
                                        <Input
                                            type="number"
                                            value={formData.nutrition.calories}
                                            onChange={(e) =>
                                                handleNutritionChange(
                                                    "calories",
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            placeholder="0"
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Protein</FormLabel>
                                        <Input
                                            value={formData.nutrition.protein}
                                            onChange={(e) =>
                                                handleNutritionChange("protein", e.target.value)
                                            }
                                            placeholder="e.g., 15g"
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Carbs</FormLabel>
                                        <Input
                                            value={formData.nutrition.carbs}
                                            onChange={(e) =>
                                                handleNutritionChange("carbs", e.target.value)
                                            }
                                            placeholder="e.g., 30g"
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Fat</FormLabel>
                                        <Input
                                            value={formData.nutrition.fat}
                                            onChange={(e) =>
                                                handleNutritionChange("fat", e.target.value)
                                            }
                                            placeholder="e.g., 10g"
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Fiber</FormLabel>
                                        <Input
                                            value={formData.nutrition.fiber}
                                            onChange={(e) =>
                                                handleNutritionChange("fiber", e.target.value)
                                            }
                                            placeholder="e.g., 5g"
                                        />
                                    </FormControl>
                                </GridItem>
                                <GridItem>
                                    <FormControl>
                                        <FormLabel>Sugar</FormLabel>
                                        <Input
                                            value={formData.nutrition.sugar}
                                            onChange={(e) =>
                                                handleNutritionChange("sugar", e.target.value)
                                            }
                                            placeholder="e.g., 8g"
                                        />
                                    </FormControl>
                                </GridItem>
                            </Grid>
                        </Box>

                        {/* Ingredients */}
                        <Box>
                            <HStack justify="space-between" mb={4}>
                                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                    Ingredients
                                </Text>
                                <Button
                                    size="sm"
                                    leftIcon={<Icon as={FiPlus} />}
                                    colorScheme="purple"
                                    variant="outline"
                                    onClick={() => handleAddArrayItem("ingredients")}
                                >
                                    Add Ingredient
                                </Button>
                            </HStack>
                            <VStack spacing={3} align="stretch">
                                {formData.ingredients.map((ingredient, index) => (
                                    <HStack key={index} spacing={3}>
                                        <Input
                                            value={ingredient.name}
                                            onChange={(e) =>
                                                handleIngredientChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ingredient name (e.g., Oats)"
                                            flex={2}
                                        />
                                        <Input
                                            value={ingredient.amount}
                                            onChange={(e) =>
                                                handleIngredientChange(
                                                    index,
                                                    "amount",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Amount (e.g., 1 cup)"
                                            flex={1}
                                        />
                                        <IconButton
                                            aria-label="Remove ingredient"
                                            icon={<Icon as={FiX} />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() =>
                                                handleRemoveArrayItem("ingredients", index)
                                            }
                                            isDisabled={formData.ingredients.length === 1}
                                        />
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>

                        {/* Instructions */}
                        <Box>
                            <HStack justify="space-between" mb={4}>
                                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                    Instructions
                                </Text>
                                <Button
                                    size="sm"
                                    leftIcon={<Icon as={FiPlus} />}
                                    colorScheme="purple"
                                    variant="outline"
                                    onClick={() => handleAddArrayItem("instructions")}
                                >
                                    Add Step
                                </Button>
                            </HStack>
                            <VStack spacing={3} align="stretch">
                                {formData.instructions.map((instruction, index) => (
                                    <HStack key={index} align="start">
                                        <Text
                                            fontWeight="bold"
                                            color="brand.600"
                                            minW="30px"
                                            mt={2}
                                        >
                                            {index + 1}.
                                        </Text>
                                        <Textarea
                                            value={instruction}
                                            onChange={(e) =>
                                                handleArrayChange(
                                                    "instructions",
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Step ${index + 1}`}
                                            rows={2}
                                        />
                                        <IconButton
                                            aria-label="Remove instruction"
                                            icon={<Icon as={FiX} />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() =>
                                                handleRemoveArrayItem("instructions", index)
                                            }
                                            isDisabled={formData.instructions.length === 1}
                                        />
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>

                        {/* Tags */}
                        <Box>
                            <HStack justify="space-between" mb={4}>
                                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                                    Tags
                                </Text>
                                <Button
                                    size="sm"
                                    leftIcon={<Icon as={FiPlus} />}
                                    colorScheme="purple"
                                    variant="outline"
                                    onClick={() => handleAddArrayItem("tags")}
                                >
                                    Add Tag
                                </Button>
                            </HStack>
                            <VStack spacing={3} align="stretch">
                                {formData.tags.map((tag, index) => (
                                    <HStack key={index}>
                                        <Input
                                            value={tag}
                                            onChange={(e) =>
                                                handleArrayChange("tags", index, e.target.value)
                                            }
                                            placeholder={`Tag ${index + 1} (e.g., high_protein, low_carb)`}
                                        />
                                        <IconButton
                                            aria-label="Remove tag"
                                            icon={<Icon as={FiX} />}
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleRemoveArrayItem("tags", index)}
                                            isDisabled={formData.tags.length === 1}
                                        />
                                    </HStack>
                                ))}
                            </VStack>
                        </Box>

                        {/* Allergens */}
                        <Box>
                            <Text fontSize="lg" fontWeight="bold" color="brand.600" mb={4}>
                                Allergens
                            </Text>
                            <Text fontSize="sm" color="gray.600" mb={3}>
                                Select all allergens present in this recipe
                            </Text>
                            <Wrap spacing={3}>
                                {ALLERGEN_VALUES.map((allergen) => {
                                    const isSelected = formData.allergens.includes(allergen);
                                    const displayName = allergen.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

                                    return (
                                        <WrapItem key={allergen}>
                                            <Tag
                                                size="lg"
                                                borderRadius="full"
                                                variant={isSelected ? "solid" : "outline"}
                                                colorScheme={isSelected ? "red" : "gray"}
                                                cursor="pointer"
                                                onClick={() => handleAllergenToggle(allergen)}
                                                _hover={{
                                                    transform: "scale(1.05)",
                                                    shadow: "md",
                                                }}
                                                transition="all 0.2s"
                                            >
                                                <TagLabel>{displayName}</TagLabel>
                                                {isSelected && (
                                                    <TagCloseButton />
                                                )}
                                            </Tag>
                                        </WrapItem>
                                    );
                                })}
                            </Wrap>
                        </Box>
                    </VStack>
                </ModalBody>

                <ModalFooter borderTop="1px" borderColor={borderColor}>
                    <Button variant="ghost" mr={3} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="purple" onClick={handleSubmit}>
                        {editingRecipe ? "Update Recipe" : "Add Recipe"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RecipeFormModal;
