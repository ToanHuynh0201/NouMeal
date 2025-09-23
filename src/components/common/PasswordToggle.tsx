import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {IconButton, useDisclosure} from "@chakra-ui/react";

export default function PasswordToggle() {
    const {isOpen: showPassword, onToggle: togglePassword} = useDisclosure();

    const button = (
        <IconButton
            h="1.75rem"
            size="sm"
            onClick={togglePassword}
            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
            variant="ghost"
            aria-label={showPassword ? "Hide password" : "Show password"}
            color="gray.500"
            _hover={{color: "blue.500", bg: "blue.50"}}
            borderRadius="md"
        />
    );
    return {showPassword, button};
}
