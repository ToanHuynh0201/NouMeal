import {useAuth} from "@/hooks/useAuth";
import {ROUTES} from "@/constants";
import {Navigate, useLocation} from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import {authService} from "@/services";
import {Box, Heading, Text, Button, VStack} from "@chakra-ui/react";
import {WarningIcon} from "@chakra-ui/icons";

interface AdminRouteProps {
	children: React.ReactNode;
}

const AdminRoute = ({children}: AdminRouteProps) => {
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

	if (!isAdmin) {
		return (
			<Box
				minH="100vh"
				display="flex"
				alignItems="center"
				justifyContent="center"
				bg="gray.50"
			>
				<VStack spacing={6} textAlign="center" p={8}>
					<WarningIcon boxSize={16} color="red.500" />
					<Heading size="xl">Access Denied</Heading>
					<Text fontSize="lg" color="gray.600" maxW="md">
						You don't have permission to access this page.
						Administrator privileges are required.
					</Text>
					<Button
						colorScheme="brand"
						size="lg"
						onClick={() => (window.location.href = ROUTES.DASHBOARD)}
					>
						Go to Dashboard
					</Button>
				</VStack>
			</Box>
		);
	}

	return <>{children}</>;
};

export default AdminRoute;
