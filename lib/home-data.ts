import {
  Award,
  Beaker,
  FlaskConical,
  Gift,
  HeartPulse,
  Leaf,
  PackageCheck,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

export const asset = (name: string) => (name.startsWith("/") ? name : `/kindbite-assets/${name}`);
export const realAsset = (name: string) => `/kindbite_realistic_product_images_webp/kindbite-realistic-product-images/${name}`;
export const balanceAsset = (name: string) => `/kindbite_balance_product_images_webp/kindbite-balance-product-images/${name}`;

export const categories = [
  ["Wellness Boxes", realAsset("01_daily_wellness_box.webp")],
  ["Immunity Boost", realAsset("02_immunity_box.webp")],
  ["Weight Management", balanceAsset("20_trail_mix.webp")],
  ["Women's Health", realAsset("04_pregnancy_nutrition_box.webp")],
  ["Kids Nutrition", realAsset("05_kids_nutrition_box.webp")],
  ["Fitness & Protein", realAsset("09_plant_protein_shake.webp")],
  ["Healthy Snacks", balanceAsset("11_energy_bites.webp")],
  ["Herbal Teas", realAsset("10_herbal_immunity_tea.webp")],
  ["Superfoods", balanceAsset("16_pumpkin_seeds.webp")],
  ["Combo Offers", balanceAsset("20_trail_mix.webp")],
  ["Corporate Gifting", realAsset("01_daily_wellness_box.webp")],
] as const;

export const featuredBoxes = [
  {
    badge: "BESTSELLER",
    title: "The Daily Wellness Box",
    description: "Everyday nutrition essentials to support immunity, energy, and overall well-being.",
    price: "₹1,499",
    original: "₹1,999",
    discount: "25% OFF",
    rating: "4.8",
    reviews: "1.2K",
    image: realAsset("01_daily_wellness_box.webp"),
    badgeColor: "bg-ink",
  },
  {
    badge: "MOST GIFTED",
    title: "The Immunity Box",
    description: "Strengthen your natural defense with clean, powerful superfoods.",
    price: "₹1,699",
    original: "₹2,299",
    discount: "26% OFF",
    rating: "4.9",
    reviews: "890",
    image: realAsset("02_immunity_box.webp"),
    badgeColor: "bg-sky-700",
  },
  {
    badge: "NEW LAUNCH",
    title: "The Detox & Cleanse Box",
    description: "Cleanse, reset, and rejuvenate with plant-based goodness.",
    price: "₹1,599",
    original: "₹2,199",
    discount: "27% OFF",
    rating: "4.7",
    reviews: "620",
    image: realAsset("03_detox_cleanse_box.webp"),
    badgeColor: "bg-success",
  },
] as const;

export const spotlights = [
  {
    title: "The Pregnancy Nutrition Box",
    description: "Thoughtfully curated nutrition for a healthy mom and baby.",
    benefits: ["Folic Acid & Iron Rich", "Nutrient Dense Snacks", "Safe & Clean Ingredients"],
    price: "₹2,199",
    original: "₹2,999",
    discount: "27% OFF",
    badge: "Mom & Baby Safe",
    image: realAsset("04_pregnancy_nutrition_box.webp"),
    tint: "from-[#fff2f2] to-[#ffe4df]",
  },
  {
    title: "The Kids Nutrition Box",
    description: "Wholesome nutrition that kids love and parents trust.",
    benefits: ["Immunity & Growth Support", "No Refined Sugar", "Tasty & Healthy Snacks"],
    price: "₹1,699",
    original: "₹2,299",
    discount: "26% OFF",
    badge: "Kid Approved",
    image: realAsset("05_kids_nutrition_box.webp"),
    tint: "from-[#fff8df] to-[#ffe8b1]",
  },
] as const;

export const popularProducts = [
  ["25% OFF", "Millet Protein Cookies", "Pack of 6", "₹299", "₹399", "4.6", "310", realAsset("08_millet_protein_cookies.webp")],
  ["20% OFF", "Plant Protein Shake", "Chocolate", "₹599", "₹749", "4.7", "450", realAsset("09_plant_protein_shake.webp")],
  ["20% OFF", "Herbal Immunity Tea", "25 Bags", "₹199", "₹249", "4.8", "560", realAsset("10_herbal_immunity_tea.webp")],
  ["20% OFF", "Energy Bites", "Pack of 8", "₹239", "₹299", "4.6", "410", balanceAsset("11_energy_bites.webp")],
  ["15% OFF", "Roasted Makhana", "Pink Salt", "₹199", "₹235", "4.7", "380", balanceAsset("12_roasted_makhana.webp")],
  ["18% OFF", "California Almonds", "250g", "₹349", "₹425", "4.8", "620", balanceAsset("13_california_almonds.webp")],
  ["15% OFF", "Premium Pistachios", "200g", "₹449", "₹529", "4.7", "290", balanceAsset("14_pistachios.webp")],
  ["18% OFF", "Premium Walnuts", "200g", "₹399", "₹489", "4.8", "340", balanceAsset("15_walnuts.webp")],
  ["15% OFF", "Pumpkin Seeds", "250g", "₹229", "₹269", "4.6", "260", balanceAsset("16_pumpkin_seeds.webp")],
  ["20% OFF", "Trail Mix", "Daily Energy Blend", "₹299", "₹375", "4.7", "510", balanceAsset("20_trail_mix.webp")],
] as const;

export const trustBadges = [
  [HeartPulse, "Nutritionist Approved"],
  [Leaf, "Clean & Natural Ingredients"],
  [ShieldCheck, "No Artificial Flavors"],
  [FlaskConical, "Lab Tested & Safe"],
  [Recycle, "Sustainable Packaging"],
  [Award, "Made in India"],
] as const;

export const promiseItems = [
  [Truck, "Free Shipping", "On orders above ₹999"],
  [PackageCheck, "Easy Returns", "Hassle-free returns"],
  [ShieldCheck, "Secure Payments", "100% secure checkout"],
  [Sparkles, "Top Rated", "4.8 star from 10,000+ customers"],
] as const;

export const heroTags = [
  { name: "Immunity Box", price: "₹1,699", image: realAsset("02_immunity_box.webp"), className: "left-[2%] top-[8%]" },
  { name: "Herbal Immunity Tea", price: "₹249", image: realAsset("10_herbal_immunity_tea.webp"), className: "left-[8%] bottom-[24%]" },
  { name: "Energy Bites", price: "₹239", image: balanceAsset("11_energy_bites.webp"), className: "right-[1%] top-[18%]" },
  { name: "Trail Mix", price: "₹299", image: balanceAsset("20_trail_mix.webp"), className: "right-[3%] bottom-[19%]" },
] as const;

export const footerColumns = [
  ["Shop", "All Products", "Wellness Boxes", "Healthy Snacks", "Superfoods", "Herbal Teas", "Gift Cards"],
  ["Learn", "Health Blog", "Nutrition Guide", "Ingredients 101", "Wellness Tips", "FAQs"],
  ["Help", "Track Order", "Shipping Policy", "Returns & Refunds", "Terms & Conditions", "Privacy Policy"],
  ["Corporate", "Corporate Gifting", "Bulk Orders", "Custom Boxes", "Partner With Us"],
] as const;

export const utilIcons = { Gift, Truck, Beaker };
