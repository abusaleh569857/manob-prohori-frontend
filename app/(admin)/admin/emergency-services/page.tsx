import { MasterAdminEmergencyServicesComponent } from "@/views/admin/emergency-services/master.admin-emergency-services";

export const metadata = {
  title: "Emergency Services Directory | Admin Portal",
  description: "Maintain national emergency hotlines and response contacts",
};

export default function AdminEmergencyServicesPage() {
  return <MasterAdminEmergencyServicesComponent />;
}
