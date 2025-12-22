import Image from "next/image";

export default function PartnersSection() {
  return (
    <div className="partners-carousel" style={{ marginTop: "28px" }}>
      <div className="carousel-track">
        <div className="carousel-item">
          <Image
            width={100}
            height={100}
            src="/RDB.webp"
            alt="RDB Partner logo"
            loading="lazy"
          />
        </div>
        <div className="carousel-item">
          <Image
            width={100}
            height={100}
            src="/visit-rwanda-seeklogo.webp"
            alt="Visit Rwanda Partner"
            loading="lazy"
          />
        </div>
        <div className="carousel-item">
          <Image
            width={100}
            height={100}
            src="/OneOnly-Logo.webp"
            alt="One Only Partner"
            loading="lazy"
          />
        </div>
        <div className="carousel-item">
          <Image
            width={100}
            height={100}
            src="/bfc9ff252b470cbc671e871d1efe3689.webp"
            alt="Partner logo"
            loading="lazy"
          />
        </div>

        <div className="carousel-item">
          <Image
            width={100}
            height={100}
            src="/Logo-011.webp"
            alt="RDB Partner logo"
            loading="lazy"
          />
        </div>
        <div className="carousel-item">
          <Image
            width={100}
            height={100}
            src="/kisspng-logo-brand-product-design-font-morvick-travels-amp-tours-ltd-nigeria-amp-apos-5b75f057225813.0890403615344558951407.webp"
            alt="RDB Partner logo"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
