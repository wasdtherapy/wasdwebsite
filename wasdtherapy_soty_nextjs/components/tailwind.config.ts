import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-sans)"], mono: ["var(--font-mono)"] },
      colors: { bg0: "#06070d", bg1: "#0b0e1a" },
    },
  },
  plugins: [],
};
export default config;
