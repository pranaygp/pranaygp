import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#d4d4d4",
            "--tw-prose-headings": "#f5f5f5",
            "--tw-prose-lead": "#a3a3a3",
            "--tw-prose-links": "#60a5fa",
            "--tw-prose-bold": "#f5f5f5",
            "--tw-prose-counters": "#a3a3a3",
            "--tw-prose-bullets": "#525252",
            "--tw-prose-hr": "#262626",
            "--tw-prose-quotes": "#d4d4d4",
            "--tw-prose-quote-borders": "#404040",
            "--tw-prose-captions": "#a3a3a3",
            "--tw-prose-code": "#f5f5f5",
            "--tw-prose-pre-code": "#d4d4d4",
            "--tw-prose-pre-bg": "#171717",
            "--tw-prose-th-borders": "#404040",
            "--tw-prose-td-borders": "#262626",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
