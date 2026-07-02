"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Baby,
  Filter,
  Gift,
  HeartHandshake,
  Home,
  Leaf,
  MessageCircle,
  PackageCheck,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
  Wheat,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  DietPreference,
  ProductAudience,
  ProductType,
  ProductUseCase,
  categoryCards,
  getProductRecommendations,
  products,
} from "@/lib/products";
import { setStoredJson } from "@/lib/storage";

const productTrustChips = [
  "Made for Indian meals",
  "Easy daily use",
  "Personalized boxes",
  "Send to India",
  "WhatsApp support",
];

const typeOptions: ProductType[] = ["Powder", "Nuts", "Dry Fruits", "Box"];
const audienceOptions: ProductAudience[] = ["Kids", "Parents", "Family", "Adults", "Gifting"];
const useCaseOptions: ProductUseCase[] = ["Breakfast", "Picky Eating", "Daily Greens", "Snacking", "Gifting"];
const dietOptions: DietPreference[] = ["No Added Sugar", "Vegan", "Traditional", "Kid-Friendly"];

const categoryIcons = [Baby, Leaf, Wheat, PackageCheck, HeartHandshake];
const spoonUses = [
  ["Mix into dosa batter", Wheat],
  ["Add to chapati dough", Home],
  ["Stir into porridge", Sparkles],
  ["Blend into smoothies", Leaf],
  ["Mix into milk", Baby],
  ["Add to soup or dal", Users],
] as const;

function formatCurrency(amount: number | null) {
  if (!amount) return "Price soon";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function ProductTrustChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {productTrustChips.map((chip) => (
        <span key={chip} className="rounded-full bg-white px-3 py-2 text-xs font-black text-kindred shadow-card ring-1 ring-kindred/10">
          {chip}
        </span>
      ))}
    </div>
  );
}

function ProductsHero() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <div className="rounded-md bg-kindred p-6 text-white shadow-soft sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-wide">
          <Sparkles className="h-4 w-4" />
          Nuts for gifting. Powders for daily habits.
        </span>
        <h1 className="mt-5 font-display text-3xl font-black leading-tight sm:text-5xl">
          Daily Wellness Foods for Every Home
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
          Explore nuts, dry fruits, food powders, and personalized care boxes made for real Indian meals, busy families, and thoughtful gifting.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-kindred" href="/wellness-quiz">
            Find My Box
            <ArrowRight className="h-4 w-4" />
          </a>
          <a className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm font-black text-white" href="#products">
            Browse Products
          </a>
        </div>
      </div>
      <div className="relative min-h-72 overflow-hidden rounded-md bg-white shadow-card ring-1 ring-kindred/8">
        <Image
          src="/kindbite_proper_section_images_webp/kindbite-proper-section-images/01_build_your_own_box.webp"
          alt="Kindbite personalized box"
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-4 bottom-4 rounded-md bg-white/92 p-4 shadow-card backdrop-blur">
          <p className="text-xs font-black uppercase tracking-wide text-kindred">Boxes for people you care about</p>
          <p className="mt-1 text-sm font-bold text-muted">Powders, nuts, dry fruits, usage guide, and personal notes.</p>
        </div>
      </div>
    </section>
  );
}

