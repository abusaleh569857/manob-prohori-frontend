import { MasterHospitalsView } from "@/views/hospitals/master.hospitals-view";

export const metadata = {
  title: "Hospital & Emergency Medical Locator | Manob Prohori",
  description: "Find verified 24/7 hospitals and emergency medical facilities across Bangladesh with direct emergency contacts and GPS directions.",
};

export default function HospitalsPage() {
  return <MasterHospitalsView />;
}
