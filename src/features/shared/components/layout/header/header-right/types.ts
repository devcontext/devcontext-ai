export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: "info" | "success" | "warning" | "error";
}

export interface NotificationsMenuProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
}

export interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
}
