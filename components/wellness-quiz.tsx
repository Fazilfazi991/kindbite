"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, HeartPulse, Leaf, ShieldCheck } from "lucide-react";
import {
  BudgetRange,
  FoodPreference,
  Gender,
  HealthConcern,
  Lifestyle,
  PlanDuration,
  QuizAnswers,
  WELLNESS_DISCLAIMER,
  WellnessGoal,
  generateWellnessRecommendation,
} from "@/lib/wellness-recommendation";

const initialAnswers: QuizAnswers = {
  age: "",
  gender: "",
  weight: "",
  lifestyle: "",
  goal: "",
  healthConcern: "",
  foodPreference: "",
  nutAllergy: false,
  avoidSweetItems: false,
  avoidRoastedItems: false,
  duration: "",
  budget: "",
};

const genders: Gender[] = ["Male", "Female", "Other / Prefer not to say"];
const lifestyles: Lifestyle[] = ["Sedentary", "Lightly active", "Active", "Very active"];
const goals: WellnessGoal[] = [
  "General wellness",
  "Energy",
  "Weight gain",
  "Weight management",
  "Heart wellness",
  "Diabetic-friendly",
  "Women wellness",
  "Kids growth",
  "Senior wellness",
];
const healthConcerns: HealthConcern[] = [
  "High sugar",
  "High cholesterol",
  "Low iron",
  "Low energy",
  "Digestive issues",
  "PCOS support",
  "No specific concern",
];
const foodPreferences: FoodPreference[] = ["Vegetarian", "Vegan", "No preference"];
const durations: PlanDuration[] = ["7 days", "10 days", "15 days", "30 days"];
const budgets: BudgetRange[] = ["₹399 - ₹799", "₹800 - ₹1499", "₹1500+"];

const helperNotes = [
  ["Takes less than 2 minutes", HeartPulse],
  ["Personalized daily intake suggestion", Leaf],
  ["Food-based wellness guidance only", ShieldCheck],
] as const;

function SelectCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-md border p-4 text-left text-sm font-black transition ${
        selected
          ? "border-kindred bg-kindred-soft text-kindred shadow-card"
          : "border-kindred/12 bg-white text-ink hover:border-kindred/45"
      }`}
    >
      <span>{label}</span>
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
          selected ? "border-kindred bg-kindred text-white" : "border-kindred/20 text-transparent"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

function StepHeader({ step, title, eyebrow }: { step: number; title: string; eyebrow: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wide text-kindred">Step {step} of 6</p>
      <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm font-semibold leading-6 text-muted">{eyebrow}</p>
    </div>
  );
}

export function WellnessQuiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");

  const progress = useMemo(() => ((currentStep + 1) / 6) * 100, [currentStep]);

  const updateAnswer = <Key extends keyof QuizAnswers>(key: Key, value: QuizAnswers[Key]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setValidationMessage("");
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!answers.age || !answers.gender || !answers.weight) {
        return "Add your age, gender, and weight to continue.";
      }

      if (Number(answers.age) <= 0 || Number(answers.weight) <= 0) {
        return "Use valid numbers for age and weight.";
      }
    }

    if (currentStep === 1 && !answers.lifestyle) return "Choose the lifestyle option that feels closest.";
    if (currentStep === 2 && !answers.goal) return "Pick your main wellness goal.";
    if (currentStep === 3 && !answers.healthConcern) return "Choose a health concern, or select no specific concern.";
    if (currentStep === 4 && !answers.foodPreference) return "Select your food preference to continue.";
    if (currentStep === 5 && (!answers.duration || !answers.budget)) return "Choose a duration and budget range.";

    return "";
  };

  const goNext = () => {
    const message = validateStep();

    if (message) {
      setValidationMessage(message);
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((step) => step + 1);
      return;
    }

    const recommendation = generateWellnessRecommendation(answers);
    window.localStorage.setItem("kindbite_quiz_answers", JSON.stringify(answers));
    window.localStorage.setItem("kindbite_recommendation", JSON.stringify(recommendation));
    router.push("/recommendation");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
          <a href="/" className="leading-none">
            <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
            <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">NOURISH. GIFT. INSPIRE.</span>
          </a>
          <a className="hidden text-sm font-black text-kindred sm:inline-flex" href="/">
            Back to home
          </a>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="rounded-md bg-kindred p-6 text-white shadow-soft">
            <p className="text-xs font-black uppercase tracking-wide text-white/75">Wellness quiz</p>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">Find your daily Kindbite mix.</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-white/80">
              Answer a few food and lifestyle questions so Kindbite can suggest a simple daily mix of nuts,
              seeds, and natural foods.
            </p>
            <div className="mt-6 grid gap-3">
              {helperNotes.map(([note, Icon]) => (
                <div key={note} className="flex items-center gap-3 rounded-md bg-white/10 p-3 text-sm font-bold">
                  <Icon className="h-5 w-5 shrink-0" />
                  {note}
                </div>
              ))}
            </div>
          </aside>

          <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-7">
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-black text-muted">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-kindred-soft">
                <div className="h-full rounded-full bg-kindred transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {currentStep === 0 && (
              <div className="grid gap-5">
                <StepHeader step={1} title="Basic details" eyebrow="This helps us keep portions realistic and personal." />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-black text-ink">
                    Age
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={answers.age}
                      onChange={(event) => updateAnswer("age", event.target.value)}
                      className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                      placeholder="32"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-black text-ink">
                    Weight
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={answers.weight}
                      onChange={(event) => updateAnswer("weight", event.target.value)}
                      className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                      placeholder="68 kg"
                    />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {genders.map((gender) => (
                    <SelectCard key={gender} label={gender} selected={answers.gender === gender} onClick={() => updateAnswer("gender", gender)} />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid gap-5">
                <StepHeader step={2} title="Lifestyle" eyebrow="Choose the activity level that best describes most weeks." />
                <div className="grid gap-3 sm:grid-cols-2">
                  {lifestyles.map((lifestyle) => (
                    <SelectCard key={lifestyle} label={lifestyle} selected={answers.lifestyle === lifestyle} onClick={() => updateAnswer("lifestyle", lifestyle)} />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid gap-5">
                <StepHeader step={3} title="Main wellness goal" eyebrow="Your goal guides the base recommendation." />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {goals.map((goal) => (
                    <SelectCard key={goal} label={goal} selected={answers.goal === goal} onClick={() => updateAnswer("goal", goal)} />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid gap-5">
                <StepHeader step={4} title="Health concern" eyebrow="Pick one concern so the mix can avoid obvious mismatches." />
                <div className="grid gap-3 sm:grid-cols-2">
                  {healthConcerns.map((concern) => (
                    <SelectCard key={concern} label={concern} selected={answers.healthConcern === concern} onClick={() => updateAnswer("healthConcern", concern)} />
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="grid gap-5">
                <StepHeader step={5} title="Food preference" eyebrow="Tell us what to include or avoid in your suggestion." />
                <div className="grid gap-3 sm:grid-cols-3">
                  {foodPreferences.map((preference) => (
                    <SelectCard key={preference} label={preference} selected={answers.foodPreference === preference} onClick={() => updateAnswer("foodPreference", preference)} />
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["nutAllergy", "Nut allergy"],
                    ["avoidSweetItems", "Avoid sweet items"],
                    ["avoidRoastedItems", "Avoid roasted items"],
                  ].map(([key, label]) => (
                    <label key={key} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-md border border-kindred/12 bg-white p-4 text-sm font-black text-ink transition hover:border-kindred/45">
                      <input
                        type="checkbox"
                        checked={Boolean(answers[key as keyof QuizAnswers])}
                        onChange={(event) => updateAnswer(key as keyof QuizAnswers, event.target.checked as never)}
                        className="h-5 w-5 accent-kindred"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="grid gap-5">
                <StepHeader step={6} title="Plan preference" eyebrow="Choose a trial duration and comfortable budget range." />
                <div>
                  <h3 className="mb-3 text-sm font-black text-ink">Duration</h3>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {durations.map((duration) => (
                      <SelectCard key={duration} label={duration} selected={answers.duration === duration} onClick={() => updateAnswer("duration", duration)} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-black text-ink">Budget</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {budgets.map((budget) => (
                      <SelectCard key={budget} label={budget} selected={answers.budget === budget} onClick={() => updateAnswer("budget", budget)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {validationMessage && (
              <p className="mt-5 rounded-md bg-kindred-soft px-4 py-3 text-sm font-bold text-kindred">
                {validationMessage}
              </p>
            )}

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-kindred/10 pt-5">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep((step) => Math.max(0, step - 1));
                  setValidationMessage("");
                }}
                disabled={currentStep === 0}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card transition hover:bg-kindred-deep"
              >
                {currentStep === 5 ? "Show My Wellness Mix" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <footer className="rounded-md bg-white/80 p-4 text-xs font-semibold leading-5 text-muted ring-1 ring-kindred/8">
          {WELLNESS_DISCLAIMER}
        </footer>
      </div>
    </main>
  );
}
