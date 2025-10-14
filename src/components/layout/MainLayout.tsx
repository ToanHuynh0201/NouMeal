import {useThemeGradients} from "@/styles/themeUtils";
import type {MainLayoutProps} from "@/types/props";
import {Box, Flex} from "@chakra-ui/react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import Sidebar from "./Sidebar";

const MainLayout = ({
    children,
    showHeader = true,
    showFooter = true,
}: MainLayoutProps) => {
    const {mainBgGradient: bgGradient} = useThemeGradients();
    return (
        <Flex minH="100vh" bgGradient={bgGradient}>
            <Sidebar />

            <Flex direction="column" flex="1">
                {showHeader && <AppHeader />}

                <Box as="main" flex="1" p={6}>
                    {children}
                </Box>

                {showFooter && <AppFooter />}
            </Flex>
        </Flex>
    );
};

export default MainLayout;
