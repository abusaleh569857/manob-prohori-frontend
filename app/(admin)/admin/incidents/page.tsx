import { MasterAdminIncidentsComponent } from "@/views/admin/incidents/master.admin-incidents";

export const metadata = {
  title: "Incident Triage & Dispatch | Admin Portal",
  description: "Manage emergency incidents, verify status, and dispatch volunteer responders",
};

export default function AdminIncidentsPage() {
  return <MasterAdminIncidentsComponent />;
}
