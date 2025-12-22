import { Earth, Tag } from "lucide-react";
import styles from "./SinglePckage.module.css";
import Image from "next/image";

export default function SinglePackage({
  id,
  title,
  description,
  price,
  imageUrl,
  featured,
}: {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  featured?: boolean;
}) {
  return (
    <div className={styles["package-card"]}>
      {featured ? (
        <div className={`${styles.ribbon} z-99999`}>Most Popular</div>
      ) : null}
      <div className={styles["img-box"]}>
        <Image
          width={100}
          height={100}
          src={imageUrl || "/cro.webp"}
          alt={title}
        />
      </div>
      <div className={`${styles["package-content"]}`}>
        <div className="flex items-center! gap-2">
          {/* <Earth size={25} /> */}
          <h3 className="text-[14px]!">{title}</h3>
        </div>
        <p>{description || "Explore this tour package."}</p>
        <span className={`flex items-center gap-2! ${styles.price}`}>
          <Tag size={14} /> From ${price}
        </span>
        <a href={`/packages/details/${id}`} className={styles.btn}>
          <i className="fas fa-eye"></i> View Details
        </a>
      </div>
    </div>
  );
}
