import { Plane } from "lucide-react";
import DestinationCard from "../components/DestinationCard";
import SectionHeader from "../components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore iconic safari destinations with Eben Tours Safaris across Rwanda, Kenya, Tanzania, and Uganda. Discover wildlife, landscapes, and the best seasons to travel.",
  alternates: {
    canonical: "/destination",
  },
};

export default function DestinationPage() {
  return (
    <>
      <SectionHeader
        title="Iconic Destinations"
        note="Explore Africa"
        description="Discover the untamed beauty of East Africa. Each destination offers unique wildlife encounters, breathtaking landscapes, and authentic cultural experiences."
      />

      <div className="grid grid-cols-4! gap-4 px-44 mb-[70px]">
        <DestinationCard
          title="Rwanda"
          isFeatured={true}
          flag="https://flagcdn.com/w40/rw.png"
          bg="/gorila.webp"
          peakSeason="Jun-Sep"
          description="Mountain gorillas, lush landscapes, and the vibrant culture of the Land of a Thousand Hills"
        />
        <DestinationCard
          title="Kenya"
          isFeatured={false}
          flag="https://flagcdn.com/w40/ke.png"
          bg="/lion.webp"
          peakSeason="Jul-Oct"
          description="Safari adventures in the Maasai Mara, encounter the Big Five and experience authentic African wildlife."
        />
        <DestinationCard
          title="Uganda"
          isFeatured={false}
          flag="https://flagcdn.com/w40/ug.png"
          bg="/cro.webp"
          peakSeason="Jun-Aug"
          description="The Pearl of Africa with pristine forests, mountain gorillas, and the majestic Nile River"
        />
        <DestinationCard
          title="Tanzania"
          isFeatured={false}
          flag="https://flagcdn.com/w40/tz.png"
          bg="/mountain.webp"
          peakSeason="Jan-Feb"
          description="Climb Africa's highest peak, witness the Serengeti migration, and explore Zanzibar's spice islands."
        />
      </div>

      {/* {CTA Section} */}

      <div
        className="container"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), #2d5a47)",
          padding: "60px",
          borderRadius: "20px",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 15px 50px rgba(30,86,49,0.2)",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            margin: "0 0 16px",
            fontFamily: "var(--font-serif)",
            color: "white",
          }}
        >
          Ready for Your African Adventure?
        </h2>
        <p
          style={{
            fontSize: "16px",
            margin: "0 0 28px",
            color: "white",
            opacity: 0.95,
          }}
        >
          Start planning your dream safari with our expert guides and
          unforgettable experiences.
        </p>
        <a
          href="#contact"
          className="cta-primary transition-all hover:opacity-80 cursor-pointer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "#fff",
            color: "var(--color-primary)",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: 700,
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Plane /> Book Your Journey Today
        </a>
      </div>
    </>
  );
}
