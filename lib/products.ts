export type ProductType = "Powder" | "Nuts" | "Dry Fruits" | "Box";
export type ProductAudience = "Kids" | "Parents" | "Family" | "Adults" | "Gifting";
export type ProductUseCase = "Breakfast" | "Picky Eating" | "Daily Greens" | "Snacking" | "Gifting";
export type DietPreference = "No Added Sugar" | "Vegan" | "Traditional" | "Kid-Friendly";

export type KindbiteProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: ProductType;
  audience: ProductAudience[];
  useCases: ProductUseCase[];
  dietPreferences: DietPreference[];
  tags: string[];
  description: string;
  bestFor: string[];
  howToUse: string;
  ingredients: string[];
  tasteNote: string;
  safetyNote: string;
  price: number | null;
  image: string;
  isBundle: boolean;
  includedProducts: string[];
};

export const productSafetyNote =
  "Kindbite food powders are everyday food products, not medicines. Please check ingredients carefully if you have allergies or medical conditions. For children below 2 years or special medical needs, consult a qualified professional.";

export const products: KindbiteProduct[] = [
  {
    id: "moringa-kids-mix",
    name: "Moringa Kids Mix",
    slug: "moringa-kids-mix",
    category: "Kids Powders",
    type: "Powder",
    audience: ["Kids", "Family"],
    useCases: ["Daily Greens", "Picky Eating"],
    dietPreferences: ["Kid-Friendly", "Vegan", "Traditional"],
    tags: ["Kid-Friendly", "Daily Greens"],
    description: "Green nutrition support for regular Indian meals.",
    bestFor: ["Dosa batter", "chapati dough", "soup", "dal", "idli podi", "chutney", "rice"],
    howToUse: "Mix a small spoon into dosa batter, chapati dough, soup, dal, idli podi, chutney, or rice.",
    ingredients: ["Moringa leaf powder", "Roasted gram", "Cumin", "Rice flour"],
    tasteNote: "Mild green note designed for cooked Indian meals.",
    safetyNote: productSafetyNote,
    price: 349,
    image: "/kindbite_kids_product_images_webp/01_kindbite_moringa_kids_mix.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "abc-powder",
    name: "ABC Powder",
    slug: "abc-powder",
    category: "Kids Powders",
    type: "Powder",
    audience: ["Kids", "Family"],
    useCases: ["Breakfast", "Picky Eating"],
    dietPreferences: ["Kid-Friendly", "Traditional"],
    tags: ["Kid-Friendly", "Daily Use"],
    description: "Apple, beetroot, and carrot powder for kids who avoid vegetables.",
    bestFor: ["Milkshake", "smoothie", "pancake batter", "porridge", "oats", "yogurt"],
    howToUse: "Mix 1/2 to 1 tsp into milkshake, smoothie, pancake batter, porridge, oats, or yogurt.",
    ingredients: ["Apple", "Beetroot", "Carrot"],
    tasteNote: "Colorful, lightly sweet, and easy to blend into regular breakfast foods.",
    safetyNote: productSafetyNote,
    price: 299,
    image: "/kindbite_kids_product_images_webp/02_kindbite_abc_powder.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "ragi-almond-date-mix",
    name: "Ragi Almond Date Mix",
    slug: "ragi-almond-date-mix",
    category: "Breakfast Mix",
    type: "Powder",
    audience: ["Kids", "Family", "Adults"],
    useCases: ["Breakfast"],
    dietPreferences: ["Traditional", "Kid-Friendly"],
    tags: ["Breakfast Mix", "Daily Use"],
    description: "A traditional Indian energy breakfast mix.",
    bestFor: ["Porridge", "malt drink", "evening snack drink"],
    howToUse: "Cook with milk or water for porridge, or prepare as a warm malt-style drink.",
    ingredients: ["Ragi", "Almonds", "Dates", "Cardamom"],
    tasteNote: "Warm, nutty, and naturally sweet from dates.",
    safetyNote: productSafetyNote,
    price: 399,
    image: "/kindbite_kids_product_images_webp/03_kindbite_ragi_almond_date_mix.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "banana-oats-powder",
    name: "Banana Oats Powder",
    slug: "banana-oats-powder",
    category: "Kids Powders",
    type: "Powder",
    audience: ["Kids", "Family"],
    useCases: ["Breakfast"],
    dietPreferences: ["Kid-Friendly", "Traditional"],
    tags: ["Kid-Friendly", "Breakfast Mix"],
    description: "A gentle breakfast powder for toddlers and kids.",
    bestFor: ["Porridge", "pancakes", "smoothies"],
    howToUse: "Stir into porridge, fold into pancake batter, or blend into smoothies.",
    ingredients: ["Banana", "Oats", "Rice", "Cardamom"],
    tasteNote: "Soft, familiar, and breakfast-friendly.",
    safetyNote: productSafetyNote,
    price: 329,
    image: "/kindbite_kids_product_images_webp/04_kindbite_banana_oats_powder.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "dry-fruit-milk-mix-for-kids",
    name: "Dry Fruit Milk Mix for Kids",
    slug: "dry-fruit-milk-mix-for-kids",
    category: "Kids & Family",
    type: "Powder",
    audience: ["Kids", "Family"],
    useCases: ["Breakfast", "Snacking"],
    dietPreferences: ["Traditional", "Kid-Friendly"],
    tags: ["Daily Use", "Family Pick"],
    description: "A better alternative to sugary commercial milk powders.",
    bestFor: ["Milk", "desserts", "smoothies"],
    howToUse: "Mix into warm milk or shakes.",
    ingredients: ["Almonds", "Cashews", "Pistachios", "Dates", "Cardamom", "Saffron-style flavor"],
    tasteNote: "Creamy, nutty, and lightly sweet.",
    safetyNote: productSafetyNote,
    price: 449,
    image: "/kindbite_kids_product_images_webp/05_kindbite_dry_fruit_milk_mix_for_kids.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "veggie-sprinkle-powder",
    name: "Veggie Sprinkle Powder",
    slug: "veggie-sprinkle-powder",
    category: "Kids Powders",
    type: "Powder",
    audience: ["Kids", "Family"],
    useCases: ["Daily Greens", "Picky Eating"],
    dietPreferences: ["Kid-Friendly", "Vegan", "Traditional"],
    tags: ["Daily Greens", "One Spoon Better"],
    description: "Add one spoon to daily food.",
    bestFor: ["Rice", "dal", "dosa", "chapati dough", "idli podi", "chutney"],
    howToUse: "Sprinkle or mix a small spoon into the foods your family already eats.",
    ingredients: ["Moringa", "Spinach", "Carrot", "Curry leaf"],
    tasteNote: "Mild savory green flavor for regular meals.",
    safetyNote: productSafetyNote,
    price: 349,
    image: "/kindbite_kids_product_images_webp/06_kindbite_veggie_sprinkle_powder.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "lunchbox-booster-powder",
    name: "Lunchbox Booster Powder",
    slug: "lunchbox-booster-powder",
    category: "Kids Powders",
    type: "Powder",
    audience: ["Kids", "Family"],
    useCases: ["Breakfast", "Picky Eating"],
    dietPreferences: ["Kid-Friendly", "Traditional"],
    tags: ["Lunchbox Pick", "Daily Use"],
    description: "A mild savory powder for school food without drama.",
    bestFor: ["Dosa", "idli", "chapati", "rice", "noodles", "cutlet mix"],
    howToUse: "Mix into dosa, idli, chapati, rice, noodles, or cutlet mix before cooking or serving.",
    ingredients: ["Roasted gram", "Moringa", "Carrot", "Curry leaf", "Mild spices"],
    tasteNote: "Savory and familiar, made for lunchbox foods.",
    safetyNote: productSafetyNote,
    price: 359,
    image: "/kindbite_kids_product_images_webp/07_kindbite_lunchbox_booster_powder.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "family-moringa-powder",
    name: "Family Moringa Powder",
    slug: "family-moringa-powder",
    category: "Family Powders",
    type: "Powder",
    audience: ["Parents", "Family", "Adults"],
    useCases: ["Daily Greens"],
    dietPreferences: ["Vegan", "Traditional"],
    tags: ["Daily Greens", "Family Pick"],
    description: "A daily green powder for Indian meals.",
    bestFor: ["Adults", "parents", "family meals"],
    howToUse: "Mix into dal, dosa, chapati, soup, or chutney.",
    ingredients: ["Moringa leaf powder"],
    tasteNote: "Earthy green flavor that works best in savory foods.",
    safetyNote: productSafetyNote,
    price: 329,
    image: "/kindbite_realistic_product_images_webp/kindbite-realistic-product-images/01_daily_wellness_box.webp",
    isBundle: false,
    includedProducts: [],
  },
  {
    id: "gcc-to-india-care-box",
    name: "GCC to India Care Box",
    slug: "gcc-to-india-care-box",
    category: "Gifting",
    type: "Box",
    audience: ["Parents", "Kids", "Family", "Gifting"],
    useCases: ["Gifting", "Breakfast", "Snacking"],
    dietPreferences: ["Traditional"],
    tags: ["Gifting Pick", "Send to India"],
    description: "Send a daily health habit home.",
    bestFor: ["Parents", "kids", "family in India"],
    howToUse: "Choose the family member, add a note, and send a monthly care box to India.",
    ingredients: ["Food powders", "nuts", "dry fruits", "usage guide", "personal note"],
    tasteNote: "A mix of familiar Indian food habits and premium snackable care.",
    safetyNote: productSafetyNote,
    price: 1499,
    image: "/kindbite_proper_section_images_webp/kindbite-proper-section-images/01_build_your_own_box.webp",
    isBundle: false,
    includedProducts: ["Food powders", "Nuts", "Dry fruits", "Personal note"],
  },
  {
    id: "picky-eater-kit",
    name: "Picky Eater Kit",
    slug: "picky-eater-kit",
    category: "Kids Bundle",
    type: "Box",
    audience: ["Kids", "Family"],
    useCases: ["Picky Eating", "Breakfast"],
    dietPreferences: ["Kid-Friendly", "Traditional"],
    tags: ["Kid-Friendly", "Bundle"],
    description: "For kids who avoid vegetables but love familiar foods.",
    bestFor: ["Milk", "dosa", "chapati", "pancakes", "porridge"],
    howToUse: "Rotate the powders through regular foods across the week.",
    ingredients: ["ABC Powder", "Moringa Kids Mix", "Banana Oats Powder", "Veggie Sprinkle Powder"],
    tasteNote: "Mild, colorful, and easy to blend into foods kids already know.",
    safetyNote: productSafetyNote,
    price: 899,
    image: "/kindbite_kids_product_images_webp/02_kindbite_abc_powder.webp",
    isBundle: true,
    includedProducts: ["ABC Powder", "Moringa Kids Mix", "Banana Oats Powder", "Veggie Sprinkle Powder"],
  },
  {
    id: "school-morning-kit",
    name: "School Morning Kit",
    slug: "school-morning-kit",
    category: "Breakfast Bundle",
    type: "Box",
    audience: ["Kids", "Family"],
    useCases: ["Breakfast"],
    dietPreferences: ["Kid-Friendly", "Traditional"],
    tags: ["Breakfast Mix", "Bundle"],
    description: "Quick breakfast mixes for busy school mornings.",
    bestFor: ["Warm porridge", "milk", "breakfast bowls"],
    howToUse: "Use one mix per morning for simple breakfast variety.",
    ingredients: ["Ragi Almond Date Mix", "Dry Fruit Milk Mix for Kids", "Banana Oats Powder"],
    tasteNote: "Comforting, nutty, and morning-friendly.",
    safetyNote: productSafetyNote,
    price: 999,
    image: "/kindbite_kids_product_images_webp/03_kindbite_ragi_almond_date_mix.webp",
    isBundle: true,
    includedProducts: ["Ragi Almond Date Mix", "Dry Fruit Milk Mix for Kids", "Banana Oats Powder"],
  },
  {
    id: "family-daily-wellness-kit",
    name: "Family Daily Wellness Kit",
    slug: "family-daily-wellness-kit",
    category: "Family Bundle",
    type: "Box",
    audience: ["Parents", "Family", "Adults"],
    useCases: ["Daily Greens", "Breakfast"],
    dietPreferences: ["Vegan", "Traditional"],
    tags: ["Family Pick", "Daily Use"],
    description: "Simple food powders for everyday family meals.",
    bestFor: ["Dal", "dosa", "chapati", "soup", "chutney"],
    howToUse: "Add small spoons into regular meals through the week.",
    ingredients: ["Moringa Kids Mix", "Veggie Sprinkle Powder", "Lunchbox Booster Powder"],
    tasteNote: "Traditional, savory, and meal-friendly.",
    safetyNote: productSafetyNote,
    price: 1099,
    image: "/kindbite_kids_product_images_webp/06_kindbite_veggie_sprinkle_powder.webp",
    isBundle: true,
    includedProducts: ["Moringa Kids Mix", "Veggie Sprinkle Powder", "Lunchbox Booster Powder"],
  },
  {
    id: "monthly-family-wellness-box",
    name: "Monthly Family Wellness Box",
    slug: "monthly-family-wellness-box",
    category: "Gifting Bundle",
    type: "Box",
    audience: ["Parents", "Family", "Gifting"],
    useCases: ["Gifting", "Daily Greens", "Snacking"],
    dietPreferences: ["Traditional"],
    tags: ["Gifting Pick", "Send to India"],
    description: "A thoughtful monthly box for your family back home.",
    bestFor: ["Parents", "kids", "whole family"],
    howToUse: "Send monthly with powders, nuts, dry fruits, and a personal note.",
    ingredients: ["Kids powder", "family powder", "nuts", "dry fruits", "personal note"],
    tasteNote: "A care box built around daily Indian routines.",
    safetyNote: productSafetyNote,
    price: 1799,
    image: "/kindbite_proper_section_images_webp/kindbite-proper-section-images/04_pregnancy_nutrition_box.webp",
    isBundle: true,
    includedProducts: ["Kids powder", "Family powder", "Nuts", "Dry fruits", "Personal note"],
  },
];

