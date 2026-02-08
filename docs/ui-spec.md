# FX Web App UI Spec (Screen-by-Screen)

Scope
- This spec covers only functionality already present in the current backend repos: fxratetracker, position_server, rule_engine, and orchestrator metadata usage.
- It does not include new products (payments, wallets, booking flows) beyond what the backend exposes.

Design language goals (inspired by the screenshots, not copied)
- Calm surfaces, soft elevation, and consistent rounded corners.
- Sparse, confident typography with clear hierarchy and generous spacing.
- Subtle accent color used only for primary actions, status, and focus.
- Neutral background with layered cards; minimal borders; micro-shadows.
- Clear empty states and inline alerts rather than modal interruptions.

Global app structure
- Top bar: product switcher, global search, notifications, profile menu.
- Primary nav (left): Dashboard, Markets, Forwards, Positions, Rules, Notifications, Metadata, Health.
- Secondary nav (top tabs within sections): list/detail/modes.
- Widget system: drag, drop, resize; user layouts saved per role and device width.

Data conventions (front-end)
- All prices and rates show currency + precision; last-updated timestamps shown in local time.
- Tables are virtualized and stream-friendly.
- Every view supports a compact "Data freshness" chip (fresh, stale, failed).

---

Screen 0: App Shell
Purpose
- Provide consistent navigation, search, and user context.

Layout
- Top bar (fixed): search, notifications, user/org menu.
- Left rail: icon + label nav (collapsible).
- Content area: page header (title, primary action, context filters).

Components
- Global search (Cmd+K) with entity shortcuts: currency pairs, positions, rules, filters.
- Notification bell (opens Notifications Center panel).
- Org/account selector.

States
- Loading: skeleton top bar + blurred content.
- Offline: global banner with reconnect action.

---

Screen 1: Dashboard (Overview)
Purpose
- High-level status across rates, forwards, positions, and rules.

Layout
- Grid of widgets (drag/resize enabled).

Default widgets
- "Rates Watchlist" (latest FX rates table).
- "Forward Highlights" (latest broken-date result + pillar snapshot).
- "Positions Summary" (count, exposures by currency).
- "Rule Alerts" (recent rule failures, if any).
- "System Health" (services up, cache status).

Interactions
- Edit layout mode with grid overlay.
- Widget menu: refresh, configure, remove.

Data sources
- fxratetracker: /fetch_latest_fx_rates
- fxratetracker: /forward/pillar_dates/auto (sample pair)
- position_server: /positions
- rule_engine: internal status (exposed via health panel)

Empty states
- No positions: CTA to upload positions.
- No rules: CTA to create a rule.

---

Screen 2: Markets (Latest FX Rates)
Purpose
- Live table of current rates with quick filtering.

Layout
- Header with base currency selector and refresh toggle.
- Full-width table with sticky header.

Table columns
- Currency Pair
- Bid
- Ask
- Spread
- 24h Change
- Range
- Last Updated

Controls
- Base currency dropdown (default USD).
- Watchlist toggles.
- Auto-refresh toggle (with interval).

Data sources
- fxratetracker: /fetch_latest_fx_rates?base_currency=XXX

States
- If local file mode: show "Local data" chip.
- Error: inline banner with retry.

---

Screen 3: Rates Explorer (Historical + Moving Avg)
Purpose
- Explore historical FX rates and computed moving averages.

Layout
- Split view: left controls, right chart + data table.

Controls
- Currency selector, date picker, window size.

Widgets
- Line chart (historical).
- Moving average summary card.
- Data table (date, rate).

Data sources
- fxratetracker: /fetch_hist_fx_rates?base_currency=XXX&date=YYYY-MM-DD
- fxratetracker: /get_fxrate_moving_avg?currency=XXX&end_date=YYYY-MM-DD&window_size=N

---

Screen 4: Interest Rates & Cache
Purpose
- View and manage interest-rate curves used for forward pricing.

Layout
- Two-column: left list of currencies, right curve detail.

Controls
- Currency list (supported + cached state).
- Refresh toggle (force refresh).
- Clear cache (single or all).

Detail panel
- Tenor table (ON, 1M, 3M, 6M, 1Y...)
- Source + fetched_at

Data sources
- fxratetracker: GET /rates
- fxratetracker: GET /rates/{currency}?refresh=bool
- fxratetracker: POST /rates/{currency} (manual override)
- fxratetracker: DELETE /rates/{currency}
- fxratetracker: DELETE /rates

---

Screen 5: Forward Pricing (Broken Date)
Purpose
- Compute a forward rate for a non-standard maturity.

Layout
- Form on left, results on right.

Inputs
- Pair, target date, spot price
- Rate mode: manual vs auto
- Business day convention

Outputs
- Forward rate
- Forward points
- Discount factors
- Days to settlement
- Rates metadata (if auto)

Data sources
- fxratetracker: POST /forward/broken_date
- fxratetracker: POST /forward/broken_date/auto

---

Screen 6: Forward Pricing (Pillar Dates)
Purpose
- Compute standard tenor forward rates.

