import { MasterVolunteerVerificationComponent } from "@/views/volunteer/verification/master.volunteer-verification";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer Verification & Skills | Manob Prohori",
  description: "Submit and manage volunteer credentials, certifications, and emergency response skills.",
};

export default function VolunteerVerificationPage() {
  return <MasterVolunteerVerificationComponent />;
}
