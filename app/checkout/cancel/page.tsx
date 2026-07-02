"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, XCircle } from "lucide-react";
import { CheckoutOrder, buildWhatsAppOrderUrl } from "@/lib/order";
import { getStoredJson, setStoredJson } from "@/lib/storage";

function updateCancelledOrder(orderId: string | null) {
  const latestOrder = getStoredJson<CheckoutOrder | null>("kindbite_order_request", null);
  const history = getStoredJson<CheckoutOrder[]>("kindbite_order_requests", []);
  const targetOrder = history.find((order) => order.orderId === orderId) || latestOrder;

  if (!targetOrder) return null;

  const updatedOrder: CheckoutOrder = {
    ...targetOrder,
    status: "pending",
    paymentStatus: "unpaid",
    updatedAt: new Date().toISOString(),
  };

  setStoredJson("kindbite_order_request", updatedOrder);
  setStoredJson("kindbite_order_requests", [
    updatedOrder,
    ...history.filter((order) => order.orderId !== updatedOrder.orderId),
  ]);

  return updatedOrder;
}

export default function CheckoutCancelPage() {
  const [order, setOrder] = useState<CheckoutOrder | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrder(updateCancelledOrder(params.get("order_id")));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="inline-block leading-none">
          <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
          <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">NOURISH. GIFT. INSPIRE.</span>
        </a>

        <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
          <XCircle className="mx-auto h-12 w-12 text-kindred" />
          <h1 className="mt-4 text-3xl font-black text-ink">Payment was not completed</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
            You can try online payment again or confirm your order on WhatsApp.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
              href="/checkout"
            >
              Try Again
              <ArrowRight className="h-4 w-4" />
            </a>
            {order && (
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-success px-5 text-sm font-black text-white shadow-card"
                href={buildWhatsAppOrderUrl(order)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Confirm on WhatsApp
              </a>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
