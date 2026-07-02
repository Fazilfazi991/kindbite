import { ArrowRight, FileText, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";

type NextStepContext = "recommendation" | "customize" | "report" | "booking" | "checkout";

const cardsByContext: Record<NextStepContext, { title: string; text: string; href: string; cta: string; icon: typeof Sparkles }[]> = {
  recommendation: [
    { title: "Customize this mix", text: "Adjust grams, remove items, and save your own box.", href: "/customize-box", cta: "Customize", icon: Sparkles },
    { title: "Review with nutritionist", text: "Ask for a quick human review before ordering.", href: "/nutritionist-booking", cta: "Book review", icon: MessageCircle },
    { title: "Upload a report", text: "Attach lab context for a beta wellness review.", href: "/report-upload", cta: "Upload", icon: FileText },
  ],
  customize: [
    { title: "Checkout", text: "Use your saved custom box for the next step.", href: "/checkout", cta: "Continue", icon: ShoppingBag },
    { title: "Nutritionist review", text: "Let a Kindbite nutritionist review your mix.", href: "/nutritionist-booking", cta: "Book review", icon: MessageCircle },
    { title: "Upload report", text: "Add report context to your mix request.", href: "/report-upload", cta: "Upload", icon: FileText },
  ],
  report: [
    { title: "Talk to nutritionist", text: "Pair your report upload with a guided review.", href: "/nutritionist-booking", cta: "Book review", icon: MessageCircle },
    { title: "Find my mix", text: "No report required for a food-based recommendation.", href: "/wellness-quiz", cta: "Start quiz", icon: Sparkles },
    { title: "Checkout", text: "Ready with your saved box or mix.", href: "/checkout", cta: "Continue", icon: ShoppingBag },
  ],
  booking: [
    { title: "Upload report", text: "Add lab context before your review.", href: "/report-upload", cta: "Upload", icon: FileText },
    { title: "Customize box", text: "Tune your portions before ordering.", href: "/customize-box", cta: "Customize", icon: Sparkles },
    { title: "Checkout", text: "Continue with your saved Kindbite plan.", href: "/checkout", cta: "Continue", icon: ShoppingBag },
  ],
  checkout: [
    { title: "Customize again", text: "Need one more adjustment before checkout?", href: "/customize-box", cta: "Customize", icon: Sparkles },
    { title: "Nutritionist review", text: "Get a human review before placing an order.", href: "/nutritionist-booking", cta: "Book review", icon: MessageCircle },
    { title: "Upload report", text: "Add report context for the beta review path.", href: "/report-upload", cta: "Upload", icon: FileText },
  ],
};

export function NextStepCards({ context }: { context: NextStepContext }) {
  return (
    <section className="rounded-md bg-white p-5 shadow-card ring-1 ring-kindred/8 sm:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-kindred">Next best steps</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {cardsByContext[context].map(({ title, text, href, cta, icon: Icon }) => (
          <a
            key={title}
            href={href}
            className="group rounded-md border border-kindred/10 bg-white p-4 transition hover:border-kindred/35 hover:shadow-card"
          >
            <Icon className="h-6 w-6 text-kindred" />
            <h2 className="mt-3 font-black text-ink">{title}</h2>
            <p className="mt-2 min-h-10 text-sm font-semibold leading-5 text-muted">{text}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-kindred">
              {cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
