export type CustomBoxItem = {
  name: string;
  gramsPerDay: number;
  totalGrams: number;
  reason: string;
  priceContribution: number;
};

export type CustomBox = {
  originalRecommendationTitle: string;
  goal: string;
  duration: number;
  totalDailyGrams: number;
  totalQuantityGrams: number;
  finalPrice: number;
  items: CustomBoxItem[];
  warnings: string[];
  disclaimer: string;
  createdAt: string;
};
