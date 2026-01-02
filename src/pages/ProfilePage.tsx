import {
	Box,
	Container,
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	VStack,
} from "@chakra-ui/react";
import MainLayout from "@/components/layout/MainLayout";
import UserInfoSection from "@/components/profile/UserInfoSection";
import TrackingSection from "@/components/profile/TrackingSection";
import UserPostsSection from "@/components/profile/UserPostsSection";
import { animationPresets } from "@/styles/animation";

const ProfilePage = () => {
	return (
		<MainLayout
			showHeader={true}
			showFooter={true}>
			<Container
				maxW="7xl"
				py={8}>
				<VStack
					spacing={6}
					align="stretch">
					<Box animation={animationPresets.fadeIn}>
						<Heading
							size="xl"
							mb={2}>
							My Profile
						</Heading>
					</Box>

					<Tabs
						variant="enclosed"
						colorScheme="blue"
						animation={animationPresets.fadeIn}>
						<TabList>
							<Tab fontWeight="semibold">👤 User Information</Tab>
							<Tab fontWeight="semibold">
								📊 Tracking & Analytics
							</Tab>
							<Tab fontWeight="semibold">📝 My Posts</Tab>
						</TabList>

						<TabPanels>
							<TabPanel
								px={0}
								py={6}>
								<UserInfoSection />
							</TabPanel>

							<TabPanel
								px={0}
								py={6}>
								<TrackingSection />
							</TabPanel>

							<TabPanel
								px={0}
								py={6}>
								<UserPostsSection />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</VStack>
			</Container>
		</MainLayout>
	);
};

export default ProfilePage;
