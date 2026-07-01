import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kindred: {
          DEFAULT: "#C93A2F",
          deep: "#8F241C",
          soft: "#FFF1EF",
        },
        cream: "#FFF9F4",
        beige: "#F8EFE7",
        ink: "#2A1E1C",
        muted: "#6B5A55",
        gold: "#D9A441",
        success: "#2F8F4E",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(143, 36, 28, 0.12)",
        card: "0 10px 26px rgba(42, 30, 28, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
