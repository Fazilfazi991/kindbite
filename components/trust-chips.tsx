import { CheckCircle2 } from "lucide-react";

const chips = [
  "Food-based guidance",
  "Custom daily portions",
  "Nutritionist review available",
  "7-day minimum trial",
  "No diagnosis or prescription",
];

export function TrustChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip}
          className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-kindred shadow-card ring-1 ring-kindred/10"
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          {chip}
        </span>
      ))}
    </div>
  );
}
