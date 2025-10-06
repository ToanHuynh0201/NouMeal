// FIXED VERSION - src/pages/LoginPage.tsx
import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterModal from "@/components/auth/RegisterModal";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLoginSuccess = () => {
        const from = location.state?.from?.pathname || "/home";
        navigate(from, {replace: true});
    };

    const handleOpenRegister = () => {
        setIsModalOpen(true);
    };

    const handleCloseRegister = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onOpenRegister={handleOpenRegister}
            />

            <RegisterModal
                key={isModalOpen ? "open" : "closed"}
                isOpen={isModalOpen}
                onClose={handleCloseRegister}
            />
        </>
    );
}
