import { createContext, useReducer, useEffect, useCallback, useRef } from "react";
import { notificationService } from "@/services/notificationService";
import type { NotificationContextType, Notification } from "@/types/notification";

// NotificationState type
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  limit: number;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  limit: 20,
};

// Action types
const NOTIFICATION_ACTIONS = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",
  UPDATE_UNREAD_COUNT: "UPDATE_UNREAD_COUNT",
  MARK_AS_READ: "MARK_AS_READ",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const notificationReducer = (state: NotificationState, action: any): NotificationState => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.FETCH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case NOTIFICATION_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        isLoading: false,
        error: null,
      };
    case NOTIFICATION_ACTIONS.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload.count,
      };
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        unreadCount: 0,
      };
    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Export context for use in hooks
export { NotificationContext };

// Notification provider component
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const intervalRef = useRef<number | null>(null);

  // Fetch notifications with pagination
  const fetchNotifications = useCallback(async (page: number = 1) => {
    dispatch({ type: NOTIFICATION_ACTIONS.FETCH_START });

    try {
      const response = await notificationService.getNotifications({
        page,
        limit: state.limit,
      });

      dispatch({
        type: NOTIFICATION_ACTIONS.FETCH_SUCCESS,
        payload: {
          notifications: response.data.notifications,
          unreadCount: response.data.unread_count,
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.pages,
        },
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch notifications";
      dispatch({
        type: NOTIFICATION_ACTIONS.FETCH_FAILURE,
        payload: { error: errorMessage },
      });
    }
  }, [state.limit]);

  // Mark a single notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);

      // Update local state to mark this notification as read
      const updatedNotifications = state.notifications.map(notif =>
        notif._id === notificationId ? { ...notif, is_read: true } : notif
      );

      const newUnreadCount = updatedNotifications.filter(n => !n.is_read).length;

      dispatch({
        type: NOTIFICATION_ACTIONS.FETCH_SUCCESS,
        payload: {
          notifications: updatedNotifications,
          unreadCount: newUnreadCount,
          currentPage: state.currentPage,
          totalPages: state.totalPages,
        },
      });
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
    }
  }, [state.notifications, state.currentPage, state.totalPages]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ });
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, []);

  // Refresh notifications (fetch unread count only for badge)
  const refreshNotifications = useCallback(async () => {
    try {
      const unreadCount = await notificationService.getUnreadCount();
      dispatch({
        type: NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT,
        payload: { count: unreadCount },
      });
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    // Initial fetch: Load first page of notifications
    fetchNotifications(1);

    // Set up interval for auto-refresh (only unread count)
    intervalRef.current = setInterval(() => {
      refreshNotifications();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNotifications, refreshNotifications]);

  const value: NotificationContextType = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isLoading: state.isLoading,
    error: state.error,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    fetchNotifications,
    markNotificationAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