Layout
- Inputs on top, results grid below.

Inputs
- Pair, spot price
- Tenor list selector
- Rate mode: manual vs auto

Outputs
- Table of tenor -> forward rate, points, target date
- Rates metadata (if auto)

Data sources
- fxratetracker: POST /forward/pillar_dates
- fxratetracker: POST /forward/pillar_dates/auto

---

Screen 7: Forward Calendar
Purpose
- Visualize forward rates by month-end and exact date.

Layout
- Calendar grid with month tabs + list view toggle.

Interactions
- Hover shows quick rate tooltip.
- Click date opens side panel with detailed pricing (calls broken_date auto).

Data sources
- fxratetracker: /forward/broken_date/auto
- fxratetracker: /forward/pillar_dates/auto

---

Screen 8: Positions (Flat View Grid)
Purpose
- List all positions with computed metadata columns.

Layout
- Table with column builder.

Controls
- Account filter
- Column group selector (DB/API/formula/user-defined)

Data sources
- position_server: GET /positions
- position_server: GET /positions/{account_num}

States
- Stale data banner if refresh thread paused.

---

Screen 9: Position Detail
Purpose
- Inspect a single position’s evaluated flat view.

Layout
- Summary card (ID, account, security)
- Attributes grouped by type
- "Derived" section for formula outputs

Data sources
- position_server: GET /positions/{account_num} (filter by id on client)

---

Screen 10: Upload Positions
Purpose
- Add new positions in batch.

Layout
- Upload panel (JSON/CSV) with preview table.
- Validation errors in a side panel.

Data sources
- position_server: POST /positions/upload_positions

---

Screen 11: Update Positions
Purpose
- Update existing positions in batch.

Layout
- Similar to upload screen with diff preview.

Data sources
- position_server: PUT /positions/update_positions

---

Screen 12: Add Security
Purpose
- Add security information to the security server.

Layout
- Form with symbol, name, and attributes from metadata.

Data sources
- position_server: PUT /security/add_security

---

Screen 13: User-Defined Fields
Purpose
- Add or update user-defined fields for positions.

Layout
- Position selector + field editor.
- Batch update list.

Data sources
- position_server: PUT /positions/add_user_defined_fields

---

Screen 14: Rules Library
Purpose
- View all rules and creation status.

Layout
- Table list with rule name, expression, status, last updated.
- Action buttons: Create, Validate (client-side), Refresh.

Data sources
- rule_engine: POST /rules/create_rule
- rule_engine: read-all via rule_engine_core (backend may need list endpoint; for now display local cache + create results)

Note
- If list API is missing, UI will show rules created during this session and indicate backend limitation.

---

Screen 15: Rule Builder
Purpose
- Create rule expressions from filters and fields.

Layout
- Left: expression builder (field/operator/value).
- Right: raw expression + validation preview.

Data sources
- rule_engine: POST /rules/create_rule

---

Screen 16: Filters Library
Purpose
- View all filters and creation status.

Layout
- Table list with filter name, expression, status.

Data sources
- rule_engine: POST /filters/create_filter

Note
- Same list API caveat as rules library.

---

Screen 17: Filter Builder
Purpose
- Create filter expressions from metadata fields.

Layout
- Same builder as rule screen but filter only.

Data sources
- rule_engine: POST /filters/create_filter

---

Screen 18: Rule Evaluation Monitor
Purpose
- Show evaluations and triggered notifications.

Layout
- Timeline table with rule, position id, evaluation result, timestamp.
- Status filter (violations only / all).

Data sources
- rule_engine: notification system (file dump/email)

Note
- Requires backend exposure for notification events. If not present, show guidance to configure NOTIFICATION_FILE_PATH and parse server-side.

---

Screen 19: Notifications Center
Purpose
- View and configure notification settings.

Layout
- Notification log list + config panel.

Config
- Notification type (file_dump/email)
- SMTP settings (if email)

Data sources
- rule_engine: env-based (no direct API today). UI can be a config stub with status text until API exists.

---

Screen 20: Metadata Manager
Purpose
- View and edit metadata store JSON used by position_server and rule_engine.

Layout
- JSON editor + field table view.
- Validation preview.

Data sources
- metadata_store.json (mounted volume); UI writes to backend endpoint if added. For now, read-only in web app with "edit locally" guidance.

---

Screen 21: System Health
Purpose
- Service health overview.

Layout
- Cards for fxratetracker, position_server, rule_engine, postgres.

Data sources
- /health endpoints from each service

---

Widget inventory (for dashboard builder)
- Rates Watchlist
- Forward Highlights
- Pillar Ladder
- Positions Summary
- Rule Alerts
- Notification Feed
- Service Health

Keyboard shortcuts
- Cmd+K: search
- g m: Markets
- g f: Forwards
- g p: Positions
- g r: Rules

Non-functional requirements
- Real-time updates with throttled rendering (1000ms coalescing for tables).
- Large tables are virtualized and support sticky headers.
- All screens must render well at 1280px and 1440px widths; responsive down to 1024px.
