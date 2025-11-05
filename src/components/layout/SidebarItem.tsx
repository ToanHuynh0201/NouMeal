import {transitions} from "@/styles/animation";
import {
    HStack,
    Icon,
    Link,
    Text,
    Tooltip,
    useColorModeValue,
} from "@chakra-ui/react";
import {Link as RouterLink} from "react-router-dom";
import type {navItem} from "@/types/layout";

interface SidebarItemProps {
    item: navItem;
    isActive: boolean;
    isCollapsed: boolean;
}

export const SidebarItem = ({item, isActive, isCollapsed}: SidebarItemProps) => {
    const activeTextColor = useColorModeValue("white", "white");
    const inactiveTextColor = useColorModeValue("gray.600", "gray.300");
    const activeBgGradient = useColorModeValue(
        "linear(135deg, brand.400, brand.600)",
        "linear(135deg, brand.500, brand.700)"
    );
    const hoverBg = useColorModeValue("brand.50", "gray.700");

    return (
        <Tooltip
            label={isCollapsed ? item.label : ""}
            placement="right"
            hasArrow
            isDisabled={!isCollapsed}
        >
            <Link
                as={RouterLink}
                to={item.path}
                _hover={{textDecoration: "none"}}
                tabIndex={0}
                w="full"
            >
                <HStack
                    px={isCollapsed ? 2 : 4}
                    py={3}
                    borderRadius="xl"
                    spacing={isCollapsed ? 0 : 3}
                    justify={isCollapsed ? "center" : "flex-start"}
                    position="relative"
                    overflow="hidden"
                    role="button"
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    color={isActive ? activeTextColor : inactiveTextColor}
                    bgGradient={isActive ? activeBgGradient : "none"}
                    bg={isActive ? undefined : "transparent"}
                    shadow={isActive ? "lg" : "none"}
                    transition={transitions.smooth}
                    _hover={{
                        color: isActive ? "white" : "brand.600",
                        bgGradient: isActive ? activeBgGradient : "none",
                        bg: isActive ? undefined : hoverBg,
                        transform: isCollapsed ? "scale(1.08)" : "translateX(6px)",
                        shadow: "xl",
                    }}
                    _active={{
                        transform: isCollapsed ? "scale(0.98)" : "translateX(3px)",
                    }}
                    _before={
                        isActive && !isCollapsed
                            ? {
                                  content: '""',
                                  position: "absolute",
                                  left: 0,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  width: "4px",
                                  height: "60%",
                                  bgGradient: "linear(to-b, white, brand.100)",
                                  borderRadius: "0 4px 4px 0",
                                  shadow: "0 0 10px rgba(255,255,255,0.5)",
                              }
                            : {}
                    }
                >
                    <Icon
                        as={item.icon}
                        boxSize={isCollapsed ? 6 : 5}
                        color={isActive ? "white" : "currentColor"}
                        transition={transitions.smooth}
                    />
                    {!isCollapsed && (
                        <Text
                            fontSize="sm"
                            fontWeight={isActive ? "bold" : "semibold"}
                            letterSpacing="wide"
                        >
                            {item.label}
                        </Text>
                    )}
                </HStack>
            </Link>
        </Tooltip>
    );
};
