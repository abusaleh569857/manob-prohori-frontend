import { baseApi } from './baseApi';
import {
  ChatMessage,
  IncidentConversationData,
  UserConversationSummary,
} from '@/types/chat.types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentConversation: builder.query<IncidentConversationData, number | string>({
      query: (incidentId) => ({
        url: `/chat/incident/${incidentId}/conversation`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; data: IncidentConversationData }) => response.data,
      providesTags: (result, error, incidentId) => [{ type: 'Chat', id: incidentId }],
    }),

    getIncidentMessages: builder.query<
      { conversation: any; messages: ChatMessage[] },
      { incidentId: number | string; limit?: number; beforeMessageId?: number }
    >({
      query: ({ incidentId, limit = 50, beforeMessageId }) => ({
        url: `/chat/incident/${incidentId}/messages`,
        method: 'GET',
        params: { limit, beforeMessageId },
      }),
      transformResponse: (response: { success: boolean; data: { conversation: any; messages: ChatMessage[] } }) =>
        response.data,
      providesTags: (result, error, arg) => [{ type: 'Chat', id: `messages-${arg.incidentId}` }],
    }),

    sendIncidentMessage: builder.mutation<
      ChatMessage,
      {
        incidentId: number | string;
        body?: string;
        messageType?: 'TEXT' | 'IMAGE' | 'LOCATION' | 'SYSTEM';
        latitude?: number | null;
        longitude?: number | null;
        attachments?: Array<{ fileUrl: string; fileName?: string; mimeType?: string; fileSizeBytes?: number }>;
      }
    >({
      query: ({ incidentId, ...body }) => ({
        url: `/chat/incident/${incidentId}/messages`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { success: boolean; data: ChatMessage }) => response.data,
      invalidatesTags: (result, error, arg) => [{ type: 'Chat', id: `messages-${arg.incidentId}` }],
    }),

    markIncidentMessagesRead: builder.mutation<{ updated: boolean }, { incidentId: number | string; messageId: number }>({
      query: ({ incidentId, messageId }) => ({
        url: `/chat/incident/${incidentId}/read`,
        method: 'POST',
        body: { messageId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Chat', id: arg.incidentId }],
    }),

    getMyConversations: builder.query<UserConversationSummary[], void>({
      query: () => ({
        url: '/chat/conversations',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; data: UserConversationSummary[] }) => response.data,
      providesTags: ['Chat'],
    }),
  }),
});

export const {
  useGetIncidentConversationQuery,
  useGetIncidentMessagesQuery,
  useSendIncidentMessageMutation,
  useMarkIncidentMessagesReadMutation,
  useGetMyConversationsQuery,
} = chatApi;
