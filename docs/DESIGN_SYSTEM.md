# Balli FX Design System

> Authoritative guide for building UI in the FX web app.
> All visual decisions flow from `tokens/tokens.json`.

---

## 1. Design Principles

1. **Serene Authority** — Financial UIs demand trust. Use restraint: muted surfaces, clear hierarchy, minimal decoration. Let data breathe.
2. **Flowing Motion** — Subtle, purposeful animations guide attention. Entrances use `emphasized` easing; exits use `decel`. Respect `prefers-reduced-motion`.
3. **Data Clarity** — Financial figures are always monospace, right-aligned, with `tabular-nums`. Status uses semantic color + icon, never color alone.
4. **Token-first** — Every color, spacing, radius, shadow, and duration comes from the token system. No magic numbers in CSS.
5. **Accessibility by default** — Keyboard navigable, focus-visible rings, ARIA roles on interactive components, reduced-motion guards on every animation.

---

## 2. Color System

### Surfaces & Hierarchy

| Token                  | Hex       | Usage                                            |
| ---------------------- | --------- | ------------------------------------------------ |
| `--color-canvas`       | `#F6F7FB` | Page background                                  |
| `--color-surface-1`    | `#FFFFFF` | Primary cards and panels                         |
| `--color-surface-2`    | `#F1F4F9` | Recessed areas, table headers, secondary panels  |
| `--color-surface-3`    | `#E8EDF5` | Nested containers, active states                 |
| `--color-surface-hover`| —         | `rgba(31,143,138,0.04)` — interactive row hover  |

### Ink (Neutral Scale)

| Token              | Hex       | Usage                                            |
| ------------------ | --------- | ------------------------------------------------ |
| `--color-ink-900`  | `#0E141B` | Primary text, headings                           |
| `--color-ink-700`  | `#2A3340` | Strong secondary text, button labels             |
| `--color-ink-600`  | `#3C4757` | Body text, descriptions                          |
| `--color-ink-500`  | `#5B6675` | Muted labels, timestamps                         |
| `--color-ink-400`  | `#7C8796` | Placeholder text, disabled, icons                |
| `--color-ink-300`  | `#A8B0BC` | Dividers, decorative elements                    |
| `--color-ink-200`  | `#C9D0DA` | Subtle borders, backgrounds                      |
| `--color-ink-100`  | `#E5E8EE` | Track backgrounds                                |
| `--color-ink-50`   | `#F4F6FA` | Lightest neutral background                      |

### Brand (Teal Palette)

| Token              | Hex       | Usage                                    |
| ------------------ | --------- | ---------------------------------------- |
| `--color-brand-500`| `#1F8F8A` | Primary action (buttons, links, active)  |
| `--color-brand-600`| `#1A6D69` | Hover state                              |
| `--color-brand-700`| `#155C59` | Active/pressed state                     |
| `--color-brand-400`| `#38A6A1` | Focus border, secondary brand            |
| `--color-brand-300`| `#6BC0BB` | Focus ring outline                       |
| `--color-brand-200`| `#B2E1DE` | Light accent                             |
| `--color-brand-100`| `#E6F6F5` | Badge/pill backgrounds                   |

**Alpha compositing**: Use `rgba(var(--color-brand-500-rgb), <alpha>)` for overlays, selections, focus rings. RGB channel tokens are available for brand-300, brand-400, and brand-500.

### Semantic Colors

Each semantic color has three tiers:

| Tier  | Usage                                    |
| ----- | ---------------------------------------- |
| `100` | Background tint (badges, alert bars)     |
| `600` | Text and icon color                      |
| `700` | Hover/active state for text/icons        |

RGB channels (`600-rgb`) are available for alpha compositing.

**Variants**: `success` (green), `warning` (amber), `danger` (red), `info` (blue).

### Data Visualization

Use `--color-viz-1` through `--color-viz-8` in order. These are optimized for distinguishability on light backgrounds. Chart defaults (`--color-chart-*`) handle grid lines, axes, and primary series.

### Borders

| Token                  | Value                    | Usage                    |
| ---------------------- | ------------------------ | ------------------------ |
| `--color-border-subtle`| `#E2E7F0`               | Default card/row borders |
| `--color-border-strong`| `#C9D1DD`               | Emphasized borders       |

RGB channel `border-subtle-rgb` available for alpha compositing on nested borders.

---

## 3. Typography

### Families

| Variable                          | Font            | Usage                        |
| --------------------------------- | --------------- | ---------------------------- |
| `--typography-fontFamily-sans`    | Sora, Space Grotesk | Headings, body, labels   |
| `--typography-fontFamily-mono`    | JetBrains Mono  | Rates, codes, timestamps     |

