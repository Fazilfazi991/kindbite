"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Facebook,
  FileText,
  Gift,
  Heart,
  Instagram,
  Linkedin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingCart,
  Star,
  User,
  Youtube,
} from "lucide-react";
import {
  asset,
  categories,
  featuredBoxes,
  footerColumns,
  heroTags,
  popularProducts,
  promiseItems,
  realAsset,
  spotlights,
  trustBadges,
} from "@/lib/home-data";

const reveal = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="leading-none">
      <div className={`font-display text-3xl font-black tracking-normal sm:text-4xl ${light ? "text-white" : "text-kindred"}`}>
        kindbite
      </div>
      <div className={`mt-1 text-[9px] font-extrabold tracking-[0.24em] sm:text-[10px] ${light ? "text-white/80" : "text-kindred-deep"}`}>
        NOURISH. GIFT. INSPIRE.
      </div>
    </div>
  );
}

function UtilityBar() {
  return (
    <div className="bg-kindred-deep text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-semibold sm:px-6 lg:px-8">
        <span className="flex items-center gap-2">
          <Gift className="h-3.5 w-3.5" /> Free shipping on all orders above ₹999
        </span>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#">Track Order</a>
          <a href="#">Corporate Gifting</a>
          <a href="#">Bulk Orders</a>
          <a className="flex items-center gap-2" href="tel:+919876543210">
            <Phone className="h-3.5 w-3.5" /> +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const nav = ["Shop Boxes", "Shop by Goal", "Build Your Box", "Subscriptions", "Corporate Gifting", "About Us"];
  return (
    <header className="sticky top-0 z-50 bg-kindred shadow-lg shadow-kindred-deep/10">
      <UtilityBar />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a className="shrink-0" href="#">
            <Logo light />
          </a>
          <div className="relative hidden flex-1 lg:block">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-kindred" />
            <input
              className="h-12 w-full rounded-md border-0 bg-white pl-14 pr-5 text-sm text-ink outline-none ring-2 ring-transparent transition focus:ring-gold"
              placeholder="Search wellness boxes, snacks, ingredients..."
            />
          </div>
          <div className="ml-auto flex items-center gap-3 text-white">
            {[
              [User, "Account"],
              [Heart, "Wishlist"],
              [ShoppingCart, "Cart"],
            ].map(([Icon, label]) => (
              <button key={label as string} className="relative hidden items-center gap-2 rounded-md px-2 py-2 text-sm font-bold transition hover:bg-white/10 md:flex">
                <Icon className="h-5 w-5" />
                {label as string}
                {label === "Cart" && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[11px] text-kindred">2</span>}
              </button>
            ))}
            <button className="grid h-10 w-10 place-items-center rounded-md bg-white/10 md:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="relative mt-3 lg:hidden">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kindred" />
          <input className="h-11 w-full rounded-md border-0 bg-white pl-11 pr-4 text-sm outline-none" placeholder="Search wellness boxes..." />
        </div>
        <nav className="mt-4 hidden items-center gap-7 text-sm font-bold text-white/95 lg:flex">
          {nav.map((item, index) => (
            <a key={item} className="flex items-center gap-1 transition hover:text-white" href="#">
              {item}
              {index < 2 && <ChevronDown className="h-4 w-4" />}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  const slides = [
    { src: "/slider1.png", alt: "Nutrition for every stage of your journey", href: "#" },
    { src: "/slider2.png", alt: "Build your own Kindbite box", href: "/wellness-quiz" },
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="bg-cream">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden">
        <div className="relative aspect-[16/9] min-h-0 sm:aspect-[16/6] sm:min-h-[360px] lg:min-h-[520px]">
          {slides.map((slide, index) => (
            <motion.a
              key={slide.src}
              href={slide.href}
              aria-label={slide.alt}
              initial={false}
              animate={{ opacity: activeSlide === index ? 1 : 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              style={{ pointerEvents: activeSlide === index ? "auto" : "none" }}
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-contain object-center sm:object-cover"
              />
            </motion.a>
          ))}
        </div>
        <button
          type="button"
          onClick={() => goToSlide(-1)}
          className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-kindred shadow-card transition hover:bg-white md:grid"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goToSlide(1)}
          className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-kindred shadow-card transition hover:bg-white md:grid"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 shadow-card backdrop-blur">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-8 bg-kindred" : "w-2.5 bg-kindred/30"}`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SparkIcon() {
  return <span className="grid h-7 w-7 place-items-center rounded-full bg-kindred-soft text-kindred">✦</span>;
}

function SectionTitle({ title, red, link }: { title: string; red?: string; link?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-black text-ink sm:text-3xl">
        {title} {red && <span className="text-kindred">{red}</span>}
      </h2>
      {link && (
        <a className="hidden items-center gap-2 text-sm font-black text-kindred sm:flex" href="#">
          {link} <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function CategoryStrip() {
  return (
    <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle title="All Categories." red="What's your need" link="View All Categories" />
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {categories.map(([label, image]) => (
          <motion.a whileHover={{ y: -5 }} key={label} href="#" className="w-32 shrink-0 rounded-md bg-white p-3 text-center shadow-card ring-1 ring-kindred/8">
            <Image src={asset(image)} alt={label} width={100} height={78} className="mx-auto h-20 w-full rounded object-cover" />
            <span className="mt-2 block text-xs font-black text-ink">{label}</span>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}

function JourneyStartSection() {
  const cards = [
    {
      title: "Find My Mix",
      text: "Take the quick quiz and get a food-based daily mix suggestion.",
      href: "/wellness-quiz",
      icon: ClipboardList,
    },
    {
      title: "Upload Report",
      text: "Share a wellness report for the beta review path.",
      href: "/report-upload",
      icon: FileText,
    },
    {
      title: "Talk to Nutritionist",
      text: "Book a review for extra guidance before ordering.",
      href: "/nutritionist-booking",
      icon: Send,
    },
  ];

  return (
    <motion.section {...reveal} className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle title="Start Your" red="Wellness Journey" />
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map(({ title, text, href, icon: Icon }) => (
            <a
              key={title}
              href={href}
              className="group rounded-md border border-kindred/10 bg-cream p-5 shadow-card transition hover:-translate-y-1 hover:border-kindred/35"
            >
              <span className="grid h-11 w-11 place-items-center rounded-md bg-kindred text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-black text-ink">{title}</h3>
              <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-muted">{text}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-kindred">
                Start
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function FeaturedBoxCard({ item }: { item: (typeof featuredBoxes)[number] }) {
  return (
    <motion.article whileHover={{ y: -5 }} className="overflow-hidden rounded-md bg-white shadow-card ring-1 ring-kindred/8">
      <div className="relative aspect-[1.55] bg-beige">
        <Image src={asset(item.image)} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        <span className={`absolute left-3 top-3 rounded px-2.5 py-1 text-[10px] font-black text-white ${item.badgeColor}`}>{item.badge}</span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-black text-ink">{item.title}</h3>
        <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-muted">{item.description}</p>
        <Rating rating={item.rating} reviews={item.reviews} />
        <div className="mt-4 flex items-center gap-2">
          <strong className="text-xl text-ink">{item.price}</strong>
          <span className="text-sm font-bold text-muted line-through">{item.original}</span>
          <span className="text-xs font-black text-success">{item.discount}</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Quantity />
          <button className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-kindred px-4 text-xs font-black text-white transition hover:bg-kindred-deep">
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Rating({ rating, reviews }: { rating: string; reviews: string }) {
  return (
    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-muted">
      <Star className="h-4 w-4 fill-gold text-gold" />
      <span className="text-ink">{rating}</span>
      <span>({reviews})</span>
    </div>
  );
}

function Quantity() {
  return (
    <div className="flex h-10 items-center rounded-md border border-kindred/15 bg-white text-sm font-black">
      <button className="grid h-10 w-9 place-items-center text-muted" aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-7 text-center">1</span>
      <button className="grid h-10 w-9 place-items-center text-muted" aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function FeaturedBoxes() {
  return (
    <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionTitle title="Featured Wellness Boxes" link="View All" />
      <div className="grid gap-6 lg:grid-cols-3">
        {featuredBoxes.map((item) => (
          <FeaturedBoxCard key={item.title} item={item} />
        ))}
      </div>
    </motion.section>
  );
}

function ImageSectionCard({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="relative min-w-0 overflow-hidden rounded-md border border-kindred/10 bg-white shadow-card transition-shadow duration-300 hover:shadow-xl sm:rounded-[28px]"
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        className="block h-auto w-full max-w-full object-contain md:h-full md:object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </motion.article>
  );
}

function PremiumSectionImageCards() {
  const actionCards = [
    {
      src: "/images/kindbite/sections/01_build_your_own_box.webp",
      alt: "Build your own Kindbite wellness box",
    },
    {
      src: "/images/kindbite/sections/02_ai_recommends_for_you.webp",
      alt: "Kindbite AI recommends a wellness box",
    },
  ];

  const spotlightCards = [
    {
      src: "/images/kindbite/sections/03_kids_nutrition_box.webp",
      alt: "Kindbite kids nutrition box",
    },
    {
      src: "/images/kindbite/sections/04_pregnancy_nutrition_box.webp",
      alt: "Kindbite pregnancy nutrition box",
    },
  ];

  return (
    <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {actionCards.map((card) => (
          <ImageSectionCard key={card.src} src={card.src} alt={card.alt} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {spotlightCards.map((card) => (
          <ImageSectionCard key={card.src} src={card.src} alt={card.alt} />
        ))}
      </div>
    </motion.section>
  );
}

function SpotlightCards() {
  return (
    <motion.section {...reveal} className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
      {spotlights.map((item) => (
        <motion.article whileHover={{ y: -4 }} key={item.title} className={`relative overflow-hidden rounded-md bg-gradient-to-br ${item.tint} p-6 shadow-card ring-1 ring-kindred/8`}>
          <div className="relative z-10 max-w-[52%]">
            <h3 className="text-2xl font-black text-ink">{item.title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-muted">{item.description}</p>
            <ul className="mt-4 space-y-2 text-xs font-bold text-muted">
              {item.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-kindred" /> {benefit}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <strong className="text-xl">{item.price}</strong>
              <span className="text-sm font-bold text-muted line-through">{item.original}</span>
              <span className="text-xs font-black text-success">{item.discount}</span>
            </div>
            <button className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white transition hover:bg-kindred-deep">
              Shop Now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <Image src={asset(item.image)} alt={item.title} width={420} height={300} className="absolute bottom-0 right-0 h-full w-[54%] object-cover" />
          <span className="absolute right-8 top-7 rounded-full bg-white px-4 py-2 text-xs font-black text-kindred shadow-card">{item.badge}</span>
        </motion.article>
      ))}
    </motion.section>
  );
}

function ProductCard({ product }: { product: (typeof popularProducts)[number] }) {
  const [discount, title, subtitle, price, original, rating, reviews, image] = product;
  return (
    <motion.article whileHover={{ y: -5 }} className="relative rounded-md bg-white p-3 shadow-card ring-1 ring-kindred/8">
      <span className="absolute left-3 top-3 z-10 rounded bg-kindred px-2 py-1 text-[10px] font-black text-white">{discount}</span>
      <div className="relative aspect-square rounded bg-beige">
        <Image src={asset(image)} alt={title} fill sizes="180px" className="object-cover" />
      </div>
      <h3 className="mt-3 text-sm font-black text-ink">{title}</h3>
      <p className="text-xs font-bold text-muted">{subtitle}</p>
      <Rating rating={rating} reviews={reviews} />
      <div className="mt-3 flex items-center gap-2">
        <strong>{price}</strong>
        <span className="text-xs font-bold text-muted line-through">{original}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Quantity />
        <button className="h-10 flex-1 rounded-md bg-kindred text-xs font-black text-white transition hover:bg-kindred-deep">Add</button>
      </div>
    </motion.article>
  );
}

function PopularProducts() {
  return (
    <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionTitle title="Most Popular Products" link="View All" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {popularProducts.map((product) => (
          <ProductCard key={product[1]} product={product} />
        ))}
      </div>
    </motion.section>
  );
}

function ActionCards() {
  return (
    <motion.section {...reveal} className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_1.22fr_1fr] lg:px-8">
      <article className="relative min-h-72 overflow-hidden rounded-md bg-white p-6 shadow-card ring-1 ring-kindred/8">
        <h3 className="text-2xl font-black">Build Your Own Box</h3>
        <p className="mt-2 max-w-48 text-sm font-semibold leading-6 text-muted">Personalize your box with your favorite products.</p>
        <a href="/wellness-quiz" className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white">Build Now <ArrowRight className="h-4 w-4" /></a>
        <Image src={realAsset("01_daily_wellness_box.webp")} alt="" width={360} height={260} className="absolute bottom-0 right-0 w-[70%] rounded-md object-cover" />
      </article>
      <article className="rounded-md bg-white p-6 shadow-card ring-1 ring-kindred/8">
        <h3 className="text-2xl font-black">Subscribe & Save</h3>
        <p className="mt-1 text-sm font-semibold text-muted">Wellness, delivered your way.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Monthly", "₹1,399", "Billed monthly", "Save 10%"],
            ["Quarterly", "₹1,299", "Billed every 3 months", "Save 15%"],
            ["Half Yearly", "₹1,199", "Billed every 6 months", "Save 20%"],
          ].map((plan, index) => (
            <motion.div whileHover={{ y: -4 }} key={plan[0]} className={`relative rounded-md border p-4 ${index === 1 ? "border-kindred shadow-card" : "border-kindred/12"}`}>
              {index === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-kindred px-3 py-1 text-[10px] font-black text-white">Most Popular</span>}
              <h4 className="font-black">{plan[0]}</h4>
              <strong className="mt-3 block text-lg">{plan[1]} <span className="text-xs text-muted">/ box</span></strong>
              <p className="mt-1 text-xs font-bold text-muted">{plan[2]}</p>
              <p className="mt-1 text-xs font-black text-success">{plan[3]}</p>
              <button className="mt-4 h-9 w-full rounded-md border border-kindred/25 text-xs font-black text-kindred">Choose</button>
            </motion.div>
          ))}
        </div>
      </article>
      <article className="overflow-hidden rounded-md bg-gradient-to-br from-white to-kindred-soft p-6 shadow-card ring-1 ring-kindred/8">
        <h3 className="text-2xl font-black">AI Recommends for You</h3>
        <p className="mt-1 text-sm font-semibold text-muted">Powered by Kindbite AI</p>
        <div className="mt-5 flex gap-4 rounded-md bg-white p-4 shadow-sm">
          <Image src={realAsset("02_immunity_box.webp")} alt="" width={132} height={132} className="h-32 w-32 rounded-md object-cover" />
          <div>
            <h4 className="font-black">Immunity Boost Pack</h4>
            {["Immunity Support", "Energy Boost", "Clean Nutrition"].map((item) => (
              <p key={item} className="mt-2 text-xs font-bold text-muted">✓ {item}</p>
            ))}
            <a className="mt-4 inline-flex items-center gap-2 text-sm font-black text-kindred" href="/wellness-quiz">Find My Mix <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </article>
    </motion.section>
  );
}

function TrustBadgeStrip() {
  return (
    <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="mb-4 text-center text-xl font-black">Why Thousands Trust Kindbite</h2>
      <div className="grid gap-3 rounded-md bg-white p-4 shadow-card ring-1 ring-kindred/8 sm:grid-cols-2 lg:grid-cols-6">
        {trustBadges.map(([Icon, label]) => (
          <div key={label} className="flex items-center justify-center gap-3 text-center text-xs font-black text-muted">
            <Icon className="h-6 w-6 shrink-0 text-kindred" /> {label}
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function FeaturedInLogos() {
  return (
    <motion.section {...reveal} className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
      <h2 className="text-xl font-black">As Featured In</h2>
      <div className="mt-5 grid grid-cols-2 gap-5 text-xl font-black text-ink/70 sm:grid-cols-4 lg:grid-cols-7">
        {["Forbes", "THE HINDU", "YourStory", "Entrepreneur", "NDTV", "TIMES NOW", "The Economic Times"].map((logo) => (
          <span key={logo} className="font-display">{logo}</span>
        ))}
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="mt-8 bg-white">
      <div className="bg-kindred text-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {promiseItems.map(([Icon, title, text]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/30"><Icon className="h-5 w-5" /></span>
              <span><strong className="block text-sm">{title}</strong><span className="text-xs text-white/78">{text}</span></span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,0.8fr)_1.2fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 text-sm font-semibold leading-6 text-muted">Premium wellness boxes and nutrition essentials for a healthier you and your loved ones.</p>
          <div className="mt-5 flex gap-3 text-kindred">
            {[Instagram, Facebook, Youtube, Linkedin, Send].map((Icon, index) => <Icon key={index} className="h-5 w-5" />)}
          </div>
        </div>
        {footerColumns.map(([heading, ...links]) => (
          <div key={heading}>
            <h3 className="font-black">{heading}</h3>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-muted">
              {links.map((link) => <a key={link} href="#">{link}</a>)}
            </div>
          </div>
        ))}
        <div>
          <h3 className="font-black">Stay in the loop</h3>
          <p className="mt-2 text-sm font-semibold text-muted">Get 10% OFF on your first order.</p>
          <div className="mt-4 flex rounded-md border border-kindred/15 bg-white p-1">
            <input className="min-w-0 flex-1 px-3 text-sm outline-none" placeholder="Enter your email" />
            <button className="grid h-10 w-10 place-items-center rounded bg-kindred text-white"><ArrowRight className="h-4 w-4" /></button>
          </div>
          <p className="mt-4 text-xs font-black text-muted">VISA · Mastercard · RuPay · UPI</p>
        </div>
      </div>
      <div className="border-t border-kindred/10 px-4 py-4 text-center text-xs font-semibold text-muted">© 2025 Kindbite Foods Pvt. Ltd. All rights reserved.</div>
    </footer>
  );
}

export function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <JourneyStartSection />
      <CategoryStrip />
      <FeaturedBoxes />
      <PremiumSectionImageCards />
      <PopularProducts />
      <TrustBadgeStrip />
      <FeaturedInLogos />
      <Footer />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-kindred/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
        <button className="h-12 w-full rounded-md bg-kindred text-sm font-black text-white">Shop Boxes</button>
      </div>
    </main>
  );
}
