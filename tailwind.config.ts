import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
    },
    extend: {
      colors: {
        charcoal: "#24292D",
        ink: "#171A1C", // near-black
        cream: "#F5F4F0", // warm off-white
        concrete: "#D9DAD7",
        slate: "#747B80", // secondary gray
        copper: {
          DEFAULT: "#A66B45",
          dark: "#8A5738",
          light: "#BD8768",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.18em",
      },
      maxWidth: {
        prose2: "42rem",
      },
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  plugins: [],
};
export default config;
