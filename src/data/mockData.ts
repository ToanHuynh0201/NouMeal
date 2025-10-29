import type {Recipe, DailyMenu, UserProfile} from "@/types/recipe";

// Mock user profile data
export const mockUserProfile: UserProfile = {
    id: "user-001",
    name: "John Doe",
    email: "john.doe@example.com",
    age: 28,
    gender: "male",
    weight: 75,
    height: 175,
    activityLevel: "moderate",
    dietaryPreferences: ["Balanced", "High Protein"],
    allergies: ["Peanuts"],
    healthGoals: ["Weight Loss", "Muscle Gain"],
    dailyCalorieTarget: 2000,
};

// Mock recipe data
export const mockRecipes: Recipe[] = [
    {
        id: "recipe-001",
        title: "Avocado Sunrise Toast",
        description:
            "A delicious and nutritious breakfast option with avocado, eggs, and whole grain toast.",
        cookingTime: "15 minutes",
        servingSize: "2 servings",
        image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&h=600&fit=crop",
        category: "breakfast",
        difficulty: "easy",
        nutrition: {
            calories: 350,
            protein: "15g",
            fat: "20g",
            satFat: "5g",
            carbs: "30g",
            cholesterol: "185mg",
            fiber: "8g",
            sugar: "4g",
            sodium: "400mg",
        },
        ingredients: [
            "1 ripe avocado",
            "2 slices of whole grain bread",
            "2 eggs",
            "1 tomato, sliced",
            "1/4 cup of feta cheese",
            "Salt and pepper to taste",
            "Fresh herbs for garnish",
        ],
        instructions: [
            "Toast the bread until golden brown.",
            "Mash the avocado in a bowl and season with salt and pepper.",
            "Poach or fry the eggs to your liking.",
            "Spread the mashed avocado on the toasted bread slices.",
            "Top with sliced tomato, feta cheese, and the cooked eggs.",
            "Season with more salt and pepper if desired.",
            "Garnish with fresh herbs before serving.",
        ],
        tags: ["Healthy", "Quick", "Protein-rich"],
    },
    {
        id: "recipe-002",
        title: "Greek Yogurt Parfait",
        description:
            "Layered Greek yogurt with fresh berries, granola, and honey for a perfect morning boost.",
        cookingTime: "10 minutes",
        servingSize: "1 serving",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop",
        category: "breakfast",
        difficulty: "easy",
        nutrition: {
            calories: 280,
            protein: "18g",
            fat: "8g",
            satFat: "2g",
            carbs: "38g",
            cholesterol: "15mg",
            fiber: "5g",
            sugar: "22g",
            sodium: "85mg",
        },
        ingredients: [
            "1 cup Greek yogurt",
            "1/2 cup mixed berries",
            "1/4 cup granola",
            "1 tbsp honey",
            "1 tbsp chia seeds",
            "Fresh mint for garnish",
        ],
        instructions: [
            "In a glass or bowl, layer half of the Greek yogurt.",
            "Add a layer of mixed berries.",
            "Sprinkle half of the granola.",
            "Repeat the layers with remaining ingredients.",
            "Drizzle honey on top.",
            "Sprinkle chia seeds and garnish with fresh mint.",
            "Serve immediately and enjoy!",
        ],
        tags: ["Quick", "No-cook", "High-protein"],
    },
    {
        id: "recipe-003",
        title: "Grilled Chicken Caesar Salad",
        description:
            "Classic Caesar salad with perfectly grilled chicken breast, crispy romaine, and homemade dressing.",
        cookingTime: "25 minutes",
        servingSize: "2 servings",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop",
        category: "lunch",
        difficulty: "medium",
        nutrition: {
            calories: 420,
            protein: "38g",
            fat: "22g",
            satFat: "6g",
            carbs: "18g",
            cholesterol: "95mg",
            fiber: "4g",
            sugar: "3g",
            sodium: "680mg",
        },
        ingredients: [
            "2 chicken breasts",
            "4 cups romaine lettuce",
            "1/2 cup Caesar dressing",
            "1/4 cup parmesan cheese",
            "1 cup croutons",
            "Lemon wedges",
            "Olive oil for grilling",
            "Salt and pepper",
        ],
        instructions: [
            "Season chicken breasts with salt, pepper, and olive oil.",
            "Grill chicken for 6-7 minutes per side until fully cooked.",
            "Let chicken rest for 5 minutes, then slice.",
            "Wash and chop romaine lettuce.",
            "In a large bowl, toss lettuce with Caesar dressing.",
            "Add croutons and parmesan cheese.",
            "Top with sliced grilled chicken.",
            "Serve with lemon wedges on the side.",
        ],
        tags: ["High-protein", "Low-carb", "Gluten-free option"],
    },
    {
        id: "recipe-004",
        title: "Quinoa Buddha Bowl",
        description:
            "Colorful and nutritious bowl with quinoa, roasted vegetables, chickpeas, and tahini dressing.",
        cookingTime: "35 minutes",
        servingSize: "2 servings",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
        category: "lunch",
        difficulty: "medium",
        nutrition: {
            calories: 480,
            protein: "16g",
            fat: "18g",
            satFat: "3g",
            carbs: "65g",
            cholesterol: "0mg",
            fiber: "12g",
            sugar: "8g",
            sodium: "420mg",
        },
        ingredients: [
            "1 cup quinoa",
            "1 cup chickpeas",
            "1 sweet potato, cubed",
            "2 cups kale",
            "1 avocado",
            "1/4 cup tahini",
            "2 tbsp lemon juice",
            "Cherry tomatoes",
            "Olive oil, salt, and spices",
        ],
        instructions: [
            "Cook quinoa according to package instructions.",
            "Toss sweet potato cubes with olive oil and spices.",
            "Roast sweet potato at 400°F for 25 minutes.",
            "Sauté chickpeas with spices until crispy.",
            "Massage kale with a bit of olive oil and lemon.",
            "Make tahini dressing by mixing tahini and lemon juice.",
            "Assemble bowls with quinoa as base.",
            "Top with roasted vegetables, chickpeas, avocado, and cherry tomatoes.",
            "Drizzle with tahini dressing and serve.",
        ],
        tags: ["Vegan", "High-fiber", "Nutrient-dense"],
    },
    {
        id: "recipe-005",
        title: "Baked Salmon with Asparagus",
        description:
            "Tender baked salmon with roasted asparagus and lemon butter sauce.",
        cookingTime: "30 minutes",
        servingSize: "2 servings",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
        category: "dinner",
        difficulty: "easy",
        nutrition: {
            calories: 380,
            protein: "42g",
            fat: "20g",
            satFat: "4g",
            carbs: "8g",
            cholesterol: "105mg",
            fiber: "4g",
            sugar: "3g",
            sodium: "320mg",
        },
        ingredients: [
            "2 salmon fillets (6 oz each)",
            "1 bunch asparagus",
            "2 tbsp butter",
            "2 cloves garlic, minced",
            "1 lemon",
            "Fresh dill",
            "Olive oil",
            "Salt and pepper",
        ],
        instructions: [
            "Preheat oven to 400°F (200°C).",
            "Place salmon and asparagus on a baking sheet.",
            "Drizzle with olive oil, season with salt and pepper.",
            "Bake for 15-18 minutes until salmon is cooked through.",
            "Meanwhile, melt butter in a small pan.",
            "Add minced garlic and cook for 1 minute.",
            "Add lemon juice and fresh dill to the butter sauce.",
            "Serve salmon and asparagus with lemon butter sauce.",
        ],
        tags: ["High-protein", "Omega-3", "Low-carb"],
    },
    {
        id: "recipe-006",
        title: "Chicken Stir-Fry with Brown Rice",
        description:
            "Quick and flavorful chicken stir-fry with colorful vegetables and brown rice.",
        cookingTime: "25 minutes",
        servingSize: "2 servings",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
        category: "dinner",
        difficulty: "easy",
        nutrition: {
            calories: 520,
            protein: "35g",
            fat: "14g",
            satFat: "3g",
            carbs: "58g",
            cholesterol: "75mg",
            fiber: "6g",
            sugar: "8g",
            sodium: "620mg",
        },
        ingredients: [
            "2 chicken breasts, sliced",
            "1 cup brown rice",
            "2 cups mixed vegetables (bell peppers, broccoli, carrots)",
            "3 tbsp soy sauce",
            "2 cloves garlic, minced",
            "1 tbsp ginger, minced",
            "2 tbsp sesame oil",
            "Green onions for garnish",
            "Sesame seeds",
        ],
        instructions: [
            "Cook brown rice according to package instructions.",
            "Heat sesame oil in a large wok or pan.",
            "Add chicken slices and cook until golden.",
            "Remove chicken and set aside.",
            "Add garlic and ginger, stir for 30 seconds.",
            "Add mixed vegetables and stir-fry for 5 minutes.",
            "Return chicken to the pan.",
            "Add soy sauce and toss everything together.",
            "Serve over brown rice, garnish with green onions and sesame seeds.",
        ],
        tags: ["Quick", "Balanced", "Asian-inspired"],
    },
    {
        id: "recipe-007",
        title: "Apple Almond Energy Bites",
        description:
            "No-bake energy bites perfect for a quick snack with apples, almonds, and dates.",
        cookingTime: "15 minutes",
        servingSize: "12 bites",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
        category: "snack",
        difficulty: "easy",
        nutrition: {
            calories: 95,
            protein: "3g",
            fat: "4g",
            satFat: "0.5g",
            carbs: "14g",
            cholesterol: "0mg",
            fiber: "2g",
            sugar: "9g",
            sodium: "25mg",
        },
        ingredients: [
            "1 cup dried apples",
            "1/2 cup almonds",
            "1/2 cup dates, pitted",
            "2 tbsp almond butter",
            "1 tsp cinnamon",
            "Pinch of salt",
            "2 tbsp chia seeds (optional)",
        ],
        instructions: [
            "Add all ingredients to a food processor.",
            "Pulse until mixture is well combined and sticky.",
            "Roll mixture into 12 small balls.",
            "Optional: roll in chia seeds for coating.",
            "Refrigerate for at least 30 minutes before serving.",
            "Store in an airtight container in the fridge for up to 1 week.",
        ],
        tags: ["No-bake", "Vegan", "Portable"],
    },
    {
        id: "recipe-008",
        title: "Hummus with Veggie Sticks",
        description:
            "Creamy homemade hummus served with fresh crunchy vegetable sticks.",
        cookingTime: "10 minutes",
        servingSize: "4 servings",
        image: "https://images.unsplash.com/photo-1571740369607-0d5896b7b3b5?w=800&h=600&fit=crop",
        category: "snack",
        difficulty: "easy",
        nutrition: {
            calories: 180,
            protein: "7g",
            fat: "10g",
            satFat: "1g",
            carbs: "18g",
            cholesterol: "0mg",
            fiber: "6g",
            sugar: "4g",
            sodium: "280mg",
        },
        ingredients: [
            "1 can chickpeas, drained",
            "3 tbsp tahini",
            "2 cloves garlic",
            "3 tbsp lemon juice",
            "2 tbsp olive oil",
            "Cumin and paprika",
            "Carrots, celery, cucumber for dipping",
            "Salt to taste",
        ],
        instructions: [
            "In a food processor, combine chickpeas, tahini, garlic, and lemon juice.",
            "Blend until smooth, adding water if needed.",
            "Add olive oil, cumin, paprika, and salt.",
            "Blend again until creamy.",
            "Transfer to a serving bowl.",
            "Drizzle with olive oil and sprinkle with paprika.",
            "Cut vegetables into sticks.",
            "Serve hummus with veggie sticks for dipping.",
        ],
        tags: ["Vegan", "High-protein", "Mediterranean"],
    },
];

