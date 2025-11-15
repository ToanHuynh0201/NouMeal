import {animationPresets, transitions} from "@/styles/animation";
import {
    Box,
    Flex,
    IconButton,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import {useState} from "react";
import {useLocation} from "react-router-dom";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import type {navItem} from "@/types/layout";
import {ROUTES} from "@/constants";
import {FiHome, FiCamera, FiBook} from "react-icons/fi";
import {MdFoodBank, MdRestaurantMenu} from "react-icons/md";
import {BsStars} from "react-icons/bs";
import {useAuth} from "@/hooks/useAuth";
import {SidebarItem} from "./SidebarItem";
import {SidebarUserProfile} from "./SidebarUserProfile";
import {SidebarLogo} from "./SidebarLogo";

const Sidebar = () => {
    const location = useLocation();
    const {user, logout} = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Color mode values
    const sidebarBg = useColorModeValue(
        "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)", 
        "linear-gradient(180deg, #1a202c 0%, #171923 100%)"
    );
    const borderColor = useColorModeValue("gray.200", "gray.700");

    // Navigation items without sections
    const navItems: navItem[] = [
        {
            label: "Home",
            path: ROUTES.HOME,
            icon: FiHome,
        },
        {
            label: "My Menu",
            path: ROUTES.MENU_SUGGESTION,
            icon: MdRestaurantMenu,
        },
        {
            label: "My Recipes",
            path: ROUTES.MY_RECIPES,
            icon: FiBook,
        },
        {
            label: "AI Suggestion",
            path: ROUTES.AI_MEAL_SUGGESTION,
            icon: BsStars,
        },
        {
            label: "Scan Food",
            path: ROUTES.IMAGE_RECOGNITION,
            icon: FiCamera,
        },
        {
            label: "Recipe",
            path: ROUTES.RECIPE,
            icon: MdFoodBank,
        },
    ];

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <Flex
            direction="column"
            w={isCollapsed ? "80px" : "260px"}
            h="100vh"
            bgGradient={sidebarBg}
            borderRight="1px"
            borderColor={borderColor}
            position="sticky"
            top={0}
            shadow="xl"
            animation={animationPresets.slideInLeft}
            transition={transitions.smooth}
            overflow="hidden"
        >
            {/* Logo Section */}
            <SidebarLogo isCollapsed={isCollapsed} />

            {/* Collapse Toggle Button */}
            <Box
                px={3}
                py={2}
                display="flex"
                justifyContent={isCollapsed ? "center" : "flex-end"}
            >
                <IconButton
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    icon={isCollapsed ? <ChevronRightIcon boxSize={5} /> : <ChevronLeftIcon boxSize={5} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="brand"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    borderRadius="lg"
                    transition={transitions.smooth}
                    _hover={{
                        bg: "brand.100",
                        transform: "scale(1.1)",
                    }}
                    _active={{
                        transform: "scale(0.95)",
                    }}
                />
            </Box>

            {/* Navigation Sections */}
            <VStack
                flex={1}
                spacing={1}
                px={3}
                py={2}
                align="stretch"
                overflowY="auto"
                overflowX="hidden"
                css={{
                    "&::-webkit-scrollbar": {
                        width: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "var(--chakra-colors-brand-300)",
                        borderRadius: "20px",
                    },
                }}
            >
                {/* Navigation Items */}
                <VStack spacing={1} align="stretch">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            item={item}
                            isActive={isActivePath(item.path)}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </VStack>
            </VStack>

            {/* User Profile Section */}
            {user && (
                <SidebarUserProfile
                    user={user}
                    isCollapsed={isCollapsed}
                    onLogout={logout}
                />
            )}
        </Flex>
    );
};

export default Sidebar;
