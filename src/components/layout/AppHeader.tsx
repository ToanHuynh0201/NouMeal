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

	// Get current date info
	const today = new Date();

	return (
		<Box
			bg="whiteAlpha.900"
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
				background:
					"linear-gradient(to right, rgba(249, 250, 251, 0.7), rgba(243, 232, 255, 0.5))",
				borderBottom: "1px solid rgba(159, 122, 234, 0.1)",
			}}>
			<Container
				maxW="7xl"
				py={4}>
				<Flex
					align="center"
					justify="space-between">
					{/* Left Section - Greeting */}
					{isAuthenticated && (
						<VStack
							align="start"
							spacing={0}
							display={{ base: "none", md: "flex" }}>
							<Text
								fontSize="sm"
								color="gray.500"
								fontWeight="500">
								{today.toLocaleDateString("en-US", {
									weekday: "long",
									month: "short",
									day: "numeric",
								})}
							</Text>
							<Text
								fontSize="lg"
								fontWeight="700"
								bgGradient="linear(to-r, purple.600, pink.500)"
								bgClip="text">
								Hello, {user?.name?.split(" ")[0] || "User"}! 👋
							</Text>
						</VStack>
					)}

					{/* Right Section - Auth Buttons or User Menu */}
					{/* Show Auth Buttons for non-authenticated users */}
					{showAuthButtons && !isAuthenticated ? (
						<HStack
							spacing={4}
							ml="auto">
							<Button
								variant="ghost"
								colorScheme="purple"
								size="md"
								fontWeight="600"
								_hover={{
									bg: "purple.50",
								}}
								onClick={() => navigate(ROUTES.LOGIN)}>
								Sign In
							</Button>
							<Button
								colorScheme="purple"
								size="md"
								fontWeight="600"
								bgGradient="linear(to-r, purple.400, pink.400)"
								_hover={{
									bgGradient:
										"linear(to-r, purple.500, pink.500)",
									transform: "translateY(-2px)",
									shadow: "lg",
								}}
								shadow="md"
								transition="all 0.3s ease"
								onClick={() => navigate(ROUTES.LOGIN)}>
								Get Started
							</Button>
						</HStack>
					) : isAuthenticated ? (
						/* User Info and Actions */
						<HStack
							spacing={4}
							ml="auto">
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
										px={4}
										py={2.5}
										bgGradient="linear(to-r, white, purple.50)"
										border="1px solid"
										borderColor="purple.100"
										borderRadius="full"
										transition={transitions.normal}
										_hover={{
											borderColor: "purple.300",
											shadow: "md",
											transform: "translateY(-2px)",
											bgGradient:
												"linear(to-r, purple.50, pink.50)",
										}}>
										<Avatar
											size="sm"
											name={user?.name}
											src={user?.avatar}
											bg="linear-gradient(135deg, #9F7AEA 0%, #EC4899 100%)"
											color="white"
											shadow="sm"
											getInitials={(name) =>
												getInitials(name, 2)
											}
										/>
										<VStack
											spacing={0}
											align="start"
											display={{
												base: "none",
												md: "flex",
											}}>
											<Text
												fontSize="sm"
												fontWeight="600"
												bgGradient="linear(to-r, purple.600, pink.500)"
												bgClip="text">
												{user?.name || "User"}
											</Text>
										</VStack>
										<ChevronDownIcon color="purple.400" />
									</HStack>
								</MenuButton>
								<MenuList
									bg="whiteAlpha.950"
									borderColor="purple.100"
									shadow="xl"
									borderRadius="xl"
									p={2}
									mt={2}
									sx={{
										backdropFilter: "blur(10px)",
										WebkitBackdropFilter: "blur(10px)",
									}}>
									<MenuItem
										icon={<CgProfile />}
										borderRadius="lg"
										fontWeight="500"
										_hover={{
											bg: "purple.50",
											color: "purple.600",
										}}
										onClick={() =>
											navigate(ROUTES.PROFILE)
										}>
										My Profile
									</MenuItem>
									<MenuItem
										icon={<LockIcon />}
										borderRadius="lg"
										fontWeight="500"
										_hover={{
											bg: "purple.50",
											color: "purple.600",
										}}
										onClick={onOpen}>
										Change Password
									</MenuItem>
									<MenuDivider />
									<MenuItem
										borderRadius="lg"
										fontWeight="500"
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
