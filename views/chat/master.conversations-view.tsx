'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  AlertTriangle,
  Flame,
  Radio,
  Clock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Users,
} from 'lucide-react';
import { useGetMyConversationsQuery } from '@/redux/api/chatApi';
import { IncidentChatModal } from '@/components/chat/incident-chat-modal';

export const MasterConversationsView: React.FC = () => {
  const { data: conversations, isLoading, refetch } = useGetMyConversationsQuery(undefined, {
    pollingInterval: 15000,
  });

  const [activeIncidentId, setActiveIncidentId] = useState<number | null>(null);
  const [activeIncidentTitle, setActiveIncidentTitle] = useState<string>('');

  const handleOpenChat = (incidentId: number, title: string) => {
    setActiveIncidentId(incidentId);
    setActiveIncidentTitle(title);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>রিয়েল-টাইম ট্যাকটিকাল কমিউনিকেশন হাব</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              আমার অপারেশনাল চ্যানেলসমূহ
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              আপনার রিপোর্টকৃত বা রেসপন্ডার হিসেবে যুক্ত থাকা দুর্যোগের লাইভ সমন্বয় চ্যানেল
            </p>
          </div>

          <Link
            href="/crisis-map"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>লাইভ ক্রাইসিস ম্যাপ</span>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-sm text-slate-400">চ্যানেলসমূহ লোড হচ্ছে...</p>
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center max-w-lg mx-auto">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white">কোনো সক্রিয় চ্যানেল পাওয়া যায়নি</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              আপনি কোনো দুর্যোগ রিপোর্ট করলে অথবা ভলান্টিয়ার হিসেবে কোনো রেসকিউ মিশনে যুক্ত হলে স্বয়ংক্রিয়ভাবে একটি লাইভ ট্যাকটিকাল চ্যানেল তৈরি হবে।
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/incidents/report"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs hover:from-red-500 hover:to-rose-500 transition shadow-lg"
              >
                জরুরি দুর্যোগ রিপোর্ট করুন
              </Link>
              <Link
                href="/volunteer/mission"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs transition"
              >
                রেসকিউ মিশন দেখুন
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleOpenChat(conv.incidentId, conv.incidentTitle || conv.title)}
                className="group relative p-5 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-red-500/40 hover:bg-slate-900 transition-all duration-200 cursor-pointer shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3 h-3" />
                      <span>{conv.incidentSeverity || 'CRISIS'}</span>
                    </span>

                    {conv.unreadCount > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold animate-pulse shadow-md">
                        {conv.unreadCount} নতুন বার্তা
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {conv.lastMessageTime
                          ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : new Date(conv.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {conv.incidentTitle || conv.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
                    {conv.lastMessageBody ? conv.lastMessageBody : 'চ্যানেল প্রস্তুত রয়েছে, সমন্বয় শুরু করুন...'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>ট্যাকটিকাল চ্যানেল লাইভ</span>
                  </span>
                  <div className="flex items-center gap-1 text-red-400 group-hover:translate-x-1 transition-transform">
                    <span>চ্যানেল খুলুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Chat Modal */}
      {activeIncidentId && (
        <IncidentChatModal
          incidentId={activeIncidentId}
          incidentTitle={activeIncidentTitle}
          isOpen={!!activeIncidentId}
          onClose={() => {
            setActiveIncidentId(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};
