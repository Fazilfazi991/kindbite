export const WELLNESS_DISCLAIMER =
  "Kindbite provides food-based wellness suggestions only. This is not medical advice, diagnosis, or treatment. Please consult a qualified healthcare professional for medical concerns.";

export type Gender = "Male" | "Female" | "Other / Prefer not to say";
export type Lifestyle = "Sedentary" | "Lightly active" | "Active" | "Very active";
export type WellnessGoal =
  | "General wellness"
  | "Energy"
  | "Weight gain"
  | "Weight management"
  | "Heart wellness"
  | "Diabetic-friendly"
  | "Women wellness"
  | "Kids growth"
  | "Senior wellness";
export type HealthConcern =
  | "High sugar"
  | "High cholesterol"
  | "Low iron"
  | "Low energy"
  | "Digestive issues"
  | "PCOS support"
  | "No specific concern";
export type FoodPreference = "Vegetarian" | "Vegan" | "No preference";
export type PlanDuration = "7 days" | "10 days" | "15 days" | "30 days";
export type BudgetRange = "₹399 - ₹799" | "₹800 - ₹1499" | "₹1500+";

export type QuizAnswers = {
  age: string;
  gender: Gender | "";
  weight: string;
  lifestyle: Lifestyle | "";
  goal: WellnessGoal | "";
  healthConcern: HealthConcern | "";
  foodPreference: FoodPreference | "";
  nutAllergy: boolean;
  avoidSweetItems: boolean;
  avoidRoastedItems: boolean;
  duration: PlanDuration | "";
  budget: BudgetRange | "";
};

export type RecommendationItem = {
  name: string;
  gramsPerDay: number;
  reason: string;
};

export type WellnessRecommendation = {
  title: string;
  description: string;
  dailyTotalGrams: number;
  items: RecommendationItem[];
  warnings: string[];
  selectedDuration: PlanDuration | "";
  disclaimer: string;
};

const reasons: Record<string, string> = {
  Almonds: "Steady plant-based nutrition with healthy fats and natural crunch.",
  Dates: "Quick food-based energy from naturally sweet dry fruit.",
  Raisins: "Gentle natural sweetness with everyday micronutrient support.",
  "Black Raisins": "Iron-focused dry fruit support for daily wellness.",
  "Pumpkin Seeds": "Seed-based minerals and a satisfying nutrient-dense bite.",
  Cashews: "Calorie-dense creaminess for energy and weight support.",
  Walnuts: "Omega-rich nut support for heart-focused daily nutrition.",
  "Flax Seeds": "Fiber and plant omega support in a compact serving.",
  "Chia Seeds": "Fiber-rich seeds that fit lighter wellness mixes.",
  "Sunflower Seeds": "Nut-free seed crunch with vitamin and mineral support.",
  Figs: "Naturally sweet dry fruit with digestive-friendly fiber.",
  Pistachios: "Small serving of nuts for growth-focused variety.",
};

const nutItems = new Set(["Almonds", "Walnuts", "Cashews", "Pistachios"]);
const sweetItems = new Set(["Dates", "Raisins", "Black Raisins", "Figs"]);
const seedAlternatives = ["Pumpkin Seeds", "Sunflower Seeds", "Flax Seeds", "Chia Seeds"];

function makeItem(name: string, gramsPerDay: number): RecommendationItem {
  return {
    name,
    gramsPerDay,
    reason: reasons[name] ?? "Balanced food-based support for your selected wellness plan.",
  };
}

function addOrIncrease(items: RecommendationItem[], name: string, gramsPerDay: number) {
  const existing = items.find((item) => item.name === name);

  if (existing) {
    existing.gramsPerDay += gramsPerDay;
    return;
  }

  items.push(makeItem(name, gramsPerDay));
}

function applyReplacementRule(
  items: RecommendationItem[],
  shouldRemove: (name: string) => boolean,
  alternatives: string[],
) {
  let alternativeIndex = 0;
  const kept: RecommendationItem[] = [];

  for (const item of items) {
    if (!shouldRemove(item.name)) {
      addOrIncrease(kept, item.name, item.gramsPerDay);
      continue;
    }

    const replacement = alternatives[alternativeIndex % alternatives.length];
    addOrIncrease(kept, replacement, item.gramsPerDay);
    alternativeIndex += 1;
  }

  return kept;
}

