"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  Leaf,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CustomBox } from "@/lib/custom-box";
import {
  AttachedMixSummary,
  AttachedMixType,
  ConsultationOption,
  NutritionistBooking,
} from "@/lib/nutritionist-booking";
import { PricingSummary } from "@/lib/pricing";
import { QuizAnswers, WellnessRecommendation } from "@/lib/wellness-recommendation";

const KIND_BITE_WHATSAPP_NUMBER = "919999999999";

const consultationOptions: ConsultationOption[] = [
  {
    id: "free-guidance-call",
    title: "Free Guidance Call",
    duration: "5 minutes",
    price: "Free",
    description: "For quick questions before choosing your Kindbite box.",
  },
  {
    id: "nutrition-review",
    title: "Nutrition Review",
    duration: "20 minutes",
    price: "₹199",
    description: "Review your quiz result, food preferences, and daily mix with a nutrition expert.",
  },
  {
    id: "monthly-wellness-plan",
    title: "Monthly Wellness Plan",
    duration: "30 minutes",
    price: "₹499",
    description: "For users who want routine guidance and monthly food planning.",
  },
  {
    id: "family-wellness-consultation",
    title: "Family Wellness Consultation",
    duration: "30 minutes",
    price: "₹699",
    description: "For families, kids, seniors, or multiple wellness goals.",
  },
];

const reasonOptions = [
  "Review my recommended mix",
  "Help with portion size",
  "Diabetic-friendly food guidance",
  "Weight gain support",
  "Weight management support",
  "Kids nutrition guidance",
  "Women wellness support",
  "Senior wellness support",
  "General wellness support",
  "Other",
];

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "05:00 PM - 06:00 PM",
  "07:00 PM - 08:00 PM",
];

type BookingFormState = {
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
  preferredDate: string;
  preferredTimeSlot: string;
  reason: string;
  notes: string;
};

