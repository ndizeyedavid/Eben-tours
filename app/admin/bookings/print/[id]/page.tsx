"use client";

import Image from "next/image";
import { useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

type BookingStatus = "pending" | "confirmed" | "cancelled";

type BookingPrintModel = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  packageName: string;
  travelDate: string;
  travellers: number;
  pickupLocation: string;
  specialRequests: string;
  notesInternal: string;
  status: BookingStatus;
  paymentStatus: "unpaid" | "partial" | "paid";
  subtotal: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  issuedAt: string;
};

const seed: BookingPrintModel[] = [
  {
    id: "BK-1024",
    customerName: "Aline M.",
    customerEmail: "aline@example.com",
    customerPhone: "+250 7xx xxx xxx",
    customerCountry: "Rwanda",
    packageName: "Volcano & Gorilla Trekking",
    travelDate: "2025-01-12",
    travellers: 2,
    pickupLocation: "Kigali City Center Hotel",
    specialRequests: "Vegetarian meals",
    notesInternal: "Confirm permit availability 48h before.",
    status: "confirmed",
    paymentStatus: "paid",
    subtotal: 650,
    discount: 0,
    total: 650,
    amountPaid: 650,
    balance: 0,
    issuedAt: "2025-12-21",
  },
  {
    id: "BK-1025",
    customerName: "John K.",
    customerEmail: "john@example.com",
    customerPhone: "+1 4xx xxx xxxx",
    customerCountry: "USA",
    packageName: "Akagera Big Five Safari",
    travelDate: "2025-01-15",
    travellers: 4,
    pickupLocation: "Kigali International Airport",
    specialRequests: "Child seat required",
    notesInternal: "Send packing list after confirmation.",
    status: "pending",
    paymentStatus: "unpaid",
    subtotal: 480,
    discount: 0,
    total: 480,
    amountPaid: 0,
    balance: 480,
    issuedAt: "2025-12-21",
  },
  {
    id: "BK-1026",
    customerName: "Fatima S.",
    customerEmail: "fatima@example.com",
    customerPhone: "+971 5x xxx xxxx",
    customerCountry: "UAE",
    packageName: "Nyungwe Chimpanzee Trek",
    travelDate: "2025-01-20",
    travellers: 1,
    pickupLocation: "Kigali Office",
    specialRequests: "",
    notesInternal: "Verify passport details.",
    status: "cancelled",
    paymentStatus: "unpaid",
    subtotal: 420,
    discount: 0,
    total: 420,
    amountPaid: 0,
    balance: 420,
    issuedAt: "2025-12-21",
  },
  {
    id: "BK-1027",
    customerName: "Moses T.",
    customerEmail: "moses@example.com",
    customerPhone: "+250 7xx xxx xxx",
    customerCountry: "Rwanda",
    packageName: "Volcano & Gorilla Trekking",
    travelDate: "2025-02-03",
    travellers: 3,
    pickupLocation: "Kigali City Center Hotel",
    specialRequests: "",
    notesInternal: "Confirm trekking time slot.",
    status: "confirmed",
    paymentStatus: "partial",
    subtotal: 650,
    discount: 50,
    total: 600,
    amountPaid: 200,
    balance: 400,
    issuedAt: "2025-12-21",
  },
  {
    id: "BK-1028",
    customerName: "Grace N.",
    customerEmail: "grace@example.com",
    customerPhone: "+254 7xx xxx xxx",
    customerCountry: "Kenya",
    packageName: "Akagera Big Five Safari",
    travelDate: "2025-02-07",
    travellers: 2,
    pickupLocation: "Kigali International Airport",
    specialRequests: "Window seats",
    notesInternal: "",
    status: "pending",
    paymentStatus: "unpaid",
    subtotal: 480,
    discount: 0,
    total: 480,
    amountPaid: 0,
    balance: 480,
    issuedAt: "2025-12-21",
  },
];

function formatMoney(n: number) {
  return `$${n.toFixed(0)}`;
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-extrabold uppercase tracking-wide text-black/50">
        {label}
      </div>
      <div className="mt-1 text-sm font-extrabold text-black">{value}</div>
    </div>
  );
}

