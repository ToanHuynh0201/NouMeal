import { useAuth } from "./useAuth";
import { ROLES } from "@/constants";
import { authService } from "@/services";

export interface UseRoleReturn {
	isAdmin: boolean;
	isUser: boolean;
	hasRole: (role: string) => boolean;
	userRole: string | undefined;
}

export const useRole = (): UseRoleReturn => {
	const { user } = useAuth();

	return {
		isAdmin: authService.isAdmin(),
		isUser: authService.hasRole(ROLES.USER),
		hasRole: (role: string) => authService.hasRole(role),
		userRole: user?.role,
	};
};