const initialFormState: BookingFormState = {
  fullName: "",
  phone: "",
  email: "",
  whatsapp: "",
  preferredDate: "",
  preferredTimeSlot: "",
  reason: "",
  notes: "",
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function formatDuration(duration: number | string | undefined) {
  if (!duration) return "";
  return typeof duration === "number" ? `${duration} days` : duration;
}

function phoneIsValid(phone: string) {
  const normalized = phone.replace(/[\s-]/g, "");
  return /^(\+91)?[6-9]\d{9}$/.test(normalized);
}

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createBookingId() {
  return `KB-NUTRI-${Date.now().toString(36).toUpperCase()}`;
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

function buildWhatsAppUrl(booking: NutritionistBooking) {
  const mixLine = booking.attachedMixSummary
    ? `Mix: ${booking.attachedMixSummary.title} (${booking.attachedMixSummary.ingredients.join(", ")})`
    : "Mix: Not attached";
  const message = [
    "Kindbite nutritionist booking request",
    `Name: ${booking.fullName}`,
    `Consultation: ${booking.consultationType}`,
    `Date: ${booking.preferredDate}`,
    `Time: ${booking.preferredTimeSlot}`,
    `Reason: ${booking.reason}`,
    mixLine,
  ].join("\n");

  return `https://wa.me/${KIND_BITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function NutritionistBookingPage() {
  const [selectedConsultationId, setSelectedConsultationId] = useState("nutrition-review");
  const [form, setForm] = useState<BookingFormState>(initialFormState);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [recommendation, setRecommendation] = useState<WellnessRecommendation | null>(null);
  const [pricingSummary, setPricingSummary] = useState<PricingSummary | null>(null);
  const [customBox, setCustomBox] = useState<CustomBox | null>(null);
  const [attachMix, setAttachMix] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<NutritionistBooking | null>(null);

  useEffect(() => {
    const savedAnswers = window.localStorage.getItem("kindbite_quiz_answers");
    const savedRecommendation = window.localStorage.getItem("kindbite_recommendation");
    const savedPricing = window.localStorage.getItem("kindbite_pricing_summary");
    const savedCustomBox = window.localStorage.getItem("kindbite_custom_box");

    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers) as QuizAnswers;
        setQuizAnswers(parsedAnswers);
        if (parsedAnswers.goal) {
          setForm((current) => ({
            ...current,
            reason: parsedAnswers.goal === "Diabetic-friendly" ? "Diabetic-friendly food guidance" : "Review my recommended mix",
          }));
        }
      } catch {
        setQuizAnswers(null);
      }
    }

    if (savedRecommendation) {
      try {
        setRecommendation(JSON.parse(savedRecommendation) as WellnessRecommendation);
      } catch {
        setRecommendation(null);
      }
    }

    if (savedPricing) {
      try {
        setPricingSummary(JSON.parse(savedPricing) as PricingSummary);
      } catch {
        setPricingSummary(null);
      }
    }

    if (savedCustomBox) {
      try {
        setCustomBox(JSON.parse(savedCustomBox) as CustomBox);
      } catch {
        setCustomBox(null);
      }
    }

    setAttachMix(Boolean(savedCustomBox || savedRecommendation));
  }, []);

  const selectedConsultation = useMemo(
    () => consultationOptions.find((option) => option.id === selectedConsultationId) ?? consultationOptions[1],
    [selectedConsultationId],
  );

  const attachedMix = useMemo((): { type: AttachedMixType; summary: AttachedMixSummary | null } => {
    if (customBox) {
      return {
        type: "custom_box",
        summary: {
          title: "Your Custom Kindbite Box",
          duration: customBox.duration,
          dailyGrams: customBox.totalDailyGrams,
          totalQuantityGrams: customBox.totalQuantityGrams,
          finalPrice: customBox.finalPrice,
          ingredients: customBox.items.map((item) => `${item.name} ${item.gramsPerDay}g/day`),
        },
      };
    }

    if (recommendation) {
      return {
        type: "recommendation",
        summary: {
          title: recommendation.title,
          duration: recommendation.selectedDuration,
          dailyGrams: recommendation.dailyTotalGrams,
          totalQuantityGrams: pricingSummary?.totalQuantityGrams,
          finalPrice: pricingSummary?.finalPrice,
          ingredients: recommendation.items.map((item) => `${item.name} ${item.gramsPerDay}g/day`),
        },
      };
    }

    return { type: "none", summary: null };
  }, [customBox, pricingSummary, recommendation]);

  const updateForm = <Key extends keyof BookingFormState>(key: Key, value: BookingFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const validate = () => {
    if (!selectedConsultation) return "Choose a consultation type.";
    if (!form.fullName.trim()) return "Enter your full name.";
    if (!phoneIsValid(form.phone)) return "Enter a valid Indian phone number.";
    if (!emailIsValid(form.email)) return "Enter a valid email address.";
    if (!form.preferredDate) return "Choose a preferred date.";
    if (form.preferredDate < todayIsoDate()) return "Preferred date cannot be in the past.";
    if (!form.preferredTimeSlot) return "Choose a preferred time slot.";
    if (!form.reason) return "Choose the main reason for your consultation.";

    return "";
  };

  const submitBooking = (event?: FormEvent) => {
    event?.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const booking: NutritionistBooking = {
      bookingId: createBookingId(),
      consultationType: selectedConsultation.title,
      consultationDuration: selectedConsultation.duration,
      consultationPrice: selectedConsultation.price,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      preferredDate: form.preferredDate,
      preferredTimeSlot: form.preferredTimeSlot,
      reason: form.reason,
      notes: form.notes.trim(),
      attachedMixType: attachMix ? attachedMix.type : "none",
      attachedMixSummary: attachMix ? attachedMix.summary : null,
      status: "requested",
      createdAt: new Date().toISOString(),
    };

    const savedHistory = window.localStorage.getItem("kindbite_nutritionist_bookings");
    let history: NutritionistBooking[] = [];

    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory) as NutritionistBooking[];
      } catch {
        history = [];
      }
    }

    window.localStorage.setItem("kindbite_nutritionist_booking", JSON.stringify(booking));
    window.localStorage.setItem("kindbite_nutritionist_bookings", JSON.stringify([booking, ...history]));
    setConfirmation(booking);
  };

  const resetForm = () => {
    setConfirmation(null);
    setForm(initialFormState);
    setSelectedConsultationId("nutrition-review");
    setAttachMix(Boolean(attachedMix.summary));
    setError("");
  };

  if (confirmation) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
            <Logo />
            <a className="hidden items-center gap-2 text-sm font-black text-kindred sm:inline-flex" href="/recommendation">
              <ArrowLeft className="h-4 w-4" />
              Recommendation
            </a>
          </header>

          <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
            <Check className="mx-auto h-12 w-12 rounded-full bg-kindred-soft p-2 text-kindred" />
            <h1 className="mt-4 text-3xl font-black text-ink">Booking request received</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
              Our team will contact you soon to confirm your nutritionist slot.
            </p>

            <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
              {[
                ["Consultation", confirmation.consultationType],
                ["Date", confirmation.preferredDate],
                ["Time", confirmation.preferredTimeSlot],
                ["Name", confirmation.fullName],
                ["Phone", confirmation.phone],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-kindred-soft p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                  <strong className="mt-1 block text-sm text-ink">{value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                href="/recommendation"
              >
                Back to Recommendation
              </a>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
                href="/checkout"
              >
                Continue to Checkout
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
              >
                Book Another Slot
              </button>
            </div>

            <a
              className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-success px-5 text-sm font-black text-white shadow-card"
              href={buildWhatsAppUrl(confirmation)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Send Details on WhatsApp
            </a>
          </section>
        </div>
      </main>
    );
  }

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

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-md bg-kindred p-6 text-white shadow-soft sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-wide">
              <ShieldCheck className="h-4 w-4" />
              Nutrition guidance, not medical advice
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight sm:text-5xl">
              Talk to a Nutritionist
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
              Get food-based wellness guidance and review your Kindbite mix before ordering.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Review your daily mix", "Ask about ingredients and portions", "Get help choosing the right plan"].map((note) => (
                <div key={note} className="rounded-md bg-white/10 p-3 text-sm font-bold">
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
            <p className="text-xs font-black uppercase tracking-wide text-kindred">Attached context</p>
            {attachedMix.summary ? (
              <div className="mt-3">
                <h2 className="text-2xl font-black text-ink">
                  {attachedMix.type === "custom_box" ? "Your Custom Kindbite Box" : "Your Recommended Wellness Mix"}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["Duration", formatDuration(attachedMix.summary.duration)],
                    ["Daily grams", attachedMix.summary.dailyGrams ? `${attachedMix.summary.dailyGrams}g/day` : "Saved mix"],
                    ["Total quantity", attachedMix.summary.totalQuantityGrams ? `${attachedMix.summary.totalQuantityGrams}g` : "Available after plan"],
                    ["Final price", attachedMix.summary.finalPrice ? formatCurrency(attachedMix.summary.finalPrice) : "Estimate pending"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md bg-kindred-soft p-3">
                      <p className="text-[10px] font-black uppercase tracking-wide text-kindred">{label}</p>
                      <strong className="mt-1 block text-sm text-ink">{value}</strong>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md bg-beige p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-muted">Ingredient preview</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                    {attachedMix.summary.ingredients.slice(0, 5).join(", ")}
                    {attachedMix.summary.ingredients.length > 5 ? "..." : ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-md bg-beige p-4">
                <h2 className="font-black text-ink">No wellness mix attached yet</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                  Complete the quiz to bring your Kindbite mix into this consultation.
                </p>
                <a className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-kindred px-4 text-sm font-black text-white" href="/wellness-quiz">
                  Take Wellness Quiz
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-md border border-kindred/10 bg-white p-3 text-sm font-black text-ink">
              <input
                type="checkbox"
                checked={attachMix}
                disabled={!attachedMix.summary}
                onChange={(event) => setAttachMix(event.target.checked)}
                className="h-5 w-5 accent-kindred"
              />
              Attach my Kindbite mix to this booking
            </label>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <form onSubmit={submitBooking} className="grid gap-5">
            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Consultation type</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {consultationOptions.map((option) => {
                  const selected = selectedConsultationId === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedConsultationId(option.id);
                        setError("");
                      }}
                      className={`rounded-md border p-4 text-left transition ${
                        selected
                          ? "border-kindred bg-kindred-soft shadow-card"
                          : "border-kindred/12 bg-white hover:border-kindred/45"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-black text-ink">{option.title}</h2>
                          <p className="mt-1 text-xs font-black text-kindred">{option.duration} · {option.price}</p>
                        </div>
                        {selected && <Check className="h-5 w-5 text-kindred" />}
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-6 text-muted">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Booking details</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-black text-ink">
                  Full name
                  <input
                    value={form.fullName}
                    onChange={(event) => updateForm("fullName", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                    placeholder="Your name"
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Phone number
                  <input
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                    placeholder="+91 98765 43210"
                    inputMode="tel"
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Email
                  <input
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                    placeholder="you@example.com"
                    inputMode="email"
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  WhatsApp number <span className="text-xs text-muted">optional if different</span>
                  <input
                    value={form.whatsapp}
                    onChange={(event) => updateForm("whatsapp", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                    placeholder="+91 98765 43210"
                    inputMode="tel"
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Preferred date
                  <input
                    type="date"
                    min={todayIsoDate()}
                    value={form.preferredDate}
                    onChange={(event) => updateForm("preferredDate", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Preferred time slot
                  <select
                    value={form.preferredTimeSlot}
                    onChange={(event) => updateForm("preferredTimeSlot", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                  >
                    <option value="">Choose a slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black text-ink sm:col-span-2">
                  Main reason for consultation
                  <select
                    value={form.reason}
                    onChange={(event) => updateForm("reason", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                  >
                    <option value="">Choose a reason</option>
                    {reasonOptions.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black text-ink sm:col-span-2">
                  Notes <span className="text-xs text-muted">optional</span>
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateForm("notes", event.target.value)}
                    className="min-h-28 rounded-md border border-kindred/15 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-kindred"
                    placeholder="Share food preferences, questions, or anything you want the nutritionist to know."
                  />
                </label>
              </div>

              {error && (
                <p className="mt-4 rounded-md bg-kindred-soft p-3 text-sm font-bold text-kindred">{error}</p>
              )}
            </div>
          </form>

          <aside className="grid gap-5 lg:sticky lg:top-5">
            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-kindred" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Selected consultation</p>
                  <h2 className="text-xl font-black text-ink">{selectedConsultation.title}</h2>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm font-bold text-muted">
                <div className="flex items-center justify-between gap-4">
                  <span>Duration</span>
                  <strong className="text-ink">{selectedConsultation.duration}</strong>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Price</span>
                  <strong className="text-ink">{selectedConsultation.price}</strong>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-white p-5 text-sm font-semibold leading-6 text-muted shadow-card ring-1 ring-kindred/8">
              <div className="flex items-center gap-2 font-black text-ink">
                <ClipboardList className="h-5 w-5 text-kindred" />
                What you can discuss
              </div>
              <p className="mt-3">Review your mix, ask about ingredients and portions, or choose a plan with more confidence.</p>
            </div>

            <p className="rounded-md bg-white p-4 text-xs font-semibold leading-5 text-muted shadow-card ring-1 ring-kindred/8">
              Kindbite nutrition guidance is food-based wellness support only. It is not medical advice, diagnosis, or treatment. For medical conditions, please consult a qualified healthcare professional.
            </p>

            <button
              type="button"
              onClick={() => submitBooking()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
            >
              <Phone className="h-4 w-4" />
              Request Booking
            </button>
          </aside>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-kindred/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wide text-muted">Consultation</p>
              <strong className="block text-xl leading-tight text-ink">{selectedConsultation.price}</strong>
            </div>
            <button
              type="button"
              onClick={() => submitBooking()}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white"
            >
              Request Booking
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
