import { MasterAdminAuditLogsComponent } from "@/views/admin/audit-logs/master.admin-audit-logs";

export const metadata = {
  title: "System Audit Logs | Admin Portal",
  description: "Traceable event logs and admin moderation history",
};

export default function AdminAuditLogsPage() {
  return <MasterAdminAuditLogsComponent />;
}
