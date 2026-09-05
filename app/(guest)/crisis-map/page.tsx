import { MasterPublicCrisisMapComponent } from "@/views/crisis-map/master.public-crisis-map";

export const metadata = {
  title: "National Crisis Map & Public Safety Radar | Manob Prohori",
  description: "Real-time interactive crisis map, hazard red-zones, and citizen safety radar across Bangladesh.",
};

export default function CrisisMapPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 py-6">
      <MasterPublicCrisisMapComponent />
    </div>
  );
}