export const categoryCards = [
  {
    title: "Kids Powders",
    description: "Easy daily mixes for milk, dosa, chapati, porridge, pancakes, and smoothies.",
    href: "/products?audience=Kids",
  },
  {
    title: "Family Powders",
    description: "Traditional Indian food powders for simple daily food upgrades.",
    href: "/products?audience=Family&type=Powder",
  },
  {
    title: "Nuts & Dry Fruits",
    description: "Premium everyday snacks and giftable wellness packs.",
    href: "/products?use=Snacking",
  },
  {
    title: "Personalized Boxes",
    description: "Build a box based on age, lifestyle, food preferences, and daily routine.",
    href: "/wellness-quiz",
  },
  {
    title: "GCC to India Care Boxes",
    description: "Send a monthly wellness box to parents, kids, or family back in India.",
    href: "/products/gcc-to-india-care-box",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductRecommendations(who: string, need: string) {
  if (who === "My child" && need === "Picky eating") {
    return products.filter((product) =>
      ["picky-eater-kit", "abc-powder", "moringa-kids-mix", "lunchbox-booster-powder"].includes(product.id),
    );
  }

  if (who === "My parents" || need === "Parent wellness") {
    return products.filter((product) =>
      ["family-daily-wellness-kit", "family-moringa-powder", "monthly-family-wellness-box"].includes(product.id),
    );
  }

  if (who === "Someone in India") {
    return products.filter((product) =>
      ["gcc-to-india-care-box", "monthly-family-wellness-box", "family-daily-wellness-kit"].includes(product.id),
    );
  }

  return products.filter((product) =>
    ["school-morning-kit", "dry-fruit-milk-mix-for-kids", "ragi-almond-date-mix", "banana-oats-powder"].includes(product.id),
  );
}
