"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  FileText,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { JourneyStepper } from "@/components/journey-stepper";
import { NextStepCards } from "@/components/next-step-cards";
import { TrustChips } from "@/components/trust-chips";
import { WellnessPlanBar } from "@/components/wellness-plan-bar";
import { CustomBox } from "@/lib/custom-box";
import {
  CheckoutBox,
  CheckoutCustomer,
  CheckoutOrder,
  CheckoutPricing,
  boxFromCustomBox,
  boxFromRecommendation,
  buildWhatsAppOrderUrl,
  emptyCheckoutCustomer,
  makeOrderId,
  pricingFromSummary,
} from "@/lib/order";
import { PricingSummary } from "@/lib/pricing";
import { getStoredJson, setStoredJson } from "@/lib/storage";
import { WellnessRecommendation } from "@/lib/wellness-recommendation";

type PaymentMethod = "stripe" | "whatsapp_cod";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
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

function validateCustomer(customer: CheckoutCustomer, paymentMethod: PaymentMethod) {
  if (!customer.fullName.trim()) return "Add your full name.";
  if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(customer.phone.replace(/\s|-/g, ""))) {
    return "Add a valid Indian phone number.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) return "Add a valid email address.";
  if (!customer.addressLine1.trim()) return "Add address line 1.";
  if (!customer.city.trim()) return "Add your city.";
  if (!customer.state.trim()) return "Add your state.";
  if (!/^\d{6}$/.test(customer.pincode.trim())) return "Add a valid 6-digit pincode.";
  if (!paymentMethod) return "Choose a payment method.";
  return "";
}

function saveOrder(order: CheckoutOrder) {
  setStoredJson("kindbite_order_request", order);
  const history = getStoredJson<CheckoutOrder[]>("kindbite_order_requests", []);
  const nextHistory = [order, ...history.filter((entry) => entry.orderId !== order.orderId)];
  setStoredJson("kindbite_order_requests", nextHistory);
}

function makeOrder(
  customer: CheckoutCustomer,
  box: CheckoutBox,
  pricing: CheckoutPricing,
  paymentMethod: PaymentMethod,
): CheckoutOrder {
  const now = new Date().toISOString();

  return {
    orderId: makeOrderId(),
    source: "checkout",
    status: paymentMethod === "stripe" ? "payment_started" : "whatsapp_confirmation",
    paymentMethod,
    paymentStatus: paymentMethod === "stripe" ? "started" : "manual_confirmation",
    customer,
    box,
    pricing,
    stripe: {},
    createdAt: now,
    updatedAt: now,
  };
}

