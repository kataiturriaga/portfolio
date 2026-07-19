export const colors = {
  paper: "#f6f3f0",
  surface: "#faf8f5",
  paperDeep: "#ece7de",
  ink: "#1e1e1e",
  inkSoft: "#413c34",
  red: "#f90000",
  rule: "rgba(30, 30, 30, 0.2)",
  ruleLight: "rgba(255, 255, 255, 0.18)",
};

export const typography = {
  fontSansVar: "--font-geist-sans",
  fontMonoVar: "--font-geist-mono",
  fontNewsreaderVar: "--font-newsreader",
  fontCaveatVar: "--font-caveat",
  families: {
    serif: "var(--font-newsreader), Georgia, 'Times New Roman', serif",
    sans: "var(--font-geist-sans), Helvetica, Arial, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  scale: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.5rem",
    xxl: "2.25rem",
  },
  weights: {
    serif: "var(--font-serif-weight, 500)",
    sans: "var(--font-sans-weight, 400)",
    mono: "var(--font-mono-weight, 400)",
  },
};

const tokens = { colors, typography };

export default tokens;

