import { CustomBox } from "@/lib/custom-box";
import { PricingSummary } from "@/lib/pricing";
import { WellnessRecommendation } from "@/lib/wellness-recommendation";

export type CheckoutCustomer = {
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  deliveryNotes: string;
};

export type CheckoutBoxItem = {
  name: string;
  gramsPerDay: number;
  totalGrams: number;
  reason?: string;
  priceContribution?: number;
};

export type CheckoutBox = {
  type: "custom_box" | "recommendation";
  title: string;
  duration: number;
  totalDailyGrams: number;
  totalQuantityGrams: number;
  finalPrice: number;
  items: CheckoutBoxItem[];
  warnings: string[];
  disclaimer: string;
};

export type CheckoutPricing = {
  finalPrice: number;
  ingredientSubtotal: number;
  packagingFee: number;
  deliveryFee: number;
  preparationFee: number;
};

export type CheckoutOrder = {
  orderId: string;
  source: "checkout";
  status: "pending" | "payment_started" | "whatsapp_confirmation";
  paymentMethod: "stripe" | "whatsapp_cod";
  paymentStatus: "unpaid" | "started" | "paid" | "manual_confirmation" | "verification_pending";
  customer: CheckoutCustomer;
  box: CheckoutBox;
  pricing: CheckoutPricing;
  stripe: {
    checkoutSessionId?: string;
    checkoutUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const emptyCheckoutCustomer: CheckoutCustomer = {
  fullName: "",
  phone: "",
  whatsapp: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  deliveryNotes: "",
};

export function makeOrderId() {
  return `KB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function pricingFromSummary(summary: PricingSummary | null | undefined, finalPrice: number): CheckoutPricing {
  return {
    finalPrice,
    ingredientSubtotal: summary?.ingredientSubtotal ?? 0,
    packagingFee: summary?.packagingFee ?? 0,
    deliveryFee: summary?.deliveryFee ?? 0,
    preparationFee: summary?.preparationFee ?? 0,
  };
}

export function boxFromCustomBox(customBox: CustomBox): CheckoutBox {
  return {
    type: "custom_box",
    title: "Your Custom Kindbite Box",
    duration: customBox.duration,
    totalDailyGrams: customBox.totalDailyGrams,
    totalQuantityGrams: customBox.totalQuantityGrams,
    finalPrice: customBox.finalPrice,
    items: customBox.items.map((item) => ({
      name: item.name,
      gramsPerDay: item.gramsPerDay,
      totalGrams: item.totalGrams,
      reason: item.reason,
      priceContribution: item.priceContribution,
    })),
    warnings: customBox.warnings,
    disclaimer: customBox.disclaimer,
  };
}

export function boxFromRecommendation(
  recommendation: WellnessRecommendation,
  pricing: PricingSummary,
): CheckoutBox {
  return {
    type: "recommendation",
    title: recommendation.title,
    duration: pricing.duration,
    totalDailyGrams: pricing.totalDailyGrams,
    totalQuantityGrams: pricing.totalQuantityGrams,
    finalPrice: pricing.finalPrice,
    items: recommendation.items.map((item) => {
      const breakdown = pricing.ingredientBreakdown.find((entry) => entry.name === item.name);

      return {
        name: item.name,
        gramsPerDay: item.gramsPerDay,
        totalGrams: breakdown?.totalGrams ?? item.gramsPerDay * pricing.duration,
        reason: item.reason,
        priceContribution: breakdown?.subtotal,
      };
    }),
    warnings: recommendation.warnings,
    disclaimer: recommendation.disclaimer,
  };
}

export function buildWhatsAppOrderMessage(order: CheckoutOrder) {
  const address = [
    order.customer.addressLine1,
    order.customer.addressLine2,
    order.customer.city,
    order.customer.state,
    order.customer.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    "Hi Kindbite, I want to order my wellness box.",
    "",
    `Order ID: ${order.orderId}`,
    `Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    `City: ${order.customer.city}`,
    `Plan: ${order.box.title}`,
    `Duration: ${order.box.duration} days`,
    `Daily intake: ${order.box.totalDailyGrams}g/day`,
    `Total quantity: ${order.box.totalQuantityGrams}g`,
    `Estimated price: INR ${Math.round(order.box.finalPrice)}`,
    "",
    "Items:",
    ...order.box.items.map((item) => `- ${item.name} ${item.gramsPerDay}g/day`),
    "",
    "Delivery Address:",
    address,
    order.customer.deliveryNotes ? `Notes: ${order.customer.deliveryNotes}` : "",
    "",
    "Food-based wellness suggestion only.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function getWhatsAppNumber() {
  return process.env.NEXT_PUBLIC_KINDBITE_WHATSAPP_NUMBER || "919999999999";
}

export function buildWhatsAppOrderUrl(order: CheckoutOrder) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(buildWhatsAppOrderMessage(order))}`;
}
