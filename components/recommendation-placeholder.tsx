"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Leaf } from "lucide-react";
import { WellnessRecommendation } from "@/lib/wellness-recommendation";

export function RecommendationPlaceholder() {
  const [recommendation, setRecommendation] = useState<WellnessRecommendation | null>(null);

  useEffect(() => {
    const savedRecommendation = window.localStorage.getItem("kindbite_recommendation");

    if (!savedRecommendation) return;

    try {
      setRecommendation(JSON.parse(savedRecommendation) as WellnessRecommendation);
    } catch {
      setRecommendation(null);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="inline-block leading-none">
          <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
          <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">NOURISH. GIFT. INSPIRE.</span>
        </a>

        <section className="mt-6 rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-7">
          {!recommendation ? (
            <div className="py-10 text-center">
              <Leaf className="mx-auto h-10 w-10 text-kindred" />
              <h1 className="mt-4 text-2xl font-black text-ink">No saved mix yet</h1>
              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-muted">
                Complete the wellness quiz to generate your Kindbite daily mix suggestion.
              </p>
              <a className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white" href="/wellness-quiz">
                Start Quiz
              </a>
            </div>
          ) : (
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Your Kindbite recommendation</p>
              <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{recommendation.title}</h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted">{recommendation.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-kindred-soft p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Daily total</p>
                  <strong className="mt-1 block text-3xl text-ink">{recommendation.dailyTotalGrams}g</strong>
                </div>
                <div className="rounded-md bg-beige p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-muted">Selected duration</p>
                  <strong className="mt-1 block text-3xl text-ink">{recommendation.selectedDuration}</strong>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {recommendation.items.map((item) => (
                  <article key={item.name} className="rounded-md border border-kindred/10 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-black text-ink">{item.name}</h2>
                      <span className="rounded-full bg-kindred-soft px-3 py-1 text-sm font-black text-kindred">
                        {item.gramsPerDay}g/day
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted">{item.reason}</p>
                  </article>
                ))}
              </div>

              {recommendation.warnings.length > 0 && (
                <div className="mt-6 rounded-md bg-kindred-soft p-4">
                  <h2 className="font-black text-kindred">Notes</h2>
                  <div className="mt-2 grid gap-2 text-sm font-semibold leading-6 text-muted">
                    {recommendation.warnings.map((warning) => (
                      <p key={warning}>{warning}</p>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-6 rounded-md bg-beige p-4 text-xs font-semibold leading-5 text-muted">
                {recommendation.disclaimer}
              </p>

              <a className="mt-6 inline-flex h-12 items-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred" href="/wellness-quiz">
                <ArrowLeft className="h-4 w-4" />
                Edit Quiz
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
