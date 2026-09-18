import { MasterDonorDashboardView } from "@/views/donor/master.donor-dashboard-view";

export const metadata = {
  title: "Donor Dashboard & Emergency Radar | Manob Prohori",
  description: "Manage blood donation availability, view urgent matching requests in your area, and respond to patients in critical need.",
};

export default function DonorDashboardPage() {
  return <MasterDonorDashboardView />;
}
