import { Metadata } from 'next';
import { MasterConversationsView } from '@/views/chat/master.conversations-view';

export const metadata: Metadata = {
  title: 'লাইভ ট্যাকটিকাল চ্যানেল ও চ্যাট | মানব প্রহরী',
  description: 'দুর্যোগ রেসপন্ডার, নাগরিক ও টিম সমন্বয় চ্যানেল',
};

export default function ChatPage() {
  return <MasterConversationsView />;
}
