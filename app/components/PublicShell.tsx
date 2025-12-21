"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
<<<<<<< HEAD
  const isSignin = pathname.startsWith("/sign-in");
  const isSignup = pathname.startsWith("/sign-up");
  if (isAdmin || isSignin || isSignup) return <>{children}</>;
=======
  const isSignIn = pathname.startsWith("/sign-in");
  const isSignup = pathname.startsWith("/sign-up");
  if (isAdmin || isSignIn || isSignup) return <>{children}</>;
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
