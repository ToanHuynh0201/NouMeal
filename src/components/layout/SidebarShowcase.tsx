// Sidebar Feature Showcase
// This file demonstrates all the interactive features of the improved Sidebar

import {Box, Container, Heading, SimpleGrid, Text, VStack, Code, Badge} from "@chakra-ui/react";

export const SidebarShowcase = () => {
    return (
        <Container maxW="container.xl" py={10}>
            <VStack spacing={8} align="stretch">
                <Box>
                    <Heading size="xl" mb={2}>
                        Sidebar UI/UX Improvements
                    </Heading>
                    <Text color="gray.600">
                        Comprehensive enhancements to improve user experience and visual design
                    </Text>
                </Box>

                <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={6}>
                    {/* Feature Cards */}
                    <FeatureCard
                        title="Modular Architecture"
                        description="Refactored into 4 reusable components for better maintainability"
                        features={[
                            "SidebarLogo.tsx",
                            "SidebarItem.tsx",
                            "SidebarUserProfile.tsx",
                            "Sidebar.tsx (main)",
                        ]}
                        badge="Architecture"
                        badgeColor="purple"
                    />

                    <FeatureCard
                        title="Visual Enhancements"
                        description="Modern design with gradients, shadows, and smooth animations"
                        features={[
                            "Gradient backgrounds",
                            "Enhanced shadows (xl)",
                            "Accent gradient lines",
                            "Increased border radius",
                        ]}
                        badge="Design"
                        badgeColor="blue"
                    />

                    <FeatureCard
                        title="Navigation Organization"
                        description="Grouped into logical sections with clear labels"
                        features={[
                            "Main section",
                            "Meal Planning section",
                            "Discover section",
                            "Section dividers",
                        ]}
                        badge="UX"
                        badgeColor="green"
                    />

                    <FeatureCard
                        title="Active State Indicators"
                        description="Clear visual feedback for current page"
                        features={[
                            "Full background color",
                            "White text color",
                            "Left accent bar (4px)",
                            "Glow effect",
                        ]}
                        badge="Interaction"
                        badgeColor="orange"
                    />

                    <FeatureCard
                        title="Hover Effects"
                        description="Smooth micro-interactions on all elements"
                        features={[
                            "Scale animation (collapsed)",
                            "Slide animation (expanded)",
                            "Enhanced shadows",
                            "Icon animations",
                        ]}
                        badge="Animation"
                        badgeColor="pink"
                    />

                    <FeatureCard
                        title="User Profile Section"
                        description="Comprehensive user menu at bottom"
                        features={[
                            "Avatar with ring effect",
                            "Active status badge",
                            "Profile dropdown menu",
                            "Logout functionality",
                        ]}
                        badge="Feature"
                        badgeColor="teal"
                    />

                    <FeatureCard
                        title="Accessibility"
                        description="Built with accessibility in mind"
                        features={[
                            "ARIA labels",
                            "Keyboard navigation",
                            "Screen reader support",
                            "Focus indicators",
                        ]}
                        badge="A11y"
                        badgeColor="red"
                    />

                    <FeatureCard
                        title="Custom Scrollbar"
                        description="Styled scrollbar matching design system"
                        features={[
                            "Slim 4px width",
                            "Brand-colored thumb",
                            "Transparent track",
                            "Rounded corners",
                        ]}
                        badge="Polish"
                        badgeColor="cyan"
                    />

                    <FeatureCard
                        title="Responsive Design"
                        description="Adapts to different states and color modes"
                        features={[
                            "Collapsed: 80px",
                            "Expanded: 260px",
                            "Light/Dark mode support",
                            "Smooth transitions",
                        ]}
                        badge="Responsive"
                        badgeColor="yellow"
                    />
                </SimpleGrid>

                {/* Code Examples */}
                <Box mt={8}>
                    <Heading size="lg" mb={4}>
                        Key Implementation Details
                    </Heading>
                    
                    <VStack spacing={4} align="stretch">
                        <CodeBlock
                            title="Gradient Background"
                            code={`const sidebarBg = useColorModeValue(
  "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  "linear-gradient(180deg, #1a202c 0%, #171923 100%)"
);`}
                        />

                        <CodeBlock
                            title="Smooth Transitions"
                            code={`export const transitions = {
  smooth: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
};`}
                        />

                        <CodeBlock
                            title="Active State Styling"
                            code={`bg={isActive ? "brand.500" : "transparent"}
color={isActive ? "white" : "gray.600"}
shadow={isActive ? "md" : "none"}`}
                        />
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

interface FeatureCardProps {
    title: string;
    description: string;
    features: string[];
    badge: string;
    badgeColor: string;
}

const FeatureCard = ({title, description, features, badge, badgeColor}: FeatureCardProps) => (
    <Box
        p={6}
        borderRadius="xl"
        bg="white"
        shadow="md"
        borderWidth={1}
        borderColor="gray.200"
        transition="all 0.3s"
        _hover={{
            shadow: "lg",
            transform: "translateY(-4px)",
            borderColor: "brand.300",
        }}
    >
        <Badge colorScheme={badgeColor} mb={3} fontSize="xs">
            {badge}
        </Badge>
        <Heading size="md" mb={2}>
            {title}
        </Heading>
        <Text color="gray.600" fontSize="sm" mb={4}>
            {description}
        </Text>
        <VStack align="stretch" spacing={2}>
            {features.map((feature, idx) => (
                <Text key={idx} fontSize="sm" color="gray.700">
                    • {feature}
                </Text>
            ))}
        </VStack>
    </Box>
);

interface CodeBlockProps {
    title: string;
    code: string;
}

const CodeBlock = ({title, code}: CodeBlockProps) => (
    <Box>
        <Text fontWeight="semibold" mb={2} fontSize="sm">
            {title}
        </Text>
        <Code
            display="block"
            whiteSpace="pre"
            p={4}
            borderRadius="lg"
            bg="gray.50"
            fontSize="sm"
            overflowX="auto"
        >
            {code}
        </Code>
    </Box>
);
