import { SignUp } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f6f8f7] px-4 py-10">
      <Link
        href="/"
        className="flex items-center justify-center gap-2 absolute left-4 top-2 hover:bg-gray-200 transition-all rounded-md px-3 py-2"
      >
        <ArrowLeft /> Go back
      </Link>
      <div className="mx-auto flex flex-col items-center gap-5 max-w-xl justify-center">
        <Image
          src="/log.webp"
          width={100}
          height={100}
          alt="Eben Safari Tours Logo"
        />
        <SignUp forceRedirectUrl="/admin" />
      </div>
    </div>
  );
}
