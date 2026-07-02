"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { CustomBox } from "@/lib/custom-box";
import { AttachedMixSummary, AttachedMixType } from "@/lib/nutritionist-booking";
import { PricingSummary } from "@/lib/pricing";
import { ManualReportValues, ReportFileMetadata, ReportRequest } from "@/lib/report-upload";
import { QuizAnswers, WellnessRecommendation } from "@/lib/wellness-recommendation";

const KINDBITE_WHATSAPP_NUMBER = "919999999999";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const acceptedFileTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

const reportTypes = [
  "Blood Sugar / HbA1c",
  "Cholesterol / Lipid Profile",
  "Vitamin D / B12",
  "Iron / Hemoglobin",
  "Thyroid",
  "General Health Checkup",
  "Other",
];

const wellnessGoals = [
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

const genders = ["Male", "Female", "Other / Prefer not to say"];

const emptyManualValues: ManualReportValues = {
  hba1c: "",
  fastingSugar: "",
  ldl: "",
  hdl: "",
  vitaminD: "",
  vitaminB12: "",
  hemoglobin: "",
  ferritin: "",
  tsh: "",
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  wellnessGoal: string;
  notes: string;
};

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  age: "",
  gender: "",
  wellnessGoal: "",
  notes: "",
};

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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function phoneIsValid(phone: string) {
  const normalized = phone.replace(/[\s-]/g, "");
  return /^(\+91)?[6-9]\d{9}$/.test(normalized);
}

function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createRequestId() {
  return `KB-REPORT-${Date.now().toString(36).toUpperCase()}`;
}

