import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F4EEE3",
        coral: "#DD6B42",
        teal: "#0F5C5C",
        ink: "#18202A",
        mist: "#E8EEF0",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(24, 32, 42, 0.08)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(221,107,66,0.24), transparent 34%), radial-gradient(circle at bottom right, rgba(15,92,92,0.18), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
