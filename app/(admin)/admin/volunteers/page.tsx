import { MasterAdminVolunteersComponent } from "@/views/admin/volunteers/master.admin-volunteers";

export const metadata = {
  title: "Volunteer Verification & Directory | Admin Portal",
  description: "Verify training certifications and manage emergency volunteer responders",
};

export default function AdminVolunteersPage() {
  return <MasterAdminVolunteersComponent />;
}