export default function BookingPrintPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const id = params?.id;
  const booking = useMemo(() => seed.find((b) => b.id === id) ?? null, [id]);

  useEffect(() => {
    const auto = searchParams?.get("auto");
    if (auto === "1") {
      window.setTimeout(() => window.print(), 200);
    }
  }, [searchParams]);

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-lg font-extrabold text-black">
            Booking not found
          </div>
          <div className="mt-2 text-sm font-semibold text-black/60">
            We could not find booking <b>{id}</b>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page { size: A4; margin: 14mm; }
          @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `,
        }}
      />

      <div className="no-print border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-4">
          <div className="text-sm font-extrabold text-black">
            Booking Form • {booking.id}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white"
            >
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={() => window.close()}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-extrabold text-black"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-black/10 bg-white">
              <Image
                src="/Logo-011.png"
                alt="Eben Tours"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <div className="text-lg font-extrabold text-black">
                Eben Tours
              </div>
              <div className="mt-1 text-xs font-semibold text-black/60">
                Rwanda Tours & Experiences
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-extrabold uppercase tracking-wide text-black/50">
              Document
            </div>
            <div className="mt-1 text-sm font-extrabold text-black">
              Booking Form
            </div>
            <div className="mt-1 text-xs font-semibold text-black/60">
              Issued: {booking.issuedAt}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white">
          <div className="grid gap-0 border-b border-black/10 sm:grid-cols-2!">
            <div className="p-5">
              <div className="text-xs font-extrabold uppercase tracking-wide text-black/50">
                Customer
              </div>
              <div className="mt-4 grid grid-cols-2! gap-3">
                <LabelValue label="Full name" value={booking.customerName} />
                <LabelValue label="Email" value={booking.customerEmail} />
                <LabelValue label="Phone" value={booking.customerPhone} />
                <LabelValue label="Country" value={booking.customerCountry} />
              </div>
            </div>

            <div className="border-t border-black/10 p-5 sm:border-l sm:border-t-0">
              <div className="text-xs font-extrabold uppercase tracking-wide text-black/50">
                Booking
              </div>
              <div className="mt-4 grid grid-cols-2! gap-3">
                <LabelValue label="Booking ID" value={booking.id} />
                <LabelValue label="Package" value={booking.packageName} />
                <LabelValue label="Travel date" value={booking.travelDate} />
                <LabelValue
                  label="Travellers"
                  value={String(booking.travellers)}
                />
                <LabelValue label="Pickup" value={booking.pickupLocation} />
              </div>
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-2!">
            <div className="p-5">
              <div className="text-xs font-extrabold uppercase tracking-wide text-black/50">
                Requests & Notes
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wide text-black/50">
                    Special requests
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm font-semibold text-black">
                    {booking.specialRequests || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wide text-black/50">
                    Internal notes
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm font-semibold text-black">
                    {booking.notesInternal || "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 p-5 sm:border-l sm:border-t-0">
              <div className="text-xs font-extrabold uppercase tracking-wide text-black/50">
                Pricing
              </div>
              <div className="mt-4 space-y-2 text-sm font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Subtotal</span>
                  <span className="font-extrabold text-black">
                    {formatMoney(booking.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Discount</span>
                  <span className="font-extrabold text-black">
                    {formatMoney(booking.discount)}
                  </span>
                </div>
                <div className="my-2 h-px bg-black/10" />
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Total</span>
                  <span className="text-base font-extrabold text-black">
                    {formatMoney(booking.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Amount paid</span>
                  <span className="font-extrabold text-black">
                    {formatMoney(booking.amountPaid)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Balance</span>
                  <span className="font-extrabold text-black">
                    {formatMoney(booking.balance)}
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-black/10 bg-[#f6f8f7] p-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-wide text-black/50">
                    Status
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-black">
                    {booking.status} • {booking.paymentStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4! sm:grid-cols-2!">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-black/50">
              Customer signature
            </div>
            <div className="mt-10 h-px bg-black/30" />
            <div className="mt-2 text-xs font-semibold text-black/60">
              Name & signature
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-black/50">
              Admin signature
            </div>
            <div className="mt-10 h-px bg-black/30" />
            <div className="mt-2 text-xs font-semibold text-black/60">
              Name & signature
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs font-semibold text-black/60">
          Company details: Eben Tours • Kigali, Rwanda • support@ebentours.com •
          +250 7xx xxx xxx
        </div>
      </div>
    </div>
  );
}
