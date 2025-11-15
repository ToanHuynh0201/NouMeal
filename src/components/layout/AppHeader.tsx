import {useAuth} from "@/hooks/useAuth";
import {animationPresets, transitions} from "@/styles/animation";
import type {AppHeaderProps} from "@/types";
import {getInitials} from "@/utils";
import {ChevronDownIcon, LockIcon} from "@chakra-ui/icons";
import {CgProfile} from "react-icons/cg";
import {
    Avatar,
    Box,
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
    // useDisclosure,
    VStack,
} from "@chakra-ui/react";
import ChangePasswordModal from "../auth/ChangePasswordModal";

const AppHeader = ({onLogout}: any) => {
    const {user} = useAuth();
    const {isOpen, onOpen, onClose} = useDisclosure();

    const headerBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    return (
        <Box
            bg={headerBg}
            shadow="xl"
            borderBottom="1px"
            borderColor={borderColor}
            position="sticky"
            top={0}
            zIndex={10}
            backdropFilter="blur(10px)"
            animation={animationPresets.slideInLeft}
        >
            <Container maxW="7xl" py={3}>
                <Flex align="center">
                    <Spacer />

                    {/* User Info and Actions */}
                    <HStack spacing={4}>
                        {/* User Profile Menu */}
                        <Menu>
                            <MenuButton
                                as={Box}
                                role="button"
                                cursor="pointer"
                                _hover={{transform: "translateY(-1px)"}}
                                transition={transitions.normal}
                            >
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
                                    }}
                                >
                                    <Avatar
                                        size="sm"
                                        name={user?.name}
                                        src={user?.avatar}
                                        bg="brand.500"
                                        color="white"
                                        shadow="md"
                                        getInitials={(name) => getInitials(name, 2)}
                                    />
                                    <VStack spacing={0} align="start">
                                        <Text
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="gray.800"
                                        >
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
                                p={1}
                            >
                                <MenuItem
                                    icon={<CgProfile />}
                                    borderRadius="md"
                                    _hover={{
                                        bg: "blue.50",
                                        color: "blue.600",
                                    }}
                                    onClick={() => navigate(ROUTES.PROFILE)}
                                >
                                    My Profile
                                </MenuItem>
                                <MenuItem
                                    icon={<LockIcon />}
                                    borderRadius="md"
                                    _hover={{
                                        bg: "blue.50",
                                        color: "blue.600",
                                    }}
                                >
                                    Change Password
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    borderRadius="md"
                                    _hover={{bg: "red.50", color: "red.600"}}
                                    color="red.500"
                                    onClick={onLogout}
                                >
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                </Flex>
            </Container>

            {/* Change Password Modal */}
            <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default AppHeader;
