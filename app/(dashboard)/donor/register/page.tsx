import { MasterDonorRegisterView } from "@/views/donor/master.donor-register-view";

export const metadata = {
  title: "Apply as Blood Donor | Manob Prohori",
  description: "Register your blood group, upload verified pathology documentation, and join Bangladesh's emergency life-saving network.",
};

export default function DonorRegisterPage() {
  return <MasterDonorRegisterView />;
}
