# CosmoLab — AI Transformation Platform for Cosmetic Manufacturers

## Project Overview
CosmoLab is a white-label, AI-powered platform for cosmetic and personal care contract manufacturers. Phase 1 delivers tailored discovery sessions and document generation per internal team. Phase 1.5 expands this into a full operational and strategic transformation platform — assessing cross-team workflows, identifying automation opportunities, and driving efficiency across commercial, digital, regulatory, and strategic functions.

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Claude API (`claude-sonnet-4-6`) via `@anthropic-ai/sdk`
- `docx` for Word document generation (client-side)
- pnpm as package manager

## Running Locally
```bash
pnpm dev            # Phase 1.5 — full transformation platform (default)
pnpm dev:phase1     # Phase 1 only — safe demo / rollback mode
pnpm dev:phase15    # Phase 1.5 — explicit
# Open http://localhost:3000
```

## Phase Feature Flags
Phase is controlled by `NEXT_PUBLIC_PHASE` in `.env.local` (or inline with the scripts above).
- `1`   → Discovery sessions + document generation only (stable, client-demo safe)
- `1.5` → Full transformation platform — all Phase 1.5 features enabled

Feature flags live in `src/lib/phase.ts`. All Phase 1.5 UI components check `features.<flag>` before rendering — Phase 1 users never see work-in-progress features.

## Key Files
- `src/lib/phase.ts` — Phase feature flags (`NEXT_PUBLIC_PHASE` → `features.*`)
- `src/lib/teams.ts` — Team and product category definitions
- `src/lib/prompts.ts` — System prompts per team/category + document generation prompt
- `src/lib/demoConversations.ts` — Pre-built conversations for Quick Test mode
- `src/lib/docBuilder.ts` — Word (.docx) document builder
- `src/app/page.tsx` — Landing page (team + category selector)
- `src/app/session/page.tsx` — Chat session + document generation UI
- `src/app/api/chat/route.ts` — Streaming chat API
- `src/app/api/generate-docs/route.ts` — Document generation API

## Teams
Sales, R&D / Formulation, Manufacturing, Engineering, Demand Planning, Quality / QA-QC

## Product Categories
Skincare, Haircare, OTC Drug (FDA regulated), Supplements (DSHEA regulated)

## Phase Status
- **Phase 1** ✅ Complete — Core session flow, AI conversation, document generation, Word download
- **Phase 1.5** 🔄 In Progress — Transformation platform (see `docs/phase-1.5-spec.md`)
- **Phase 2** Pending — Multi-tenancy, white-label subdomain routing, per-tenant branding, admin dashboard
- **Phase 3** Pending — Billing (Stripe), usage analytics, custom question sets per tenant

## Phase Rationale
| Phase | Purpose |
|-------|---------|
| 1 | Can CosmoLab run a discovery session? |
| 1.5 | Can CosmoLab transform how a CM operates? |
| 2 | Can we sell this to many CMs at scale? |
| 3 | Can we monetize at scale? |

## Environment
Requires `ANTHROPIC_API_KEY` in `.env.local`.
