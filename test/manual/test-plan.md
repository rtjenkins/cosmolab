# CosmoLab Manual Test Plan

## Overview
This plan covers end-to-end manual testing of the CosmoLab AI platform across three
test combos. Each combo exercises a different module of the app: Discovery (Phase 1),
Cross-Team Workflow Assessment (Phase 1.5), and IT & Digital Transformation Assessment
(Phase 1.5).

**Why manual tests?** The IT Assessment generate endpoint requires ~70–90 seconds of
AI generation time, which exceeds the 60-second Vercel Hobby plan limit. That combo
must be run manually in a browser. The other two combos pass the automated test suite
but manual runs are still recommended before demos or client presentations.

---

## Test Environments

| Environment | URL | How to Start |
|---|---|---|
| **Live App** | https://cosmolab-hcrb.vercel.app | Sign in with Google — no setup needed |
| **Local App** | http://localhost:3000 | `cd "Claude Apps/cosmolab" && pnpm dev` |

### Local App Prerequisites
```bash
cd "/Users/rajeshtulsyani/Claude Apps/cosmolab"
pnpm install        # if node_modules is missing
pnpm dev            # starts on http://localhost:3000
```
Requires `.env.local` with `ANTHROPIC_API_KEY`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, and `ALLOWED_EMAILS`.

---

## Test Combos

| # | Combo | Module | App URL Path | Test Data File |
|---|---|---|---|---|
| 1 | Discovery — Sales × Skincare | Phase 1 | `/session?team=sales&category=skincare` | `test-data/combo-1-discovery-sales-skincare.md` |
| 2 | Cross-Team Workflow Assessment | Phase 1.5 | `/assessment` | `test-data/combo-2-cross-team-workflow-assessment.md` |
| 3 | IT & Digital Transformation Assessment | Phase 1.5 | `/it-assessment` | `test-data/combo-3-it-assessment.md` |

---

## How to Run a Manual Test

### Step 1 — Open the app
- **Live:** Navigate to https://cosmolab-hcrb.vercel.app and sign in with Google
- **Local:** Run `pnpm dev` and open http://localhost:3000

### Step 2 — Navigate to the combo
Use the URL path from the table above, or navigate via the home screen.

For Combo 1 (Discovery):
- Home screen → select **Sales** team → select **Skincare** → click **Start Session**

For Combo 2 (Workflow Assessment):
- Home screen → click **Cross-Team Workflow Assessment** (Phase 1.5 section)

For Combo 3 (IT Assessment):
- Home screen → click **IT & Digital Transformation Assessment** (Phase 1.5 section)

### Step 3 — Run the conversation
Open the test data file for the combo. Copy and paste each **USER RESPONSE** into the
chat when the AI asks a question. The test data shows the expected AI question first so
you know which response goes where — but don't paste the AI text, only the user responses.

### Step 4 — Generate documents
When the AI says "I have everything I need. Type 'generate'…", type:
```
generate
```
Wait for documents to appear (up to 60 seconds on live app, faster locally).

### Step 5 — Save results
1. Screenshot or copy the generated documents
2. Save each document's text content to the results folder for this test run:
   ```
   test/manual/results/
     live-app/YYYY-MM-DD/
       combo-1-discovery-sales-skincare/
         <document-title>.txt
         notes.md               ← pass/fail, observations, timing
       combo-2-cross-team-workflow-assessment/
         ...
       combo-3-it-assessment/
         ...
     local-app/YYYY-MM-DD/
       ...
   ```
3. Fill in `notes.md` for each combo (see template below)

---

## Notes Template (notes.md)

```markdown
# Test Notes — [Combo Name]

Date: YYYY-MM-DD
Environment: live-app | local-app
Tester: [your name]
Result: PASS | FAIL | PARTIAL

## Timing
- Chat response time (first response): ~X seconds
- Document generation time: ~X seconds

## Documents Generated
- [ ] Document 1 title
- [ ] Document 2 title
- [ ] Document 3 title
- [ ] Document 4 title

## Issues Observed
- (none)

## Content Quality
Rate 1–5: ___
Notes:
```

---

## Acceptance Criteria

| Check | Pass Condition |
|---|---|
| Authentication | Sign-in with Google works, lands on home screen |
| Chat response | AI responds within 10 seconds, asks a relevant follow-up question |
| AI persona | Responses sound like a senior industry expert (not generic chatbot) |
| Document generation | ≥ 3 documents generated with no "[To be confirmed]" placeholders |
| Document content | Documents reference specific details from the conversation (brand names, figures, etc.) |
| Download | Word (.docx) download works for at least one document |

---

## Automated Test (for reference)

The automated test suite covers Combos 1 and 2 end-to-end:
```bash
cd "/Users/rajeshtulsyani/Claude Apps/cosmolab"
pnpm exec ts-node --skip-project --transpile-only \
  --compiler-options '{"module":"CommonJS","moduleResolution":"node"}' \
  test/auto-test/live-integration-test.ts
```
Results are saved to `test/auto-test/results/<timestamp>/`.

---

## Results Folder Index

| Date | Environment | C1 | C2 | C3 | Notes |
|---|---|---|---|---|---|
| 2026-03-22 | live-app | ✅ | ✅ | — | Automated run (combos 1–2). C3 requires manual run. |
