import Image from "next/image";

export default function PartnersSection() {
  const partners = [
    {
      src: "/RDB.webp",
      alt: "RDB Partner logo",
    },
    {
      src: "/Visit_Rwanda_Logo.png",
      alt: "Visit Rwanda Partner",
    },
    {
      src: "/OneOnly-Logo.webp",
      alt: "One Only Partner",
    },
    {
      src: "/bfc9ff252b470cbc671e871d1efe3689.webp",
      alt: "Partner logo",
    },
    {
      src: "/Logo-011.webp",
      alt: "RDB Partner logo",
    },
    {
      src: "/kisspng-logo-brand-product-design-font-morvick-travels-amp-tours-ltd-nigeria-amp-apos-5b75f057225813.0890403615344558951407.webp",
      alt: "RDB Partner logo",
    },
  ];

  // Duplicate the partners array for seamless infinite loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className="partners-carousel" style={{ marginTop: "28px" }}>
      <div className="carousel-track">
        {duplicatedPartners.map((partner, index) => (
          <div key={index} className="carousel-item">
            <Image
              width={100}
              height={100}
              src={partner.src}
              alt={partner.alt}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
