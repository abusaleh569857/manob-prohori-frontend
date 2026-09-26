'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  AlertTriangle,
  Flame,
  Droplet,
  MessageSquare,
  HeartHandshake,
  CheckCheck,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from '@/redux/api/notificationApi';
import { NotificationItem, NotificationType } from '@/types/notification.types';
import { toast } from 'sonner';

export const NotificationBell: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Poll for new notifications every 20 seconds
  const { data: countData } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 20000,
  });
  const unreadCount = countData?.unreadCount || 0;

  const { data: notifData, refetch } = useGetMyNotificationsQuery(
    { limit: 10, offset: 0 },
    { skip: !isOpen }
  );

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      await markRead(notif.id);
    }
    setIsOpen(false);

    // Route depending on reference
    if (notif.referenceType === 'INCIDENT' && notif.referenceId) {
      router.push(`/incidents/${notif.referenceId}`);
    } else if (notif.notificationType === 'BLOOD_REQUEST') {
      router.push('/blood');
    } else if (notif.notificationType === 'RELIEF_UPDATE') {
      router.push('/relief');
    } else if (notif.notificationType === 'VOLUNTEER_REQUEST') {
      router.push('/volunteer/mission');
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead().unwrap();
      toast.success('সবগুলো নোটিফিকেশন পঠিত হিসেবে চিহ্নিত করা হয়েছে');
      refetch();
    } catch {
      toast.error('ব্যর্থ হয়েছে, অনুগ্রহ করে পুনরায় চেষ্টা করুন');
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'INCIDENT_ALERT':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'VOLUNTEER_REQUEST':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'BLOOD_REQUEST':
        return <Droplet className="w-4 h-4 text-rose-500" />;
      case 'CHAT_MESSAGE':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'RELIEF_UPDATE':
        return <HeartHandshake className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="নোটিফিকেশন"
        className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-gradient-to-r from-red-600 to-rose-600 text-[10px] font-bold text-white shadow-md">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-400" />
              <h3 className="font-semibold text-sm text-white">জরুরি নোটিফিকেশন</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  {unreadCount} নতুন
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={isMarkingAll}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors disabled:opacity-50"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>সব পঠিত</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
            {!notifData?.notifications || notifData.notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-sm">কোনো নতুন নোটিফিকেশন নেই</p>
                <p className="text-xs text-slate-500 mt-1">সবজরুরি আপডেট এখানে প্রদর্শিত হবে</p>
              </div>
            ) : (
              notifData.notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 items-start relative ${
                    !n.isRead ? 'bg-red-500/5' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                    {getIcon(n.notificationType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className={`text-xs font-semibold truncate ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 ring-4 ring-red-500/20"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-white/5 border-t border-white/10 text-center">
            <Link
              href="/incidents"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <span>লাইভ ইমার্জেন্সি ফিড দেখুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
