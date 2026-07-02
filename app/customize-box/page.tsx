"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Leaf,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { CustomBox } from "@/lib/custom-box";
import { calculatePricing, getIngredientPrice } from "@/lib/pricing";
import {
  PlanDuration,
  QuizAnswers,
  RecommendationItem,
  WELLNESS_DISCLAIMER,
  WellnessRecommendation,
} from "@/lib/wellness-recommendation";

const durationOptions = [
  { days: 7, label: "7 Days", subtitle: "Trial" },
  { days: 10, label: "10 Days", subtitle: "Starter" },
  { days: 15, label: "15 Days", subtitle: "Wellness" },
  { days: 30, label: "30 Days", subtitle: "Monthly", badge: "Best Value" },
];

const productBenefits: Record<string, string> = {
  Almonds: "Supports daily energy and healthy fats.",
  Walnuts: "Omega-rich support for heart-focused wellness.",
  Dates: "Naturally sweet energy for active routines.",
  Raisins: "Gentle dry-fruit sweetness and everyday micronutrients.",
  "Black Raisins": "Iron-aware dry fruit support.",
  "Pumpkin Seeds": "Mineral-rich seed crunch for daily balance.",
  "Sunflower Seeds": "Nut-free crunch with vitamin and mineral support.",
  "Flax Seeds": "Fiber and plant omega support.",
  "Chia Seeds": "Fiber-rich seeds for lighter mixes.",
  Cashews: "Creamy, calorie-dense nourishment.",
  Figs: "Naturally sweet dry fruit with digestive-friendly fiber.",
  Pistachios: "Small nut serving for variety and crunch.",
};

const productNames = [
  "Almonds",
  "Walnuts",
  "Dates",
  "Raisins",
  "Black Raisins",
  "Pumpkin Seeds",
  "Sunflower Seeds",
  "Flax Seeds",
  "Chia Seeds",
  "Cashews",
  "Figs",
  "Pistachios",
];

const nutItems = new Set(["Almonds", "Walnuts", "Cashews", "Pistachios"]);
const sweetItems = new Set(["Dates", "Raisins", "Black Raisins", "Figs"]);
const MIN_ITEM_GRAMS = 5;
const MAX_ITEM_GRAMS = 50;
const GRAM_STEP = 5;
const MIN_DAILY_GRAMS = 30;

