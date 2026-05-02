import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effef1",
          100: "#d9fbe0",
          200: "#b7f3c3",
          300: "#87e396",
          400: "#52cc65",
          500: "#28b446",
          600: "#1a8f35",
          700: "#176f2d",
          800: "#155828",
          900: "#124824"
        },
        cream: "#f8fbf4",
        ink: "#122018"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(40, 180, 70, 0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(21, 88, 40, 0.15), transparent 35%)"
      },
      boxShadow: {
        soft: "0 20px 45px -25px rgba(18, 32, 24, 0.32)"
      },
      fontFamily: {
        sans: ["var(--font-manrope)"],
        display: ["var(--font-fraunces)"]
      }
    }
  },
  plugins: []
};

export default config;

