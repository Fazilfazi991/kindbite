import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({
      received: true,
      message: "Stripe webhook is not configured yet.",
    });
  }

  const stripe = new Stripe(secretKey);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      // TODO: Connect this to database order update when backend is added.
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook" }, { status: 400 });
  }
}
