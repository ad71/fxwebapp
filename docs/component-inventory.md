# Component Inventory

This inventory defines the UI building blocks for the FX web app, aligned to the calm, cohesive UX shown in the reference screenshots while remaining original.

---

## Library Versions (Pinned)
All versions are the latest stable releases found via web search.

- Framework: Next.js 16.1.4
- UI runtime: React 19.2.4, React DOM 19.2.4
- Language: TypeScript 5.9.0
- Styling: Tailwind CSS 4.1.13
- Primitives: Radix UI 1.2.1 (@radix-ui/react-dialog)
- Data fetching: @tanstack/react-query 5.87.1
- Table engine: @tanstack/react-table 8.21.3
- Enterprise grid (heavy tables): AG Grid 35.0.0 (ag-grid-react/ag-grid-community)
- Charts: Apache ECharts 6.0.0; TradingView Lightweight Charts 5.0.8
- Dashboard grid: react-grid-layout 1.5.1
- Forms: react-hook-form 7.62.0 + zod 4.0.14
- State: zustand 4.3.4
- Date utilities: date-fns 4.1.0
- Icons: lucide-react 0.542.0
- Motion: framer-motion 12.23.12

---

## Foundations

### AppShell
Purpose
- Global layout with top bar, left nav, and content area.

Structure
- Top bar: search, notifications, org selector, profile.
- Left nav: primary routes, collapsible.
- Content header: title, subtitle, actions, filters.

Variants
- Default, Compact (narrow), Full-bleed (charts only).

### PageHeader
Purpose
- Set context per screen.

Variants
- Title only
- Title + subtitle + action
- Title + filter strip

States
- Loading (skeleton lines)

### Surface
Purpose
- Consistent card and panel surfaces.

Variants
- Surface-1 (primary card), Surface-2 (secondary), Surface-3 (panel)

---

## Navigation

### SideNav
- Icons + label
- Active state: pill + accent line
- Collapsible with tooltips

### Tabs
- Segment-style tabs (equal height)
- Supports badge counts

### Breadcrumbs
- Used on detail screens only

### CommandPalette
- Global search with sections: pairs, positions, rules

---

## Data Display

### DataTable (Standard)
- Virtualized rows, sticky header
- Column pinning + hide/show
- Row hover and selection

Variants
- Dense (32px row), Regular (40px), Spacious (48px)

### DataGrid (Heavy)
- AG Grid wrapper with server-side pagination
- Used for large position sets

### MetricCard
- Title, value, delta, timestamp

### StatusPill
- Status: ok, stale, error, warning
- Small and non-intrusive

### Banner
- Inline alert with optional CTA
- Used for stale data or missing configs

### EmptyState
- Icon, short title, one CTA

### Tooltip
- Used for rate metadata and column hints

---

## Charts

### LineChart
- For historical FX and moving average
- Muted fill, single accent line

### Sparkline
- Embedded in tables

### CurveChart
- Forward curve and pillar plot

### CalendarHeat
- Forward calendar view with day tiles

---

## Data Entry

### TextInput
### NumericInput
- Built-in formatting for rates/amounts

### CurrencyInput
- Currency prefix + precision lock

### DatePicker
- Single date + range (for historical)

### Select
- Searchable, async options

### SegmentedControl
- For toggles like Manual vs Auto

### Switch
- Auto-refresh, show blended rate

### Slider
- Optional for window size or threshold

---

## Rules & Expressions

### ExpressionBuilder
- Field selector + operator + value
- Produces raw expression string

### ExpressionPreview
- Monospace read-only pane

### RuleCard
- Name, expression, last updated, status

---

## Overlays

### Modal
- Confirmations and advanced editing
- Sizes: S, M, L

### Drawer
- Right side details for pair/position

### Toast
- Low‑priority feedback

---

## Dashboard Widgets

### WidgetShell
- Title + settings menu + refresh

### WidgetGrid
- Drag/resize

### Widget Library
- Rates Watchlist
- Forward Highlights
- Positions Summary
- Rule Alerts
- System Health

---

## Utilities

### KeyValueList
- Used for rates metadata and summaries

### TagList
- For tenors and categories

### CopyField
- Copyable values (pair, IDs)

### Timestamp
- Localized format with relative hover

---

## States & Feedback

### Loading
- Skeletons at card and table levels

### Error
- Inline banner + retry

### Stale Data
- Timestamp warning + refresh button

### Offline
- Global banner with reconnect action

---

## Accessibility

- All interactive elements keyboard navigable.
- Focus rings visible and high contrast.
- Table rows are selectable with ARIA roles.
- Charts have accessible summaries.

---

## Usage Mapping

- Markets: DataTable + Sparkline + Drawer
- Forwards: CurveChart + DataTable + CalendarHeat
- Positions: DataGrid + ColumnBuilder
- Rules: ExpressionBuilder + RuleCard
- Health: MetricCard + StatusPill
