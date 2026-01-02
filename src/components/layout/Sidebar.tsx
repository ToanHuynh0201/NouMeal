import { animationPresets, transitions } from "@/styles/animation";
import {
	Box,
	Flex,
	IconButton,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import type { navItem } from "@/types/layout";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarItem } from "./SidebarItem";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { FiCamera, FiBook, FiUsers } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { MdRestaurantMenu, MdDashboard, MdFastfood } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiCommunityLine } from "react-icons/ri";

function Sidebar() {
	const location = useLocation();
	const { user, logout } = useAuth();
	const { isAdmin } = useRole();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleSidebar = () => setIsCollapsed(!isCollapsed);

	// Color mode values
	const sidebarBg = useColorModeValue(
		"linear(to-b, rgba(100, 181, 246, 0.1), rgba(236, 72, 153, 0.1))",
		"linear(to-b, rgba(26, 32, 44, 0.95), rgba(23, 25, 35, 0.95))",
	);
	const borderColor = useColorModeValue(
		"rgba(159, 122, 234, 0.1)",
		"gray.700",
	);

	// Navigation items for regular users
	const userNavItems: navItem[] = [
		{
			label: "Dashboard",
			path: ROUTES.DASHBOARD,
			icon: MdDashboard,
		},
		{
			label: "Profile",
			path: ROUTES.PROFILE,
			icon: CgProfile,
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
	];

	// Navigation items for admin
	const adminNavItems: navItem[] = [
		{
			label: "Overall",
			path: ROUTES.ADMIN_OVERALL,
			icon: MdDashboard,
		},
		{
			label: "Users",
			path: ROUTES.ADMIN_USERS,
			icon: FiUsers,
		},
		{
			label: "Food",
			path: ROUTES.ADMIN_FOOD,
			icon: MdFastfood,
		},
		{
			label: "Foods Management",
			path: ROUTES.ADMIN_FOODS_MANAGEMENT,
			icon: FiBook,
		},
		{
			label: "Community",
			path: ROUTES.ADMIN_COMMUNITY,
			icon: RiCommunityLine,
		},
	];

	// Select nav items based on user role
	const navItems = isAdmin ? adminNavItems : userNavItems;

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
			sx={{
				backdropFilter: "blur(12px) saturate(180%)",
				WebkitBackdropFilter: "blur(12px) saturate(180%)",
			}}>
			{/* Logo Section */}
			<SidebarLogo isCollapsed={isCollapsed} />

			{/* Collapse Toggle Button */}
			<Box
				px={3}
				py={2}
				display="flex"
				justifyContent={isCollapsed ? "center" : "flex-end"}>
				<IconButton
					aria-label={
						isCollapsed ? "Expand sidebar" : "Collapse sidebar"
					}
					icon={
						isCollapsed ? (
							<ChevronRightIcon boxSize={5} />
						) : (
							<ChevronLeftIcon boxSize={5} />
						)
					}
					size="sm"
					variant="ghost"
					colorScheme="brand"
					onClick={toggleSidebar}
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
				}}>
				{/* Navigation Items */}
				<VStack
					spacing={1}
					align="stretch">
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
			{user && !isAdmin && (
				<SidebarUserProfile
					user={user}
					isCollapsed={isCollapsed}
					onLogout={logout}
					onToggleSidebar={toggleSidebar}
				/>
			)}
		</Flex>
	);
}

export default Sidebar;
