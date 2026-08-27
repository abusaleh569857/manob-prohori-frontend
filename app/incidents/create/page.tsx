import type { Metadata } from "next";
import { MasterCreateIncidentComponent } from "@/views/incidents/create/master.create-incident";

export const metadata: Metadata = {
  title: "Report Emergency - Manob Prohori",
  description: "Report an immediate emergency to alert nearby verified volunteers and emergency services.",
};

export default function CreateIncidentPage() {
  return <MasterCreateIncidentComponent />;
}
