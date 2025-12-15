import type { ReactNode } from "react";
import { authService } from "@/services";

interface RoleGuardProps {
	children: ReactNode;
	allowedRoles: string[];
	fallback?: ReactNode;
}

const RoleGuard = ({
	children,
	allowedRoles,
	fallback = null,
}: RoleGuardProps) => {
	const hasAccess = allowedRoles.some((role) => authService.hasRole(role));
	return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default RoleGuard;
