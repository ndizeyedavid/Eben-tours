"use client";

import Filter from "../components/Filter";
import SectionHeader from "../components/SectionHeader";
import SinglePackage from "../components/SinglePackage";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type CountryKey = "all" | "rwanda" | "kenya" | "tanzania" | "uganda";

type PackageListRow = {
  id: string;
  title: string;
  country: Exclude<CountryKey, "all">;
  location: string;
  durationDays: number;
  price: number;
  maxGroup: number;
  featured: boolean;
  imageUrl?: string | null;
  description?: string | null;
};

export default function PackagesClient() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<PackageListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<CountryKey>("all");

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) setCountry(filter as CountryKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const q =
      country === "all" ? "" : `?country=${encodeURIComponent(country)}`;

    fetch(`/api/packages${q}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setRows(Array.isArray(data?.rows) ? data.rows : []);
      })
      .catch(() => {
        if (!alive) return;
        setRows([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [country]);

  return (
    <>
      <SectionHeader
        title="Unforgettable Safari Experiences"
        note="Our Tours & Packages"
        description="Discover our curated collection of African safari tours designed to create lasting memories. From wildlife adventures to cultural immersion, find your perfect journey."
      />

      <Filter value={country} onChange={setCountry} />

      <div className="container">
        <div className="grid grid-cols-3 gap-4">
          {loading
            ? null
            : rows.map((p) => (
                <SinglePackage
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  description={p.description}
                  price={p.price}
                  imageUrl={p.imageUrl}
                  featured={p.featured}
                />
              ))}
        </div>
      </div>
    </>
  );
}
