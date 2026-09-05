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
    <>
      {/* ================= SIDEBAR ================= */}
      <UserSidebar />

      {/* ================= MAIN ================= */}
      <main
        className="
          ml-[280px]
          min-h-screen
          w-[calc(100%-280px)]
          bg-[#f7fafc]
        "
      >
        {/* Header */}
        <UserHeader />

        {/* Content */}
        <div className="px-8 py-8">
          {/* ================= PAGE HEADER ================= */}
          <div
            className="
              mb-8
              flex
              flex-wrap
              items-end
              justify-between
              gap-6
            "
          >
            {/* Title */}
            <div>
              <h2
                className="
                  text-5xl
                  font-bold
                  leading-tight
                  text-[#181c1e]
                "
              >
                নিকটবর্তী ভলান্টিয়ার
              </h2>

              <p
                className="
                  mt-2
                  text-[15px]
                  text-[#5b403e]
                "
              >
                আপনার এলাকার সক্রিয় উদ্ধারকর্মীদের তালিকা
              </p>
            </div>

            {/* Search */}
            <div className="flex flex-wrap items-center gap-4">
              <VolunteerSearch />
            </div>
          </div>

          {/* ================= VOLUNTEER GRID ================= */}
          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {volunteers.length > 0 ? (
              volunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer.volunteer_id}
                  volunteer={volunteer}
                />
              ))
            ) : (
              <div
                className="
                  col-span-full
                  rounded-xl
                  bg-white
                  p-10
                  text-center
                  shadow-sm
                "
              >
                <span className="material-symbols-outlined text-5xl text-gray-400">
                  group_off
                </span>

                <h3 className="mt-3 text-xl font-semibold text-gray-700">
                  কোনো নিকটবর্তী ভলান্টিয়ার পাওয়া যায়নি
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  আপনার এলাকার ৩ কিলোমিটারের মধ্যে
                  বর্তমানে কোনো verified volunteer নেই।
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}