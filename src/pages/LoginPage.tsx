import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import LoginForm from "@/components/auth/LoginForm";
import RegisterModal from "@/components/auth/RegisterModal";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";

export default function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
	const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
		useState(false);

	const handleLoginSuccess = (user?: any) => {
		// Check user role and redirect accordingly
		const isAdmin = user?.role === "ADMIN";
		const defaultRoute = isAdmin ? ROUTES.ADMIN_OVERALL : ROUTES.DASHBOARD;

		// Only use 'from' if it's appropriate for the user's role
		const from = location.state?.from?.pathname;
		let targetRoute = defaultRoute;

		if (from) {
			// If user is admin and 'from' is an admin route, use it
			// If user is regular and 'from' is not an admin route, use it
			const isAdminRoute = from.startsWith("/admin");
			if (isAdmin && isAdminRoute) {
				targetRoute = from;
			} else if (!isAdmin && !isAdminRoute) {
				targetRoute = from;
			}
			// Otherwise, use defaultRoute
		}

		navigate(targetRoute, { replace: true });
	};

	const handleOpenRegister = () => {
		setIsForgotPasswordModalOpen(false);
		setIsRegisterModalOpen(true);
	};

	const handleCloseRegister = () => {
		setIsRegisterModalOpen(false);
	};

	const handleOpenForgotPassword = () => {
		setIsRegisterModalOpen(false);
		setIsForgotPasswordModalOpen(true);
	};

	const handleCloseForgotPassword = () => {
		setIsForgotPasswordModalOpen(false);
	};

	return (
		<>
			<LoginForm
				onLoginSuccess={handleLoginSuccess}
				onOpenRegister={handleOpenRegister}
				onOpenForgotPassword={handleOpenForgotPassword}
			/>

			<RegisterModal
				key={isRegisterModalOpen ? "register-open" : "register-closed"}
				isOpen={isRegisterModalOpen}
				onClose={handleCloseRegister}
			/>

			<ForgotPasswordModal
				key={
					isForgotPasswordModalOpen ? "forgot-open" : "forgot-closed"
				}
				isOpen={isForgotPasswordModalOpen}
				onClose={handleCloseForgotPassword}
			/>
		</>
	);
}
