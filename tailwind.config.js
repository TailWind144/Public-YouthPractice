module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.{js,ts,vue}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        large: "repeat(auto-fill, minmax(250px, 1fr))",
        normal: "repeat(auto-fill, minmax(200px, 1fr))",
        normal2: "repeat(auto-fill, minmax(128px, 1fr))",
        fix: "repeat(auto-fit, minmax(56px, 1fr))",
      },
      backgroundSize: {
        "100%": "100%",
        "110%": "110%",
      },
      boxShadow: {
        normal:
          "0 1px 4px 0 rgba(0, 0, 0, .02), 0 2px 12px 0 rgba(0, 0, 0, .04), 0 2px 6px 0 rgba(0, 0, 0, .02)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
