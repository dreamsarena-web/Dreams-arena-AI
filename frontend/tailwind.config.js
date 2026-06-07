module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5"
        },
        dark: {
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a"
        }
      },
      animation: {
        "pulse-slow": "pulse 3s infinite"
      }
    }
  },
  plugins: []
}
