/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 👈 This makes Tailwind scan all React files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // optional: clean modern font
      },
      colors: {
        brand: {
          light: "#A7F3D0",
          DEFAULT: "#10B981", // emerald/teal wellness vibe
          dark: "#047857",
        },
      },
    },
  },
  plugins: [],
}
