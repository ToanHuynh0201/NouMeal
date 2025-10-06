import MainLayout from "@/components/layout/MainLayout";
import {animationPresets} from "@/styles/animation";
import {Box, Container, VStack} from "@chakra-ui/react";

function HomePage() {
    return (
        <MainLayout showHeader={true} showFooter={true}>
            <Container maxW="7xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <Box
                        animation={animationPresets.fadeInUp}
                        overflow="hidden"
                        bgGradient="linear(135deg, blue.400 0%, purple.500 50%, pink.400 100%)"
                        color="white"
                        py={12}
                        position="relative"
                    ></Box>
                </VStack>
            </Container>
        </MainLayout>
    );
}

export default HomePage;
