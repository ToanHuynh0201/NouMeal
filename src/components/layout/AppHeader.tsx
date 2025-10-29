import {useAuth} from "@/hooks/useAuth";
import {animationPresets, transitions} from "@/styles/animation";
import {getInitials} from "@/utils";
import {ChevronDownIcon, LockIcon} from "@chakra-ui/icons";
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
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
const AppHeader = ({onLogout}: any) => {
    const {user} = useAuth();
    const {onOpen} = useDisclosure();

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
            }}
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
                                cursor="pointer"
                                _hover={{transform: "translateY(-1px)"}}
                                transition={transitions.normal}
                            >
                                <HStack
                                    spacing={3}
                                    p={2}
                                    bg="whiteAlpha.700"
                                    borderRadius="lg"
                                    transition={transitions.normal}
                                    backdropFilter="blur(8px)"
                                    border="1px solid"
                                    borderColor="whiteAlpha.300"
                                    _hover={{
                                        bg: "whiteAlpha.800",
                                        transform: "translateY(-1px)",
                                        shadow: "lg",
                                        borderColor: "whiteAlpha.400",
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
                                    icon={<LockIcon />}
                                    borderRadius="md"
                                    _hover={{
                                        bg: "blue.50",
                                        color: "blue.600",
                                    }}
                                    onClick={onOpen}
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
            {/* <ChangePasswordModal isOpen={isOpen} onClose={onClose} /> */}
        </Box>
    );
};

export default AppHeader;
