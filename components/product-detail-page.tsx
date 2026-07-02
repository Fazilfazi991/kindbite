"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { addProductToCart } from "@/components/products-flow";
import { KindbiteProduct } from "@/lib/products";

function formatCurrency(amount: number | null) {
  if (!amount) return "Price soon";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function ProductDetailPage({ product }: { product: KindbiteProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const addToCart = () => {
    addProductToCart(product.id, quantity);
    setMessage("Added to local cart.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 pb-24 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4 rounded-md bg-white/85 px-4 py-4 shadow-card ring-1 ring-kindred/8">
          <a href="/" className="leading-none">
            <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
            <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">NOURISH. GIFT. INSPIRE.</span>
          </a>
          <a className="hidden items-center gap-2 text-sm font-black text-kindred sm:inline-flex" href="/products">
            <ArrowLeft className="h-4 w-4" />
            Products
          </a>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="grid gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-kindred-soft shadow-card ring-1 ring-kindred/8">
              <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[product.image, product.image, product.image].map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-md bg-white ring-1 ring-kindred/8">
                  <Image src={image} alt={`${product.name} preview ${index + 1}`} fill sizes="160px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
            <span className="inline-flex rounded-full bg-kindred-soft px-3 py-1 text-xs font-black uppercase tracking-wide text-kindred">
              {product.category}
            </span>
            <h1 className="mt-4 font-display text-3xl font-black leading-tight text-ink sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-base font-semibold leading-7 text-muted">{product.description}</p>
            <strong className="mt-5 block text-3xl text-ink">{formatCurrency(product.price)}</strong>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex h-12 items-center overflow-hidden rounded-md border border-kindred/15 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="grid h-12 w-12 place-items-center text-kindred"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="grid h-12 w-12 place-items-center text-sm font-black text-ink">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(12, value + 1))}
                  className="grid h-12 w-12 place-items-center text-kindred"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={addToCart}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-kindred/20 bg-white px-5 text-sm font-black text-kindred"
                href="/wellness-quiz"
              >
                <Sparkles className="h-4 w-4" />
                Find in a Box
              </a>
            </div>
            {message && <p className="mt-4 rounded-md bg-kindred-soft p-3 text-sm font-bold text-kindred">{message}</p>}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-2 rounded-md bg-beige p-3 text-sm font-black text-muted">
                  <Check className="h-4 w-4 text-kindred" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-5">
          {[
            ["How to Use", product.howToUse],
            ["Best For", product.bestFor.join(", ")],
            ["Ingredients", product.ingredients.join(", ")],
            ["Taste Note", product.tasteNote],
            ["Safety Note", product.safetyNote],
          ].map(([title, text]) => (
            <article key={title} className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8">
              <p className="text-xs font-black uppercase tracking-wide text-kindred">{title}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
