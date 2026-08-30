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
        sand: "#Fdfcf0", // Blanco blando
        gold: "#C49A45", // Dorado
        green: "#1B5E20", // Verde profundo
        coral: "#C49A45", // Alias temporal a Dorado para evitar pantallas rotas
        teal: "#1B5E20", // Alias temporal a Verde para contraste
        ink: "#18202A",
        mist: "#E8EEF0",
      },
      fontFamily: {
        tropical: ["var(--font-tropical)"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(24, 32, 42, 0.08)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.5rem",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(221,107,66,0.24), transparent 34%), radial-gradient(circle at bottom right, rgba(15,92,92,0.18), transparent 30%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 40s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
