import { useAuth } from "@/hooks/useAuth";
import { animationPresets, transitions } from "@/styles/animation";
import type { AppHeaderProps } from "@/types";
import { getInitials } from "@/utils";
import { ChevronDownIcon, LockIcon } from "@chakra-ui/icons";
import { CgProfile } from "react-icons/cg";
import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spacer,
	Text,
	useColorModeValue,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

const AppHeader = ({ onLogout, showAuthButtons = false }: AppHeaderProps) => {
	const { user, isAuthenticated } = useAuth();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();

	const borderColor = useColorModeValue("gray.200", "gray.600");

	return (
		<Box
			bg="whiteAlpha.800"
			shadow="sm"
			borderBottom="1px"
			borderColor={borderColor}
			position="sticky"
			top={0}
			zIndex={10}
			backdropFilter="blur(12px)"
			animation={animationPresets.slideInLeft}
			sx={{
				backdropFilter: "blur(12px) saturate(180%)",
				WebkitBackdropFilter: "blur(12px) saturate(180%)",
			}}>
			<Container
				maxW="7xl"
				py={3}>
				<Flex align="center">
					{/* Logo */}
					<HStack
						spacing={3}
						cursor="pointer"
						onClick={() =>
							navigate(
								isAuthenticated
									? ROUTES.DASHBOARD
									: ROUTES.LANDING,
							)
						}>
						<Box
							p={2}
							bg="white"
							borderRadius="lg"
							shadow="md"
							transition={transitions.normal}
							_hover={{
								transform: "scale(1.05)",
								shadow: "lg",
							}}>
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
						<Text
							fontSize="xl"
							fontWeight="bold"
							color="brand.600"
							lineHeight={1}>
							MealGenie
						</Text>
					</HStack>

					<Spacer />

					{/* Show Auth Buttons for non-authenticated users */}
					{showAuthButtons && !isAuthenticated ? (
						<HStack spacing={4}>
							<Button
								variant="ghost"
								colorScheme="purple"
								onClick={() => navigate(ROUTES.LOGIN)}>
								Sign In
							</Button>
							<Button
								colorScheme="purple"
								onClick={() => navigate(ROUTES.LOGIN)}>
								Get Started
							</Button>
						</HStack>
					) : isAuthenticated ? (
						/* User Info and Actions */
						<HStack spacing={4}>
							{/* User Profile Menu */}
							<Menu>
								<MenuButton
									as={Box}
									role="button"
									cursor="pointer"
									_hover={{ transform: "translateY(-1px)" }}
									transition={transitions.normal}>
									<HStack
										spacing={3}
										p={2}
										bg="gray.50"
										borderRadius="lg"
										transition={transitions.normal}
										_hover={{
											bg: "gray.100",
											transform: "translateY(-1px)",
											shadow: "md",
										}}>
										<Avatar
											size="sm"
											name={user?.name}
											src={user?.avatar}
											bg="brand.500"
											color="white"
											shadow="md"
											getInitials={(name) =>
												getInitials(name, 2)
											}
										/>
										<VStack
											spacing={0}
											align="start">
											<Text
												fontSize="sm"
												fontWeight="bold"
												color="gray.800">
												{user?.name || "User"}
											</Text>
										</VStack>
										<ChevronDownIcon />
									</HStack>
								</MenuButton>
								<MenuList
									bg="white"
									borderColor="gray.200"
									shadow="xl"
									borderRadius="lg"
									p={1}>
									<MenuItem
										icon={<CgProfile />}
										borderRadius="md"
										_hover={{
											bg: "blue.50",
											color: "blue.600",
										}}
										onClick={() =>
											navigate(ROUTES.PROFILE)
										}>
										My Profile
									</MenuItem>
									<MenuItem
										icon={<LockIcon />}
										borderRadius="md"
										_hover={{
											bg: "blue.50",
											color: "blue.600",
										}}
										onClick={onOpen}>
										Change Password
									</MenuItem>
									<MenuDivider />
									<MenuItem
										borderRadius="md"
										_hover={{
											bg: "red.50",
											color: "red.600",
										}}
										color="red.500"
										onClick={onLogout}>
										Logout
									</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
					) : null}
				</Flex>
			</Container>

			{/* Change Password Modal */}
			<ChangePasswordModal
				isOpen={isOpen}
				onClose={onClose}
			/>
		</Box>
	);
};

export default AppHeader;
