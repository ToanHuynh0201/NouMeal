import { ROUTES } from "@/constants";
import { transitions } from "@/styles/animation";
import {
	Avatar,
	Badge,
	Box,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface SidebarUserProfileProps {
	user: {
		name?: string;
		email: string;
		avatar?: string;
	};
	isCollapsed: boolean;
	onLogout: () => void;
	onToggleSidebar?: () => void;
}

export const SidebarUserProfile = ({
	user,
	isCollapsed,
	onLogout,
	onToggleSidebar,
}: SidebarUserProfileProps) => {
	const userSectionBg = useColorModeValue(
		"rgba(255, 255, 255, 0.7)",
		"gray.800",
	);
	const userSectionHoverBg = useColorModeValue(
		"rgba(243, 232, 255, 0.6)",
		"gray.700",
	);
	const borderColor = useColorModeValue("purple.100", "gray.700");
	const textColor = useColorModeValue("gray.800", "white");
	const navigate = useNavigate();
	return (
		<Box
			mt="auto"
			p={3}
			borderTop="1px"
			borderColor={borderColor}
			bg={userSectionBg}
			backdropFilter="blur(10px)"
			position="relative"
			_before={{
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				height: "1px",
				bgGradient:
					"linear(to-r, transparent, purple.400, pink.400, transparent)",
				opacity: 0.6,
			}}>
			<Menu
				placement="top-end"
				isLazy>
				<MenuButton
					as={Box}
					cursor="pointer"
					transition={transitions.smooth}
					_hover={{
						bg: userSectionHoverBg,
					}}
					borderRadius="xl"
					p={2}
					onClick={() => {
						if (isCollapsed && onToggleSidebar) {
							onToggleSidebar();
						}
					}}>
					{isCollapsed ? (
						<Tooltip
							label="Profile"
							placement="right"
							hasArrow>
							<Flex justify="center">
								<Avatar
									size="sm"
									name={user.name || user.email}
									src={user.avatar}
									bg="linear-gradient(135deg, #64B5F6 0%, #EC4899 100%)"
									color="white"
									shadow="md"
									ring={2}
									ringColor="blue.200"
									_hover={{
										shadow: "lg",
										transform: "scale(1.1)",
										ringColor: "pink.300",
									}}
									transition={transitions.smooth}
								/>
							</Flex>
						</Tooltip>
					) : (
						<HStack spacing={3}>
							<Avatar
								size="sm"
								name={user.name || user.email}
								src={user.avatar}
								bg="linear-gradient(135deg, #64B5F6 0%, #EC4899 100%)"
								color="white"
								shadow="md"
								ring={2}
								ringColor="blue.200"
								transition={transitions.smooth}
								_hover={{
									ringColor: "pink.300",
								}}
							/>
							<VStack
								spacing={0}
								align="start"
								flex={1}>
								<Text
									fontSize="sm"
									fontWeight="bold"
									color={textColor}
									noOfLines={1}>
									{user.name || "User"}
								</Text>
								<HStack spacing={1}>
									<Badge
										colorScheme="green"
										fontSize="2xs"
										px={2}
										borderRadius="full"
										variant="subtle">
										● Active
									</Badge>
								</HStack>
							</VStack>
						</HStack>
					)}
				</MenuButton>
				<MenuList
					shadow="2xl"
					borderColor={borderColor}
					borderRadius="xl"
					py={2}
					minW="200px">
					<Box
						px={3}
						py={2}
						mb={2}>
						<Text
							fontSize="xs"
							color="gray.500"
							fontWeight="semibold">
							Account
						</Text>
						<Text
							fontSize="sm"
							fontWeight="bold"
							color={textColor}>
							{user.name || "User"}
						</Text>
						<Text
							fontSize="xs"
							color="gray.500"
							noOfLines={1}>
							{user.email}
						</Text>
					</Box>
					<MenuDivider />
					<MenuItem
						icon={<FiUser size={16} />}
						fontSize="sm"
						borderRadius="lg"
						mx={2}
						transition={transitions.smooth}
						onClick={() => navigate(ROUTES.PROFILE)}
						_hover={{
							bg: "blue.50",
							color: "blue.600",
							transform: "translateX(4px)",
						}}>
						View Profile
					</MenuItem>
					<MenuDivider />
					<MenuItem
						icon={<FiLogOut size={16} />}
						fontSize="sm"
						color="red.500"
						borderRadius="lg"
						mx={2}
						onClick={onLogout}
						transition={transitions.smooth}
						_hover={{
							bg: "red.50",
							color: "red.600",
							transform: "translateX(4px)",
						}}>
						Logout
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
};
