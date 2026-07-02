"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, FileText, ShoppingBag, Sparkles } from "lucide-react";
import { JourneyStepper } from "@/components/journey-stepper";
import { NextStepCards } from "@/components/next-step-cards";
import { WellnessPlanBar } from "@/components/wellness-plan-bar";
import { CustomBox } from "@/lib/custom-box";
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
  const [customBox, setCustomBox] = useState<CustomBox | null>(null);

  useEffect(() => {
    const savedCustomBox = window.localStorage.getItem("kindbite_custom_box");
    const savedSummary = window.localStorage.getItem("kindbite_pricing_summary");

    if (savedCustomBox) {
      try {
        setCustomBox(JSON.parse(savedCustomBox) as CustomBox);
        return;
      } catch {
        setCustomBox(null);
      }
    }

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
          <JourneyStepper currentStep="checkout" />
          <ShoppingBag className="mx-auto h-11 w-11 text-kindred" />
          <h1 className="mt-4 text-3xl font-black text-ink">
            {customBox ? "Your Custom Kindbite Box" : summary ? "Checkout Coming Soon" : "No mix selected yet"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
            {customBox
              ? "Checkout integration will be added next."
              : summary
                ? "Your Kindbite wellness mix is ready. Checkout integration will be added next."
                : "Find your wellness mix first, or upload a report if you want a review path before ordering."}
          </p>

          {customBox ? (
            <>
              <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-4">
                {[
                  ["Duration", `${customBox.duration} days`],
                  ["Daily grams", `${customBox.totalDailyGrams}g/day`],
                  ["Total quantity", `${customBox.totalQuantityGrams}g`],
                  ["Final price", formatCurrency(customBox.finalPrice)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-kindred-soft p-4">
                    <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                    <strong className="mt-1 block text-lg text-ink">{value}</strong>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-5 grid max-w-2xl gap-3 text-left">
                {customBox.items.map((item) => (
                  <article key={item.name} className="rounded-md border border-kindred/10 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="font-black text-ink">{item.name}</h2>
                        <p className="mt-1 text-xs font-bold text-muted">{item.gramsPerDay}g/day · {item.totalGrams}g total</p>
                      </div>
                      <strong className="text-kindred">{formatCurrency(item.priceContribution)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : summary ? (
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
          ) : (
            <div className="mx-auto mt-6 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
                href="/wellness-quiz"
              >
                <Sparkles className="h-4 w-4" />
                Find My Mix
              </a>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                href="/report-upload"
              >
                <FileText className="h-4 w-4" />
                Upload Report
              </a>
            </div>
          )}

          {(customBox || summary) && (
            <>
              <a
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
                href={customBox ? "/customize-box" : "/recommendation"}
              >
                <ArrowLeft className="h-4 w-4" />
                {customBox ? "Back to Customize" : "Back to Recommendation"}
              </a>
              <div className="mt-6 text-left">
                <NextStepCards context="checkout" />
              </div>
            </>
          )}
        </section>
      </div>
      <WellnessPlanBar />
    </main>
  );
}
