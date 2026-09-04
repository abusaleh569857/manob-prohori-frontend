import { MasterAdminCategoriesComponent } from "@/views/admin/categories/master.admin-categories";

export const metadata = {
  title: "Incident Categories Management | Admin Portal",
  description: "Manage dynamic emergency taxonomy, categories, icons, and activation status",
};

export default function AdminCategoriesPage() {
  return <MasterAdminCategoriesComponent />;
}
