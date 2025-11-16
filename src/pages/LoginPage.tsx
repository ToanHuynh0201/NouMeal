import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "@/constants";
import LoginForm from "@/components/auth/LoginForm";
import RegisterModal from "@/components/auth/RegisterModal";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
        useState(false);

    const handleLoginSuccess = () => {
        const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
        navigate(from, {replace: true});
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
                key={isForgotPasswordModalOpen ? "forgot-open" : "forgot-closed"}
                isOpen={isForgotPasswordModalOpen}
                onClose={handleCloseForgotPassword}
            />
        </>
    );
}
