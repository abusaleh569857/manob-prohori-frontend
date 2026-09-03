import { MasterAdminBloodDonorsComponent } from "@/views/admin/blood-donors/master.admin-blood-donors";

export const metadata = {
  title: "Blood Donors Verification & Registry | Admin Portal",
  description: "Verify pathology reports and manage blood donor network",
};

export default function AdminBloodDonorsPage() {
  return <MasterAdminBloodDonorsComponent />;
}
