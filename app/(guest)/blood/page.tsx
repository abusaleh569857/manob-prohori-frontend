import { MasterBloodDirectoryView } from "@/views/blood/master.blood-directory-view";

export const metadata = {
  title: "Emergency Blood Network & Urgent Matches | Manob Prohori",
  description:
    "Real-time emergency blood requests and verified donor network across Bangladesh. Automated spatial proximity matching connects patients and donors instantly.",
};

export default function BloodPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 py-6">
      <MasterBloodDirectoryView />
    </div>
  );
}

