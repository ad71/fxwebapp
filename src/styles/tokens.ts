// Generated from tokens/tokens.json. Do not edit directly.
export const tokens = 
{
  color: 
  {
    ink: 
    {
      50: "#F4F6FA",
      100: "#E5E8EE",
      200: "#C9D0DA",
      300: "#A8B0BC",
      400: "#7C8796",
      500: "#5B6675",
      600: "#3C4757",
      700: "#2A3340",
      900: "#0E141B"
    },
    canvas: "#F6F7FB",
    surface: 
    {
      1: "#FFFFFF",
      2: "#F1F4F9",
      3: "#E8EDF5"
    },
    border: 
    {
      subtle: "#E2E7F0",
      strong: "#C9D1DD"
    },
    brand: 
    {
      100: "#E6F6F5",
      200: "#B2E1DE",
      300: "#6BC0BB",
      400: "#38A6A1",
      500: "#1F8F8A",
      600: "#1A6D69",
      700: "#155C59"
    },
    semantic: 
    {
      success: 
      {
        100: "#E3F6EB",
        600: "#2E9E5B"
      },
      warning: 
      {
        100: "#FFF1DD",
        600: "#D98A2B"
      },
      danger: 
      {
        100: "#FDE6E4",
        600: "#D9544D"
      },
      info: 
      {
        100: "#E5F0FF",
        600: "#2F7AD7"
      }
    },
    viz: 
    {
      1: "#1F8F8A",
      2: "#2F7AD7",
      3: "#E2A93B",
      4: "#D9544D",
      5: "#7E57C2",
      6: "#00A3C4",
      7: "#6B7C93",
      8: "#9B59B6"
    },
    chart: 
    {
      grid: "#E7ECF3",
      axis: "#9AA3AF",
      line: "#1F8F8A",
      fill: "rgba(31, 143, 138, 0.12)"
    }
  },
  typography: 
  {
    fontFamily: 
    {
      sans: "var(--font-sora), var(--font-space-grotesk), \"Segoe UI\", sans-serif",
      mono: "\"JetBrains Mono\", \"SF Mono\", monospace"
    },
    size: 
    {
      xs: 12,
      sm: 13,
      md: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 28,
      "4xl": 32,
      "5xl": 40
    },
    lineHeight: 
    {
      tight: 1.2,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.7
    },
    weight: 
    {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: 
  {
    2: 2,
    4: 4,
    6: 6,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
    64: 64,
    80: 80
  },
  radius: 
  {
    4: 4,
    6: 6,
    10: 10,
    14: 14,
    20: 20
  },
  elevation: 
  {
    xs: "0 1px 2px rgba(14, 20, 27, 0.04)",
    sm: "0 2px 6px rgba(14, 20, 27, 0.06)",
    md: "0 6px 16px rgba(14, 20, 27, 0.08)",
    lg: "0 16px 32px rgba(14, 20, 27, 0.12)"
  },
  border: 
  {
    1: "1px solid #E2E7F0",
    2: "2px solid #C9D1DD"
  },
  motion: 
  {
    duration: 
    {
      120: 120,
      180: 180,
      240: 240,
      320: 320,
      560: 560
    },
    easing: 
    {
      standard: "cubic-bezier(0.2, 0.0, 0.2, 1.0)",
      emphasized: "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
      decel: "cubic-bezier(0.0, 0.0, 0.2, 1.0)"
    }
  },
  layout: 
  {
    gridColumns: 12,
    gridGutter: 24,
    contentMax: 1440,
    breakpoints: 
    {
      1024: 1024,
      1280: 1280,
      1440: 1440,
      1680: 1680
    }
  },
  zIndex: 
  {
    base: 1,
    dropdown: 20,
    sticky: 30,
    overlay: 40,
    modal: 50,
    toast: 60
  },
  table: 
  {
    headerHeight: 40,
    rowHeightRegular: 40,
    rowHeightDense: 32,
    rowHeightSpacious: 48,
    rowHover: "rgba(31, 143, 138, 0.06)",
    rowSelected: "rgba(31, 143, 138, 0.12)"
  }
} as const;

export type Tokens = typeof tokens;
