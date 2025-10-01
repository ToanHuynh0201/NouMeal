import LoginForm from "@/components/auth/LoginForm";
import {useLocation, useNavigate} from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLoginSuccess = () => {
        const from = location.state?.from?.pathname || "/home";
        navigate(from, {replace: true});
    };
    return <LoginForm onLoginSuccess={handleLoginSuccess}></LoginForm>;
}
