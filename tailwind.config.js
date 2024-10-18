/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        themeColor: {
          50: "#e6e8f4",
          100: "#c0c4e0",
          200: "#9aa1cc",
          300: "#747db7",
          400: "#4e58a3",
          500: "#28338e",
          600: "#232d80",
          700: "#1e2670",
          800: "#192060",
          900: "#131a50",
          950: "#0b0f30",
        },
        primary: {
          50: "#ffe8e6",
          100: "#ffc0c4",
          200: "#ff999a",
          300: "#ff7270",
          400: "#ff4a46",
          500: "#ff221c",
          600: "#e61f1a",
          700: "#cc1c16",
          800: "#b31913",
          900: "#99150f",
          950: "#660e0a",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
