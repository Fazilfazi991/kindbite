import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { KindbiteProduct } from "@/lib/products";

function formatCurrency(amount: number | null) {
  if (!amount) return "Price soon";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product, compact = false }: { product: KindbiteProduct; compact?: boolean }) {
  return (
    <article className="overflow-hidden rounded-md bg-white shadow-card ring-1 ring-kindred/8">
      <a href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-kindred-soft">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-white/92 px-3 py-1 text-[10px] font-black text-kindred shadow-card">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </a>
      <div className="p-4">
        <p className="text-[11px] font-black uppercase tracking-wide text-kindred">{product.category}</p>
        <a href={`/products/${product.slug}`}>
          <h3 className="mt-2 text-xl font-black text-ink">{product.name}</h3>
        </a>
        <p className={`mt-2 text-sm font-semibold leading-6 text-muted ${compact ? "line-clamp-2" : ""}`}>
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <strong className="text-lg text-ink">{formatCurrency(product.price)}</strong>
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-kindred px-4 text-xs font-black text-white"
            href={`/products/${product.slug}`}
          >
            {product.type === "Box" ? <ShoppingBag className="h-4 w-4" /> : null}
            {product.id === "gcc-to-india-care-box" ? "Send to India" : "View Product"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
