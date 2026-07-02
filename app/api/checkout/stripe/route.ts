import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CheckoutOrder } from "@/lib/order";

function isValidOrderPayload(value: unknown): value is CheckoutOrder {
  if (!value || typeof value !== "object") return false;

  const order = value as CheckoutOrder;
  return (
    typeof order.orderId === "string" &&
    Boolean(order.customer?.email) &&
    Boolean(order.customer?.fullName) &&
    Boolean(order.customer?.phone) &&
    Boolean(order.box?.title) &&
    typeof order.box?.finalPrice === "number" &&
    order.box.finalPrice >= 50
  );
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);

  if (!isValidOrderPayload(payload)) {
    return NextResponse.json({ error: "Invalid checkout order" }, { status: 400 });
  }

  const order = payload;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || "http://localhost:3000";
  const stripe = new Stripe(secretKey);
  const amountInPaise = Math.round(order.box.finalPrice * 100);

  // When backend/database is added, recalculate price server-side before creating Stripe session.
  if (!Number.isFinite(amountInPaise) || amountInPaise < 5000) {
    return NextResponse.json({ error: "Invalid checkout amount" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customer.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Kindbite Wellness Box - ${order.box.title}`,
              description: `${order.box.duration} days · ${order.box.totalDailyGrams}g/day · ${order.box.totalQuantityGrams}g total`,
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.orderId,
        customerName: order.customer.fullName,
        phone: order.customer.phone,
        boxTitle: order.box.title,
        duration: String(order.box.duration),
        totalQuantityGrams: String(order.box.totalQuantityGrams),
        source: "kindbite_checkout",
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.orderId}`,
      cancel_url: `${siteUrl}/checkout/cancel?order_id=${order.orderId}`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Online payment could not be started. Please use WhatsApp confirmation." },
      { status: 400 },
    );
  }
}
