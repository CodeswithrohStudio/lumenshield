import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        unbounded: ["Unbounded", "sans-serif"],
        albert: ["Albert Sans", "sans-serif"],
        plex: ["IBM Plex Mono", "monospace"],
        orbitron: ["Orbitron", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "#5170cf",
        cta: "#5170cf",
        surface: "#14161c",
        "surface-2": "#090b11",
        accent: "#e2832e",
        signal: "#e2832e",
      },
      maxWidth: {
        "480px": "480px",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
