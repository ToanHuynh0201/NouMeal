import {useAuth} from "@/hooks/useAuth";
import {ROUTES} from "@/constants";
import {Navigate, useLocation} from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import {authService} from "@/services";
import {Box, Heading, Text, Button, VStack} from "@chakra-ui/react";
import {WarningIcon} from "@chakra-ui/icons";
import {getSubdomainInfo, redirectToSubdomain} from "@/utils/subdomain";
import {useEffect} from "react";

interface UserRouteProps {
	children: React.ReactNode;
}

const UserRoute = ({children}: UserRouteProps) => {
	const {isAuthenticated, isLoading} = useAuth();
	const location = useLocation();

	// Check subdomain on mount and when auth changes
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			const isAdmin = authService.isAdmin();
			const subdomainInfo = getSubdomainInfo();

			console.log('UserRoute subdomain check:', { isAdmin, subdomainInfo, location: location.pathname });

			// Redirect user away from admin subdomain if they're there
			if (!isAdmin && subdomainInfo.isAdmin) {
				console.log('Redirecting user away from admin subdomain');
				redirectToSubdomain(false);
			}
			// Redirect admin to admin subdomain if they're not there
			else if (isAdmin && !subdomainInfo.isAdmin) {
				console.log('Redirecting admin to admin subdomain');
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

	// If user is admin
	if (isAdmin) {
		// Redirect to admin subdomain if not already there
		if (!subdomainInfo.isAdmin) {
			redirectToSubdomain(true);
			return (
				<LoadingSpinner
					message="Redirecting to admin portal..."
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

	// If regular user is on admin subdomain, redirect them
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

	return <>{children}</>;
};

export default UserRoute;
