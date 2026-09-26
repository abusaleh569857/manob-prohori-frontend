'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  X,
  Send,
  MapPin,
  Image as ImageIcon,
  Radio,
  Shield,
  User,
  Users,
  AlertCircle,
  ExternalLink,
  Loader2,
  Navigation,
} from 'lucide-react';
import {
  useGetIncidentConversationQuery,
  useGetIncidentMessagesQuery,
  useSendIncidentMessageMutation,
  useMarkIncidentMessagesReadMutation,
} from '@/redux/api/chatApi';
import { getSocket } from '@/lib/socket';
import { ChatMessage, MessageType } from '@/types/chat.types';
import { toast } from 'sonner';

interface IncidentChatModalProps {
  incidentId: number;
  incidentTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentChatModal: React.FC<IncidentChatModalProps> = ({
  incidentId,
  incidentTitle,
  isOpen,
  onClose,
}) => {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id;
  const token = (session as any)?.backendAccessToken;

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // RTK Query: Initial load & polling fallback
  const { data: convData, isLoading: isConvLoading } = useGetIncidentConversationQuery(
    incidentId,
    { skip: !isOpen || !incidentId }
  );

  const { data: messagesData, refetch: refetchMessages } = useGetIncidentMessagesQuery(
    { incidentId, limit: 50 },
    { skip: !isOpen || !incidentId, pollingInterval: isLiveConnected ? 0 : 5000 }
  );

  const [sendMessageMutation, { isLoading: isSending }] = useSendIncidentMessageMutation();
  const [markReadMutation] = useMarkIncidentMessagesReadMutation();

  // Sync messages from query
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  // Mark latest message as read
  useEffect(() => {
    if (messages.length > 0 && isOpen) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderUserId !== currentUserId) {
        markReadMutation({ incidentId, messageId: lastMsg.id }).catch(() => {});
      }
    }
  }, [messages, incidentId, currentUserId, isOpen, markReadMutation]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Socket.IO Setup
  useEffect(() => {
    if (!isOpen || !incidentId) return;

    const socket = getSocket(token);

    const onConnect = () => {
      setIsLiveConnected(true);
      socket.emit('join_incident', { incidentId }, (res: any) => {
        if (res?.success) {
          setIsLiveConnected(true);
        }
      });
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.on('connect', onConnect);
    }

    const onNewMessage = (payload: { incidentId: number; message: ChatMessage }) => {
      if (Number(payload.incidentId) === Number(incidentId)) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.message.id)) return prev;
          return [...prev, payload.message];
        });
      }
    };

    const onUserTyping = (data: { incidentId: number; userName: string }) => {
      if (Number(data.incidentId) === Number(incidentId)) {
        setTypingUser(data.userName);
      }
    };

    const onUserStopTyping = (data: { incidentId: number }) => {
      if (Number(data.incidentId) === Number(incidentId)) {
        setTypingUser(null);
      }
    };

    socket.on('new_incident_message', onNewMessage);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);

    return () => {
      socket.emit('leave_incident', { incidentId });
      socket.off('new_incident_message', onNewMessage);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
      socket.off('connect', onConnect);
    };
  }, [isOpen, incidentId, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    const socket = getSocket(token);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { incidentId, userName: session?.user?.name || 'Responder' });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', { incidentId });
    }, 1500);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || isSending) return;

    try {
      setMessageText('');
      const socket = getSocket(token);
      socket.emit('stop_typing', { incidentId });
      setIsTyping(false);

      if (isLiveConnected) {
        socket.emit('send_incident_message', {
          incidentId,
          body: trimmed,
          messageType: 'TEXT',
        });
      } else {
        await sendMessageMutation({
          incidentId,
          body: trimmed,
          messageType: 'TEXT',
        }).unwrap();
      }
    } catch {
      toast.error('বার্তা পাঠানো সম্ভব হয়নি');
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      toast.error('আপনার ব্রাউজার জিপিএস সাপোর্ট করে না');
      return;
    }

    setIsSharingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsSharingLocation(false);
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const body = `📍 লাইভ জিপিএস লোকেশন শেয়ার করেছেন: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

          const socket = getSocket(token);
          if (isLiveConnected) {
            socket.emit('send_incident_message', {
              incidentId,
              body,
              messageType: 'LOCATION',
              latitude: lat,
              longitude: lng,
            });
          } else {
            await sendMessageMutation({
              incidentId,
              body,
              messageType: 'LOCATION',
              latitude: lat,
              longitude: lng,
            }).unwrap();
          }
          toast.success('আপনার লাইভ অবস্থান সফলভাবে শেয়ার করা হয়েছে');
        } catch {
          toast.error('অবস্থান শেয়ার করতে সমস্যা হয়েছে');
        }
      },
      () => {
        setIsSharingLocation(false);
        toast.error('জিপিএস লোকেশন নেওয়া সম্ভব হয়নি, ডিভাইসের লোকেশন অন করুন');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl h-[88vh] max-h-[750px] bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 ${
                  isLiveConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                }`}
              ></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {incidentTitle ? incidentTitle : `Incident #${incidentId} Ops Channel`}
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isLiveConnected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isLiveConnected ? 'Live Socket' : 'Auto Polling'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>ফিল্ড রেসপন্ডার, নাগরিক ও টিম সমন্বয় চ্যানেল</span>
                {convData?.participants && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Users className="w-3 h-3" />
                    {convData.participants.length} জন যুক্ত
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Participants Pill Strip */}
        {convData?.participants && convData.participants.length > 0 && (
          <div className="px-5 py-2 bg-white/5 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
            <span className="font-semibold text-slate-500 shrink-0">টিম সদস্য:</span>
            {convData.participants.map((p) => (
              <span
                key={p.userId}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 shrink-0 text-[11px]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{p.name}</span>
                {p.roles?.includes('ADMIN') && (
                  <span className="text-[9px] text-amber-400 font-bold uppercase">(Admin)</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-900/60">
          {isConvLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6">
              <Radio className="w-10 h-10 text-slate-600 mb-2 opacity-60" />
              <p className="text-sm font-medium text-slate-300">চ্যানেলে এখনো কোনো বার্তা নেই</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                জরুরি পরিস্থিতি, লাইভ লোকেশন অথবা উদ্ধার নির্দেশিকা নিচে টাইপ করে রেসপন্ডারদের সাথে সরাসরি সমন্বয় করুন।
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderUserId === currentUserId;
              const isLocation = msg.messageType === 'LOCATION' || (msg.latitude && msg.longitude);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-400">
                      {isMe ? 'আপনি' : msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-md ${
                      isMe
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-200 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {isLocation ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-semibold text-xs">
                          <MapPin className="w-4 h-4 text-amber-300 animate-bounce" />
                          <span>লাইভ কোঅর্ডিনেট পিন</span>
                        </div>
                        <p className="text-xs font-mono bg-black/20 p-2 rounded-xl border border-white/10">
                          Lat: {msg.latitude?.toFixed(5)}, Lng: {msg.longitude?.toFixed(5)}
                        </p>
                        <a
                          href={`https://www.google.com/maps?q=${msg.latitude},${msg.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-200 hover:text-white underline"
                        >
                          <span>গুগল ম্যাপসে দেখুন</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                        {msg.body}
                      </p>
                    )}

                    {/* Attachments if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {msg.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl overflow-hidden border border-white/20 hover:opacity-90 transition"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={att.fileUrl}
                              alt={att.fileName || 'Attachment'}
                              className="max-h-48 w-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Notification */}
        {typingUser && (
          <div className="px-5 py-1.5 bg-slate-950/60 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400 italic">
            <span className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>
            <span>{typingUser} লিখছেন...</span>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-slate-950/90 border-t border-white/10 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleShareLocation}
            disabled={isSharingLocation}
            title="লাইভ জিপিএস লোকেশন শেয়ার করুন"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 border border-white/10 transition disabled:opacity-50"
          >
            {isSharingLocation ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
          </button>

          <input
            type="text"
            value={messageText}
            onChange={handleInputChange}
            placeholder="বার্তা লিখুন (রেসপন্ডার ও টিম সমন্বয়)..."
            className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />

          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className="p-2.5 sm:px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs sm:text-sm hover:from-red-500 hover:to-rose-500 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">পাঠান</span>
          </button>
        </form>
      </div>
    </div>
  );
};
