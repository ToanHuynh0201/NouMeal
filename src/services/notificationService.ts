import api from "@/lib/api";
import type { NotificationResponse } from "@/types/notification";

export const notificationService = {
	// Lấy tất cả notifications với pagination
	getNotifications: async (params?: {
		page?: number;
		limit?: number;
	}): Promise<NotificationResponse> => {
		try {
			const queryParams = new URLSearchParams();

			if (params?.page) {
				queryParams.append("page", params.page.toString());
			}
			if (params?.limit) {
				queryParams.append("limit", params.limit.toString());
			}

			const queryString = queryParams.toString();
			const url = `/notifications${queryString ? `?${queryString}` : ""}`;

			const response = await api.get(url);
			console.log(response.data.data);

			return response.data;
		} catch (error) {
			console.error("Error fetching notifications:", error);
			throw error;
		}
	},

	// Mark a single notification as read
	markNotificationAsRead: async (notificationId: string): Promise<void> => {
		try {
			await api.patch(`/notifications/${notificationId}/read`, {});
		} catch (error) {
			console.error("Error marking notification as read:", error);
			throw error;
		}
	},

	// Mark all notifications as read
	markAllAsRead: async (): Promise<void> => {
		try {
			await api.patch("/notifications/read-all", {});
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
			throw error;
		}
	},

	// Get unread count only
	getUnreadCount: async (): Promise<number> => {
		try {
			const response = await api.get("/notifications?limit=1");
			return response.data.data.unread_count;
		} catch (error) {
			console.error("Error fetching unread count:", error);
			return 0;
		}
	},
};
