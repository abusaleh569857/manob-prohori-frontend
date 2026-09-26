import UserSidebar from "@/components/layout/user-sidebar";
import UserHeader from "@/components/layout/user-header";
import VolunteerSearch from "./components/VolunteerSearch";
import VolunteerCard from "./components/VolunteerCard";

interface Volunteer {
  volunteer_id: number;
  photo_path?: string | null;
  location_text: string;
  availability_status: "online" | "offline";
  rating?: number | null;
  name: string;
  phone: string;
  distance: number;
}

interface NearbyVolunteerProps {
  volunteers: Volunteer[];
}

export default function NearbyVolunteer({
  volunteers,
}: NearbyVolunteerProps) {
  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans text-brand-navy">
      {/* ================= SIDEBAR ================= */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        <UserSidebar />
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <UserHeader />

        {/* Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
          {/* ================= PAGE HEADER ================= */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                নিকটবর্তী ভলান্টিয়ার
              </h2>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                আপনার এলাকার সক্রিয় উদ্ধারকর্মীদের তালিকা
              </p>
            </div>

            {/* Search */}
            <div className="flex flex-wrap items-center gap-4">
              <VolunteerSearch />
            </div>
          </div>

          {/* ================= VOLUNTEER GRID ================= */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {volunteers.length > 0 ? (
              volunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer.volunteer_id}
                  volunteer={volunteer}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-xs">
                <span className="material-symbols-outlined text-5xl text-gray-400">
                  group_off
                </span>

                <h3 className="mt-3 text-lg font-bold text-slate-800">
                  কোনো নিকটবর্তী ভলান্টিয়ার পাওয়া যায়নি
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  আপনার এলাকার ৩ কিলোমিটারের মধ্যে বর্তমানে কোনো verified volunteer নেই।
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}