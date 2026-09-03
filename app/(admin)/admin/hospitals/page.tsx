import { MasterAdminHospitalsComponent } from "@/views/admin/hospitals/master.admin-hospitals";

export const metadata = {
  title: "Hospital Network & Emergency Facilities | Admin Portal",
  description: "Manage 24/7 medical hubs and hospital directories",
};

export default function AdminHospitalsPage() {
  return <MasterAdminHospitalsComponent />;
}
