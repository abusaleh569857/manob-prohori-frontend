import { MasterEmergencyDirectoryView } from "@/views/emergency-directory/master.emergency-directory-view";

export const metadata = {
  title: "Emergency Services & Agency Directory | Manob Prohori",
  description: "Direct verified 24/7 hotline numbers for Ambulance, Fire Service, Police, and National Emergency Services (999) across Bangladesh.",
};

export default function EmergencyDirectoryPage() {
  return <MasterEmergencyDirectoryView />;
}
