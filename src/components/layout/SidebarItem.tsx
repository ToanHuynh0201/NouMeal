import { transitions } from "@/styles/animation";
import {
	HStack,
	Icon,
	Link,
	Text,
	Tooltip,
	useColorModeValue,
	Box,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import type { navItem } from "@/types/layout";

interface SidebarItemProps {
	item: navItem;
	isActive: boolean;
	isCollapsed: boolean;
}

export const SidebarItem = ({
	item,
	isActive,
	isCollapsed,
}: SidebarItemProps) => {
	const activeTextColor = useColorModeValue("white", "white");
	const inactiveTextColor = useColorModeValue("gray.600", "gray.300");
	const activeBgGradient = useColorModeValue(
		"linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)",
		"linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)",
	);
	const hoverBg = useColorModeValue("rgba(100, 181, 246, 0.1)", "gray.700");

	return (
		<Tooltip
			label={isCollapsed ? item.label : ""}
			placement="right"
			hasArrow
			isDisabled={!isCollapsed}>
			<Link
				as={RouterLink}
				to={item.path}
				_hover={{ textDecoration: "none" }}
				tabIndex={0}
				w="full">
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
						color: isActive ? "white" : "blue.500",
						bgGradient: isActive ? activeBgGradient : "none",
						bg: isActive ? undefined : hoverBg,
						transform: isCollapsed
							? "scale(1.08)"
							: "translateX(6px)",
						shadow: "lg",
					}}
					_active={{
						transform: isCollapsed
							? "scale(0.98)"
							: "translateX(3px)",
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
									bgGradient: "linear(to-b, white, pink.200)",
									borderRadius: "0 4px 4px 0",
									shadow: "0 0 10px rgba(255,255,255,0.5)",
							  }
							: {}
					}>
					<Box position="relative">
						<Icon
							as={item.icon}
							boxSize={isCollapsed ? 6 : 5}
							color={isActive ? "white" : "currentColor"}
							transition={transitions.smooth}
						/>
						{item.badge && item.badge > 0 && (
							<Box
								position="absolute"
								top="-6px"
								right="-6px"
								bg="red.500"
								color="white"
								borderRadius="full"
								minW="16px"
								h="16px"
								display="flex"
								alignItems="center"
								justifyContent="center"
								fontSize="9px"
								fontWeight="bold"
								border="2px solid"
								borderColor={isActive ? "white" : "rgba(255, 255, 255, 0.5)"}
								zIndex={1}
							>
								{item.badge > 99 ? "99+" : item.badge}
							</Box>
						)}
					</Box>
					{!isCollapsed && (
						<Text
							fontSize="sm"
							fontWeight={isActive ? "bold" : "semibold"}
							letterSpacing="wide"
							flex={1}>
							{item.label}
						</Text>
					)}
					{!isCollapsed && item.badge && item.badge > 0 && (
						<Box
							bg="red.500"
							color="white"
							borderRadius="full"
							minW="20px"
							h="20px"
							display="flex"
							alignItems="center"
							justifyContent="center"
							fontSize="10px"
							fontWeight="bold"
							px={1.5}
						>
							{item.badge > 99 ? "99+" : item.badge}
						</Box>
					)}
				</HStack>
			</Link>
		</Tooltip>
	);
};
