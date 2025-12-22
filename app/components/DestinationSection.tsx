"use client";

import { useEffect } from "react";
import styles from "./DestinationSection.module.css";
import Image from "next/image";
export default function DestinationSection() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(`.${styles["fade-in"]}`)
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).classList.add(styles.visible);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.destins} id="destins">
      <div className={styles["destins-container"]}>
        <div className={`${styles["destination-card"]} ${styles["fade-in"]}`}>
          <Image width={500} height={500} src="/cro.webp" alt="Rwanda" />
          <div className={styles["glass-overlay"]}>
            <h3>Rwanda</h3>
          </div>
        </div>

        <div className={`${styles["destination-card"]} ${styles["fade-in"]}`}>
          <Image width={500} height={500} src="/gorila.webp" alt="Uganda" />
          <div className={styles["glass-overlay"]}>
            <h3>Uganda</h3>
          </div>
        </div>

        <div className={`${styles["destination-card"]} ${styles["fade-in"]}`}>
          <Image width={500} height={500} src="/mountain.webp" alt="Tanzania" />
          <div className={styles["glass-overlay"]}>
            <h3>Tanzania</h3>
          </div>
        </div>

        <div className={`${styles["destination-card"]} ${styles["fade-in"]}`}>
          <Image width={500} height={500} src="/lion.webp" alt="Kenya" />
          <div className={styles["glass-overlay"]}>
            <h3>Kenya</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
