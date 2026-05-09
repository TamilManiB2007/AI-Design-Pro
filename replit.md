# SENTINEL-G

A Next-Gen Pro Max enterprise mule fraud detection platform — the superior alternative to MuleHunter.AI. Built with "Stone & Rust" branding, all 24 detection features, and a 3-column forensic command center.

## Run & Operate

- `pnpm --filter @workspace/sentinel-g run dev` — run the SENTINEL-G frontend (port 19264)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite (frontend, no backend required — all synthetic data)
- Tailwind CSS with Stone & Rust custom theme
- Lucide-react for all icons
- Wouter for client-side routing
- Framer Motion + CSS animations for typewriter / live feed effects

## Where things live

- `artifacts/sentinel-g/src/App.tsx` — root app, page state, Zero-PII toggle, STR button
- `artifacts/sentinel-g/src/components/Navigation.tsx` — persistent header
- `artifacts/sentinel-g/src/pages/LandingPage.tsx` — hero, moat cards, 24-feature showcase
- `artifacts/sentinel-g/src/pages/Dashboard.tsx` — 3-column command center with all 24 features
- `artifacts/sentinel-g/src/pages/Documentation.tsx` — rule engine docs + regulatory alignment table
- `artifacts/sentinel-g/src/pages/Team.tsx` — team profiles + Merkle verification utility
- `artifacts/sentinel-g/src/index.css` — Stone & Rust CSS custom properties theme

## Architecture decisions

- Single-page React app with React useState navigation (no URL routing needed for page switching)
- All data is synthetic — no backend required, realistic fake arrays hardcoded in components
- Zero-PII is global state in App.tsx, passed down to Dashboard which masks account names
- Merkle ledger uses SHA-256 style hash strings for visual authenticity
- Typewriter animation in AI Forensic Explainer uses useEffect + setTimeout character-by-character streaming

## Product

SENTINEL-G is a multi-page enterprise fraud detection command center:
- **Page A (Landing)**: Hero, MuleHunter.AI gap analysis (5 moat cards), 24-feature engine showcase
- **Page B (Dashboard)**: 3-column command center — Six Detectors, Weighted Risk, PAMRS, Dynamic Thresholds, Emergency Override | Transaction Table, Circular Flow Graph, NLP Analyst, Merkle Ledger | AI Forensic Explainer, Alert Surface, Maker-Checker, STR Queue, Jurisdictional Mapping
- **Page C (Documentation)**: Rule engine docs, regulatory alignment table (FIU-IND/FATF/FinCEN/Basel)
- **Page D (Team)**: Team profiles, Merkle verification utility

## User preferences

- "Stone & Rust" enterprise aesthetic — stone-50 bg, #C2410C rust-orange accent, charcoal text, sage green secondary
- No blue or slate colors anywhere
- 24 features must all be visually represented
- Data-dense, enterprise-grade, classified-operations-room feel

## Gotchas

- No DATABASE_URL needed — this is a frontend-only app with synthetic data
- The Emergency Override button has a 2-step confirmation flow — first click shows confirm dialog
- Typewriter animation auto-starts when a transaction row is clicked in the Dashboard
