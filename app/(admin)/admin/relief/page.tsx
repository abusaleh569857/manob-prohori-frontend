import { MasterAdminReliefView } from "@/views/admin/relief/master.admin-relief";

export const metadata = {
  title: "Relief Campaigns Verification & Moderation | Admin Portal",
  description: "Verify disaster damage documentation, authenticate victim mobile financial accounts, and publish public campaigns.",
};

export default function AdminReliefPage() {
  return <MasterAdminReliefView />;
}
