"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHeader from "../components/SectionHeader";
import { PhoneInput } from "react-international-phone";

type PackageOption = {
  id: string;
  title: string;
  days: string;
  fromPrice: string;
  highlight: string;
};

const PACKAGE_OPTIONS: PackageOption[] = [
  {
    id: "volcano-gorilla-trek",
    title: "Volcano & Gorilla Trekking",
    days: "3 Days",
    fromPrice: "$650",
    highlight: "Volcanoes National Park & unforgettable gorilla encounter.",
  },
  {
    id: "nyungwe-chimpanzee",
    title: "Nyungwe Chimpanzee Trek",
    days: "2 Days",
    fromPrice: "$420",
    highlight: "Rainforest trails, canopy walk, and chimp tracking.",
  },
  {
    id: "akagera-safari",
    title: "Akagera Big Five Safari",
    days: "2 Days",
    fromPrice: "$480",
    highlight: "Game drives, boat safari, and classic savannah wildlife.",
  },
];

type BookingForm = {
  packageId: string;
  travelDate: string;
  travellers: number;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
};

const initialForm: BookingForm = {
  packageId: "",
  travelDate: "",
  travellers: 2,
  fullName: "",
  email: "",
  phone: "",
  country: "",
  notes: "",
};

function classNames(...values: Array<string | false | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

export default function BookPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const selectedPackage = useMemo(
    () => PACKAGE_OPTIONS.find((p) => p.id === form.packageId) || null,
    [form.packageId]
  );

  const errors = useMemo(() => {
    const next: Record<string, string> = {};

    if (!form.packageId) next.packageId = "Please choose a package.";

    if (step >= 2) {
      if (!form.fullName.trim()) next.fullName = "Full name is required.";

      const email = form.email.trim();
      if (!email) next.email = "Email is required.";
      else if (!/^\S+@\S+\.\S+$/.test(email))
        next.email = "Enter a valid email.";

      if (!form.phone.trim()) next.phone = "Phone number is required.";

      if (!form.travelDate) next.travelDate = "Select a preferred travel date.";
      if (!form.travellers || form.travellers < 1)
        next.travellers = "Travellers must be at least 1.";
    }

    return next;
  }, [form, step]);

  const canGoStep2 = !errors.packageId;
  const canGoStep3 = step >= 2 && Object.keys(errors).length === 0;

  const goNext = () => {
    if (step === 1) {
      setTouched((t) => ({ ...t, packageId: true }));
      if (!canGoStep2) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      setTouched((t) => ({
        ...t,
        fullName: true,
        email: true,
        phone: true,
        travelDate: true,
        travellers: true,
      }));
      if (!canGoStep3) return;
      setStep(3);
      return;
    }
  };

  const goBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const submitBooking = () => {
    // For now, just a UX-friendly confirmation.
    // Later we can POST to an API route or send an email.
    alert(
      `Booking request submitted!\n\nPackage: ${
        selectedPackage?.title ?? ""
      }\nName: ${form.fullName}\nEmail: ${form.email}`
    );

    setForm(initialForm);
    setTouched({});
    setStep(1);
  };

  return (
    <>
      <SectionHeader
        title="Book Your Tour"
        note="Secure your spot"
        description="Choose a package, share your travel details, and confirm your booking in a few simple steps."
      />

      <div className="container pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-emerald-900/10 bg-white shadow-[0_20px_60px_rgba(30,86,49,0.12)]">
            <div className="border-b border-emerald-900/10 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-lg font-extrabold text-[var(--color-secondary)]">
                    Booking Wizard
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
                    Step {step} of 3
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={classNames(
                        "h-2 w-16 rounded-full transition",
                        step >= n
                          ? "bg-gradient-to-r from-emerald-600 to-lime-500"
                          : "bg-black/10"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <div className="text-base font-extrabold text-[var(--color-secondary)]">
                      Choose your package
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
                      Pick what fits your trip. You can adjust details in the
                      next step.
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {PACKAGE_OPTIONS.map((pkg) => {
                      const active = form.packageId === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, packageId: pkg.id }));
                            setTouched((t) => ({ ...t, packageId: true }));
                          }}
                          className={classNames(
                            "text-left rounded-2xl border p-4 transition focus:outline-none focus:ring-2",
                            active
                              ? "border-emerald-600/30 bg-emerald-50 ring-emerald-600/30"
                              : "border-emerald-900/10 bg-white hover:bg-emerald-50/40 ring-emerald-600/20"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-extrabold text-[var(--color-secondary)]">
                                {pkg.title}
                              </div>
                              <div className="mt-1 text-xs font-semibold text-[var(--muted)]">
                                {pkg.days} • From {pkg.fromPrice}
                              </div>
                            </div>
                            <div
                              className={classNames(
                                "mt-0.5 h-4 w-4 rounded-full border",
                                active
                                  ? "border-emerald-600 bg-emerald-600"
                                  : "border-black/20 bg-white"
                              )}
                            />
                          </div>
                          <div className="mt-3 text-xs font-semibold text-[var(--muted)]">
                            {pkg.highlight}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {touched.packageId && errors.packageId && (
                    <div className="text-sm font-semibold text-red-700">
                      {errors.packageId}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href="/packages"
                      className="text-sm font-extrabold text-[var(--color-primary)] hover:underline"
                    >
                      View packages
                    </Link>

                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(30,86,49,0.25)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="text-base font-extrabold text-[var(--color-secondary)]">
                        Your details
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
                        We’ll use this to confirm availability and contact you.
                      </div>
                    </div>

                    {selectedPackage && (
                      <div className="rounded-xl border border-emerald-900/10 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)]">
                        {selectedPackage.title}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-extrabold text-[var(--color-secondary)]">
                        Full name
                      </label>
                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, fullName: e.target.value }))
                        }
                        onBlur={() =>
                          setTouched((t) => ({ ...t, fullName: true }))
                        }
                        className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/30"
                        placeholder="Your name"
                      />
                      {touched.fullName && errors.fullName && (
                        <div className="mt-2 text-sm font-semibold text-red-700">
                          {errors.fullName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-extrabold text-[var(--color-secondary)]">
                        Email
                      </label>
                      <input
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        onBlur={() =>
                          setTouched((t) => ({ ...t, email: true }))
                        }
                        className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/30"
                        placeholder="you@example.com"
                      />
                      {touched.email && errors.email && (
                        <div className="mt-2 text-sm font-semibold text-red-700">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-extrabold text-[var(--color-secondary)]">
                        Phone
                      </label>
                      <div className="mt-2">
                        <div className="contact-phone">
                          <PhoneInput
                            defaultCountry="rw"
                            value={form.phone}
                            onChange={(value) =>
                              setForm((f) => ({ ...f, phone: value }))
                            }
                            inputClassName="!w-full"
                          />
                        </div>
                      </div>
                      {touched.phone && errors.phone && (
                        <div className="mt-2 text-sm font-semibold text-red-700">
                          {errors.phone}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-extrabold text-[var(--color-secondary)]">
                        Country
                      </label>
                      <input
                        value={form.country}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, country: e.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/30"
                        placeholder="e.g. Rwanda"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-extrabold text-[var(--color-secondary)]">
                        Travel date
                      </label>
                      <input
                        type="date"
                        value={form.travelDate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, travelDate: e.target.value }))
                        }
                        onBlur={() =>
                          setTouched((t) => ({ ...t, travelDate: true }))
                        }
                        className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/30"
                      />
                      {touched.travelDate && errors.travelDate && (
                        <div className="mt-2 text-sm font-semibold text-red-700">
                          {errors.travelDate}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-extrabold text-[var(--color-secondary)]">
                        Travellers
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.travellers}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            travellers: Number(e.target.value || 1),
                          }))
                        }
                        onBlur={() =>
                          setTouched((t) => ({ ...t, travellers: true }))
                        }
                        className="mt-2 w-full rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/30"
                      />
                      {touched.travellers && errors.travellers && (
                        <div className="mt-2 text-sm font-semibold text-red-700">
                          {errors.travellers}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-extrabold text-[var(--color-secondary)]">
                      Notes (optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, notes: e.target.value }))
                      }
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] outline-none transition focus:ring-2 focus:ring-emerald-600/30"
                      placeholder="Anything we should know? (pickup location, special requests, etc.)"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center justify-center rounded-xl border border-emerald-900/10 bg-white px-5 py-3 text-sm font-extrabold text-[var(--color-secondary)] transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(30,86,49,0.25)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                    >
                      Review booking
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <div className="text-base font-extrabold text-[var(--color-secondary)]">
                      Review & confirm
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[var(--muted)]">
                      Check the details before submitting your request.
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-4">
                      <div className="text-xs font-extrabold text-[var(--muted)]">
                        PACKAGE
                      </div>
                      <div className="mt-1 text-sm font-extrabold text-[var(--color-secondary)]">
                        {selectedPackage?.title ?? ""}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-[var(--muted)]">
                        Date: {form.travelDate || "-"}
                        <br />
                        Travellers: {form.travellers}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                      <div className="text-xs font-extrabold text-[var(--muted)]">
                        CONTACT
                      </div>
                      <div className="mt-2 text-xs font-semibold text-[var(--muted)]">
                        <div>
                          <span className="font-extrabold text-[var(--color-secondary)]">
                            Name:
                          </span>{" "}
                          {form.fullName}
                        </div>
                        <div>
                          <span className="font-extrabold text-[var(--color-secondary)]">
                            Email:
                          </span>{" "}
                          {form.email}
                        </div>
                        <div>
                          <span className="font-extrabold text-[var(--color-secondary)]">
                            Phone:
                          </span>{" "}
                          {form.phone}
                        </div>
                        {form.country && (
                          <div>
                            <span className="font-extrabold text-[var(--color-secondary)]">
                              Country:
                            </span>{" "}
                            {form.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {form.notes && (
                    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                      <div className="text-xs font-extrabold text-[var(--muted)]">
                        NOTES
                      </div>
                      <div className="mt-2 text-sm font-semibold text-[var(--color-secondary)]">
                        {form.notes}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center justify-center rounded-xl border border-emerald-900/10 bg-white px-5 py-3 text-sm font-extrabold text-[var(--color-secondary)] transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={submitBooking}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(16,185,129,0.25)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
                    >
                      Confirm booking
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-[var(--muted)]">
                    Submitting creates a booking request. We’ll confirm
                    availability and get back to you.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-center text-sm font-semibold text-[var(--muted)]">
            Prefer WhatsApp? You can also reach us via the Contact page.
          </div>
        </div>
      </div>
    </>
  );
}