// Mock daily menu based on user profile
export const mockDailyMenu: DailyMenu = {
    date: new Date().toISOString().split("T")[0],
    breakfast: mockRecipes[0], // Avocado Sunrise Toast
    lunch: mockRecipes[2], // Grilled Chicken Caesar Salad
    dinner: mockRecipes[4], // Baked Salmon with Asparagus
    snacks: [mockRecipes[6], mockRecipes[7]], // Energy Bites & Hummus
    totalCalories: 1505,
    totalProtein: "121g",
    totalCarbs: "94g",
    totalFat: "76g",
};

// Mock weekly menu
export const mockWeeklyMenu: DailyMenu[] = [
    // Monday (Today)
    mockDailyMenu,
    // Tuesday
    {
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        breakfast: mockRecipes[1], // Greek Yogurt Parfait
        lunch: mockRecipes[3], // Quinoa Buddha Bowl
        dinner: mockRecipes[5], // Chicken Stir-Fry
        snacks: [mockRecipes[7]], // Hummus
        totalCalories: 1460,
        totalProtein: "96g",
        totalCarbs: "159g",
        totalFat: "50g",
    },
    // Wednesday
    {
        date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
        breakfast: mockRecipes[0], // Avocado Toast
        lunch: mockRecipes[2], // Caesar Salad
        dinner: mockRecipes[4], // Baked Salmon
        snacks: [mockRecipes[6]], // Energy Bites
        totalCalories: 1245,
        totalProtein: "110g",
        totalCarbs: "72g",
        totalFat: "58g",
    },
    // Thursday
    {
        date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        breakfast: mockRecipes[1], // Greek Yogurt Parfait
        lunch: mockRecipes[2], // Caesar Salad
        dinner: mockRecipes[5], // Chicken Stir-Fry
        snacks: [mockRecipes[7]], // Hummus
        totalCalories: 1460,
        totalProtein: "103g",
        totalCarbs: "94g",
        totalFat: "54g",
    },
    // Friday
    {
        date: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0],
        breakfast: mockRecipes[0], // Avocado Toast
        lunch: mockRecipes[3], // Buddha Bowl
        dinner: mockRecipes[4], // Baked Salmon
        snacks: [mockRecipes[6], mockRecipes[7]], // Energy Bites & Hummus
        totalCalories: 1735,
        totalProtein: "128g",
        totalCarbs: "139g",
        totalFat: "76g",
    },
    // Saturday
    {
        date: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
        breakfast: mockRecipes[1], // Greek Yogurt Parfait
        lunch: mockRecipes[2], // Caesar Salad
        dinner: mockRecipes[5], // Chicken Stir-Fry
        snacks: [mockRecipes[6]], // Energy Bites
        totalCalories: 1375,
        totalProtein: "94g",
        totalCarbs: "110g",
        totalFat: "50g",
    },
    // Sunday
    {
        date: new Date(Date.now() + 86400000 * 6).toISOString().split("T")[0],
        breakfast: mockRecipes[0], // Avocado Toast
        lunch: mockRecipes[3], // Buddha Bowl
        dinner: mockRecipes[4], // Baked Salmon
        snacks: [mockRecipes[7]], // Hummus
        totalCalories: 1560,
        totalProtein: "110g",
        totalCarbs: "121g",
        totalFat: "66g",
    },
];

