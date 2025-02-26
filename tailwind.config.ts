import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#8b5cf6',
          light: '#a78bfa',
          dark: '#6d28d9',
        },
        secondary: {
          main: '#bfa094',
          light: '#d2bab0',
          dark: '#a18072',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
  // Important: Since we're using MUI, we need to make sure Tailwind doesn't conflict
  corePlugins: {
    preflight: false,
  },
};

export default config;
