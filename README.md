# Balli FX

A foreign exchange dashboard and live rates platform built with Next.js 16, React 19, and TypeScript.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
```

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5.9**
- **CSS Modules** with a token-driven design system (`tokens/tokens.json` → generated CSS variables)
- **react-grid-layout** for the draggable dashboard widget grid
- **lucide-react** for icons
- **Sora** + **Space Grotesk** fonts

## Pages

| Route             | Description                                          |
|-------------------|------------------------------------------------------|
| `/`               | Dashboard — 8 draggable widgets (settlements, balances, trades, VaR, etc.) |
| `/rates`          | Live FX rates table — 30 currency pairs, search, filters, OHLC, drag-to-reorder |
| `/components`     | UI component showcase (dev reference)                |
| `/preview/tokens` | Design token color gallery                           |

## Project Structure

```
tokens/tokens.json              ← Design token source of truth
scripts/generate-tokens.mjs     ← Token → CSS/TS generator
src/
  app/                          ← Pages (App Router file-system routing)
  components/
    ui/                         ← Reusable component library (Button, Card, Modal, etc.)
    layout/                     ← AppShell (top nav), PageHeader
    dashboard/                  ← Widget grid system + 8 widget implementations
    rates/                      ← Rates table, rate rows, search/filter
  lib/rates/                    ← Rate data types, mock data source, live rates hook
  styles/                       ← Generated tokens.css + tokens.ts
docs/                           ← Design system docs, onboarding guide
```

## Design Token System

All visual values (colors, typography, spacing, motion, elevation) are defined in `tokens/tokens.json` and consumed as CSS custom properties:

```bash
# After editing tokens.json:
npm run tokens:build
```

This regenerates `src/styles/tokens.css` (CSS variables) and `src/styles/tokens.ts` (TypeScript constants).

```css
/* Usage in CSS modules */
color: var(--color-ink-900);
font-size: var(--typography-size-sm);
padding: var(--spacing-16);
border-radius: var(--radius-8);
```

## UI Component Library

All components are in `src/components/ui/` and exported from `index.ts`:

**Interactive**: Button, Modal, Drawer, Tabs, Toast (via `useToast` hook)
**Data Display**: Table, Badge, Tooltip, Skeleton
**Form**: Field, Input, Textarea, Select
**Layout**: Card (with Header/Title/Body/Footer sub-components)

```tsx
import { Button, Card, CardBody, Modal, Badge } from "../components/ui";
```

## Dashboard Widgets

The dashboard uses `react-grid-layout` for a draggable, resizable widget grid. Layout persists to localStorage.

To add a new widget:
1. Create component in `src/components/dashboard/widgets/`
2. Register in `widget-registry.ts` and `widget-types.ts`
3. Add to `default-layouts.ts`
4. Bump `DASHBOARD_VERSION`

## Live Rates

The rates system uses a pluggable data source pattern:

```
RateDataSource (interface)
  ├── MockRateDataSource    ← Random ticks for development
  └── LiveRateDataSource    ← Placeholder for WebSocket integration
```

The `useLiveRates(pairIds)` hook connects to the data source and returns `{ rates, isConnected }`.

## Scripts

```bash
npm run dev            # Development server
npm run build          # Production build
npm run tokens:build   # Regenerate design tokens
npm run tokens:check   # Validate token structure
```

## Documentation

- **[docs/ONBOARDING.md](docs/ONBOARDING.md)** — Full developer onboarding guide (start here)
- **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** — Design language, token usage, component patterns, accessibility
- **[docs/design-tokens.md](docs/design-tokens.md)** — Token reference
- **[docs/component-inventory.md](docs/component-inventory.md)** — Component catalog
