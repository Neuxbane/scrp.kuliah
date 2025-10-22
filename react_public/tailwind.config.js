/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8",
        secondary: "#018786",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1a73e8 0%, #6c63ff 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
      },
    },
  },
  plugins: [],
});
