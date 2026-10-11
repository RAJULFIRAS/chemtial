/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2f5143",
        secondary: "#6a6a6a",
        background: "#ffffff",
        "primary-light": "#4a7a67",
        "primary-dark": "#1e3a30",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans SC",
          "Noto Sans Devanagari",
          "Noto Sans Arabic",
          "system-ui",
          "sans-serif",
        ],
        arabic: ["Noto Sans Arabic", "Inter", "system-ui", "sans-serif"],
        chinese: ["Noto Sans SC", "Inter", "system-ui", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-in",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
