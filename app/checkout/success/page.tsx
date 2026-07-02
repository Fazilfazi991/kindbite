"use client";

import { useEffect, useState } from "react";
import { Check, Home, MessageCircle } from "lucide-react";
import { NextStepCards } from "@/components/next-step-cards";
import { CheckoutOrder, buildWhatsAppOrderUrl } from "@/lib/order";
import { getStoredJson, setStoredJson } from "@/lib/storage";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function updateStoredOrder(orderId: string | null, sessionId: string | null) {
  const latestOrder = getStoredJson<CheckoutOrder | null>("kindbite_order_request", null);
  const history = getStoredJson<CheckoutOrder[]>("kindbite_order_requests", []);
  const targetOrder = history.find((order) => order.orderId === orderId) || latestOrder;

  if (!targetOrder) return null;

  const updatedOrder: CheckoutOrder = {
    ...targetOrder,
    status: "payment_started",
    paymentStatus: "verification_pending",
    stripe: {
      ...targetOrder.stripe,
      checkoutSessionId: sessionId || targetOrder.stripe.checkoutSessionId,
    },
    updatedAt: new Date().toISOString(),
  };

  setStoredJson("kindbite_order_request", updatedOrder);
  setStoredJson("kindbite_order_requests", [
    updatedOrder,
    ...history.filter((order) => order.orderId !== updatedOrder.orderId),
  ]);

  return updatedOrder;
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<CheckoutOrder | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrder(updateStoredOrder(params.get("order_id"), params.get("session_id")));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="inline-block leading-none">
          <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
          <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">NOURISH. GIFT. INSPIRE.</span>
        </a>

        <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
          <Check className="mx-auto h-12 w-12 rounded-full bg-kindred-soft p-2 text-kindred" />
          <h1 className="mt-4 text-3xl font-black text-ink">Order payment completed</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-6 text-muted">
            We&apos;ve received your checkout confirmation. If payment was completed, our team will verify and process your order.
          </p>

          {order && (
            <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
              {[
                ["Order ID", order.orderId],
                ["Box", order.box.title],
                ["Final price", formatCurrency(order.box.finalPrice)],
                ["Total quantity", `${order.box.totalQuantityGrams}g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-kindred-soft p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{label}</p>
                  <strong className="mt-1 block text-sm text-ink">{value}</strong>
                </div>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {order && (
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-success px-5 text-sm font-black text-white shadow-card"
                href={buildWhatsAppOrderUrl(order)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Send Order Details on WhatsApp
              </a>
            )}
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
              href="/"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </a>
          </div>
        </section>

        <div className="mt-5">
          <NextStepCards context="checkout" />
        </div>
      </div>
    </main>
  );
}
