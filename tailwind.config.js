import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust paths as per your project structure
];
export const theme = {
  extend: {
    colors: {
      primary: "#1D4ED8", // Customize your primary color
      secondary: "#9333EA", // Customize your secondary color
      accent: "#FACC15", // Accent color
      muted: "#64748B", // For muted text or elements
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"], // Example of custom font
      serif: ["Merriweather", "serif"],
    },
    spacing: {
      128: "32rem", // Example of custom spacing
      144: "36rem",
    },
    borderRadius: {
      xl: "1.5rem", // Custom border radius
    },
  },
};
export const screens = {
  sm: "640px", // Small screens
  md: "768px", // Medium screens
  lg: "1024px", // Large screens
  xl: "1280px", // Extra large screens
  "2xl": "1536px", // 2XL screens
};
export const plugins = [
  require("@tailwindcss/forms"), // Plugin for styling forms
  require("@tailwindcss/typography"), // Plugin for typography utilities
  require("@tailwindcss/aspect-ratio"), // Plugin for aspect ratio utilities
];
