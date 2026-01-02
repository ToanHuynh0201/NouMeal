import {useAuth} from "@/hooks/useAuth";
import {ROUTES} from "@/constants";
import {Navigate, useLocation} from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import {authService} from "@/services";
import {Box, Heading, Text, Button, VStack} from "@chakra-ui/react";
import {WarningIcon} from "@chakra-ui/icons";
import {getSubdomainInfo, redirectToSubdomain} from "@/utils/subdomain";
import {useEffect} from "react";

interface AdminRouteProps {
	children: React.ReactNode;
}

const AdminRoute = ({children}: AdminRouteProps) => {
	const {isAuthenticated, isLoading} = useAuth();
	const location = useLocation();

	// Check subdomain on mount and when auth changes
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			const isAdmin = authService.isAdmin();
			const subdomainInfo = getSubdomainInfo();

			// Redirect admin to admin subdomain if not already there
			if (isAdmin && !subdomainInfo.isAdmin) {
				redirectToSubdomain(true);
			}
		}
	}, [isLoading, isAuthenticated]);

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
	const subdomainInfo = getSubdomainInfo();

	// Check if user is not admin
	if (!isAdmin) {
		// If on admin subdomain, redirect to user domain
		if (subdomainInfo.isAdmin) {
			redirectToSubdomain(false);
			return (
				<LoadingSpinner
					message="Redirecting..."
					minHeight="100vh"
					variant="primary"
				/>
			);
		}

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

	// Check if admin is not on admin subdomain
	if (!subdomainInfo.isAdmin) {
		return (
			<LoadingSpinner
				message="Redirecting to admin portal..."
				minHeight="100vh"
				variant="primary"
			/>
		);
	}

	return <>{children}</>;
};

export default AdminRoute;
