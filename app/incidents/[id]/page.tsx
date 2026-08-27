import { MasterIncidentDetailsComponent } from "@/views/incidents/details/master.incident-details";

interface IncidentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function IncidentDetailsPage({
  params,
}: IncidentDetailsPageProps) {
  const { id } = await params;

  return <MasterIncidentDetailsComponent incidentId={id} />;
}