function parseDuration(duration: PlanDuration | "" | number | undefined) {
  if (typeof duration === "number") return durationOptions.some((option) => option.days === duration) ? duration : 7;

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

function totalDailyGrams(items: RecommendationItem[]) {
  return items.reduce((total, item) => total + item.gramsPerDay, 0);
}

function makeProductItem(name: string): RecommendationItem {
  return {
    name,
    gramsPerDay: 10,
    reason: productBenefits[name] ?? "Balanced food-based support for your wellness box.",
  };
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

export default function CustomizeBoxPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<WellnessRecommendation | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [duration, setDuration] = useState(7);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const skipNextPricingSaveRef = useRef(false);

  useEffect(() => {
    const savedRecommendation = window.localStorage.getItem("kindbite_recommendation");
    const savedAnswers = window.localStorage.getItem("kindbite_quiz_answers");
    const savedCustomBox = window.localStorage.getItem("kindbite_custom_box");

    if (savedAnswers) {
      try {
        setQuizAnswers(JSON.parse(savedAnswers) as QuizAnswers);
      } catch {
        setQuizAnswers(null);
      }
    }

    if (!savedRecommendation) return;

    try {
      const parsedRecommendation = JSON.parse(savedRecommendation) as WellnessRecommendation;
      setRecommendation(parsedRecommendation);

      if (savedCustomBox) {
        try {
          const parsedCustomBox = JSON.parse(savedCustomBox) as CustomBox;
          setItems(parsedCustomBox.items.map(({ name, gramsPerDay, reason }) => ({ name, gramsPerDay, reason })));
          setDuration(parseDuration(parsedCustomBox.duration));
          setWarnings(parsedCustomBox.warnings);
          return;
        } catch {
          window.localStorage.removeItem("kindbite_custom_box");
          window.localStorage.removeItem("kindbite_custom_pricing_summary");
        }
      }

      setItems(parsedRecommendation.items);
      setDuration(parseDuration(parsedRecommendation.selectedDuration));
      setWarnings(parsedRecommendation.warnings);
    } catch {
      setRecommendation(null);
      setItems([]);
      setWarnings([]);
    }
  }, []);

  const totalDaily = useMemo(() => totalDailyGrams(items), [items]);
  const pricing = useMemo(() => calculatePricing(items, duration, totalDaily), [duration, items, totalDaily]);
  const goal = quizAnswers?.goal || "Your wellness goal";
  const isSweetRestricted =
    quizAnswers?.avoidSweetItems ||
    quizAnswers?.goal === "Diabetic-friendly" ||
    quizAnswers?.healthConcern === "High sugar";
  const canSave = items.length > 0 && totalDaily >= MIN_DAILY_GRAMS;

  useEffect(() => {
    if (!recommendation) return;

    if (skipNextPricingSaveRef.current) {
      skipNextPricingSaveRef.current = false;
      window.localStorage.removeItem("kindbite_custom_pricing_summary");
      return;
    }

    window.localStorage.setItem("kindbite_custom_pricing_summary", JSON.stringify(pricing));
  }, [pricing, recommendation]);

  const updateItemGrams = (name: string, delta: number) => {
    setMessage("");
    setItems((currentItems) => {
      const target = currentItems.find((item) => item.name === name);
      if (!target) return currentItems;

      const nextGrams = Math.min(MAX_ITEM_GRAMS, Math.max(MIN_ITEM_GRAMS, target.gramsPerDay + delta));
      const nextTotal = totalDailyGrams(currentItems) - target.gramsPerDay + nextGrams;

      if (nextTotal < MIN_DAILY_GRAMS) {
        setMessage("Your daily mix should be at least 30g for a useful wellness box.");
        return currentItems;
      }

      return currentItems.map((item) =>
        item.name === name ? { ...item, gramsPerDay: nextGrams } : item,
      );
    });
  };

  const removeItem = (name: string) => {
    setMessage("");
    setItems((currentItems) => {
      const nextItems = currentItems.filter((item) => item.name !== name);
      if (nextItems.length > 0 && totalDailyGrams(nextItems) < MIN_DAILY_GRAMS) {
        setMessage("Your daily mix should be at least 30g for a useful wellness box.");
        return currentItems;
      }

      return nextItems;
    });
  };

  const addIngredient = (name: string) => {
    setMessage("");

    if (quizAnswers?.nutAllergy && nutItems.has(name)) return;

    if (isSweetRestricted && sweetItems.has(name)) {
      const confirmed = window.confirm(`${name} is naturally sweet. Add anyway?`);
      if (!confirmed) return;

      setWarnings((current) =>
        Array.from(new Set([...current, `${name} was added even though sweet items were flagged in your preferences.`])),
      );
    }

    setItems((currentItems) => {
      if (currentItems.some((item) => item.name === name)) return currentItems;
      return [...currentItems, makeProductItem(name)];
    });
  };

  const restoreRecommendedMix = () => {
    if (!recommendation) return;

    setItems(recommendation.items);
    setDuration(parseDuration(recommendation.selectedDuration));
    setWarnings(recommendation.warnings);
    setMessage("Recommended mix restored.");
    skipNextPricingSaveRef.current = true;
    window.localStorage.removeItem("kindbite_custom_box");
    window.localStorage.removeItem("kindbite_custom_pricing_summary");
  };

  const saveAndContinue = () => {
    if (!recommendation || !canSave) {
      setMessage(
        items.length === 0
          ? "Your box is empty. Add at least one ingredient to continue."
          : "Your daily mix should be at least 30g for a useful wellness box.",
      );
      return;
    }

    const customBox: CustomBox = {
      originalRecommendationTitle: recommendation.title,
      goal,
      duration,
      totalDailyGrams: totalDaily,
      totalQuantityGrams: pricing.totalQuantityGrams,
      finalPrice: pricing.finalPrice,
      items: items.map((item) => {
        const breakdown = pricing.ingredientBreakdown.find((entry) => entry.name === item.name);

        return {
          name: item.name,
          gramsPerDay: item.gramsPerDay,
          totalGrams: breakdown?.totalGrams ?? item.gramsPerDay * duration,
          reason: item.reason,
          priceContribution: breakdown?.subtotal ?? 0,
        };
      }),
      warnings,
      disclaimer: recommendation.disclaimer || WELLNESS_DISCLAIMER,
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem("kindbite_custom_box", JSON.stringify(customBox));
    window.localStorage.setItem("kindbite_custom_pricing_summary", JSON.stringify(pricing));
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 pb-28 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
          <Logo />
          <a className="hidden items-center gap-2 text-sm font-black text-kindred sm:inline-flex" href="/recommendation">
            <ArrowLeft className="h-4 w-4" />
            Recommendation
          </a>
        </header>

        {!recommendation ? (
          <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
            <Leaf className="mx-auto h-11 w-11 text-kindred" />
            <h1 className="mt-4 text-2xl font-black text-ink sm:text-3xl">Start with your wellness quiz</h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-muted">
              Complete the quick quiz first so we can suggest your base daily mix.
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
            <section className="mt-6 grid gap-5 lg:grid-cols-[1.06fr_0.94fr]">
              <div className="rounded-md bg-kindred p-6 text-white shadow-soft sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-wide">
                  <ShieldCheck className="h-4 w-4" />
                  Personalized daily intake
                </span>
                <h1 className="mt-5 font-display text-4xl font-black leading-tight sm:text-5xl">
                  Customize Your Wellness Box
                </h1>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
                  Adjust your daily mix, add ingredients, and build a box that fits your routine.
                </p>
                <p className="mt-5 inline-flex rounded-md bg-white/10 px-3 py-2 text-xs font-black">
                  Minimum plan: 7 days
                </p>
              </div>

              <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                <p className="text-xs font-black uppercase tracking-wide text-kindred">Base mix summary</p>
                <h2 className="mt-2 text-2xl font-black text-ink">{recommendation.title}</h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["Goal", goal],
                    ["Duration", `${duration} days`],
                    ["Daily total", `${totalDaily}g/day`],
                    ["Box quantity", `${pricing.totalQuantityGrams}g`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md bg-kindred-soft p-4">
                      <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                      <strong className="mt-1 block text-lg leading-tight text-ink">{value}</strong>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md bg-beige p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-muted">Current estimate</p>
                  <strong className="mt-1 block text-3xl text-ink">{formatCurrency(pricing.finalPrice)}</strong>
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
              <div className="grid gap-5">
                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-kindred">Ingredient editor</p>
                      <h2 className="mt-2 text-2xl font-black text-ink">Fine-tune your daily mix</h2>
                    </div>
                    <button
                      type="button"
                      onClick={restoreRecommendedMix}
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-kindred/20 bg-white px-4 text-xs font-black text-kindred"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Restore Recommended Mix
                    </button>
                  </div>

                  {message && (
                    <p className="mt-4 rounded-md bg-kindred-soft p-3 text-sm font-bold text-kindred">{message}</p>
                  )}

                  {items.length === 0 ? (
                    <p className="mt-5 rounded-md bg-beige p-4 text-sm font-bold text-muted">
                      Your box is empty. Add at least one ingredient to continue.
                    </p>
                  ) : (
                    <div className="mt-5 grid gap-3">
                      {items.map((item) => {
                        const breakdown = pricing.ingredientBreakdown.find((entry) => entry.name === item.name);

                        return (
                          <article
                            key={item.name}
                            className="rounded-md border border-kindred/10 bg-white p-4"
                          >
                            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                              <div>
                                <h3 className="font-black text-ink">{item.name}</h3>
                                <p className="mt-2 text-sm font-semibold leading-6 text-muted">{item.reason}</p>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-center sm:w-72">
                                <div className="rounded-md bg-kindred-soft p-3">
                                  <p className="text-[10px] font-black uppercase tracking-wide text-kindred">Per day</p>
                                  <strong className="text-lg text-ink">{item.gramsPerDay}g</strong>
                                </div>
                                <div className="rounded-md bg-beige p-3">
                                  <p className="text-[10px] font-black uppercase tracking-wide text-muted">Total</p>
                                  <strong className="text-lg text-ink">{breakdown?.totalGrams ?? item.gramsPerDay * duration}g</strong>
                                </div>
                                <div className="rounded-md bg-white p-3 ring-1 ring-kindred/10">
                                  <p className="text-[10px] font-black uppercase tracking-wide text-muted">Cost</p>
                                  <strong className="text-lg text-ink">{formatCurrency(breakdown?.subtotal ?? 0)}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateItemGrams(item.name, -GRAM_STEP)}
                                disabled={item.gramsPerDay <= MIN_ITEM_GRAMS}
                                className="grid h-11 w-11 place-items-center rounded-md border border-kindred/20 bg-white text-kindred disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Decrease ${item.name}`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => updateItemGrams(item.name, GRAM_STEP)}
                                disabled={item.gramsPerDay >= MAX_ITEM_GRAMS}
                                className="grid h-11 w-11 place-items-center rounded-md border border-kindred/20 bg-white text-kindred disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Increase ${item.name}`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(item.name)}
                                className="inline-flex h-11 items-center gap-2 rounded-md border border-kindred/20 bg-white px-4 text-sm font-black text-kindred"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Add More to Your Box</p>
                  <h2 className="mt-2 text-2xl font-black text-ink">Ingredient shelf</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {productNames.map((name) => {
                      const alreadyAdded = items.some((item) => item.name === name);
                      const blockedByAllergy = Boolean(quizAnswers?.nutAllergy && nutItems.has(name));
                      const disabled = alreadyAdded || blockedByAllergy;

                      return (
                        <article key={name} className="rounded-md border border-kindred/10 bg-white p-4">
                          <h3 className="font-black text-ink">{name}</h3>
                          <p className="mt-1 text-xs font-black text-kindred">
                            {formatCurrency(getIngredientPrice(name))} per gram
                          </p>
                          <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-muted">
                            {blockedByAllergy
                              ? "Not available because nut allergy was selected."
                              : productBenefits[name]}
                          </p>
                          <button
                            type="button"
                            onClick={() => addIngredient(name)}
                            disabled={disabled}
                            className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-xs font-black transition ${
                              disabled
                                ? "cursor-not-allowed bg-beige text-muted"
                                : "bg-kindred text-white shadow-card"
                            }`}
                          >
                            {alreadyAdded ? "Already added" : blockedByAllergy ? "Unavailable" : "Add"}
                            {!disabled && <Plus className="h-4 w-4" />}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>
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
                          onClick={() => {
                            setDuration(option.days);
                            setMessage("");
                          }}
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
                      <p className="text-xs font-black uppercase tracking-wide text-kindred">Box total</p>
                      <h2 className="text-xl font-black text-ink">{pricing.totalQuantityGrams}g for {duration} days</h2>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm font-bold text-muted">
                    {[
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
                      <strong className="text-3xl text-ink">{formatCurrency(pricing.finalPrice)}</strong>
                    </div>
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8">
                    <div className="flex items-center gap-2 text-kindred">
                      <AlertTriangle className="h-5 w-5" />
                      <h2 className="font-black">Box notes</h2>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-muted">
                      {warnings.map((warning) => (
                        <p key={warning} className="rounded-md bg-kindred-soft p-3">
                          {warning}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-md bg-white p-5 text-sm font-semibold leading-6 text-muted shadow-card ring-1 ring-kindred/8">
                  <p>You can fine-tune this before ordering.</p>
                  <p className="mt-2">Daily intake is calculated from your selected mix.</p>
                  <p className="mt-2">Food-based wellness suggestion only.</p>
                </div>

                <p className="rounded-md bg-white p-4 text-xs font-semibold leading-5 text-muted shadow-card ring-1 ring-kindred/8">
                  {recommendation.disclaimer || WELLNESS_DISCLAIMER}
                </p>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={saveAndContinue}
                    disabled={!canSave}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Save & Continue
                  </button>
                  <a
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                    href="/recommendation"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Recommendation
                  </a>
                </div>
              </aside>
            </section>

            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-kindred/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
              <div className="mx-auto flex max-w-7xl items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wide text-muted">Total</p>
                  <strong className="block text-xl leading-tight text-ink">{formatCurrency(pricing.finalPrice)}</strong>
                </div>
                <button
                  type="button"
                  onClick={saveAndContinue}
                  disabled={!canSave}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white disabled:opacity-45"
                >
                  Save & Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
