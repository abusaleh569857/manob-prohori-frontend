export type MessageType = 'TEXT' | 'IMAGE' | 'LOCATION' | 'SYSTEM';

export interface MessageAttachment {
  id: number;
  messageId: number;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes?: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderUserId: number;
  messageType: MessageType;
  body: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  editedAt?: string | null;
  senderName: string;
  senderPhone?: string;
  senderPhoto?: string | null;
  attachments?: MessageAttachment[];
}

export interface ChatParticipant {
  userId: number;
  name: string;
  phone?: string;
  email?: string;
  photoUrl?: string | null;
  joinedAt: string;
  lastReadMessageId?: number | null;
  roles?: string;
}

export interface IncidentConversation {
  id: number;
  incident_id: number;
  conversation_type: 'INCIDENT' | 'DIRECT';
  title: string;
  created_by: number;
  created_at: string;
  incident_title?: string;
  incident_status?: string;
  incident_severity?: string;
}

export interface IncidentConversationData {
  conversation: IncidentConversation;
  userRole: 'REPORTER' | 'RESPONDER' | 'ADMIN';
  participants: ChatParticipant[];
}

export interface UserConversationSummary {
  id: number;
  incidentId: number;
  conversationType: 'INCIDENT' | 'DIRECT';
  title: string;
  createdAt: string;
  incidentTitle: string;
  incidentStatus: string;
  incidentSeverity: string;
  lastMessageBody: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}
