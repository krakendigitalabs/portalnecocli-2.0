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
        sand: "#FDFBF7", // Blanco cálido premium (Alabaster/Sand)
        gold: "#D4AF37", // Dorado clásico luxury
        green: "#10452F", // Verde bosque/esmeralda muy profundo
        coral: "#E86A58", // Coral cálido real para CTAs
        teal: "#0F5C5C", // Teal/Esmeralda corporativo elegante
        ink: "#0F172A", // Negro tintero (Slate 900)
        mist: "#F1F5F9", // Gris muy sutil
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
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2s infinite linear",
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
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
