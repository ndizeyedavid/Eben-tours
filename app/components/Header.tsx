"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.nav}`}>
        <div className={styles.brand}>
          <img src="/log.webp" alt="ventures logo" />
          <div>
            <h1>Eben Tours safaris</h1>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>
              Guided & family-friendly treks
            </div>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          <button
            className={styles["nav-toggle"]}
            aria-expanded="false"
            aria-controls="primary-menu"
          >
            ☰
          </button>
          <ul id="primary-menu">
            <li>
              <Link
                className={isActive("/") ? styles.active : undefined}
                href="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={isActive("/destination") ? styles.active : undefined}
                href="/destination"
              >
                Destinations
              </Link>
            </li>
            <li>
              <Link
                className={isActive("/packages") ? styles.active : undefined}
                href="/packages"
              >
                Packages
              </Link>
            </li>
            <li>
              <Link
                className={isActive("/services") ? styles.active : undefined}
                href="/services"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                className={isActive("/about") ? styles.active : undefined}
                href="/about"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className={isActive("/blogs") ? styles.active : undefined}
                href="/blogs"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                className={isActive("/contact") ? styles.active : undefined}
                href="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.cta}>
          <Link className={styles["cta-primary"]} href="/book">
            Book a Trek
          </Link>
        </div>
      </div>
    </header>
  );
}
