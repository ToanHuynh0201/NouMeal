import {useAuth} from "@/hooks/useAuth";
import {ROUTES} from "@/constants";
import {Navigate, useLocation} from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import {authService} from "@/services";
import {Box, Heading, Text, Button, VStack} from "@chakra-ui/react";
import {WarningIcon} from "@chakra-ui/icons";

interface UserRouteProps {
	children: React.ReactNode;
}

const UserRoute = ({children}: UserRouteProps) => {
	const {isAuthenticated, isLoading} = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<LoadingSpinner
				message="Verifying permissions..."
				minHeight="100vh"
				variant="primary"
			/>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.LOGIN} state={{from: location}} replace />;
	}

	const isAdmin = authService.isAdmin();

	// If user is admin, redirect to admin dashboard
	if (isAdmin) {
		return (
			<Box
				minH="100vh"
				display="flex"
				alignItems="center"
				justifyContent="center"
				bg="gray.50"
			>
				<VStack spacing={6} textAlign="center" p={8}>
					<WarningIcon boxSize={16} color="orange.500" />
					<Heading size="xl">Admin Account Detected</Heading>
					<Text fontSize="lg" color="gray.600" maxW="md">
						This page is for regular users only.
						Please use the admin dashboard to manage the system.
					</Text>
					<Button
						colorScheme="brand"
						size="lg"
						onClick={() => (window.location.href = ROUTES.ADMIN_OVERALL)}
					>
						Go to Admin Dashboard
					</Button>
				</VStack>
			</Box>
		);
	}

	return <>{children}</>;
};

export default UserRoute;
