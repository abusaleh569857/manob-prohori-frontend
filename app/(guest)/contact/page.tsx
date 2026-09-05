import { MasterContactComponent } from "@/views/contact/master.contact";

export const metadata = {
  title: "Contact & Emergency Support | Manob Prohori",
  description: "Contact the Manob Prohori coordination team, submit inquiries, or view 24/7 national hotlines.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12 py-6">
      <MasterContactComponent />
    </div>
  );
}
