import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#22201c",
        paper: "#f8f3e8",
        jade: "#2f6f63",
        cinnabar: "#b9472e",
        gold: "#c89b3c",
        indigo: "#34456b"
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans SC", "Noto Sans", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
