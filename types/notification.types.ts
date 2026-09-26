export type NotificationType =
  | 'INCIDENT_ALERT'
  | 'VOLUNTEER_REQUEST'
  | 'BLOOD_REQUEST'
  | 'CHAT_MESSAGE'
  | 'RELIEF_UPDATE'
  | 'SYSTEM';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface NotificationItem {
  id: number;
  userId: number;
  notificationType: NotificationType;
  title: string;
  body: string;
  referenceType: string | null;
  referenceId: number | null;
  priority: NotificationPriority;
  isRead: boolean;
  readAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: NotificationItem[];
  total: number;
  limit: number;
  offset: number;
}
