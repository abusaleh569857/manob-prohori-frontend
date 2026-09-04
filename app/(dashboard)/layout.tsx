import UserSidebar from "@/components/layout/user-sidebar";
import UserHeader from "@/components/layout/user-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-brand-navy">
      {/* Fixed / Sticky Responsive Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <UserSidebar />
      </div>

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        <UserHeader />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-6 py-5 sm:py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
