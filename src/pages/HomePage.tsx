import MainLayout from "@/components/layout/MainLayout";
import {animationPresets} from "@/styles/animation";
import {Box, Container, VStack} from "@chakra-ui/react";

function HomePage() {
    return (
        <MainLayout showHeader={true} showFooter={true}>
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <Box animation={animationPresets.fadeInUp}></Box>
                </VStack>
            </Container>
        </MainLayout>
    );
}

export default HomePage;
