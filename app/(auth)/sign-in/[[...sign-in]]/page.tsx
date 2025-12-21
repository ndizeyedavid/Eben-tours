import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f6f8f7] px-4 py-10">
      <div className="mx-auto flex max-w-xl justify-center">
        <SignIn forceRedirectUrl="/admin" />
      </div>
    </div>
  );
}
