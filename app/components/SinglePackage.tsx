import styles from "./SinglePckage.module.css";

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
        <img src={imageUrl || "/cro.jpg"} alt={title} />
      </div>
      <div className={styles["package-content"]}>
        <h3>
          <i className="fas fa-volcano"></i> {title}
        </h3>
        <p>{description || "Explore this tour package."}</p>
        <span className={styles.price}>
          <i className="fas fa-tag"></i> From ${price}
        </span>
        <a href={`/packages/details/${id}`} className={styles.btn}>
          <i className="fas fa-eye"></i> View Details
        </a>
      </div>
    </div>
  );
}
