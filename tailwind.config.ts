import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F0F4FA",
          100: "#DCE6F2",
          200: "#B9CDE4",
          300: "#8AAAD0",
          400: "#5A83B4",
          500: "#35619A",
          600: "#234A80",
          700: "#173A6B",
          800: "#102C55",
          900: "#0B2145",
          950: "#071630",
        },
        royal: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#1D6FE0",
          700: "#1A5BC0",
          800: "#174A9C",
          900: "#123A78",
        },
        gold: {
          50: "#FDF6EA",
          100: "#FAEBD0",
          200: "#F4D69E",
          300: "#EDBE6C",
          400: "#E8A33D",
          500: "#D18E24",
          600: "#B07417",
          700: "#8C5A13",
          800: "#6F4612",
          900: "#5A3A11",
        },
        leaf: {
          50: "#F0FAF4",
          100: "#DCF2E5",
          200: "#BAE4CC",
          300: "#8DD0AC",
          400: "#57B584",
          500: "#2F9E63",
          600: "#237F4E",
          700: "#1D6640",
          800: "#185134",
          900: "#14432C",
        },
        sand: "#FAF7F2",
        cream: "#F4EFE6",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(11,33,69,0.14)",
        lift: "0 24px 48px -16px rgba(11,33,69,0.20)",
        card: "0 2px 10px -2px rgba(11,33,69,0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.04)" },
        },
      },
      animation: {
        fadeUp: "fadeUp .7s ease-out both",
        kenburns: "kenburns 18s ease-out alternate infinite",
      },
    },
  },
  plugins: [],
};
export default config;
