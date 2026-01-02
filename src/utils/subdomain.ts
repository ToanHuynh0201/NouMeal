/**
 * Subdomain utility functions
 * Handles subdomain detection and validation for multi-tenant routing
 */

export interface SubdomainInfo {
	subdomain: string | null;
	isAdmin: boolean;
	isUser: boolean;
}

/**
 * Gets the current subdomain from the window location
 * @returns SubdomainInfo object containing subdomain information
 */
export const getSubdomainInfo = (): SubdomainInfo => {
	const hostname = window.location.hostname;

	// Split hostname by dots
	const parts = hostname.split(".");

	// For localhost:
	// - admin.localhost -> parts = ["admin", "localhost"]
	// - localhost -> parts = ["localhost"]
	//
	// For production (e.g., mealgenie.com):
	// - admin.mealgenie.com -> parts = ["admin", "mealgenie", "com"]
	// - mealgenie.com -> parts = ["mealgenie", "com"]

	let subdomain: string | null = null;

	// Check if there's a subdomain
	if (parts.length > 1 && parts[0] !== "www") {
		// For localhost: admin.localhost
		if (parts[1] === "localhost" || parts[1].includes("localhost")) {
			subdomain = parts[0];
		}
		// For production domains: admin.example.com
		else if (parts.length >= 3) {
			subdomain = parts[0];
		}
	}

	return {
		subdomain,
		isAdmin: subdomain === "admin",
		isUser: subdomain === null || subdomain === "www",
	};
};

/**
 * Redirects to the appropriate subdomain based on user role
 * @param isAdmin - Whether the user is an admin
 */
export const redirectToSubdomain = (isAdmin: boolean): void => {
	const currentSubdomain = getSubdomainInfo();
	const protocol = window.location.protocol;
	const hostname = window.location.hostname;
	const port = window.location.port ? `:${window.location.port}` : "";
	const path = window.location.pathname;

	// Determine base domain (without any subdomain)
	let baseDomain: string;
	const parts = hostname.split(".");

	// For localhost
	if (parts.includes("localhost") || hostname === "localhost") {
		baseDomain = "localhost";
	}
	// For production domains
	else if (parts.length >= 2) {
		// If there's a subdomain, take last 2 parts (domain.com)
		// Otherwise, use as is
		baseDomain = parts.length >= 3 ? parts.slice(-2).join(".") : hostname;
	} else {
		baseDomain = hostname;
	}

	// If user is admin but not on admin subdomain
	if (isAdmin && !currentSubdomain.isAdmin) {
		const newUrl = `${protocol}//admin.${baseDomain}${port}${path}`;
		window.location.href = newUrl;
		return;
	}

	// If user is regular user but on admin subdomain
	if (!isAdmin && currentSubdomain.isAdmin) {
		const newUrl = `${protocol}//${baseDomain}${port}${path}`;
		window.location.href = newUrl;
		return;
	}
};

/**
 * Validates if current subdomain matches user role
 * @param isAdmin - Whether the user is an admin
 * @returns true if subdomain matches role, false otherwise
 */
export const validateSubdomain = (isAdmin: boolean): boolean => {
	const subdomainInfo = getSubdomainInfo();

	// Admin should be on admin subdomain
	if (isAdmin) {
		return subdomainInfo.isAdmin;
	}

	// Regular user should NOT be on admin subdomain
	return subdomainInfo.isUser;
};

/**
 * Gets the base URL for API calls based on current subdomain
 * @returns base domain without subdomain
 */
export const getBaseDomain = (): string => {
	const hostname = window.location.hostname;
	const parts = hostname.split(".");

	// For localhost
	if (parts.includes("localhost")) {
		return "localhost";
	}

	// For production domains, return domain without subdomain
	if (parts.length >= 3) {
		return parts.slice(-2).join(".");
	}

	return hostname;
};
