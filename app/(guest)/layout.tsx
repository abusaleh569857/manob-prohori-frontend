import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

// ============================================================================
// Guest Route Group Layout
// Automatically provides the shared navigation header & footer for all guest pages.
// ============================================================================
export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Global Responsive Navbar Container */}
      <div className="relative mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 z-30">
        <Navbar />
      </div>
      {/* Main Page View Content */}
      <main className="grow">{children}</main>
      {/* Global Responsive Footer */}
      <Footer />
    </div>
  );
}
