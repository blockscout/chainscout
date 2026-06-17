# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Chainscout is a Next.js web app that serves as a discovery explorer for Blockscout instances — users can search and filter blockchain networks and projects that use Blockscout as their block explorer. It is essentially a static-data-driven SPA: all chain data lives in `data/chains.json` and there is no database.

## Commands

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint (next/core-web-vitals)
npm start        # Run production build
```

There are no automated tests. Validation is done via GitHub Actions and a standalone script:

```bash
cd scripts && npm install && npm run validate   # Validates all explorer URLs in chains.json
```

## Architecture

### Data Flow

All chain data is read from `data/chains.json` at request time via `fs.readFile` in API routes — there is no database or external data source. The main page (`app/page.tsx`) is a `'use client'` component that fetches from `/api/chains` and `/api/featured` on mount, then performs all filtering and sorting in-memory using `useMemo`.

### API Routes (`app/api/`)

- `GET /api/chains` — returns full `chains.json`; accepts `?chain_ids=1,10,8453` to filter by ID
- `GET /api/chains/[id]` — returns a single chain entry
- `GET /api/chains/list` — returns a slim `[{name, chainid}]` array
- `GET /api/featured` — returns the array of featured chain IDs from `data/featured.json`

### Client-Side State (`app/page.tsx`)

The home page manages: `searchTerm`, `filters` (hosting, networkTypes, ecosystems), `sortOption` (Featured | Alphabetical), `viewMode` (list | table), and the raw `chainsData`/`featuredChains`. Filtering runs through `useMemo` on every state change — no server round-trips for search/filter.

Search matches against name, chainId, and description. Hosting filter checks `explorers[0].hostedBy`. Network type filter maps to `l1`/`l2`/`l3` (via `layer` field) and `testnet`/`mainnet` (via `isTestnet`).

### Key Types (`types/index.ts`, `utils/constants.ts`)

```ts
type ChainData = {
  name: string; description: string;
  ecosystem: string | string[];   // can be either
  isTestnet: boolean | undefined;
  layer: 1 | 2 | 3;
  rollupType: RollupType | undefined;  // 'optimistic' | 'zk'
  website: string; explorers: Explorer[]; logo: string;
}
type Explorer = { url: string; hostedBy: HostingProvider; }
// HostingProvider: 'blockscout' | 'conduit' | 'gelato-raas' | 'altlayer-raas' | 'protofire' | 'gateway' | 'self' | 'alchemy' | 'caldera'
```

### SVG Icons

SVGs in `icons/` are imported as React components via `@svgr/webpack` (configured in `next.config.mjs`). Import them like: `import MyIcon from '@/icons/my-icon.svg'`.

## Data Conventions (`data/chains.json`)

The file is keyed by chain ID (string). When adding or editing chain entries:

- `ecosystem` may be a single string or an array of strings — both are valid, handle both in any code that reads it
- `explorers` is always an array; the first entry (`explorers[0]`) is treated as the primary explorer for hosting filter purposes
- `rollupType` is `null` (not `undefined`) in JSON when absent — API routes return raw JSON so callers see `null`
- `logo` should be a URL to an SVG on the Blockscout S3 bucket (`https://blockscout-icons.s3.us-east-1.amazonaws.com/`)
- `featured.json` is a flat array of chain ID strings controlling sort prominence

## CI Workflows (`.github/workflows/`)

PRs to `main` trigger:
- `validate-chains-json.yml` — syntax-checks `chains.json` with `jq`
- `validate-chain-urls.yml` — runs the scripts/validateChainUrls.mts script
- `validate-image-build.yml` — builds the Docker image

Pushes to `main` trigger `build-and-deploy.yml`, which builds and pushes `ghcr.io/blockscout/chainscout:latest`.
