import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kindbite | Thoughtful Nutrition. Beautifully Gifted.",
  description: "Premium wellness boxes, healthy snacks, superfoods, and nutrition gifting by Kindbite.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