// Mock AI Meal Suggestion Data
export const mockMealSuggestions = {
    "healthy breakfast": [
        {
            id: "suggestion-001",
            recipe: mockRecipes[0], // Avocado Sunrise Toast
            matchScore: 95,
            matchReason:
                "Perfect match! High in healthy fats, protein, and fiber. Great for a nutritious start to your day.",
            alternativeOptions: [mockRecipes[1]], // Greek Yogurt Parfait
        },
        {
            id: "suggestion-002",
            recipe: mockRecipes[1], // Greek Yogurt Parfait
            matchScore: 90,
            matchReason:
                "Excellent protein source with probiotics. Quick to prepare and very nutritious.",
            alternativeOptions: [mockRecipes[0]],
        },
    ],
    "high protein lunch": [
        {
            id: "suggestion-003",
            recipe: mockRecipes[2], // Grilled Chicken Caesar Salad
            matchScore: 98,
            matchReason:
                "Outstanding protein content (38g) with balanced macros. Perfect for muscle building and satiety.",
            alternativeOptions: [mockRecipes[3]],
        },
    ],
    "low carb dinner": [
        {
            id: "suggestion-004",
            recipe: mockRecipes[4], // Baked Salmon with Asparagus
            matchScore: 97,
            matchReason:
                "Excellent choice! Only 8g carbs with high protein and omega-3 fatty acids. Great for keto or low-carb diets.",
            alternativeOptions: [mockRecipes[2]],
        },
    ],
    "vegan meal": [
        {
            id: "suggestion-005",
            recipe: mockRecipes[3], // Quinoa Buddha Bowl
            matchScore: 100,
            matchReason:
                "Perfect vegan meal! Complete protein from quinoa, high in fiber, and packed with nutrients.",
            alternativeOptions: [],
        },
        {
            id: "suggestion-006",
            recipe: mockRecipes[7], // Hummus with Veggie Sticks
            matchScore: 85,
            matchReason:
                "Great vegan snack option with plant-based protein and healthy fats.",
            alternativeOptions: [mockRecipes[6]],
        },
    ],
    "quick and easy": [
        {
            id: "suggestion-007",
            recipe: mockRecipes[1], // Greek Yogurt Parfait
            matchScore: 95,
            matchReason: "Ready in just 10 minutes with no cooking required!",
            alternativeOptions: [mockRecipes[7]],
        },
        {
            id: "suggestion-008",
            recipe: mockRecipes[5], // Chicken Stir-Fry
            matchScore: 88,
            matchReason:
                "Quick 25-minute meal with minimal prep and cleanup.",
            alternativeOptions: [mockRecipes[2]],
        },
    ],
    default: [
        {
            id: "suggestion-009",
            recipe: mockRecipes[0],
            matchScore: 85,
            matchReason:
                "Balanced and nutritious meal option that fits most dietary preferences.",
            alternativeOptions: [mockRecipes[1], mockRecipes[2]],
        },
        {
            id: "suggestion-010",
            recipe: mockRecipes[3],
            matchScore: 82,
            matchReason:
                "Colorful and nutrient-dense meal with great variety.",
            alternativeOptions: [mockRecipes[4], mockRecipes[5]],
        },
    ],
};