function CategoryCards() {
  return (
    <section className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-kindred">Browse by need</p>
          <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Choose a product path</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {categoryCards.map((card, index) => {
          const Icon = categoryIcons[index] ?? Sparkles;
          return (
            <a key={card.title} href={card.href} className="rounded-md border border-kindred/10 bg-cream p-4 transition hover:border-kindred/35 hover:shadow-card">
              <Icon className="h-7 w-7 text-kindred" />
              <h3 className="mt-3 font-black text-ink">{card.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">{card.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-kindred">
                Explore
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ProductQuiz() {
  const [who, setWho] = useState("");
  const [need, setNeed] = useState("");
  const recommendations = who && need ? getProductRecommendations(who, need) : [];

  return (
    <section className="rounded-md bg-kindred-soft p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-kindred">Quick product guide</p>
      <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Not Sure What to Choose?</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-muted">
        Answer a few quick questions and we&apos;ll suggest the right Kindbite box.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md bg-white p-4">
          <h3 className="font-black text-ink">Who are you buying for?</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {["My child", "My parents", "My family", "Myself", "Someone in India"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setWho(option);
                  setNeed("");
                }}
                className={`min-h-11 rounded-md border px-3 text-sm font-black ${who === option ? "border-kindred bg-kindred text-white" : "border-kindred/15 bg-white text-ink"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-md bg-white p-4">
          <h3 className="font-black text-ink">What do you want help with?</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {["Better breakfast", "Picky eating", "Daily greens", "Healthy snacking", "Parent wellness", "Gifting to family"].map((option) => (
              <button
                key={option}
                type="button"
                disabled={!who}
                onClick={() => setNeed(option)}
                className={`min-h-11 rounded-md border px-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-45 ${need === option ? "border-kindred bg-kindred text-white" : "border-kindred/15 bg-white text-ink"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      {recommendations.length > 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductFilters({
  filters,
  setFilters,
}: {
  filters: { type: string; audience: string; useCase: string; diet: string; query: string };
  setFilters: (filters: { type: string; audience: string; useCase: string; diet: string; query: string }) => void;
}) {
  const fieldClass = "h-11 rounded-md border border-kindred/15 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-kindred";

  return (
    <section className="rounded-md bg-white p-4 shadow-card ring-1 ring-kindred/8">
      <div className="flex items-center gap-2 text-kindred">
        <Filter className="h-5 w-5" />
        <p className="text-sm font-black">Filters</p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kindred" />
          <input
            className={`${fieldClass} w-full pl-10`}
            placeholder="Search products"
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          />
        </label>
        {[
          ["type", "Product Type", typeOptions],
          ["audience", "Audience", audienceOptions],
          ["useCase", "Use Case", useCaseOptions],
          ["diet", "Diet Preference", dietOptions],
        ].map(([key, label, options]) => (
          <select
            key={key as string}
            className={fieldClass}
            value={filters[key as keyof typeof filters]}
            onChange={(event) => setFilters({ ...filters, [key as string]: event.target.value })}
            aria-label={label as string}
          >
            <option value="">{label as string}</option>
            {(options as string[]).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [filters, setFilters] = useState({ type: "", audience: "", useCase: "", diet: "", query: "" });
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const queryMatch = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(filters.query.toLowerCase());
        const typeMatch = !filters.type || product.type === filters.type;
        const audienceMatch = !filters.audience || product.audience.includes(filters.audience as ProductAudience);
        const useCaseMatch = !filters.useCase || product.useCases.includes(filters.useCase as ProductUseCase);
        const dietMatch = !filters.diet || product.dietPreferences.includes(filters.diet as DietPreference);

        return queryMatch && typeMatch && audienceMatch && useCaseMatch && dietMatch;
      }),
    [filters],
  );

  return (
    <section id="products" className="grid gap-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-kindred">Featured products</p>
        <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Powders, boxes, nuts, and daily habits</h2>
      </div>
      <ProductFilters filters={filters} setFilters={setFilters} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function BundleSection() {
  const bundles = products.filter((product) => product.isBundle);

  return (
    <section className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-kindred">Shop by daily need</p>
      <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Bundles for real routines</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {bundles.map((bundle) => (
          <article key={bundle.id} className="rounded-md border border-kindred/10 bg-cream p-4">
            <h3 className="text-xl font-black text-ink">{bundle.name}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">{bundle.description}</p>
            <div className="mt-4 grid gap-2">
              {bundle.includedProducts.map((item) => (
                <span key={item} className="rounded-md bg-white px-3 py-2 text-xs font-black text-muted">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <strong className="text-lg text-ink">{formatCurrency(bundle.price)}</strong>
              <a className="inline-flex h-10 items-center rounded-md bg-kindred px-4 text-xs font-black text-white" href={`/products/${bundle.slug}`}>
                View Kit
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OneSpoonBetter() {
  return (
    <section className="rounded-md bg-kindred p-5 text-white shadow-soft sm:p-8">
      <p className="text-xs font-black uppercase tracking-wide text-white/70">One small habit</p>
      <h2 className="mt-2 font-display text-3xl font-black sm:text-4xl">One Spoon Better</h2>
      <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/80">
        You don&apos;t need to change the whole meal. Add one small spoon to the food your family already eats.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {spoonUses.map(([label, Icon]) => (
          <div key={label} className="flex min-h-20 items-center gap-3 rounded-md bg-white/10 p-4">
            <Icon className="h-6 w-6 shrink-0" />
            <span className="text-sm font-black">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SendCareHome() {
  const whatsappText = encodeURIComponent("Hi Kindbite, I want to build a care box for my family in India.");

  return (
    <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
      <div className="relative min-h-72 overflow-hidden rounded-md bg-white shadow-card ring-1 ring-kindred/8">
        <Image
          src="/kindbite_realistic_product_images_webp/kindbite-realistic-product-images/06_senior_vitality_box.webp"
          alt="Kindbite care box for family in India"
          fill
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-kindred">For GCC and NRI families</p>
        <h2 className="mt-2 text-3xl font-black text-ink">Send Care Home to India</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-muted">
          You may be far away, but your care can still be part of their daily routine.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {["For Parents", "For Kids", "For Family", "Monthly Care Box"].map((item) => (
            <div key={item} className="rounded-md bg-kindred-soft p-4 text-sm font-black text-kindred">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white" href="/wellness-quiz">
            <Gift className="h-4 w-4" />
            Build a Care Box
          </a>
          <a className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred" href={`https://wa.me/?text=${whatsappText}`} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" />
            Share this box with family on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function ProductsPage({ boxesOnly = false }: { boxesOnly?: boolean }) {
  const boxProducts = products.filter((product) => product.type === "Box");

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 pb-24 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5">
        <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
          <a href="/" className="leading-none">
            <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
            <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">NOURISH. GIFT. INSPIRE.</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm font-black text-kindred md:flex">
            <a href="/products">Products</a>
            <a href="/boxes">Boxes</a>
            <a href="/wellness-quiz">Find My Box</a>
          </nav>
        </header>

        <ProductsHero />
        <ProductTrustChips />

        {boxesOnly ? (
          <section className="grid gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-kindred">Boxes</p>
              <h1 className="mt-2 text-3xl font-black text-ink">Personalized and giftable Kindbite boxes</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {boxProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : (
          <>
            <CategoryCards />
            <ProductQuiz />
            <FeaturedProducts />
            <BundleSection />
            <OneSpoonBetter />
            <SendCareHome />
          </>
        )}
      </div>

      <a
        className="fixed inset-x-3 bottom-3 z-50 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred text-sm font-black text-white shadow-2xl md:hidden"
        href="/wellness-quiz"
      >
        <ShoppingBag className="h-4 w-4" />
        Find My Box
      </a>
    </main>
  );
}

export function addProductToCart(productId: string, quantity: number) {
  const currentCart = JSON.parse(window.localStorage.getItem("kindbite_cart") || "[]") as { productId: string; quantity: number }[];
  const existing = currentCart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    currentCart.push({ productId, quantity });
  }

  setStoredJson("kindbite_cart", currentCart);
}
