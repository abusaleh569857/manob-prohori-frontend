import { MasterHowItWorksComponent } from "@/views/how-it-works/master.how-it-works";

export const metadata = {
  title: "How It Works | Manob Prohori",
  description: "Learn how Manob Prohori connects citizens, volunteers, hospitals, and emergency services in real time.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 py-6">
      <MasterHowItWorksComponent />
    </div>
  );
}