### Scale

| Token                     | Size  | Usage                                    |
| ------------------------- | ----- | ---------------------------------------- |
| `--typography-size-2xs`   | 10px  | Table headers, pair market labels        |
| `--typography-size-xs`    | 12px  | Captions, helper text, small mono data   |
| `--typography-size-sm`    | 13px  | Labels, body text, nav items             |
| `--typography-size-md`    | 14px  | Default body text                        |
| `--typography-size-base`  | 16px  | Emphasized body, large button text       |
| `--typography-size-lg`    | 18px  | Section headings, modal titles           |
| `--typography-size-xl`    | 20px  | Page sub-headings                        |
| `--typography-size-2xl`   | 24px  | Page titles, hero titles                 |
| `--typography-size-3xl`   | 28px  | Large headings                           |
| `--typography-size-4xl`   | 32px  | Hero numbers, KPI values                 |
| `--typography-size-5xl`   | 40px  | Display text                             |

### Weights

| Token                           | Value | Usage                          |
| ------------------------------- | ----- | ------------------------------ |
| `--typography-weight-regular`   | 400   | Body text                      |
| `--typography-weight-medium`    | 500   | Labels, nav, secondary text    |
| `--typography-weight-semibold`  | 600   | Headings, active states        |
| `--typography-weight-bold`      | 700   | KPI figures, emphasis          |

### Line Heights

| Token                              | Value | Usage                |
| ---------------------------------- | ----- | -------------------- |
| `--typography-lineHeight-tight`    | 1.2   | Headings, compact    |
| `--typography-lineHeight-snug`     | 1.35  | Labels, captions     |
| `--typography-lineHeight-normal`   | 1.5   | Body text            |
| `--typography-lineHeight-relaxed`  | 1.7   | Long-form content    |

### Conventions

- **Page titles**: `2xl`, semibold, `letter-spacing: -0.02em`
- **Section headings**: `lg`, semibold, `letter-spacing: -0.01em`
- **Body**: `md` (14px), regular, line-height 1.5
- **Labels/captions**: `sm` (13px) or `xs` (12px), medium
- **Uppercase text**: `letter-spacing: 0.02em` to `0.08em` (nav, badges, table headers)
- **Financial figures**: Always `fontFamily-mono`, right-aligned, `tabular-nums`

---

## 4. Spacing & Layout

### Scale

`2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80` px — use `--spacing-*` tokens.

### Conventions

| Context              | Value  | Token           |
| -------------------- | ------ | --------------- |
| Card padding         | 20-24px| `--spacing-20` / `--spacing-24` |
| Section gaps         | 24-32px| `--spacing-24` / `--spacing-32` |
| Inline element gaps  | 8-12px | `--spacing-8` / `--spacing-12`  |
| Table cell padding   | 8px    | `--spacing-8`   |
| Content max-width    | 1440px | `--layout-contentMax` |

### Grid

- 12-column grid (`--layout-gridColumns`)
- 32px gutter (`--layout-gridGutter`)
- Dashboard uses `react-grid-layout` for widget positioning

### Breakpoints

| Token                        | Width  | Usage              |
| ---------------------------- | ------ | ------------------ |
| `--layout-breakpoints-sm`    | 640px  | Mobile             |
| `--layout-breakpoints-md`    | 1024px | Tablet             |
| `--layout-breakpoints-lg`    | 1280px | Desktop            |
| `--layout-breakpoints-xl`    | 1440px | Wide desktop       |
| `--layout-breakpoints-2xl`   | 1680px | Ultra-wide         |

**Strategy**: Desktop-first. Hide non-essential columns at `md`, stack at `sm`.

---

## 5. Border Radius

| Token          | Size  | Usage                              |
| -------------- | ----- | ---------------------------------- |
| `--radius-4`   | 4px   | Grip dots, small indicators        |
| `--radius-6`   | 6px   | Small buttons, inputs              |
| `--radius-8`   | 8px   | Default buttons, dropdowns         |
| `--radius-10`  | 10px  | Search bars, toasts, tab lists     |
| `--radius-14`  | 14px  | Cards, modals, widgets             |
| `--radius-20`  | 20px  | Large containers, hero panels      |
| `--radius-full`| 999px | Circles (avatars, pills, badges)   |

---

## 6. Elevation & Depth

Shadows are intentionally subtle. Most elements use borders rather than shadows.

| Token            | Usage                                  |
| ---------------- | -------------------------------------- |
| `--elevation-xs` | Default cards, static elements         |
| `--elevation-sm` | Elevated cards, hover states           |
| `--elevation-md` | Dropdowns, popovers, toasts           |
| `--elevation-lg` | Modals, drawers                        |

