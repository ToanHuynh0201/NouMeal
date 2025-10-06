import {animationPresets, transitions} from "@/styles/animation";
import {
    Box,
    HStack,
    Icon,
    IconButton,
    Link,
    Text,
    Tooltip,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import {useState} from "react";
import {Link as RouterLink, useLocation} from "react-router-dom";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import type {navItem} from "@/types/layout";
import {ROUTES} from "@/constants";
import {FiHome} from "react-icons/fi";

function Sidebar() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const sidebarBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const navItems: navItem[] = [
        {
            label: "Home",
            path: ROUTES.HOME,
            icon: FiHome,
        },
    ];

    const isActivePath = (path: string) => location.pathname === path;

    return (
        <Box
            w={isCollapsed ? "80px" : "240px"}
            h="100vh"
            bg={sidebarBg}
            borderRight="1px"
            borderColor={borderColor}
            position="sticky"
            top={0}
            shadow="lg"
            animation={animationPresets.slideInLeft}
            transition={transitions.normal}
        >
            {/*Logo Section*/}
            <Box
                p={isCollapsed ? 3 : 6}
                borderBottom="1px"
                borderColor={borderColor}
            >
                {isCollapsed ? (
                    <Box display="flex" justifyContent="center">
                        <Box
                            p={2}
                            bg="white"
                            borderRadius="lg"
                            shadow="md"
                            animation={animationPresets.float}
                            transition={transitions.normal}
                            _hover={{
                                transform: "scale(1.05)",
                                shadow: "lg",
                            }}
                        >
                            <img
                                src="/vite.svg"
                                alt="MealGenie Logo"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    objectFit: "contain",
                                }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <HStack spacing={3}>
                        <Box
                            p={2}
                            bg="white"
                            borderRadius="lg"
                            shadow="md"
                            animation={animationPresets.float}
                            transition={transitions.normal}
                            _hover={{
                                transform: "scale(1.05)",
                                shadow: "lg",
                            }}
                        >
                            <img
                                src="/vite.svg"
                                alt="MealGenie Logo"
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    objectFit: "contain",
                                }}
                            />
                        </Box>
                        <VStack spacing={0} align="start">
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color="brand.600"
                                lineHeight={1}
                            >
                                MealGenie
                            </Text>
                        </VStack>
                    </HStack>
                )}
            </Box>
            {/* Collapse Toggle Button */}
            <Box
                p={2}
                display="flex"
                justifyContent={isCollapsed ? "center" : "flex-end"}
            >
                <IconButton
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    _hover={{
                        bg: "brand.50",
                        color: "brand.600",
                    }}
                />
            </Box>

            {/* Navigation */}
            <VStack spacing={2} p={2} align="stretch">
                {navItems.map((item) => (
                    <Tooltip
                        key={item.path}
                        label={isCollapsed ? item.label : ""}
                        placement="right"
                        isDisabled={!isCollapsed}
                    >
                        <Link
                            as={RouterLink}
                            to={item.path}
                            _hover={{textDecoration: "none"}}
                        >
                            <HStack
                                px={isCollapsed ? 2 : 4}
                                py={3}
                                borderRadius="lg"
                                spacing={isCollapsed ? 0 : 3}
                                justify={isCollapsed ? "center" : "flex-start"}
                                color={
                                    isActivePath(item.path)
                                        ? "brand.600"
                                        : "gray.600"
                                }
                                bg={
                                    isActivePath(item.path)
                                        ? "brand.50"
                                        : "transparent"
                                }
                                borderWidth={1}
                                borderColor={
                                    isActivePath(item.path)
                                        ? "brand.200"
                                        : "transparent"
                                }
                                transition={transitions.normal}
                                _hover={{
                                    color: "brand.600",
                                    bg: "brand.50",
                                    borderColor: "brand.200",
                                    transform: isCollapsed
                                        ? "scale(1.05)"
                                        : "translateX(4px)",
                                }}
                                _active={{
                                    transform: isCollapsed
                                        ? "scale(1)"
                                        : "translateX(2px)",
                                }}
                            >
                                <Icon
                                    as={item.icon}
                                    boxSize={isCollapsed ? 6 : 5}
                                    color={
                                        isActivePath(item.path)
                                            ? "brand.500"
                                            : "gray.500"
                                    }
                                />
                                {!isCollapsed && (
                                    <Text
                                        fontSize="md"
                                        fontWeight={
                                            isActivePath(item.path)
                                                ? "semibold"
                                                : "medium"
                                        }
                                    >
                                        {item.label}
                                    </Text>
                                )}
                            </HStack>
                        </Link>
                    </Tooltip>
                ))}
            </VStack>
        </Box>
    );
}

export default Sidebar;
