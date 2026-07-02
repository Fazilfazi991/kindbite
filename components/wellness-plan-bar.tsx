"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Edit3, ShoppingBag } from "lucide-react";
import { CustomBox } from "@/lib/custom-box";
import { PricingSummary } from "@/lib/pricing";
import { getStoredJson } from "@/lib/storage";
import { WellnessRecommendation } from "@/lib/wellness-recommendation";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function WellnessPlanBar({ mobileBottomClass = "bottom-3" }: { mobileBottomClass?: string }) {
  const [plan, setPlan] = useState<{
    title: string;
    subtitle: string;
    price?: number;
    href: string;
  } | null>(null);

  useEffect(() => {
    const customBox = getStoredJson<CustomBox | null>("kindbite_custom_box", null);
    const recommendation = getStoredJson<WellnessRecommendation | null>("kindbite_recommendation", null);
    const pricing = getStoredJson<PricingSummary | null>("kindbite_pricing_summary", null);

    if (customBox) {
      setPlan({
        title: "Custom box saved",
        subtitle: `${customBox.totalDailyGrams}g/day for ${customBox.duration} days`,
        price: customBox.finalPrice,
        href: "/customize-box",
      });
      return;
    }

    if (recommendation) {
      setPlan({
        title: recommendation.title,
        subtitle: `${recommendation.dailyTotalGrams}g/day${pricing ? ` for ${pricing.duration} days` : ""}`,
        price: pricing?.finalPrice,
        href: "/recommendation",
      });
    }
  }, []);

  if (!plan) return null;

  return (
    <aside
      className={`fixed inset-x-3 ${mobileBottomClass} z-40 rounded-md bg-ink p-3 text-white shadow-2xl ring-1 ring-white/10 md:bottom-5 md:left-auto md:right-5 md:w-[390px]`}
      aria-label="Current wellness plan"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white/12">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black">{plan.title}</p>
          <p className="truncate text-xs font-bold text-white/70">
            {plan.subtitle}
            {typeof plan.price === "number" ? ` · ${formatCurrency(plan.price)}` : ""}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <a className="inline-flex h-9 items-center justify-center gap-1 rounded-md bg-white/10 text-[11px] font-black" href={plan.href}>
          <Edit3 className="h-3.5 w-3.5" />
          View
        </a>
        <a className="inline-flex h-9 items-center justify-center rounded-md bg-white/10 text-[11px] font-black" href="/customize-box">
          Customize
        </a>
        <a className="inline-flex h-9 items-center justify-center gap-1 rounded-md bg-white text-[11px] font-black text-ink" href="/checkout">
          Checkout
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
