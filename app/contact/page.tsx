import ContactForm from "../components/ContactForm";
import SectionHeader from "../components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Eben Tours Safaris to plan your next safari. Send us a message and we’ll respond with tailored recommendations and availability.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* <SectionHeader /> */}
      <div className="container">
        <ContactForm />
      </div>
    </>
  );
}
