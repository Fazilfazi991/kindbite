"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Leaf,
  MessageCircle,
  PackageCheck,
  Pencil,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { calculatePricing, PricingSummary } from "@/lib/pricing";
import { PlanDuration, QuizAnswers, WellnessRecommendation } from "@/lib/wellness-recommendation";

const durationOptions = [
  { days: 7, label: "7 Days", subtitle: "Trial Pack" },
  { days: 10, label: "10 Days", subtitle: "Starter Pack" },
  { days: 15, label: "15 Days", subtitle: "Wellness Pack" },
  { days: 30, label: "30 Days", subtitle: "Monthly Box", badge: "Best Value" },
];

function parseDuration(duration: PlanDuration | "" | undefined) {
  const parsed = Number.parseInt(duration ?? "", 10);
  return durationOptions.some((option) => option.days === parsed) ? parsed : 7;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function selectedDurationLabel(duration: number): PlanDuration {
  return `${duration} days` as PlanDuration;
}

function Logo() {
  return (
    <a href="/" className="inline-block leading-none">
      <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
      <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">
        NOURISH. GIFT. INSPIRE.
      </span>
    </a>
  );
}

export function RecommendationPlaceholder() {
  const [recommendation, setRecommendation] = useState<WellnessRecommendation | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [duration, setDuration] = useState(7);
  const [pricing, setPricing] = useState<PricingSummary | null>(null);

  useEffect(() => {
    const savedRecommendation = window.localStorage.getItem("kindbite_recommendation");
    const savedAnswers = window.localStorage.getItem("kindbite_quiz_answers");

    if (savedAnswers) {
      try {
        setQuizAnswers(JSON.parse(savedAnswers) as QuizAnswers);
      } catch {
        setQuizAnswers(null);
      }
    }

    if (!savedRecommendation) {
      return;
    }

    try {
      const parsed = JSON.parse(savedRecommendation) as WellnessRecommendation;
      setRecommendation(parsed);
      setDuration(parseDuration(parsed.selectedDuration));
    } catch {
      setRecommendation(null);
    }
  }, []);

  useEffect(() => {
    if (!recommendation) return;

    const nextRecommendation = {
      ...recommendation,
      selectedDuration: selectedDurationLabel(duration),
    };
    const nextPricing = calculatePricing(
      recommendation.items,
      duration,
      recommendation.dailyTotalGrams,
    );

    setPricing(nextPricing);
    window.localStorage.setItem("kindbite_recommendation", JSON.stringify(nextRecommendation));
    window.localStorage.setItem("kindbite_pricing_summary", JSON.stringify(nextPricing));
  }, [duration, recommendation]);

  const totalQuantity = pricing?.totalQuantityGrams ?? 0;
  const goal = quizAnswers?.goal || "Your wellness goal";

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
          <Logo />
          <a className="hidden items-center gap-2 text-sm font-black text-kindred sm:inline-flex" href="/wellness-quiz">
            <Pencil className="h-4 w-4" />
            Edit Quiz
          </a>
        </header>

        {!recommendation ? (
          <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
            <Leaf className="mx-auto h-11 w-11 text-kindred" />
            <h1 className="mt-4 text-2xl font-black text-ink sm:text-3xl">Let's find your wellness mix first</h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-muted">
              Complete the quick wellness quiz to get your personalized daily intake suggestion.
            </p>
            <a
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
              href="/wellness-quiz"
            >
              Start Wellness Quiz
              <ArrowRight className="h-4 w-4" />
            </a>
          </section>
        ) : (
          <>
            <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
              <div className="rounded-md bg-kindred p-6 text-white shadow-soft sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                  <ShieldCheck className="h-4 w-4" />
                  Food-based wellness suggestion
                </span>
                <h1 className="mt-5 font-display text-4xl font-black leading-tight sm:text-5xl">
                  Your Personalized Wellness Mix
                </h1>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
                  Based on your lifestyle, goal, and preferences, here's your suggested daily Kindbite mix.
                </p>
              </div>

              <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                <p className="text-xs font-black uppercase tracking-wide text-kindred">Recommended mix</p>
                <h2 className="mt-2 text-2xl font-black text-ink">{recommendation.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted">{recommendation.description}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["Daily intake", `${recommendation.dailyTotalGrams}g/day`],
                    ["Goal", goal],
                    ["Plan", `${duration} days`],
                    ["Total", `${totalQuantity}g`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md bg-kindred-soft p-4">
                      <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                      <strong className="mt-1 block text-lg leading-tight text-ink">{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
              <div className="grid gap-5">
                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-kindred">Ingredient breakdown</p>
                      <h2 className="mt-2 text-2xl font-black text-ink">Your daily mix</h2>
                    </div>
                    <span className="hidden rounded-full bg-beige px-3 py-1 text-xs font-black text-muted sm:inline-flex">
                      Updates with duration
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {recommendation.items.map((item) => (
                      <article
                        key={item.name}
                        className="grid gap-3 rounded-md border border-kindred/10 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                      >
                        <div>
                          <h3 className="font-black text-ink">{item.name}</h3>
                          <p className="mt-2 text-sm font-semibold leading-6 text-muted">{item.reason}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:w-52">
                          <div className="rounded-md bg-kindred-soft p-3">
                            <p className="text-[10px] font-black uppercase tracking-wide text-kindred">Per day</p>
                            <strong className="block text-lg text-ink">{item.gramsPerDay}g</strong>
                          </div>
                          <div className="rounded-md bg-beige p-3">
                            <p className="text-[10px] font-black uppercase tracking-wide text-muted">For {duration} days</p>
                            <strong className="block text-lg text-ink">{item.gramsPerDay * duration}g</strong>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {recommendation.warnings.length > 0 && (
                  <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                    <div className="flex items-center gap-2 text-kindred">
                      <AlertTriangle className="h-5 w-5" />
                      <h2 className="font-black">Mix notes</h2>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-muted">
                      {recommendation.warnings.map((warning) => (
                        <p key={warning} className="rounded-md bg-kindred-soft p-3">
                          {warning}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <p className="rounded-md bg-white p-4 text-xs font-semibold leading-5 text-muted shadow-card ring-1 ring-kindred/8">
                  {recommendation.disclaimer}
                </p>
              </div>

              <aside className="grid gap-5 lg:sticky lg:top-5">
                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8">
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Choose duration</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {durationOptions.map((option) => {
                      const selected = duration === option.days;

                      return (
                        <button
                          key={option.days}
                          type="button"
                          onClick={() => setDuration(option.days)}
                          className={`relative flex min-h-16 items-center justify-between gap-3 rounded-md border p-4 text-left transition ${
                            selected
                              ? "border-kindred bg-kindred-soft shadow-card"
                              : "border-kindred/12 bg-white hover:border-kindred/45"
                          }`}
                        >
                          <span>
                            <span className="block text-sm font-black text-ink">{option.label}</span>
                            <span className="mt-1 block text-xs font-bold text-muted">{option.subtitle}</span>
                          </span>
                          {option.badge && (
                            <span className="rounded-full bg-kindred px-2.5 py-1 text-[10px] font-black text-white">
                              {option.badge}
                            </span>
                          )}
                          {selected && <Check className="h-5 w-5 shrink-0 text-kindred" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8">
                  <div className="flex items-center gap-3">
                    <PackageCheck className="h-6 w-6 text-kindred" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-kindred">Total quantity</p>
                      <h2 className="text-xl font-black text-ink">{totalQuantity}g for {duration} days</h2>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-muted">
                    You'll receive this as a ready-to-use wellness box.
                  </p>
                </div>

                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8">
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Price summary</p>
                  <div className="mt-4 grid gap-3 text-sm font-bold text-muted">
                    {pricing && [
                      ["Mix cost", pricing.ingredientSubtotal],
                      ["Packing", pricing.packagingFee],
                      ["Delivery", pricing.deliveryFee],
                      ["Kindbite preparation", pricing.preparationFee],
                    ].map(([label, value]) => (
                      <div key={label as string} className="flex items-center justify-between gap-4">
                        <span>{label as string}</span>
                        <strong className="text-ink">{formatCurrency(value as number)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-kindred/10 pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-sm font-black text-ink">Total</span>
                      <strong className="text-3xl text-ink">{pricing ? formatCurrency(pricing.finalPrice) : "..."}</strong>
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-5 text-muted">
                      Price updates automatically based on selected duration.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <a
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
                    href="/customize-box"
                  >
                    <Sparkles className="h-4 w-4" />
                    Customize My Box
                  </a>
                  <a
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                    href="/checkout"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Continue with This Mix
                  </a>
                  <a
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                    href="/nutritionist-booking"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Talk to a Nutritionist
                  </a>
                  <a
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                    href="/wellness-quiz"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Edit Quiz
                  </a>
                </div>
              </aside>
            </section>

            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-kindred/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
              <div className="mx-auto flex max-w-7xl items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wide text-muted">Total</p>
                  <strong className="block text-xl leading-tight text-ink">
                    {pricing ? formatCurrency(pricing.finalPrice) : "..."}
                  </strong>
                </div>
                <a
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white"
                  href="/checkout"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
