module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss"),
    require("postcss-nested"),
    require("autoprefixer"),
    require("@tailwindcss/typography"),
    ...(process.env.NODE_ENV === "production"
      ? [
          require("cssnano")({
            preset: "default",
          }),
        ]
      : []),
  ],
};