### Focus Rings

Interactive elements use `outline: 2px solid var(--color-brand-300)` with `outline-offset: 2px` on `:focus-visible`. Inputs use `box-shadow: 0 0 0 3px rgba(var(--color-brand-500-rgb), 0.08)` on focus.

---

## 7. Motion

### Durations

| Token                    | Time  | Usage                                |
| ------------------------ | ----- | ------------------------------------ |
| `--motion-duration-100`  | 100ms | Micro-interactions (hover color)     |
| `--motion-duration-150`  | 150ms | Button state changes, focus rings    |
| `--motion-duration-200`  | 200ms | Tooltips, small reveals, toast exit  |
| `--motion-duration-240`  | 240ms | Alert slide-in, drawer exit          |
| `--motion-duration-320`  | 320ms | Modal enter, drawer enter, fade-in   |
| `--motion-duration-400`  | 400ms | Widget entrance, range-bar transition|
| `--motion-duration-560`  | 560ms | Risk-bar fill, slower transitions    |
| `--motion-duration-800`  | 800ms | Rate flash animations                |

### Easings

| Token                         | Curve                           | Usage                           |
| ----------------------------- | ------------------------------- | ------------------------------- |
| `--motion-easing-standard`    | `cubic-bezier(0.2, 0, 0.2, 1)` | Most transitions, hover, data   |
| `--motion-easing-emphasized`  | `cubic-bezier(0.2, 0, 0, 1)`   | Enter animations (overshoot)    |
| `--motion-easing-decel`       | `cubic-bezier(0, 0, 0.2, 1)`   | Exit animations, rate flashes   |

### Animation Patterns

| Pattern          | Duration | Easing     | Description                               |
| ---------------- | -------- | ---------- | ----------------------------------------- |
| **Enter**        | 280-400ms| emphasized | Fade in + `translateY(8-12px)` or `scale(0.95→1)` |
| **Exit**         | 200-240ms| standard   | Fade out (exits are faster than entries)   |
| **Hover/focus**  | 100-150ms| standard   | Color/background transitions only          |
| **Data flash**   | 800ms    | decel      | Scale pulse + colored background flash     |
| **Slide-in**     | 240-320ms| emphasized | `translateX` for drawers/alerts            |
| **Progress**     | variable | linear     | Width shrink for toast auto-dismiss        |

### Rules

1. **Prefer `transform` and `opacity`** — GPU-composited, no layout thrashing. Exception: `width` transitions on progress bars are acceptable.
2. **Exits are faster than entries** — enter at 280-320ms, exit at 200-240ms.
3. **Every animation needs a `@media (prefers-reduced-motion: reduce)` guard** that sets `animation: none` and/or `transition: none`.
4. **Stagger delays** use CSS custom properties (e.g., `--widget-enter-delay`) set from JS.

---

## 8. Components

### Quick Reference

| Component     | Import from      | Variants / Key Props                  | When to Use                              |
| ------------- | ---------------- | ------------------------------------- | ---------------------------------------- |
| `Button`      | `ui`             | primary, secondary, ghost, danger × sm/md/lg | All clickable actions              |
| `Card`        | `ui`             | Card, CardHeader, CardTitle, CardBody, CardFooter | Content containers          |
| `Badge`       | `ui`             | neutral, success, warning, danger, info | Status indicators, counts             |
| `Skeleton`    | `ui`             | —                                     | Loading placeholders                     |
| `Tooltip`     | `ui`             | `content: string`                     | Non-interactive hover/focus info         |
| `Modal`       | `ui`             | `open`, `onOpenChange`, `title`       | Dialogs requiring user decision          |
| `Drawer`      | `ui`             | `open`, `onOpenChange`, `title`       | Detail panels, side sheets               |
| `Tabs`        | `ui`             | Tabs, TabsList, TabsTrigger, TabsContent | Switching between related views       |
| `Toast`       | `ui`             | success, warning, danger, info        | Transient notifications (via `useToast`) |
| `Table`       | `ui`             | Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell | Data tables   |
| `Field`       | `ui`             | `label`, `error`, `helperText`        | Form field wrapper with a11y             |
| `Input`       | `ui`             | —                                     | Text input (wrap in `Field`)             |
| `Textarea`    | `ui`             | —                                     | Multi-line input (wrap in `Field`)       |
| `Select`      | `ui`             | —                                     | Dropdown select (wrap in `Field`)        |
| `AppShell`    | `layout`         | —                                     | Top-level page wrapper with nav          |
| `PageHeader`  | `layout`         | `title`, `description`, `kicker`, `actions` | Page-level heading                 |

