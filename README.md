# coin-gate

Coin Gate is a crypto market dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS. It combines server-rendered market data from CoinGecko with live websocket updates, interactive candlestick charts, coin detail pages, converter tools, category and trending views, and a keyboard-friendly search modal.

## What this project does

The app gives users a compact way to explore the crypto market:

- Home page with featured coin overview, trending coins, and top categories
- Coins listing page with pagination and market stats
- Dynamic coin detail pages with chart data, live price updates, recent trades, and conversion tools
- Search modal with `Cmd+K` / `Ctrl+K` support for quick navigation between coins
- Reusable data table patterns and loading fallbacks for a smoother UI

## Why this build is strong

This project works well as a portfolio piece because it shows both frontend product work and real-world data integration:

- Uses modern App Router patterns in Next.js 16
- Blends server components, client components, route handlers, and streamed UI
- Handles external API quirks from CoinGecko, including demo/pro differences and historical data limits
- Combines REST data fetching with websocket-driven live updates
- Includes responsive UI patterns, modal search, charts, tables, and keyboard interactions
- Shows practical TypeScript usage across API responses, shared UI props, and stateful client logic

## Tech stack

- Next.js 16.2.4
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- Base UI React primitives
- lightweight-charts
- CoinGecko REST API
- CoinGecko websocket stream
- Bun

## Architecture notes

### Server-side data layer

The project uses a shared `fetcher` in `lib/coinGecko.action.ts` to talk to CoinGecko. It:

- normalizes API URLs
- switches between demo and pro header formats
- retries demo-key requests against the correct base URL
- falls back from unsupported OHLC `max` history to `365` days for demo usage

### Live market features

`hooks/useCoinGeckoWebSocket.ts` subscribes to CoinGecko stream channels for:

- live price changes
- recent on-chain trades
- OHLCV updates for active coin charts

### UI patterns

The app mixes:

- server-rendered pages for initial market data
- client-side interactive charts and live updates
- reusable tables for categories, trending assets, trades, and coin listings
- modal search with keyboard navigation

## Key features

### 1. Market dashboard

The home page highlights:

- Bitcoin overview with candlestick chart
- trending tokens
- top crypto categories

### 2. Coin explorer

The `/coins` route lists coins with:

- market cap rank
- token info
- price
- 24h change
- market cap
- pagination

### 3. Coin detail experience

Each `/coins/[id]` page includes:

- live price card
- chart period switching
- recent trade feed
- converter
- key project and market metadata

### 4. Search modal

The search modal supports:

- opening by click, `Cmd+K`, or `Ctrl+K`
- trending defaults when empty
- live CoinGecko search by name or symbol
- keyboard up/down navigation
- Enter to open selected result

## Environment variables

Create `.env.local` with:

```env
COIN_GECKO_API_KEY=your_key_here
NEXT_PUBLIC_COIN_GECKO_API_KEY=your_key_here
COIN_GECKO_API_URL=https://pro-api.coingecko.com/api/v3
NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL=wss://stream.coingecko.com/v1
```

### Important note

If you are using a CoinGecko Demo key, CoinGecko expects the demo REST base URL. The app contains fallback handling for demo/pro mismatch, but the clean setup is still to use the correct API plan and endpoint combination.

## Local development

Run the app with Bun:

```bash
bun dev
```

Open:

```txt
http://localhost:3000
```

Other useful commands:

```bash
bunx tsc --noEmit
bun run fmt
bun run fmt:check
```

## Project structure

```txt
app/
  api/search/route.ts
  coins/
  page.tsx
components/
  home/
  ui/
  SearchModal.tsx
  CandleStrickChart.tsx
  Converter.tsx
  LiveDataWrapper.tsx
hooks/
  useCoinGeckoWebSocket.ts
lib/
  coinGecko.action.ts
  utils.ts
```

## Portfolio-ready project summary prompt

Use the block below as a prompt for another AI that needs to turn this project into portfolio content:

```txt
Write a polished portfolio project entry for a project called "Coin Gate".

Project summary:
Coin Gate is a crypto market dashboard built with Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Base UI primitives, and lightweight-charts. It integrates CoinGecko REST APIs and CoinGecko websocket streams to deliver both server-rendered market data and live client-side updates.

Main features:
- home dashboard with featured coin overview, trending assets, and top categories
- paginated coins listing page
- dynamic coin detail pages with live pricing, recent trades, OHLC charting, and coin conversion
- command-style search modal with keyboard shortcut support and arrow-key navigation
- reusable data tables and responsive UI patterns

Technical highlights:
- built with Next.js App Router
- mixes server components, client components, route handlers, and live websocket subscriptions
- includes a shared CoinGecko fetch layer that handles demo/pro API differences and OHLC history fallbacks
- uses TypeScript across API models, UI props, and client state
- includes interactive charting with lightweight-charts

Why this project is strong:
- demonstrates real-world API integration and error handling
- combines static and live market data in one product
- shows frontend engineering, data modeling, UI composition, keyboard interactions, and state management
- good example of building a production-style fintech/market dashboard

Write the portfolio entry in a concise, credible tone. Include:
1. a 2-3 sentence overview
2. a short bullet list of key features
3. a short bullet list of technologies used
4. a short paragraph on what makes the implementation technically strong
```

## Notes

- The search route lives at `app/api/search/route.ts`
- The modal search UI lives at `components/SearchModal.tsx`
- Live pricing behavior is powered by `hooks/useCoinGeckoWebSocket.ts`
