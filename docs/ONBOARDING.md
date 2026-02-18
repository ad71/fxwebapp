# Balli FX — Developer Onboarding Guide

> Everything you need to understand, navigate, and build features in this codebase.

---

## What Is This?

Balli FX is a foreign exchange dashboard web app. It shows live currency rates, dashboard widgets (settlements, balances, trades, VaR), and will eventually support trade execution, wallet management, and reporting. Think Bloomberg Terminal aesthetics but clean and modern — inspired by [Bound.co](https://bound.co).

**Current state**: The dashboard and live rates pages are fully functional with mock data. Four pages (`/trade`, `/discover`, `/wallet`, `/report`) are defined in the nav but not yet built — they're your next features.

---

## Tech Stack

| Layer        | Technology                        | Version |
|------------- |-----------------------------------|---------|
| Framework    | Next.js (App Router)              | 16.1.4  |
| UI Library   | React                             | 19.2.4  |
| Language     | TypeScript (strict mode)          | 5.9.3   |
| Styling      | CSS Modules                       | —       |
| Design Tokens| Custom JSON → CSS/TS pipeline     | —       |
| Icons        | lucide-react                      | 0.564   |
| Grid Layout  | react-grid-layout                 | 2.2.2   |
| Fonts        | Sora + Space Grotesk (Google)     | —       |

No Tailwind. No styled-components. No external UI libraries. Everything is custom CSS Modules driven by a design token system.

---

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # Production build (verifies everything compiles)
npm run tokens:build # Regenerate CSS/TS from tokens.json (run after editing tokens)
npm run tokens:check # Validate token structure
```

---

## Directory Structure

```
fxwebapp/
├── tokens/
│   └── tokens.json                ← THE source of truth for all design values
│
├── scripts/
│   ├── generate-tokens.mjs        ← Reads tokens.json → writes tokens.css + tokens.ts
│   ├── generate-color-list.mjs    ← Generates color preview data
│   └── check-tokens.mjs           ← Validates token structure
│
├── src/
│   ├── app/                       ← Next.js App Router (pages & routes)
│   │   ├── layout.tsx             ← Root layout: fonts, global CSS, AppShell
│   │   ├── globals.css            ← Resets, base typography, scrollbars, reduced-motion
│   │   ├── page.tsx               ← "/" — Dashboard (renders WidgetGrid)
│   │   ├── rates/
│   │   │   ├── page.tsx           ← "/rates" — server component entry
│   │   │   └── rates-page.tsx     ← Client component with search, tabs, live rates
│   │   ├── components/
│   │   │   └── page.tsx           ← "/components" — UI component showcase
│   │   └── preview/tokens/
│   │       └── page.tsx           ← "/preview/tokens" — Color token gallery
│   │
│   ├── components/
│   │   ├── ui/                    ← Reusable UI primitives (the component library)
│   │   │   ├── index.ts           ← Barrel export — import everything from here
│   │   │   ├── button.tsx         ← Button (primary/secondary/ghost/danger)
│   │   │   ├── card.tsx           ← Card + CardHeader/Title/Body/Footer
│   │   │   ├── badge.tsx          ← Badge (neutral/success/warning/danger/info)
│   │   │   ├── input.tsx          ← Field + Input/Textarea/Select
│   │   │   ├── table.tsx          ← Table + Head/Body/Row/HeaderCell/Cell
│   │   │   ├── tabs.tsx           ← Tabs + TabsList/Trigger/Content
│   │   │   ├── modal.tsx          ← Modal + ModalBody/Footer
│   │   │   ├── drawer.tsx         ← Drawer + DrawerBody/Footer
│   │   │   ├── toast.tsx          ← ToastProvider + useToast hook
│   │   │   ├── skeleton.tsx       ← Skeleton loading placeholder
│   │   │   ├── tooltip.tsx        ← Tooltip on hover/focus
│   │   │   ├── cn.ts              ← className utility (like clsx)
│   │   │   ├── use-focus-trap.ts  ← Focus trap for modal/drawer
│   │   │   ├── use-lock-body-scroll.ts ← Prevents body scroll
│   │   │   └── *.module.css       ← Each component has its own CSS module
│   │   │
│   │   ├── layout/                ← App-level layout components
│   │   │   ├── app-shell.tsx      ← Top nav bar (wraps every page)
│   │   │   └── page-header.tsx    ← Page title/description header
│   │   │
│   │   ├── dashboard/             ← Dashboard widget system
│   │   │   ├── widget-grid.tsx    ← Responsive grid (react-grid-layout)
│   │   │   ├── widget.tsx         ← Widget container (title, drag handle, body)
│   │   │   ├── widget-registry.ts ← Lazy-loaded widget component map
│   │   │   ├── widget-types.ts    ← TypeScript interfaces
│   │   │   ├── default-layouts.ts ← Default 8-widget grid configuration
│   │   │   ├── use-dashboard-layout.ts ← localStorage persistence hook
│   │   │   └── widgets/           ← Individual widget implementations
│   │   │       ├── settlements-widget.tsx
│   │   │       ├── settlements-next-widget.tsx
│   │   │       ├── var-widget.tsx
│   │   │       ├── payments-widget.tsx
│   │   │       ├── hedge-ratio-widget.tsx
│   │   │       ├── balances-widget.tsx
│   │   │       ├── recent-trades-widget.tsx
│   │   │       ├── performance-widget.tsx
│   │   │       └── shared.module.css  ← Shared widget styles (flags, amounts, alerts)
│   │   │
│   │   └── rates/                 ← Rates table components
│   │       ├── rates-table.tsx    ← Draggable rate table with all columns
│   │       ├── rate-row.tsx       ← Single currency pair row
│   │       ├── range-bar.tsx      ← Visual low-high range indicator
│   │       ├── currency-pair-cell.tsx ← Flag + pair name cell
│   │       ├── search-filter.tsx  ← Search input + filter pills
│   │       └── index.ts           ← Barrel export
│   │
│   ├── lib/                       ← Business logic & data
│   │   └── rates/
│   │       ├── types.ts           ← RateTick, RateSnapshot, CurrencyPairMeta
│   │       ├── currency-pairs.ts  ← 30 currency pairs + group definitions
│   │       ├── data-source.ts     ← Abstract RateDataSource interface
│   │       ├── mock-data-source.ts← Mock implementation (random ticks)
│   │       ├── live-data-source.ts← Placeholder for real WebSocket
│   │       ├── create-data-source.ts ← Factory: "mock" | "live"
│   │       └── use-live-rates.ts  ← React hook: subscribes to rate updates
│   │
│   └── styles/
│       ├── tokens.css             ← GENERATED — CSS custom properties
│       └── tokens.ts              ← GENERATED — TypeScript token constants
│
└── docs/
    ├── DESIGN_SYSTEM.md           ← Design language, tokens, patterns, a11y
    ├── ONBOARDING.md              ← This file
    ├── design-tokens.md           ← Token reference
    ├── component-inventory.md     ← Component catalog
    └── ui-spec.md                 ← UI specifications
```

---

## How the App Boots

Here's the chain from browser request to rendered page:

```
Browser hits /
  → Next.js App Router resolves src/app/page.tsx
  → page.tsx is wrapped by src/app/layout.tsx (root layout)
    → layout.tsx loads:
        1. globals.css — resets, base typography, scrollbars, reduced-motion
        2. tokens.css  — all design token CSS variables (generated)
        3. Google Fonts — Sora + Space Grotesk via next/font
    → layout.tsx renders <AppShell>{children}</AppShell>
      → AppShell provides the sticky top nav bar
      → {children} = page.tsx content
        → page.tsx renders <WidgetGrid dashboardId="home" />
          → WidgetGrid loads layout from localStorage (or defaults)
          → react-grid-layout renders 8 <Widget> containers
          → Each Widget lazy-loads its content via widgetRegistry
```

**Key insight**: Every page is wrapped in `AppShell`. The nav bar, fonts, global styles, and design tokens are always available. You never need to import tokens.css manually — it's loaded once at the root.

---

## How Pages Work

### Adding a New Page

Next.js App Router uses file-system routing. To create `/trade`:

```
src/app/trade/
  page.tsx          ← Server component (entry point)
  trade-page.tsx    ← Client component (if you need interactivity)
  trade-page.module.css
```

```tsx
// src/app/trade/page.tsx
import { TradePage } from "./trade-page";
export default function Page() {
  return <TradePage />;
}

// src/app/trade/trade-page.tsx
"use client";
import { PageHeader } from "../../components/layout/page-header";

export function TradePage() {
  return (
    <div>
      <PageHeader title="Trade" description="Execute FX trades" />
      {/* Your content here */}
    </div>
  );
}
```

The nav link in `app-shell.tsx` already exists for `/trade` — it'll automatically highlight when the route matches.

### Existing Routes

| Route             | What It Does                                     |
|-------------------|--------------------------------------------------|
| `/`               | Dashboard — 8 draggable widgets in a grid        |
| `/rates`          | Live rates table with search, filters, OHLC data |
| `/components`     | Showcase of all UI components (dev reference)     |
| `/preview/tokens` | Visual gallery of all color tokens               |

---

## The Design Token Pipeline

This is the backbone of the entire visual system.

### Flow

```
tokens/tokens.json          (you edit this)
        ↓
npm run tokens:build         (runs generate-tokens.mjs)
        ↓
src/styles/tokens.css        (CSS custom properties — consumed by CSS modules)
src/styles/tokens.ts         (TypeScript constants — consumed by JS if needed)
```

### What's In tokens.json

```
color.ink.*          → Neutral grays (ink-50 through ink-900)
color.surface.*      → Background colors (canvas, surface-1/2/3)
color.brand.*        → Teal palette (brand-100 through brand-700)
color.semantic.*     → Success/warning/danger/info (100, 600, 700 tiers)
color.viz.*          → 8 chart colors
color.chart.*        → Grid, axis, line, fill
color.border.*       → Subtle and strong borders
typography.size.*    → 2xs (10px) through 5xl (40px)
typography.weight.*  → regular/medium/semibold/bold
typography.fontFamily.* → sans and mono
spacing.*            → 2px through 80px
radius.*             → 4px through full (999px)
elevation.*          → xs/sm/md/lg shadow values
motion.duration.*    → 100ms through 800ms
motion.easing.*      → standard/emphasized/decel curves
layout.*             → Grid columns, gutters, breakpoints
zIndex.*             → base/dropdown/sticky/overlay/modal/toast
table.*              → Row heights, hover/selected colors
```

### Using Tokens In CSS

```css
/* In any .module.css file */
.myElement {
  color: var(--color-ink-900);
  font-size: var(--typography-size-sm);
  padding: var(--spacing-16);
  border-radius: var(--radius-8);
  transition: background var(--motion-duration-150) var(--motion-easing-standard);
}
```

### Alpha Compositing

Several tokens have `-rgb` variants for use with `rgba()`:

```css
background: rgba(var(--color-brand-500-rgb), 0.08);  /* Brand tint at 8% */
box-shadow: 0 0 0 3px rgba(var(--color-brand-500-rgb), 0.12);  /* Focus ring */
```

Available RGB channels: `ink-900-rgb`, `brand-300-rgb`, `brand-400-rgb`, `brand-500-rgb`, `border-subtle-rgb`, and all `semantic-*-600-rgb`.

---

## The Component Library

All reusable UI primitives live in `src/components/ui/` and are exported from `index.ts`.

### Import Pattern

```tsx
import { Button, Card, CardBody, Badge, Modal, ModalBody, ModalFooter } from "../../components/ui";
```

### Component Quick Reference

#### Button
```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger" loading>Deleting...</Button>
<Button variant="ghost">Skip</Button>
```
Variants: `primary` | `secondary` | `ghost` | `danger`. Sizes: `sm` | `md` | `lg`.

#### Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardBody>Content here</CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Badge
```tsx
<Badge variant="success">Settled</Badge>
<Badge variant="danger">Failed</Badge>
<Badge variant="neutral">Draft</Badge>
```

#### Form Fields
```tsx
<Field label="Email" error={errors.email} helperText="We'll never share your email">
  <Input placeholder="you@example.com" />
</Field>
<Field label="Notes">
  <Textarea rows={4} />
</Field>
<Field label="Currency">
  <Select>
    <option>USD</option>
    <option>EUR</option>
  </Select>
</Field>
```
Always wrap `Input`/`Textarea`/`Select` in `Field` — it handles label linking, `aria-invalid`, `aria-describedby`, and error display automatically.

#### Tabs
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">First</TabsTrigger>
    <TabsTrigger value="tab2">Second</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for first tab</TabsContent>
  <TabsContent value="tab2">Content for second tab</TabsContent>
</Tabs>
```
Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes.

#### Modal
```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onOpenChange={setOpen} title="Confirm Trade">
  <ModalBody>Are you sure?</ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```
Focus is trapped inside. Escape closes. Focus returns to the trigger on close.

#### Drawer
```tsx
<Drawer open={open} onOpenChange={setOpen} title="Trade Details">
  <DrawerBody>...</DrawerBody>
  <DrawerFooter>
    <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
  </DrawerFooter>
</Drawer>
```
Same API as Modal but slides in from the right. Use for detail views and side panels.

#### Toast
```tsx
// In your root layout or providers:
<ToastProvider>{children}</ToastProvider>

// In any component:
const { addToast } = useToast();
addToast({ title: "Trade executed", message: "USDINR at 90.57", variant: "success" });
addToast({ title: "Margin warning", variant: "warning", duration: 6000 });
```

#### Table
```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Pair</TableHeaderCell>
      <TableHeaderCell>Rate</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>USD/INR</TableCell>
      <TableCell>90.57</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Other Components
- `<Skeleton />` — Set width/height via style. Shows shimmer animation during loading.
- `<Tooltip content="Helpful text">Hover me</Tooltip>` — Appears on hover and focus.

---

## The Dashboard Widget System

### How It Works

The dashboard at `/` is a drag-and-drop grid powered by `react-grid-layout`.

```
WidgetGrid (widget-grid.tsx)
  ├── reads layout from localStorage (or default-layouts.ts)
  ├── renders <Responsive> grid with 12 columns
  └── for each widget config:
        <Widget title="...">            ← Container with drag handle
          <Suspense fallback={...}>     ← Shows skeleton while loading
            <LazyWidgetComponent />     ← The actual widget content
          </Suspense>
        </Widget>
```

### Adding a New Widget

1. **Create the component** in `src/components/dashboard/widgets/`:

```tsx
// src/components/dashboard/widgets/my-widget.tsx
import styles from "./my-widget.module.css";

export default function MyWidget() {
  return <div className={styles.body}>Your widget content</div>;
}
```

2. **Register it** in `widget-types.ts` and `widget-registry.ts`:

```tsx
// widget-types.ts — add to the WidgetType union
export type WidgetType = "settlements-tomorrow" | ... | "my-widget";

// widget-registry.ts — add lazy import
"my-widget": lazy(() => import("./widgets/my-widget")),
```

3. **Add to default layout** in `default-layouts.ts`:

```tsx
// DEFAULT_WIDGETS — add config
{ id: "my-widget", type: "my-widget", title: "My Widget", minW: 3, minH: 3 },

// DEFAULT_LAYOUTS — add position
{ i: "my-widget", x: 0, y: 12, w: 6, h: 4, minW: 3, minH: 3 },
```

4. **Bump the version** — increment `DASHBOARD_VERSION` so users get the new default layout:

```tsx
export const DASHBOARD_VERSION = 2;  // was 1
```

### Layout Persistence

- Layout saves to `localStorage["dashboard-layout-{dashboardId}"]`
- Version check: if stored version doesn't match `DASHBOARD_VERSION`, layout resets to defaults
- "Reset layout" button in the toolbar clears localStorage and restores defaults

---

## The Live Rates System

### Architecture

```
currency-pairs.ts         ← Static list of 30 pairs + group definitions
        ↓
mock-data-source.ts       ← Generates random price ticks (~8% chance per pair per 200ms)
        ↓
create-data-source.ts     ← Factory: createDataSource("mock") or ("live")
        ↓
use-live-rates.ts         ← React hook: connects, subscribes, returns { rates, isConnected }
        ↓
rates-page.tsx            ← Filters by market/search/group, passes to RatesTable
        ↓
rates-table.tsx           ← Renders rows with drag-to-reorder
  └── rate-row.tsx         ← Single row: bid/ask with flash animation, OHLC, timestamp
```

### Data Types

```typescript
interface RateTick {
  pairId: string;           // "USDINR-OFF"
  bid: number;              // 90.5700
  ask: number;              // 90.5800
  spread: number;           // 0.0100
  open: number;             // Today's opening price
  high: number;             // Session high
  low: number;              // Session low
  close: number;            // Previous close
  change: number;           // bid - close
  changePct: number;        // Percentage change
  lastUpdated: Date;
  bidDirection: "up" | "down" | "flat";
  askDirection: "up" | "down" | "flat";
}
```

### Connecting Real Data

Replace `MockRateDataSource` with a real WebSocket implementation in `live-data-source.ts`:

```typescript
export class LiveRateDataSource implements RateDataSource {
  private ws: WebSocket | null = null;

  connect() {
    this.ws = new WebSocket("wss://your-api.com/rates");
  }

  subscribe(pairIds: string[], onTick: (snapshot: RateSnapshot) => void) {
    this.ws?.send(JSON.stringify({ action: "subscribe", pairs: pairIds }));
    this.ws?.addEventListener("message", (event) => {
      const snapshot = JSON.parse(event.data);
      onTick(snapshot);
    });
  }

  // ... disconnect, unsubscribe
}
```

Then change the factory:

```typescript
// create-data-source.ts
export function createDataSource(type: "mock" | "live"): RateDataSource {
  return type === "live" ? new LiveRateDataSource() : new MockRateDataSource();
}
```

---

## CSS Modules — How Styling Works

Every component has a co-located `.module.css` file. Classes are locally scoped — no global collisions.

### Pattern

```tsx
// button.tsx
import styles from "./button.module.css";
import { cn } from "./cn";

<button className={cn(styles.button, styles[variant], styles[size], className)}>
```

```css
/* button.module.css */
.button {
  padding: var(--spacing-8) var(--spacing-20);
  font-size: var(--typography-size-md);
  border-radius: var(--radius-8);
  transition: background var(--motion-duration-150) var(--motion-easing-standard);
}

.primary {
  background: var(--color-brand-500);
  color: var(--color-white);
}
```

### The `cn()` Utility

```typescript
cn("base", isActive && "active", className)
// → "base active custom-class" (falsy values filtered out)
```

This is the project's version of `clsx`. Use it everywhere for conditional classes.

### Rules

- All values come from tokens: `var(--color-*)`, `var(--spacing-*)`, `var(--typography-size-*)`, etc.
- No hardcoded hex colors, pixel values, or ms durations
- Every animation gets a `@media (prefers-reduced-motion: reduce)` guard
- Transitions use `var(--motion-duration-*)` and `var(--motion-easing-*)`

---

## Building a New Feature — Checklist

When adding a new feature, here's what to reach for:

1. **Page**: Create `src/app/{route}/page.tsx` + client component
2. **Layout**: Use `<PageHeader>` at the top. Content is already wrapped in `<AppShell>`.
3. **Components**: Import from `../../components/ui` — Button, Card, Tabs, Modal, etc.
4. **Styling**: Create `{component}.module.css` next to your TSX. Use token variables.
5. **Data**: Put business logic in `src/lib/{feature}/`. Use hooks for state management.
6. **Icons**: `import { IconName } from "lucide-react"` — browse at [lucide.dev](https://lucide.dev)
7. **Notifications**: `const { addToast } = useToast()` for success/error feedback
8. **Overlays**: Use `<Modal>` for decisions, `<Drawer>` for detail panels
9. **Loading states**: Use `<Skeleton>` placeholders
10. **Accessibility**: Wrap form inputs in `<Field>`, use semantic HTML, add `aria-label` to icon-only buttons

### What NOT to Do

- Don't install Tailwind or other CSS frameworks — everything is CSS Modules
- Don't hardcode colors or sizes — always use token variables
- Don't skip `<Field>` wrappers on form inputs
- Don't animate `width`/`height`/`top`/`left` — use `transform` and `opacity`
- Don't forget `@media (prefers-reduced-motion: reduce)` on new animations

---

## Key Files to Know

If you only read 10 files, read these:

| File | Why |
|------|-----|
| `src/app/layout.tsx` | Root of the app — fonts, styles, AppShell |
| `tokens/tokens.json` | Every design value lives here |
| `src/components/ui/index.ts` | All available UI components |
| `src/components/layout/app-shell.tsx` | Navigation structure |
| `src/components/dashboard/widget-grid.tsx` | Dashboard grid system |
| `src/components/dashboard/widget-registry.ts` | How widgets are loaded |
| `src/lib/rates/types.ts` | Core data models |
| `src/lib/rates/use-live-rates.ts` | How rate data flows to components |
| `src/app/rates/rates-page.tsx` | Most complex page — good reference |
| `docs/DESIGN_SYSTEM.md` | Visual language, tokens, accessibility |

---

## Related Documentation

- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** — Design principles, color/typography/motion rules, component patterns, accessibility requirements, do's and don'ts
- **[design-tokens.md](./design-tokens.md)** — Token structure and generator details
- **[component-inventory.md](./component-inventory.md)** — Component catalog
- **[ui-spec.md](./ui-spec.md)** — Detailed UI specifications
