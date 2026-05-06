# Coin Gate

Coin Gate is a crypto market dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. It combines server-rendered CoinGecko data, live websocket updates, candlestick charts, searchable market views, and reusable UI primitives built on Base UI.

## Highlights

- Home dashboard with Bitcoin overview, trending coins, and top categories
- `/coins` market table with pagination and route-pending feedback
- `/coins/[id]` detail page with live price updates, recent trades, and converter
- Keyboard-first search modal with `Cmd+K` / `Ctrl+K`
- Reusable chart, table, dialog, select, and pagination primitives
- Reusable pending-navigation overlays that keep content visible while blocking interaction

## Stack

- Next.js `16.2.4`
- React `19.2.4`
- TypeScript `5`
- Tailwind CSS `4`
- `@base-ui/react`
- `lightweight-charts`
- `next-themes`
- CoinGecko REST API
- CoinGecko websocket stream

## Project Structure

```txt
app/
  api/search/route.ts
  coins/
    [id]/page.tsx
    page.tsx
  globals.css
  layout.tsx
  page.tsx

api/
  coinGecko.api.ts

components/
  home/
  navigation/
  search/
  ui/
  CandleStickChart.tsx
  CoinHeader.tsx
  CoinPagination.tsx
  Converter.tsx
  DataTable.tsx
  Header.tsx
  LiveDataWrapper.tsx
  SearchModal.tsx
  ThemeProvider.tsx
  ThemeToggle.tsx

hooks/
  useCandlestickChart.ts
  useCandlestickData.ts
  useCandlestickSeries.ts
  useCoinGeckoWebSocket.ts
  useCoinTableColumn.tsx
  useDebouncedValue.ts
  useNavigationPending.ts
  useSearchHotkey.ts
  useSearchModal.ts
  useSearchNavigation.ts
  useSearchResults.ts

utils/
  candlestick.ts
  coinDetailList.ts
  utils.ts
```

## Architecture

### Data layer

[`api/coinGecko.api.ts`](./api/coinGecko.api.ts) centralizes REST access to CoinGecko.

It currently handles:

- URL normalization
- demo vs pro API key header selection
- retrying demo keys against the demo REST base URL
- fallback from unsupported OHLC `days=max` requests to `365`

### Live updates

[`hooks/useCoinGeckoWebSocket.ts`](./hooks/useCoinGeckoWebSocket.ts) subscribes to:

- live price updates
- on-chain trades
- live OHLCV data for chart refreshes

### UI composition

Recent refactors split large files into smaller pieces:

- candlestick chart state, chart setup, and series sync live in separate hooks
- search modal logic is split into focused hooks
- `dialog`, `pagination`, `select`, and `table` expose compound APIs
- pending-navigation feedback is reusable across links, tables, and modal result lists

## Reusable UX Patterns

### Pending navigation overlays

When a route transition is slow, users now get immediate feedback instead of dead clicks.

Shared pieces:

- [`hooks/useNavigationPending.ts`](./hooks/useNavigationPending.ts)
- [`components/ui/loading-overlay.tsx`](./components/ui/loading-overlay.tsx)
- [`components/navigation/PendingNavigationBoundary.tsx`](./components/navigation/PendingNavigationBoundary.tsx)
- [`components/navigation/PendingNavigationLink.tsx`](./components/navigation/PendingNavigationLink.tsx)

Current usage:

- trending coins table
- search modal result list
- all coins table links
- all coins pagination

## Environment Variables

Create `.env.local`:

```env
COIN_GECKO_API_KEY=your_key_here
COIN_GECKO_API_URL=https://pro-api.coingecko.com/api/v3
NEXT_PUBLIC_COINGECKO_API_KEY=your_key_here
NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL=wss://stream.coingecko.com/v1
```

Notes:

- `COIN_GECKO_API_URL` can point to CoinGecko Pro.
- If you use a demo key with the pro base URL, the fetch layer retries against the demo REST endpoint automatically.

## Local Development

Install dependencies, then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run build
npm run fmt
npm run fmt:check
./node_modules/.bin/tsc --noEmit
```

## Current Feature Map

### Home

- Bitcoin overview card
- historical candlestick chart
- trending coins table
- top categories table

### All Coins

- paginated market table
- market cap, price, and 24h change view
- pending loader overlay during row navigation and pagination

### Coin Details

- live websocket price refresh
- live trade table
- live chart updates
- converter
- project metadata and external links

### Search

- open by click or keyboard shortcut
- trending defaults when query is empty
- debounced search requests
- keyboard navigation with Enter-to-open
- pending loader during route transition
