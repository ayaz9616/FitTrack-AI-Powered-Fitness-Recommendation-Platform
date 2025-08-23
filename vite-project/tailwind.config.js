/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        gilroy: ["Gilroy", "sans-serif"],
      },
      colors: {
        primary: "#F97316", // Deep Orange
        secondary: "#8B5CF6", // Soft Purple
        accent: "#EC4899", // Pink
        background: "#FEF3C7", // Warm Ivory
        neutral: "#111827", // Charcoal
        success: "#10B981", // Lime Green
        warning: "#EF4444", // Red
        // legacy colors for fallback
        black: "#000000",
        white: "#FFFFFF",
      },
      backgroundImage: {
        'sidebar-gradient': 'linear-gradient(180deg, #F97316 0%, #8B5CF6 100%)',
      },
    },
  },
  plugins: [],
}