export default function CheckoutPage() {
  const [box, setBox] = useState<CheckoutBox | null>(null);
  const [pricing, setPricing] = useState<CheckoutPricing | null>(null);
  const [customer, setCustomer] = useState<CheckoutCustomer>(emptyCheckoutCustomer);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "stripe" : "whatsapp_cod",
  );
  const [error, setError] = useState("");
  const [confirmationOrder, setConfirmationOrder] = useState<CheckoutOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const customBox = getStoredJson<CustomBox | null>("kindbite_custom_box", null);

    if (customBox) {
      const nextBox = boxFromCustomBox(customBox);
      const customPricing = getStoredJson<PricingSummary | null>("kindbite_custom_pricing_summary", null);
      setBox(nextBox);
      setPricing(pricingFromSummary(customPricing, customBox.finalPrice));
      return;
    }

    const recommendation = getStoredJson<WellnessRecommendation | null>("kindbite_recommendation", null);
    const summary = getStoredJson<PricingSummary | null>("kindbite_pricing_summary", null);

    if (recommendation && summary) {
      setBox(boxFromRecommendation(recommendation, summary));
      setPricing(pricingFromSummary(summary, summary.finalPrice));
    }
  }, []);

  const canCheckout = Boolean(box && pricing && box.finalPrice >= 50);
  const whatsappUrl = confirmationOrder ? buildWhatsAppOrderUrl(confirmationOrder) : "";

  const updateCustomer = <Key extends keyof CheckoutCustomer>(key: Key, value: CheckoutCustomer[Key]) => {
    setCustomer((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const submitCheckout = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!box || !pricing) {
      setError("Your wellness box is not ready yet. Please return to your recommendation or customize your box.");
      return;
    }

    if (box.finalPrice < 50) {
      setError("Checkout needs a valid order amount of at least INR 50.");
      return;
    }

    const validationMessage = validateCustomer(customer, paymentMethod);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const order = makeOrder(customer, box, pricing, paymentMethod);
    saveOrder(order);

    if (paymentMethod === "whatsapp_cod") {
      setConfirmationOrder(order);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const payload = (await response.json()) as { url?: string; sessionId?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Online payment is not configured yet. Please use WhatsApp confirmation.");
      }

      const updatedOrder: CheckoutOrder = {
        ...order,
        stripe: {
          checkoutSessionId: payload.sessionId,
          checkoutUrl: payload.url,
        },
        updatedAt: new Date().toISOString(),
      };
      saveOrder(updatedOrder);
      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Online payment is not configured yet. Please use WhatsApp confirmation.",
      );
      setPaymentMethod("whatsapp_cod");
    } finally {
      setSubmitting(false);
    }
  };

  const paymentOptions = useMemo(
    () => [
      {
        id: "stripe" as const,
        title: "Online Payment",
        label: "Pay securely with Stripe",
        description: "Card, UPI or available payment methods depending on Stripe settings.",
        icon: CreditCard,
      },
      {
        id: "whatsapp_cod" as const,
        title: "Cash on Delivery / Manual Confirmation",
        label: "Confirm on WhatsApp",
        description: "Our team will confirm delivery and payment details on WhatsApp.",
        icon: MessageCircle,
      },
    ],
    [],
  );

  if (confirmationOrder) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
            <Logo />
            <a className="hidden items-center gap-2 text-sm font-black text-kindred sm:inline-flex" href="/">
              Home
              <ArrowRight className="h-4 w-4" />
            </a>
          </header>

          <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
            <Check className="mx-auto h-12 w-12 rounded-full bg-kindred-soft p-2 text-kindred" />
            <h1 className="mt-4 text-3xl font-black text-ink">Order request received</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
              Our team will contact you on WhatsApp to confirm delivery and payment.
            </p>

            <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
              {[
                ["Order ID", confirmationOrder.orderId],
                ["Name", confirmationOrder.customer.fullName],
                ["Phone", confirmationOrder.customer.phone],
                ["Final price", formatCurrency(confirmationOrder.box.finalPrice)],
                ["Duration", `${confirmationOrder.box.duration} days`],
                ["Total quantity", `${confirmationOrder.box.totalQuantityGrams}g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-kindred-soft p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                  <strong className="mt-1 block text-sm text-ink">{value}</strong>
                </div>
              ))}
            </div>

            <a
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-success px-5 text-sm font-black text-white shadow-card"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Send Order on WhatsApp
            </a>
          </section>

          <div className="mt-5">
            <NextStepCards context="checkout" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 pb-32 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
          <Logo />
          <a className="hidden items-center gap-2 text-sm font-black text-kindred sm:inline-flex" href="/customize-box">
            <ArrowLeft className="h-4 w-4" />
            Edit box
          </a>
        </header>

        <div className="mt-5">
          <JourneyStepper currentStep="checkout" />
        </div>

        {!box || !pricing ? (
          <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
            <ShoppingBag className="mx-auto h-11 w-11 text-kindred" />
            <h1 className="mt-4 text-3xl font-black text-ink">Your wellness box is not ready yet</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
              Start with a quick quiz or upload your report to get a personalized Kindbite mix.
            </p>
            <div className="mx-auto mt-6 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
              <a className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card" href="/wellness-quiz">
                <Sparkles className="h-4 w-4" />
                Find My Mix
              </a>
              <a className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred" href="/report-upload">
                <FileText className="h-4 w-4" />
                Upload Report
              </a>
            </div>
          </section>
        ) : (
          <>
            <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start">
              <form onSubmit={submitCheckout} className="grid gap-5 lg:order-1">
                <div className="rounded-md bg-kindred p-6 text-white shadow-soft sm:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-wide">
                    <ShieldCheck className="h-4 w-4" />
                    Secure checkout
                  </span>
                  <h1 className="mt-5 font-display text-3xl font-black leading-tight sm:text-5xl">
                    Complete Your Kindbite Order
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
                    Review your wellness box and share your delivery details. You can pay online or confirm through WhatsApp.
                  </p>
                </div>

                <TrustChips />

                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Customer details</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {[
                      ["fullName", "Full name", "Your name", "text"],
                      ["phone", "Phone number", "+91 98765 43210", "tel"],
                      ["whatsapp", "WhatsApp number optional", "+91 98765 43210", "tel"],
                      ["email", "Email", "you@example.com", "email"],
                    ].map(([key, label, placeholder, type]) => (
                      <label key={key} className="grid gap-2 text-sm font-black text-ink">
                        {label}
                        <input
                          type={type}
                          value={customer[key as keyof CheckoutCustomer]}
                          onChange={(event) => updateCustomer(key as keyof CheckoutCustomer, event.target.value)}
                          className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                          placeholder={placeholder}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Delivery details</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-black text-ink sm:col-span-2">
                      Address line 1
                      <input
                        value={customer.addressLine1}
                        onChange={(event) => updateCustomer("addressLine1", event.target.value)}
                        className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                        placeholder="House, apartment, street"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-black text-ink sm:col-span-2">
                      Address line 2 optional
                      <input
                        value={customer.addressLine2}
                        onChange={(event) => updateCustomer("addressLine2", event.target.value)}
                        className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                        placeholder="Area, landmark"
                      />
                    </label>
                    {[
                      ["city", "City", "Mumbai"],
                      ["state", "State", "Maharashtra"],
                      ["pincode", "Pincode", "400001"],
                    ].map(([key, label, placeholder]) => (
                      <label key={key} className="grid gap-2 text-sm font-black text-ink">
                        {label}
                        <input
                          value={customer[key as keyof CheckoutCustomer]}
                          onChange={(event) => updateCustomer(key as keyof CheckoutCustomer, event.target.value)}
                          className="h-12 rounded-md border border-kindred/15 bg-white px-4 text-sm font-bold outline-none transition focus:border-kindred"
                          placeholder={placeholder}
                          inputMode={key === "pincode" ? "numeric" : "text"}
                        />
                      </label>
                    ))}
                    <label className="grid gap-2 text-sm font-black text-ink sm:col-span-2">
                      Delivery notes optional
                      <textarea
                        value={customer.deliveryNotes}
                        onChange={(event) => updateCustomer("deliveryNotes", event.target.value)}
                        className="min-h-24 rounded-md border border-kindred/15 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-kindred"
                        placeholder="Preferred time, delivery instructions, or gifting notes"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-wide text-kindred">Payment method</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {paymentOptions.map((option) => {
                      const selected = paymentMethod === option.id;
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(option.id);
                            setError("");
                          }}
                          className={`rounded-md border p-4 text-left transition ${
                            selected
                              ? "border-kindred bg-kindred-soft shadow-card"
                              : "border-kindred/12 bg-white hover:border-kindred/45"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <Icon className="h-6 w-6 text-kindred" />
                            {selected && <Check className="h-5 w-5 text-kindred" />}
                          </div>
                          <h2 className="mt-3 font-black text-ink">{option.title}</h2>
                          <p className="mt-1 text-sm font-black text-kindred">{option.label}</p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-muted">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 grid gap-2 text-xs font-bold leading-5 text-muted sm:grid-cols-3">
                    <span className="rounded-md bg-beige p-3">Secure online payment</span>
                    <span className="rounded-md bg-beige p-3">WhatsApp confirmation available</span>
                    <span className="rounded-md bg-beige p-3">Food-based wellness suggestion only</span>
                  </div>
                </div>

                {error && (
                  <p className="rounded-md bg-kindred-soft p-4 text-sm font-bold text-kindred">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canCheckout || submitting}
                  className="hidden h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card disabled:cursor-not-allowed disabled:opacity-45 md:inline-flex"
                >
                  {paymentMethod === "stripe" ? <CreditCard className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                  {submitting ? "Starting checkout..." : paymentMethod === "stripe" ? "Pay Online" : "Confirm on WhatsApp"}
                </button>
              </form>

              <aside className="grid gap-5 lg:sticky lg:top-5 lg:order-2">
                <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-kindred">Order summary</p>
                      <h2 className="mt-2 text-2xl font-black text-ink">{box.title}</h2>
                    </div>
                    <a className="shrink-0 text-xs font-black text-kindred" href="/customize-box">
                      Edit box
                    </a>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {[
                      ["Duration", `${box.duration} days`],
                      ["Daily grams", `${box.totalDailyGrams}g/day`],
                      ["Total quantity", `${box.totalQuantityGrams}g`],
                      ["Final price", formatCurrency(box.finalPrice)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md bg-kindred-soft p-4">
                        <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                        <strong className="mt-1 block text-lg text-ink">{value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    {box.items.map((item) => (
                      <article key={item.name} className="rounded-md border border-kindred/10 bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black text-ink">{item.name}</h3>
                            <p className="mt-1 text-xs font-bold text-muted">
                              {item.gramsPerDay}g/day · {item.totalGrams}g total
                            </p>
                          </div>
                          {typeof item.priceContribution === "number" && (
                            <strong className="text-kindred">{formatCurrency(item.priceContribution)}</strong>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {box.warnings.length > 0 && (
                    <div className="mt-5 rounded-md bg-beige p-4">
                      <div className="flex items-center gap-2 text-kindred">
                        <AlertTriangle className="h-4 w-4" />
                        <p className="text-sm font-black">Mix notes</p>
                      </div>
                      <div className="mt-2 grid gap-2 text-sm font-semibold leading-6 text-muted">
                        {box.warnings.map((warning) => (
                          <p key={warning}>{warning}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 rounded-md bg-ink p-4 text-white">
                    <div className="flex items-center gap-3">
                      <PackageCheck className="h-6 w-6" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-white/70">Amount payable</p>
                        <strong className="text-3xl">{formatCurrency(box.finalPrice)}</strong>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold leading-5 text-muted">
                    Food-based wellness suggestion only. Not medical advice.
                  </p>
                </div>
              </aside>
            </section>

            <div className="mt-5">
              <NextStepCards context="checkout" />
            </div>

            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-kindred/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
              <div className="mx-auto flex max-w-7xl items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wide text-muted">Total</p>
                  <strong className="block text-xl leading-tight text-ink">{formatCurrency(box.finalPrice)}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => submitCheckout()}
                  disabled={!canCheckout || submitting}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white disabled:opacity-45"
                >
                  {submitting ? "Starting..." : paymentMethod === "stripe" ? "Pay Online" : "Confirm on WhatsApp"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <WellnessPlanBar mobileBottomClass="bottom-20" />
          </>
        )}
      </div>
    </main>
  );
}
