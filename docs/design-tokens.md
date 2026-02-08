# Design Tokens

These tokens define the product’s visual language. Values are calibrated for calm, high‑clarity financial UIs.

---

## Color

### Neutral
- ink-900: #0E141B
- ink-700: #2A3340
- ink-600: #3C4757
- ink-500: #5B6675
- ink-400: #7C8796
- ink-300: #A8B0BC
- ink-200: #C9D0DA
- ink-100: #E5E8EE
- ink-50:  #F4F6FA

### Canvas & Surfaces
- canvas: #F6F7FB
- surface-1: #FFFFFF
- surface-2: #F1F4F9
- surface-3: #E8EDF5
- border-subtle: #E2E7F0
- border-strong: #C9D1DD

### Brand (Teal)
- brand-700: #155C59
- brand-600: #1A6D69
- brand-500: #1F8F8A
- brand-400: #38A6A1
- brand-300: #6BC0BB
- brand-200: #B2E1DE
- brand-100: #E6F6F5

### Semantic
- success-600: #2E9E5B
- success-100: #E3F6EB
- warning-600: #D98A2B
- warning-100: #FFF1DD
- danger-600: #D9544D
- danger-100: #FDE6E4
- info-600: #2F7AD7
- info-100: #E5F0FF

### Data Viz Palette
- viz-1: #1F8F8A
- viz-2: #2F7AD7
- viz-3: #E2A93B
- viz-4: #D9544D
- viz-5: #7E57C2
- viz-6: #00A3C4
- viz-7: #6B7C93
- viz-8: #9B59B6

---

## Typography

### Font Families
- font-sans: "Sora", "Space Grotesk", "Segoe UI", sans-serif
- font-mono: "JetBrains Mono", "SF Mono", monospace

### Type Scale (px)
- xs: 12
- sm: 13
- md: 14
- base: 16
- lg: 18
- xl: 20
- 2xl: 24
- 3xl: 28
- 4xl: 32
- 5xl: 40

### Line Heights
- tight: 1.2
- snug: 1.35
- normal: 1.5
- relaxed: 1.7

### Font Weights
- regular: 400
- medium: 500
- semibold: 600
- bold: 700

---

## Spacing

Scale (px)
- 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80

---

## Radii

- r-4: 4
- r-6: 6
- r-10: 10
- r-14: 14
- r-20: 20

---

## Elevation

- shadow-xs: 0 1px 2px rgba(14, 20, 27, 0.04)
- shadow-sm: 0 2px 6px rgba(14, 20, 27, 0.06)
- shadow-md: 0 6px 16px rgba(14, 20, 27, 0.08)
- shadow-lg: 0 16px 32px rgba(14, 20, 27, 0.12)

---

## Borders

- border-1: 1px solid var(--border-subtle)
- border-2: 2px solid var(--border-strong)

---

## Motion

Durations (ms)
- 120, 180, 240, 320, 560

Easings
- standard: cubic-bezier(0.2, 0.0, 0.2, 1.0)
- emphasized: cubic-bezier(0.2, 0.0, 0.0, 1.0)
- decel: cubic-bezier(0.0, 0.0, 0.2, 1.0)

---

## Layout

- grid-columns: 12
- grid-gutter: 24
- content-max: 1440

Breakpoints (px)
- 1024, 1280, 1440, 1680

---

## Z-Index

- base: 1
- dropdown: 20
- sticky: 30
- overlay: 40
- modal: 50
- toast: 60

---

## Table Tokens

- header-height: 40
- row-height-regular: 40
- row-height-dense: 32
- row-height-spacious: 48
- row-hover: rgba(31, 143, 138, 0.06)
- row-selected: rgba(31, 143, 138, 0.12)

---

## Chart Tokens

- chart-grid: #E7ECF3
- chart-axis: #9AA3AF
- chart-line: var(--brand-500)
- chart-fill: rgba(31, 143, 138, 0.12)
