import { RecommendationItem } from "@/lib/wellness-recommendation";

export const PRICE_PER_GRAM: Record<string, number> = {
  Almonds: 1.2,
  Walnuts: 1.8,
  Dates: 0.6,
  Raisins: 0.5,
  "Black Raisins": 0.6,
  "Pumpkin Seeds": 0.8,
  "Sunflower Seeds": 0.7,
  "Flax Seeds": 0.6,
  "Chia Seeds": 1.0,
  Cashews: 1.3,
  Figs: 1.4,
  Pistachios: 1.8,
};

export type IngredientPricingBreakdown = {
  name: string;
  gramsPerDay: number;
  totalGrams: number;
  pricePerGram: number;
  subtotal: number;
};

export type PricingSummary = {
  duration: number;
  totalDailyGrams: number;
  totalQuantityGrams: number;
  ingredientSubtotal: number;
  packagingFee: number;
  deliveryFee: number;
  preparationFee: number;
  finalPrice: number;
  ingredientBreakdown: IngredientPricingBreakdown[];
};

const DEFAULT_PRICE_PER_GRAM = 1;
const PACKAGING_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 59;
const PREPARATION_RATE = 0.25;

export function getIngredientPrice(name: string) {
  return PRICE_PER_GRAM[name] ?? DEFAULT_PRICE_PER_GRAM;
}

export function roundToNearestNicePrice(amount: number) {
  const roundedUpToTen = Math.ceil(amount / 10) * 10;
  return roundedUpToTen - 1;
}

export function calculatePricing(
  items: RecommendationItem[],
  duration: number,
  totalDailyGrams?: number,
): PricingSummary {
  const ingredientBreakdown = items.map((item) => {
    const totalGrams = item.gramsPerDay * duration;
    const pricePerGram = getIngredientPrice(item.name);

    return {
      name: item.name,
      gramsPerDay: item.gramsPerDay,
      totalGrams,
      pricePerGram,
      subtotal: totalGrams * pricePerGram,
    };
  });

  const ingredientSubtotal = ingredientBreakdown.reduce((total, item) => total + item.subtotal, 0);
  const preparationFee = ingredientSubtotal * PREPARATION_RATE;
  const deliveryFee = ingredientSubtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const totalQuantityGrams = (totalDailyGrams ?? items.reduce((total, item) => total + item.gramsPerDay, 0)) * duration;
  const finalPrice = roundToNearestNicePrice(
    ingredientSubtotal + PACKAGING_FEE + deliveryFee + preparationFee,
  );

  return {
    duration,
    totalDailyGrams: totalDailyGrams ?? totalQuantityGrams / duration,
    totalQuantityGrams,
    ingredientSubtotal,
    packagingFee: PACKAGING_FEE,
    deliveryFee,
    preparationFee,
    finalPrice,
    ingredientBreakdown,
  };
}