// Mock Image Recognition Results
export const mockImageRecognitionResults = [
    {
        id: "recognition-001",
        imageUrl:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
        recognizedFoods: [
            {
                name: "Grilled Chicken Breast",
                confidence: 94,
                category: "Protein",
                estimatedWeight: "150g",
            },
            {
                name: "Mixed Green Salad",
                confidence: 89,
                category: "Vegetables",
                estimatedWeight: "100g",
            },
            {
                name: "Cherry Tomatoes",
                confidence: 92,
                category: "Vegetables",
                estimatedWeight: "50g",
            },
        ],
        overallNutrition: {
            calories: 285,
            protein: "42g",
            fat: "8g",
            satFat: "2g",
            carbs: "12g",
            cholesterol: "85mg",
            fiber: "4g",
            sugar: "5g",
            sodium: "180mg",
        },
        suggestions: [
            "Great protein-rich meal! Consider adding complex carbs like quinoa or brown rice for more energy.",
            "This meal is low in calories - perfect for weight loss goals.",
            "High in protein and low in fat - excellent post-workout meal.",
        ],
        timestamp: new Date().toISOString(),
        processingTime: "1.2s",
    },
    {
        id: "recognition-002",
        imageUrl:
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
        recognizedFoods: [
            {
                name: "Fresh Garden Salad",
                confidence: 96,
                category: "Vegetables",
                estimatedWeight: "200g",
            },
            {
                name: "Avocado",
                confidence: 93,
                category: "Healthy Fats",
                estimatedWeight: "80g",
            },
            {
                name: "Mixed Nuts",
                confidence: 88,
                category: "Protein & Fats",
                estimatedWeight: "30g",
            },
        ],
        overallNutrition: {
            calories: 380,
            protein: "12g",
            fat: "32g",
            satFat: "5g",
            carbs: "18g",
            cholesterol: "0mg",
            fiber: "12g",
            sugar: "4g",
            sodium: "95mg",
        },
        suggestions: [
            "Excellent source of healthy fats from avocado and nuts!",
            "High fiber content will keep you full for longer.",
            "Consider adding a protein source like grilled chicken or tofu.",
        ],
        timestamp: new Date().toISOString(),
        processingTime: "1.5s",
    },
    {
        id: "recognition-003",
        imageUrl:
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
        recognizedFoods: [
            {
                name: "Pancakes",
                confidence: 97,
                category: "Carbohydrates",
                estimatedWeight: "150g",
            },
            {
                name: "Fresh Berries",
                confidence: 95,
                category: "Fruits",
                estimatedWeight: "100g",
            },
            {
                name: "Maple Syrup",
                confidence: 91,
                category: "Sweetener",
                estimatedWeight: "30ml",
            },
        ],
        overallNutrition: {
            calories: 450,
            protein: "8g",
            fat: "12g",
            satFat: "3g",
            carbs: "78g",
            cholesterol: "45mg",
            fiber: "5g",
            sugar: "35g",
            sodium: "520mg",
        },
        suggestions: [
            "High in carbohydrates - great for an energy boost before activities.",
            "Consider adding protein like Greek yogurt or nuts for better balance.",
            "The berries provide good antioxidants and vitamins!",
        ],
        timestamp: new Date().toISOString(),
        processingTime: "1.0s",
    },
];
