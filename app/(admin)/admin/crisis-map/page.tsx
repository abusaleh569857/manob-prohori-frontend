import { MasterAdminCrisisMapComponent } from "@/views/admin/crisis-map/master.admin-crisis-map";

export const metadata = {
  title: "National Crisis Map & GIS Radar | Admin Command Center",
  description: "Nationwide live emergency telemetry, crisis heatmap, division rankings, and tactical volunteer dispatch",
};

export default function AdminCrisisMapPage() {
  return <MasterAdminCrisisMapComponent />;
}
