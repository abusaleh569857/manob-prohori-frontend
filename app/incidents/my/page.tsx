import type { Metadata } from "next";
import { MasterMyIncidentsComponent } from "@/views/incidents/my/master.my-incidents";

export const metadata: Metadata = {
  title: "My Emergency Reports - Manob Prohori",
  description: "View and track the status of emergency incidents reported by you.",
};

export default function MyIncidentsPage() {
  return <MasterMyIncidentsComponent />;
}
