/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Main brand color
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        dark: {
          800: "#1e293b",
          900: "#0f172a", // Background for dark mode
        },
        light: {
          100: "#f1f5f9", // Background for light mode
        },
        accent: "#10b981", // Vibrant accent color for CTAs
      },
      fontFamily: {
        sans: ['"Inter var"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