function buildWhatsAppUrl(request: ReportRequest) {
  const manualValues = Object.entries(request.manualValues)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
  const mixLine = request.attachedMixSummary
    ? `Mix: ${request.attachedMixSummary.title} (${request.attachedMixSummary.ingredients.join(", ")})`
    : "Mix: Not attached";
  const message = [
    "Kindbite report review request",
    `Name: ${request.fullName}`,
    `Phone: ${request.phone}`,
    `Report type: ${request.reportType}`,
    `Wellness goal: ${request.wellnessGoal}`,
    `File: ${request.fileMetadata.fileName} - please attach manually`,
    request.notes ? `Notes: ${request.notes}` : "",
    manualValues ? `Manual values: ${manualValues}` : "",
    mixLine,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${KINDBITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ReportUploadPage() {
  const [reportType, setReportType] = useState("Blood Sugar / HbA1c");
  const [fileMetadata, setFileMetadata] = useState<ReportFileMetadata | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [manualValues, setManualValues] = useState<ManualReportValues>(emptyManualValues);
  const [manualOpen, setManualOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [recommendation, setRecommendation] = useState<WellnessRecommendation | null>(null);
  const [pricingSummary, setPricingSummary] = useState<PricingSummary | null>(null);
  const [customBox, setCustomBox] = useState<CustomBox | null>(null);
  const [attachMix, setAttachMix] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<ReportRequest | null>(null);

  useEffect(() => {
    const savedAnswers = window.localStorage.getItem("kindbite_quiz_answers");
    const savedRecommendation = window.localStorage.getItem("kindbite_recommendation");
    const savedCustomBox = window.localStorage.getItem("kindbite_custom_box");
    const savedPricing = window.localStorage.getItem("kindbite_pricing_summary");

    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers) as QuizAnswers;
        setQuizAnswers(parsedAnswers);
        setForm((current) => ({
          ...current,
          age: parsedAnswers.age || current.age,
          gender: parsedAnswers.gender || current.gender,
          wellnessGoal: parsedAnswers.goal || current.wellnessGoal,
        }));
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

    if (savedCustomBox) {
      try {
        setCustomBox(JSON.parse(savedCustomBox) as CustomBox);
      } catch {
        setCustomBox(null);
      }
    }

    if (savedPricing) {
      try {
        setPricingSummary(JSON.parse(savedPricing) as PricingSummary);
      } catch {
        setPricingSummary(null);
      }
    }

    setAttachMix(Boolean(savedCustomBox || savedRecommendation));
  }, []);

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

  const updateForm = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) return;

    if (!acceptedFileTypes.includes(file.type)) {
      setFileMetadata(null);
      setError("Upload a PDF, JPG, PNG, or WEBP report file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileMetadata(null);
      setError("Report file must be 10MB or smaller.");
      return;
    }

    setFileMetadata({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    });
  };

  const validate = () => {
    const age = Number(form.age);

    if (!reportType) return "Choose a report type.";
    if (!fileMetadata) return "Upload your report file.";
    if (!form.fullName.trim()) return "Enter your full name.";
    if (!phoneIsValid(form.phone)) return "Enter a valid Indian phone number.";
    if (!emailIsValid(form.email)) return "Enter a valid email address.";
    if (!form.age || Number.isNaN(age) || age < 1 || age > 100) return "Enter an age between 1 and 100.";
    if (!form.gender) return "Choose your gender.";
    if (!form.wellnessGoal) return "Choose your main wellness goal.";

    return "";
  };

  const submitRequest = (event?: FormEvent) => {
    event?.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const request: ReportRequest = {
      requestId: createRequestId(),
      reportType,
      fileMetadata: fileMetadata as ReportFileMetadata,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      age: form.age,
      gender: form.gender,
      wellnessGoal: form.wellnessGoal,
      notes: form.notes.trim(),
      manualValues,
      attachedMixType: attachMix ? attachedMix.type : "none",
      attachedMixSummary: attachMix ? attachedMix.summary : null,
      status: "submitted",
      createdAt: new Date().toISOString(),
      disclaimerAccepted: true,
    };

    const savedHistory = window.localStorage.getItem("kindbite_report_requests");
    let history: ReportRequest[] = [];

    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory) as ReportRequest[];
      } catch {
        history = [];
      }
    }

    window.localStorage.setItem("kindbite_report_request", JSON.stringify(request));
    window.localStorage.setItem("kindbite_report_requests", JSON.stringify([request, ...history]));
    setConfirmation(request);
  };

  const resetForm = () => {
    setConfirmation(null);
    setReportType("Blood Sugar / HbA1c");
    setFileMetadata(null);
    setForm({
      ...initialForm,
      age: quizAnswers?.age ?? "",
      gender: quizAnswers?.gender ?? "",
      wellnessGoal: quizAnswers?.goal ?? "",
    });
    setManualValues(emptyManualValues);
    setManualOpen(false);
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
            <h1 className="mt-4 text-3xl font-black text-ink">Report review request submitted</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
              Our team will review your details and suggest food-based wellness options. This is not medical advice.
            </p>

            <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
              {[
                ["Report type", confirmation.reportType],
                ["Name", confirmation.fullName],
                ["Phone", confirmation.phone],
                ["Wellness goal", confirmation.wellnessGoal],
                ["Attached mix", confirmation.attachedMixSummary ? confirmation.attachedMixSummary.title : "Not attached"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-kindred-soft p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                  <strong className="mt-1 block text-sm text-ink">{value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
                href="/nutritionist-booking"
              >
                Book Nutritionist Review
              </a>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                href="/recommendation"
              >
                Back to Recommendation
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
              >
                Submit Another Report
              </button>
            </div>

            <a
              className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-success px-5 text-sm font-black text-white shadow-card"
              href={buildWhatsAppUrl(confirmation)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Send Report Details on WhatsApp
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
              <Sparkles className="h-4 w-4" />
              Beta feature
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight sm:text-5xl">
              Upload Your Wellness Report
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
              Share your report and get food-based Kindbite mix suggestions reviewed for your wellness goals.
            </p>
            <p className="mt-5 inline-flex rounded-md bg-white/10 px-3 py-2 text-xs font-black">
              AI-assisted food guidance, reviewed safely.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Food-based suggestions only", "Nutritionist review option", "No diagnosis or prescription"].map((note) => (
                <div key={note} className="rounded-md bg-white/10 p-3 text-sm font-bold">
                  {note}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-kindred" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-kindred">Safety note</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-muted">
                  Kindbite does not diagnose, treat, cure, or prescribe. Report upload is used only to provide food-based wellness suggestions. Please consult a qualified healthcare professional for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <form onSubmit={submitRequest} className="grid gap-5">
            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Report type</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {reportTypes.map((type) => {
                  const selected = reportType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setReportType(type);
                        setError("");
                      }}
                      className={`min-h-20 rounded-md border p-4 text-left text-sm font-black transition ${
                        selected
                          ? "border-kindred bg-kindred-soft text-kindred shadow-card"
                          : "border-kindred/12 bg-white text-ink hover:border-kindred/45"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        {type}
                        {selected && <Check className="h-5 w-5 shrink-0" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Upload report</p>
              <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-kindred/30 bg-kindred-soft/45 p-5 text-center transition hover:border-kindred">
                <Upload className="h-10 w-10 text-kindred" />
                <span className="mt-3 text-sm font-black text-ink">Choose PDF, JPG, PNG, or WEBP report</span>
                <span className="mt-1 text-xs font-bold text-muted">Maximum file size: 10MB</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {fileMetadata && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-beige p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-kindred" />
                    <div>
                      <p className="text-sm font-black text-ink">{fileMetadata.fileName}</p>
                      <p className="text-xs font-bold text-muted">{formatBytes(fileMetadata.fileSize)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFileMetadata(null)}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-kindred/20 bg-white px-3 text-xs font-black text-kindred"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Basic details</p>
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
                  Age
                  <input
                    value={form.age}
                    onChange={(event) => updateForm("age", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                    placeholder="32"
                    inputMode="numeric"
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Gender
                  <select
                    value={form.gender}
                    onChange={(event) => updateForm("gender", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                  >
                    <option value="">Choose gender</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Main wellness goal
                  <select
                    value={form.wellnessGoal}
                    onChange={(event) => updateForm("wellnessGoal", event.target.value)}
                    className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                  >
                    <option value="">Choose goal</option>
                    {wellnessGoals.map((goal) => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black text-ink sm:col-span-2">
                  Notes / concerns
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateForm("notes", event.target.value)}
                    className="min-h-28 rounded-md border border-kindred/15 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-kindred"
                    placeholder="Tell us what you want help with - energy, sugar-friendly foods, cholesterol-friendly mix, low iron support, etc."
                  />
                </label>
              </div>

              {error && (
                <p className="mt-4 rounded-md bg-kindred-soft p-3 text-sm font-bold text-kindred">{error}</p>
              )}
            </div>

            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
              <button
                type="button"
                onClick={() => setManualOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <span>
                  <span className="block text-xs font-black uppercase tracking-wide text-kindred">Optional values</span>
                  <span className="mt-2 block text-xl font-black text-ink">Add key values manually, optional</span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-muted">
                    If you know the values, add them here. Otherwise our team can review the report.
                  </span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-kindred transition ${manualOpen ? "rotate-180" : ""}`} />
              </button>

              {manualOpen && (
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    ["hba1c", "HbA1c"],
                    ["fastingSugar", "Fasting sugar"],
                    ["ldl", "LDL"],
                    ["hdl", "HDL"],
                    ["vitaminD", "Vitamin D"],
                    ["vitaminB12", "Vitamin B12"],
                    ["hemoglobin", "Hemoglobin"],
                    ["ferritin", "Ferritin"],
                    ["tsh", "TSH"],
                  ].map(([key, label]) => (
                    <label key={key} className="grid gap-2 text-sm font-black text-ink">
                      {label}
                      <input
                        value={manualValues[key as keyof ManualReportValues]}
                        onChange={(event) =>
                          setManualValues((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                        className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                        placeholder="Optional"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </form>

          <aside className="grid gap-5 lg:sticky lg:top-5">
            <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8">
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Kindbite mix context</p>
              {attachedMix.summary ? (
                <div className="mt-3">
                  <h2 className="text-xl font-black text-ink">
                    {attachedMix.type === "custom_box" ? "Attach your custom Kindbite box" : "Attach your recommended wellness mix"}
                  </h2>
                  <div className="mt-4 grid gap-3">
                    {[
                      ["Daily grams", attachedMix.summary.dailyGrams ? `${attachedMix.summary.dailyGrams}g/day` : "Saved mix"],
                      ["Duration", attachedMix.summary.duration ? String(attachedMix.summary.duration).includes("days") ? attachedMix.summary.duration : `${attachedMix.summary.duration} days` : "Selected plan"],
                      ["Final price", attachedMix.summary.finalPrice ? formatCurrency(attachedMix.summary.finalPrice) : "Estimate pending"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md bg-kindred-soft p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-kindred">{label}</p>
                        <strong className="mt-1 block text-sm text-ink">{value}</strong>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 rounded-md bg-beige p-3 text-sm font-semibold leading-6 text-muted">
                    {attachedMix.summary.ingredients.slice(0, 5).join(", ")}
                    {attachedMix.summary.ingredients.length > 5 ? "..." : ""}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-md bg-beige p-4">
                  <h2 className="font-black text-ink">No Kindbite mix attached yet</h2>
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
                Attach my current Kindbite mix to this report request
              </label>
            </div>

            <div className="rounded-md bg-white p-5 text-sm font-semibold leading-6 text-muted shadow-card ring-1 ring-kindred/8">
              <div className="flex items-center gap-2 font-black text-ink">
                <Leaf className="h-5 w-5 text-kindred" />
                Beta review flow
              </div>
              <p className="mt-3">Your report file stays on your device in this MVP. Kindbite stores only the file details and your request information locally.</p>
            </div>

            <button
              type="button"
              onClick={() => submitRequest()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
            >
              Submit Report Request
            </button>
          </aside>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-kindred/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wide text-muted">Report review</p>
              <strong className="block text-xl leading-tight text-ink">Beta</strong>
            </div>
            <button
              type="button"
              onClick={() => submitRequest()}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white"
            >
              Submit Report Request
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
