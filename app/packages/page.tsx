import { Suspense } from "react";
import PackagesClient from "./PackagesClient";

export default function PackagesPage() {
  return (
    <Suspense>
      <PackagesClient />
    </Suspense>
  );
}
