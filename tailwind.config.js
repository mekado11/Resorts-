/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:  "#0D1B2A",
        gold:  "#C9A84C",
        ivory: "#FAF8F2",
        linen: "#EDE9DF",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body:    ["'Jost'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
