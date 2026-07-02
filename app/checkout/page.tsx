"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { PricingSummary } from "@/lib/pricing";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export default function CheckoutPage() {
  const [summary, setSummary] = useState<PricingSummary | null>(null);

  useEffect(() => {
    const savedSummary = window.localStorage.getItem("kindbite_pricing_summary");

    if (!savedSummary) return;

    try {
      setSummary(JSON.parse(savedSummary) as PricingSummary);
    } catch {
      setSummary(null);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="inline-block leading-none">
          <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
          <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">
            NOURISH. GIFT. INSPIRE.
          </span>
        </a>

        <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
          <ShoppingBag className="mx-auto h-11 w-11 text-kindred" />
          <h1 className="mt-4 text-3xl font-black text-ink">Checkout Coming Soon</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
            Your Kindbite wellness mix is ready. Checkout integration will be added next.
          </p>

          {summary && (
            <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left sm:grid-cols-3">
              {[
                ["Final price", formatCurrency(summary.finalPrice)],
                ["Duration", `${summary.duration} days`],
                ["Total quantity", `${summary.totalQuantityGrams}g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-kindred-soft p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                  <strong className="mt-1 block text-lg text-ink">{value}</strong>
                </div>
              ))}
            </div>
          )}

          <a
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
            href="/recommendation"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recommendation
          </a>
        </section>
      </div>
    </main>
  );
}
