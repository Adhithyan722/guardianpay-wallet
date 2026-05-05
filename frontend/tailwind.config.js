/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",
        card: "rgba(30, 41, 59, 0.7)",
        primary: "#38bdf8",
        secondary: "#818cf8",
        'text-main': "#f8fafc",
        'text-muted': "#94a3b8",
      }
    },
  },
  plugins: [],
}
