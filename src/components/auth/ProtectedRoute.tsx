import {useAuth} from "@/hooks/useAuth";
import {ROUTES} from "@/constants";
import {Navigate, useLocation} from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedRoute = ({children}: any) => {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();
    
    if (isLoading) {
        return (
            <LoadingSpinner
                message="Authenticating..."
                minHeight="100vh"
                variant="primary"
            />
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{from: location}} replace />;
    }

    return children;
};

export default ProtectedRoute;
