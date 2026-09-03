import { MasterAdminReliefComponent } from "@/views/admin/relief/master.admin-relief";

export const metadata = {
  title: "Relief Requests & Aid Verification | Admin Portal",
  description: "Verify victim relief requests and authorize direct donation publishing",
};

export default function AdminReliefPage() {
  return <MasterAdminReliefComponent />;
}
