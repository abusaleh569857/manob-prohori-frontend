import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/70 font-sans text-brand-navy">
      {/* Fixed Sticky Sidebar for Admin */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-360 w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
