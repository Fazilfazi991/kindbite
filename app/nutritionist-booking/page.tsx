import { ArrowLeft, MessageCircle } from "lucide-react";

export default function NutritionistBookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-white to-beige px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="inline-block leading-none">
          <span className="block font-display text-3xl font-black text-kindred">kindbite</span>
          <span className="text-[9px] font-extrabold tracking-[0.24em] text-kindred-deep">
            NOURISH. GIFT. INSPIRE.
          </span>
        </a>

        <section className="mt-6 rounded-md bg-white p-6 text-center shadow-card ring-1 ring-kindred/8 sm:p-10">
          <MessageCircle className="mx-auto h-11 w-11 text-kindred" />
          <h1 className="mt-4 text-3xl font-black text-ink">Nutritionist Booking Coming Soon</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-6 text-muted">
            A Kindbite nutritionist booking flow will be added next.
          </p>
          <a
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-kindred px-5 text-sm font-black text-white shadow-card"
            href="/recommendation"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recommendation
          </a>
        </section>
      </div>
    </main>
  );
}
