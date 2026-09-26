import { MasterReliefDirectoryView } from "@/views/relief/master.relief-directory-view";

export const metadata = {
  title: "Emergency Disaster Relief & Direct Aid | Manob Prohori",
  description:
    "100% direct peer-to-peer relief aid for flood, fire, and disaster victims across Bangladesh. Donate directly through bKash, Nagad, and Rocket with zero platform fees.",
};

export default function ReliefPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 py-6">
      <MasterReliefDirectoryView />
    </div>
  );
}

