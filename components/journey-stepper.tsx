"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { CustomBox } from "@/lib/custom-box";
import { PricingSummary } from "@/lib/pricing";
import { getStoredJson } from "@/lib/storage";
import { WellnessRecommendation } from "@/lib/wellness-recommendation";

type JourneyStep = "quiz" | "recommendation" | "customize" | "checkout";

const steps: { id: JourneyStep; label: string; href: string }[] = [
  { id: "quiz", label: "Quiz", href: "/wellness-quiz" },
  { id: "recommendation", label: "Mix", href: "/recommendation" },
  { id: "customize", label: "Customize", href: "/customize-box" },
  { id: "checkout", label: "Checkout", href: "/checkout" },
];

export function JourneyStepper({ currentStep }: { currentStep: JourneyStep }) {
  const [hasRecommendation, setHasRecommendation] = useState(false);
  const [hasCustomBox, setHasCustomBox] = useState(false);
  const [hasPricing, setHasPricing] = useState(false);

  useEffect(() => {
    setHasRecommendation(Boolean(getStoredJson<WellnessRecommendation | null>("kindbite_recommendation", null)));
    setHasCustomBox(Boolean(getStoredJson<CustomBox | null>("kindbite_custom_box", null)));
    setHasPricing(Boolean(getStoredJson<PricingSummary | null>("kindbite_pricing_summary", null)));
  }, []);

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  const canOpen = (id: JourneyStep) => {
    if (id === "quiz") return true;
    if (id === "recommendation") return hasRecommendation;
    if (id === "customize") return hasRecommendation || hasCustomBox;
    return hasCustomBox || hasPricing;
  };

  return (
    <nav aria-label="Wellness journey" className="no-scrollbar overflow-x-auto rounded-md bg-white/88 p-3 shadow-card ring-1 ring-kindred/8">
      <ol className="flex min-w-max items-center gap-2">
        {steps.map((step, index) => {
          const active = step.id === currentStep;
          const complete = index < currentIndex;
          const enabled = canOpen(step.id);

          const content = (
            <span
              className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-xs font-black transition ${
                active
                  ? "bg-kindred text-white"
                  : complete
                    ? "bg-kindred-soft text-kindred"
                    : "bg-beige text-muted"
              } ${enabled ? "" : "opacity-55"}`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
                  active ? "bg-white text-kindred" : complete ? "bg-kindred text-white" : "bg-white text-muted"
                }`}
              >
                {complete ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              {step.label}
            </span>
          );

          return (
            <li key={step.id} className="flex items-center gap-2">
              {enabled ? (
                <a href={step.href} aria-current={active ? "step" : undefined}>
                  {content}
                </a>
              ) : (
                content
              )}
              {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-kindred/35" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
