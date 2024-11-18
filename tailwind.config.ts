import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import tailwindAnimate from "tailwindcss-animate"

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
        },
        accent: "hsl(var(--accent))",
        surface: "hsl(var(--surface))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        grey: {
          1: "hsl(var(--grey-1))",
          2: "hsl(var(--grey-2))",
          3: "hsl(var(--grey-3))",
          4: "hsl(var(--grey-4))",
        },
        error: "hsl(var(--error))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        "open-sans": ["var(--open-sans)"],
      },
      fontSize: {
        h1: ["34px", { fontWeight: "700", lineHeight: "42px" }],
        h2: ["24px", { fontWeight: "700", lineHeight: "36px" }],
        h3: ["20px", { fontWeight: "500", lineHeight: "28px" }],
        h4: ["18px", { fontWeight: "500", lineHeight: "20px" }],
        h5: ["16px", { fontWeight: "600", lineHeight: "24px" }],
        "subtitle-1": ["16px", { fontWeight: "500", lineHeight: "24px" }],
        "subtitle-2": ["14px", { fontWeight: "600", lineHeight: "20px" }],
        "body-1": ["16px", { fontWeight: "400", lineHeight: "24px" }],
        "body-2": ["14px", { fontWeight: "400", lineHeight: "20px" }],
        button: ["14px", { fontWeight: "500", lineHeight: "20px" }],
        caption: ["12px", { fontWeight: "400", lineHeight: "16px" }],
        overline: ["10px", { fontWeight: "400", lineHeight: "14px" }],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".flex-center-between": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        ".flex-col-center": {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        },
      })
    }),
    tailwindAnimate,
  ],
} satisfies Config
