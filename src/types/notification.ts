export interface NotificationMetadata {
  post_id?: {
    _id: string;
    author?: {
      _id: string;
      name: string;
    };
    text?: string;
  };
  comment_id?: {
    _id: string;
    author?: {
      _id: string;
      name: string;
    };
    content?: {
      text: string;
      media: string[];
    };
  };
  text_preview?: string;
  [key: string]: any;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  type: "post_like" | "post_comment" | "comment_like" | "follow" | "mention" | "system";
  target_type: "Post" | "Comment" | "User" | "System";
  target_id?: any; // Can be populated object or string ID
  metadata?: NotificationMetadata;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    unread_count: number;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchNotifications: (page?: number) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}
