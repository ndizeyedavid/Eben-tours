"use client";

import Image from "next/image";

export default function HomeLoading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#186e7d",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      <div>
        <Image
          src="/loading.gif"
          width={500}
          height={400}
          alt="Eben Tours Safaris Loading"
        />
      </div>

      <div className="relative -top-[80px] text-center ">
        <h2
          style={{
            fontSize: "68px",
            fontWeight: 800,
            margin: "0 0 12px 0",
            letterSpacing: "-0.5px",
            color: "#9eb561",
          }}
        >
          Eben Safaris Tours
        </h2>

        <p
          style={{
            fontSize: "16px",
            margin: 0,
            fontWeight: 500,
            color: "#9eb561",
          }}
        >
          Preparing your journey…
        </p>
      </div>

      <div
        className="relative -top-[80px]"
        style={{
          marginTop: "32px",
          display: "flex",
          gap: "8px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "white",
              animation: `dot 1.4s ease-in-out ${i * 0.16}s infinite`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes dot {
          0%,
          80%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
