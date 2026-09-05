import { MasterFindHelpComponent } from "@/views/find-help/master.find-help";

export const metadata = {
  title: "Find Emergency Help & Resources | Manob Prohori",
  description: "Directory of emergency hotlines, hospitals, ambulances, blood banks, and disaster shelters across Bangladesh.",
};

export default function FindHelpPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 py-6">
      <MasterFindHelpComponent />
    </div>
  );
}
