import { MasterVolunteerDashboardComponent } from "@/views/volunteer/master.volunteer-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer Emergency Command | Manob Prohori",
  description: "Live volunteer emergency dispatch and rescue responder dashboard.",
};

export default function VolunteerDashboardPage() {
  return <MasterVolunteerDashboardComponent />;
}
