import { baseApi } from './baseApi';
import { NotificationItem, NotificationResponse } from '@/types/notification.types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<
      NotificationResponse,
      { limit?: number; offset?: number; unreadOnly?: boolean } | void
    >({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params: params || { limit: 20, offset: 0 },
      }),
      transformResponse: (response: { success: boolean; data: NotificationResponse }) => response.data,
      providesTags: ['Notification'],
    }),

    getUnreadNotificationCount: builder.query<{ unreadCount: number }, void>({
      query: () => ({
        url: '/notifications/unread-count',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; data: { unreadCount: number } }) => response.data,
      providesTags: ['Notification'],
    }),

    markNotificationRead: builder.mutation<{ updated: boolean }, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    markAllNotificationsRead: builder.mutation<{ updatedCount: number }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
