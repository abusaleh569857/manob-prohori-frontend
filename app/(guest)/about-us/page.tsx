import { MasterAboutUsComponent } from "@/views/about-us/master.about-us";

export const metadata = {
  title: "About Us | Manob Prohori",
  description: "Learn about Manob Prohori, Bangladesh's real-time emergency dispatch and disaster response platform.",
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 py-6">
      <MasterAboutUsComponent />
    </div>
  );
}