function baseMixForAnswers(answers: QuizAnswers) {
  const diabeticFriendly =
    answers.goal === "Diabetic-friendly" ||
    answers.healthConcern === "High sugar" ||
    answers.avoidSweetItems;

  if (diabeticFriendly) {
    return {
      title: "Your Sugar-Conscious Wellness Mix",
      description: "A seed-forward daily mix designed without dates or raisins for a lighter, diabetic-friendly profile.",
      items: [
        makeItem("Almonds", 15),
        makeItem("Walnuts", 10),
        makeItem("Pumpkin Seeds", 10),
        makeItem("Sunflower Seeds", 10),
        makeItem("Flax Seeds", 5),
      ],
    };
  }

  if (answers.goal === "Energy") {
    return {
      title: "Your Daily Energy Mix",
      description: "A naturally energizing combination of nuts, seeds, and dry fruits for active days.",
      items: [
        makeItem("Almonds", 15),
        makeItem("Dates", 20),
        makeItem("Raisins", 10),
        makeItem("Pumpkin Seeds", 10),
        makeItem("Cashews", 10),
      ],
    };
  }

  if (answers.goal === "Heart wellness") {
    return {
      title: "Your Heart Wellness Mix",
      description: "A walnut, almond, and seed-led mix with heart-friendly everyday ingredients.",
      items: [
        makeItem("Walnuts", 10),
        makeItem("Almonds", 15),
        makeItem("Flax Seeds", 5),
        makeItem("Chia Seeds", 5),
        makeItem("Pumpkin Seeds", 10),
      ],
    };
  }

  if (answers.goal === "Weight gain") {
    return {
      title: "Your Nourishing Weight Gain Mix",
      description: "A calorie-dense dry fruit and nut mix for food-based daily nourishment.",
      items: [
        makeItem("Almonds", 20),
        makeItem("Cashews", 15),
        makeItem("Dates", 25),
        makeItem("Figs", 15),
        makeItem("Raisins", 15),
      ],
    };
  }

  if (answers.goal === "Weight management") {
    return {
      title: "Your Light Wellness Mix",
      description: "A measured mix of nuts and seeds focused on satisfying portions and daily balance.",
      items: [
        makeItem("Almonds", 10),
        makeItem("Walnuts", 10),
        makeItem("Pumpkin Seeds", 10),
        makeItem("Chia Seeds", 5),
        makeItem("Flax Seeds", 5),
      ],
    };
  }

  if (
    answers.goal === "Women wellness" ||
    answers.healthConcern === "Low iron" ||
    answers.healthConcern === "PCOS support"
  ) {
    return {
      title: "Your Women Wellness Mix",
      description: "A mineral-aware daily mix with iron-supportive dry fruits and balanced seeds.",
      items: [
        makeItem("Black Raisins", 15),
        makeItem("Dates", 15),
        makeItem("Pumpkin Seeds", 10),
        makeItem("Almonds", 15),
        makeItem("Figs", 10),
      ],
    };
  }

  if (answers.goal === "Kids growth") {
    return {
      title: "Your Kids Growth Mix",
      description: "A gentle, familiar mix with small portions of nuts and dry fruits for growing appetites.",
      items: [
        makeItem("Almonds", 10),
        makeItem("Cashews", 10),
        makeItem("Raisins", 10),
        makeItem("Dates", 10),
        makeItem("Pistachios", 5),
      ],
    };
  }

  if (answers.goal === "Senior wellness") {
    return {
      title: "Your Senior Wellness Mix",
      description: "A balanced daily mix with softer dry fruits, walnuts, almonds, and seeds.",
      items: [
        makeItem("Walnuts", 10),
        makeItem("Almonds", 10),
        makeItem("Pumpkin Seeds", 10),
        makeItem("Figs", 10),
        makeItem("Raisins", 5),
      ],
    };
  }

  return {
    title: "Your Daily Wellness Mix",
    description: "A balanced everyday Kindbite mix for general wellness, energy, and clean snacking.",
    items: [
      makeItem("Almonds", 15),
      makeItem("Walnuts", 10),
      makeItem("Dates", 15),
      makeItem("Pumpkin Seeds", 10),
      makeItem("Raisins", 10),
    ],
  };
}

export function generateWellnessRecommendation(answers: QuizAnswers): WellnessRecommendation {
  const warnings: string[] = [];
  const base = baseMixForAnswers(answers);
  let items = [...base.items];

  if (
    answers.goal === "Diabetic-friendly" ||
    answers.healthConcern === "High sugar" ||
    answers.avoidSweetItems
  ) {
    warnings.push(
      "Sweet dry fruits are avoided because you selected diabetic-friendly/high sugar/avoid sweet items.",
    );
  }

  if (answers.nutAllergy) {
    const allergyAlternatives = answers.avoidSweetItems
      ? seedAlternatives
      : [...seedAlternatives, "Black Raisins"];

    items = applyReplacementRule(items, (name) => nutItems.has(name), allergyAlternatives);
    warnings.push("You selected nut allergy, so nut-based ingredients have been removed from this suggestion.");
  }

  if (answers.avoidSweetItems) {
    items = applyReplacementRule(items, (name) => sweetItems.has(name), seedAlternatives);
    warnings.push("Sweet dry fruits have been removed based on your preference.");
  }

  return {
    title: base.title,
    description: base.description,
    dailyTotalGrams: items.reduce((total, item) => total + item.gramsPerDay, 0),
    items,
    warnings: Array.from(new Set(warnings)),
    selectedDuration: answers.duration,
    disclaimer: WELLNESS_DISCLAIMER,
  };
}