### Usage Notes

- **Modal vs Drawer**: Use Modal for focused decisions (confirmations, forms). Use Drawer for detail views and secondary content that doesn't block the main flow.
- **Toast**: Always wrap your app in `<ToastProvider>`. Fire toasts via `const { addToast } = useToast()`.
- **Form fields**: Always wrap `<Input>`, `<Textarea>`, and `<Select>` in `<Field>` for proper labeling and error display.
- **Tables**: Use semantic sub-components. Financial columns use `fontFamily-mono` and right-align.

---

## 9. Accessibility

### ARIA Patterns

| Component   | ARIA                                                       |
| ----------- | ---------------------------------------------------------- |
| `Tabs`      | `role="tablist"`, `role="tab"` with `aria-selected`, `role="tabpanel"` with `aria-labelledby` |
| `Modal`     | `role="dialog"`, `aria-modal="true"`                       |
| `Drawer`    | `role="dialog"`, `aria-modal="true"` (on `<aside>`)       |
| `Tooltip`   | `role="tooltip"`                                           |
| `Toast`     | `role="region"`, `aria-live="polite"`, close button has `aria-label="Dismiss"` |
| `Field`     | `<label htmlFor>`, `aria-invalid`, `aria-describedby`, error has `role="alert"` |
| `Table`     | `<th scope="col">`                                         |
| `Button`    | Loading spinner has `aria-hidden`                          |

### Focus Management

- **Focus-visible**: All interactive elements show `2px outline` in `brand-300` with `2px offset` on `:focus-visible`.
- **Focus trap**: Modal and Drawer use `useFocusTrap()` hook — Tab cycles within the dialog, focus restores on close.
- **Auto-focus**: First focusable element receives focus when Modal/Drawer opens.

### Keyboard Navigation

- **Escape**: Closes Modal and Drawer.
- **Tab / Shift+Tab**: Navigates between focusable elements. Trapped within open overlays.
- **Enter / Space**: Activates buttons and tab triggers (native behavior).

### Reduced Motion

Every animated component has a `@media (prefers-reduced-motion: reduce)` guard:

```css
@media (prefers-reduced-motion: reduce) {
  .element {
    animation: none;
    transition: none;
  }
}
```

Components with reduced-motion guards: Skeleton, Toast, Tabs, Modal/Drawer (overlay), Widget, Alert bars, Search filter pills, Performance widget chart, Rates table (flash + empty state).

### Contrast

- Body text (`ink-600` on `surface-1`): exceeds 4.5:1.
- Large text (`ink-500` on `surface-1`): exceeds 3:1.
- Brand interactive (`brand-500` on white): 4.6:1.
- Never use color alone as a status indicator — always pair with icon or text.

---

## 10. Do's and Don'ts

### Do

- Use token variables for all values — `var(--spacing-16)`, not `16px`.
- Use `cn()` utility for conditional className composition.
- Add `@media (prefers-reduced-motion: reduce)` guard to every new animation.
- Use semantic colors (`success`, `warning`, `danger`, `info`) for status.
- Use `forwardRef` on new leaf components.
- Use `fontFamily-mono` for any financial/numeric data.
- Use `letter-spacing: -0.01em` to `-0.02em` on headings for a tighter feel.

### Don't

- Don't use hardcoded hex colors, pixel values, or ms durations in CSS.
- Don't animate `width`, `height`, `top`, `left`, or `margin` (prefer `transform`).
- Don't use color alone to convey meaning — always pair with icon or text.
- Don't add heavy shadows or gradients — the aesthetic is light and airy.
- Don't skip the `Field` wrapper for form inputs — it provides label linking and error a11y.
- Don't create per-component reduced-motion overrides in `globals.css` — each component owns its own guard.

---

## File Structure

```
tokens/tokens.json          ← Single source of truth
scripts/generate-tokens.mjs ← Generates CSS + TS from JSON
src/styles/tokens.css       ← Generated CSS custom properties
src/styles/tokens.ts        ← Generated TS constants
src/app/globals.css         ← Global resets, scrollbars
src/components/ui/          ← Reusable primitives (Button, Card, Tabs, etc.)
src/components/ui/index.ts  ← Barrel export for all UI components
src/components/layout/      ← AppShell, PageHeader
docs/DESIGN_SYSTEM.md       ← This file
```

### Token Workflow

1. Edit `tokens/tokens.json`.
2. Run `node scripts/generate-tokens.mjs`.
3. Both `tokens.css` and `tokens.ts` are regenerated.
4. CSS uses proper units (px, ms). TS preserves raw numbers.
