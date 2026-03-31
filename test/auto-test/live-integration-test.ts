/**
 * CosmoLab Live Integration Test — cosmolab-hcrb.vercel.app
 *
 * Covers all Phase 1 and Phase 1.5 session types:
 *   Phase 1  — Discovery: Sales × Skincare, R&D × OTC Drug
 *   Phase 1.5 — Workflow Assessment, Strategy Session, Client Portal,
 *               IT Assessment, Regulatory Assessment
 *
 * Results saved to: test/auto-test/results/<timestamp>/
 *   summary.json              — overall pass/fail
 *   <combo>/documents.json    — raw API response
 *   <combo>/<title>.txt       — each document as plain text
 *
 * Cost: ~$0.50–$1.00 per full run (7 combos × Claude Sonnet 4.6)
 *
 * Run: pnpm exec ts-node --skip-project --transpile-only \
 *        --compiler-options '{"module":"CommonJS","moduleResolution":"node"}' \
 *        test/auto-test/live-integration-test.ts
 */

import * as fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { encode } = require("next-auth/jwt");

const BASE_URL    = process.env.TEST_BASE_URL   ?? "https://cosmolab-hcrb.vercel.app";
const AUTH_SECRET = process.env.AUTH_SECRET      ?? "F2NjQWqUxd3HuM5az/ZgovtpqxYcuGKMw1qoWeIBLYQ=";
const TEST_EMAIL  = process.env.TEST_EMAIL       ?? "iphone60523@gmail.com";
// localhost uses plain cookie name; Vercel (HTTPS) uses __Secure- prefix
const COOKIE_NAME = BASE_URL.startsWith("http://")
  ? "authjs.session-token"
  : "__Secure-authjs.session-token";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message { role: "user" | "assistant"; content: string; }
interface Section  { heading: string; content: string; }
interface Document { title: string; sections: Section[]; }

// ── Results ───────────────────────────────────────────────────────────────────

const RUN_TS     = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const RESULTS_DIR = path.join(__dirname, "results", RUN_TS);

function ensureDir(dir: string) { fs.mkdirSync(dir, { recursive: true }); }
function saveFile(p: string, content: string) { ensureDir(path.dirname(p)); fs.writeFileSync(p, content, "utf-8"); }
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

interface ComboResult {
  label: string; documentsGenerated: number | null;
  documentTitles: string[]; passed: boolean; error?: string;
}
const results: ComboResult[] = [];

// ── Auth ──────────────────────────────────────────────────────────────────────

async function makeSessionToken(): Promise<string> {
  return encode({
    token: { name: "Test User", email: TEST_EMAIL, picture: null, sub: TEST_EMAIL },
    secret: AUTH_SECRET, salt: COOKIE_NAME,
  });
}

async function apiFetch(urlPath: string, body: object, token: string): Promise<Response> {
  return fetch(`${BASE_URL}${urlPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `${COOKIE_NAME}=${token}` },
    body: JSON.stringify(body),
  });
}

// ── Logging ───────────────────────────────────────────────────────────────────

function pass(msg: string)    { console.log(`  ✅ ${msg}`); }
function fail(msg: string)    { console.log(`  ❌ ${msg}`); }
function section(msg: string) { console.log(`\n${"═".repeat(60)}\n  ${msg}\n${"═".repeat(60)}`); }

function saveDocuments(dir: string, genData: { documents: Document[] }): string[] {
  saveFile(path.join(dir, "documents.json"), JSON.stringify(genData, null, 2));
  return (genData.documents ?? []).map(doc => {
    const text = `${doc.title}\n${"─".repeat(doc.title.length)}\n\n` +
      (doc.sections ?? []).map(s => `## ${s.heading}\n${s.content}`).join("\n\n");
    saveFile(path.join(dir, `${slugify(doc.title)}.txt`), text);
    console.log(`     📄 ${doc.title}`);
    return doc.title;
  });
}

// ── Combo runner ──────────────────────────────────────────────────────────────

async function runCombo(
  label: string,
  generatePath: string,
  buildBody: (messages: Message[]) => object,
  conversation: Message[],
  token: string,
  minDocs = 3
) {
  section(`COMBO: ${label}`);
  const result: ComboResult = { label, documentsGenerated: null, documentTitles: [], passed: false };
  const dir = path.join(RESULTS_DIR, slugify(label));

  const messages: Message[] = [...conversation, { role: "user", content: "generate" }];
  console.log(`  → Sending ${messages.length}-message conversation to ${generatePath}...`);

  let res: Response;
  try {
    res = await apiFetch(generatePath, buildBody(messages), token);
  } catch (e) {
    result.error = `Network error: ${e}`; fail(result.error); results.push(result); return;
  }

  if (!res.ok) {
    const body = await res.text().then(t => t.slice(0, 300));
    result.error = `API error: ${res.status} — ${body}`; fail(result.error); results.push(result); return;
  }

  const genData = await res.json();
  const docCount: number = genData.documents?.length ?? 0;
  result.documentsGenerated = docCount;
  result.documentTitles = saveDocuments(dir, genData);
  console.log(`     💾 ${docCount} documents saved`);

  pass(`Generated ${docCount} documents`);
  if (docCount >= minDocs) { pass(`Sufficient document count (≥${minDocs})`); result.passed = true; }
  else fail(`Only ${docCount} documents — expected ≥${minDocs}`);

  results.push(result);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CONVERSATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Phase 1: Sales × Skincare ─────────────────────────────────────────────────
const SALES_SKINCARE: Message[] = [
  { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session. What's the client brand and what are they looking to develop?" },
  { role: "user",      content: "A clean beauty indie brand called Lumière. They want a vitamin C brightening serum." },
  { role: "assistant", content: "Who is their target consumer and what price point are they targeting at retail?" },
  { role: "user",      content: "Millennial women, clean beauty enthusiasts. Retail $65–85." },
  { role: "assistant", content: "What key claims are they looking to make?" },
  { role: "user",      content: "Brightening, even skin tone, and antioxidant protection. No drug claims." },
  { role: "assistant", content: "What markets are they launching in?" },
  { role: "user",      content: "US first, then Canada within 6 months." },
  { role: "assistant", content: "What MOQ and volume are they anticipating?" },
  { role: "user",      content: "3,000 units for the first run, scaling to 10,000 within a year." },
  { role: "assistant", content: "Existing formula or full formulation development needed?" },
  { role: "user",      content: "Full formulation from scratch. Reference aesthetic: Drunk Elephant C-Firma." },
  { role: "assistant", content: "Target launch date?" },
  { role: "user",      content: "Q4 this year — about 8 months from now." },
  { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
];

// ── Phase 1: R&D × OTC Drug ───────────────────────────────────────────────────
const RD_OTC: Message[] = [
  { role: "assistant", content: "Hi, I'm CosmoLab AI. R&D discovery session for an OTC Drug product. What product are we formulating?" },
  { role: "user",      content: "An acne treatment gel with 2% salicylic acid. Leave-on, for teens and young adults." },
  { role: "assistant", content: "Targeting US only, or other markets? OTC drug status varies by geography." },
  { role: "user",      content: "US primary. May consider Canada later — we know salicylic acid has different limits there." },
  { role: "assistant", content: "Desired texture and packaging format?" },
  { role: "user",      content: "Lightweight gel, pump bottle, 1oz. Quick-absorbing, no white residue." },
  { role: "assistant", content: "Any additional actives alongside salicylic acid — niacinamide, benzoyl peroxide, zinc?" },
  { role: "user",      content: "Niacinamide at 2% for redness reduction. No benzoyl peroxide — want to avoid staining." },
  { role: "assistant", content: "Target pH range? Salicylic acid efficacy is pH-dependent." },
  { role: "user",      content: "pH 3.5–4.0 to keep salicylic acid active. R&D confirmed this is achievable." },
  { role: "assistant", content: "Shelf life target and preservative preference?" },
  { role: "user",      content: "24 months. Paraben-free. Prefer phenoxyethanol + ethylhexylglycerin." },
  { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
];

// ── Phase 1.5: Cross-Team Workflow Assessment ─────────────────────────────────
const WORKFLOW_ASSESSMENT: Message[] = [
  { role: "assistant", content: "Welcome. I'm CosmoLab AI conducting a Cross-Team Workflow Assessment. Let's start: Sales → R&D handoff — how does a new client brief move from Sales to your formulation team?" },
  { role: "user",      content: "Sales emails a Word doc brief — quality varies by rep. No standard template. R&D usually has to chase missing details. Takes 3–5 days before R&D can start." },
  { role: "assistant", content: "Sales → Demand Planning: how does committed volume and timeline reach your planning team?" },
  { role: "user",      content: "Shared Excel forecast updated weekly. No formal SLA — mostly verbal. We've missed production windows due to late volume confirmations. Version control issues on the file." },
  { role: "assistant", content: "R&D → Manufacturing formula handoff for scale-up?" },
  { role: "user",      content: "R&D emails batch sheet and formula card. ~30% rework rate on first handoff — missing packaging specs or scale-up gaps. Adds a week+ of delay." },
  { role: "assistant", content: "R&D → Quality and R&D → Engineering handoffs?" },
  { role: "user",      content: "R&D → QA is structured — we have a stability plan and quality spec template. R&D → Engineering is informal — R&D mentions requirements in meetings, Engineering takes notes. No formal spec doc." },
  { role: "assistant", content: "Manufacturing → Quality for batch release?" },
  { role: "user",      content: "Paper batch records. QA reviews post-production. Compliance findings in audits due to incomplete floor entries." },
  { role: "assistant", content: "Demand Planning → Manufacturing scheduling, and → Procurement for POs?" },
  { role: "user",      content: "Weekly email production schedule. Manufacturing confirms verbally. Procurement manually creates POs in ERP. Lead times in a separate spreadsheet. Had stockouts from miscommunication." },
  { role: "assistant", content: "Quality → All Teams for non-conformance and CAPA escalation?" },
  { role: "user",      content: "QA emails deviation reports. CAPA follow-up is manual — QA chases teams. QMS is document storage only, not active CAPA tracking." },
  { role: "assistant", content: "I have everything I need. Type 'generate' to create your assessment reports." },
];

// ── Phase 1.5: Strategy Session ───────────────────────────────────────────────
const STRATEGY_SESSION: Message[] = [
  { role: "assistant", content: "Hello, I'm CosmoLab AI. Business Strategy Session for CM leadership. Let's start: what's your approximate revenue size, product category mix, and client type mix?" },
  { role: "user",      content: "About $28M revenue. 60% skincare, 30% haircare, 10% supplements. Roughly 70% indie brands, 20% mid-market, 10% enterprise. We run shared manufacturing lines — no dedicated lines." },
  { role: "assistant", content: "Revenue trend over the last 2–3 years — growing, flat, or declining? Which categories are driving it?" },
  { role: "user",      content: "Growing about 9% annually. Skincare is the engine — especially serums and treatments. Haircare is flat. Supplements grew fast last year but we're cautious about capacity." },
  { role: "assistant", content: "Current capacity utilization — how much headroom do you have without further capex?" },
  { role: "user",      content: "Running at about 78% utilization overall. Skincare lines are at 90%+ — we're turning down business. Engineering lines are at 55%. We have $2M earmarked for a new skincare line next year." },
  { role: "assistant", content: "What formats or categories is the market asking for that you can't currently serve?" },
  { role: "user",      content: "SPF and sunscreen — huge demand but we don't have the regulatory clearance or testing capability. Aerosol formats — clients keep asking. Prestige packaging with complex assembly — we lose those bids." },
  { role: "assistant", content: "Client concentration — top 3–5 clients as a percentage of revenue?" },
  { role: "user",      content: "Top client is 22% of revenue — a fast-growing clean beauty brand. Top 3 combined are 48%. We know this is a risk. They've been with us 4 years but if they bring manufacturing in-house we'd feel it." },
  { role: "assistant", content: "Where do you win deals, and where do you lose them?" },
  { role: "user",      content: "We win on formulation speed — we can hit prototype in 6 weeks. We win with indie brands on service and flexibility. We lose on price to overseas CMs and on aerosol and SPF capability. Also lose larger enterprise accounts because we lack ISO 22716 certification." },
  { role: "assistant", content: "Strategic options you're actively considering — M&A, partnerships, capability investments?" },
  { role: "user",      content: "Considering acquiring a small SPF-capable lab. Looking at ISO 22716 certification — estimated 9-month project. One PE firm has approached us about a minority investment to fund capacity expansion." },
  { role: "assistant", content: "I have everything I need. Type 'generate' to create your strategic assessment." },
];

// ── Phase 1.5: Client Portal × Skincare ──────────────────────────────────────
const CLIENT_PORTAL_SKINCARE: Message[] = [
  { role: "assistant", content: "Hello! I'm CosmoLab AI — I'll help you get started on your product development project. What type of skincare product are you looking to develop?" },
  { role: "user",      content: "A hydrating face oil for dry and sensitive skin. Clean, minimalist formula." },
  { role: "assistant", content: "Tell me about your brand and target customer." },
  { role: "user",      content: "Brand is called Aura Botanics. Our customer is women 28–45, skin-conscious, prefers natural ingredients. We sell DTC and are planning to pitch to Credo Beauty." },
  { role: "assistant", content: "What key claims or benefits do you want the product to deliver?" },
  { role: "user",      content: "Deep hydration, skin barrier repair, glow. Fragrance-free. Want to highlight rosehip and squalane as hero ingredients." },
  { role: "assistant", content: "What's your target retail price and initial order quantity?" },
  { role: "user",      content: "Retail $58–72. Initial run of 1,500 units to test the market before scaling." },
  { role: "assistant", content: "What markets will you be selling in, and do you have a target launch date?" },
  { role: "user",      content: "US only for now. Target launch is 6 months from now — aiming for the holiday season." },
  { role: "assistant", content: "I have what I need. Type 'submit' to generate your project brief." },
];

// ── Phase 1.5: IT & Digital Transformation Assessment ────────────────────────
const IT_ASSESSMENT: Message[] = [
  { role: "assistant", content: "Hello, I'm CosmoLab AI. Let's assess your IT landscape. What core systems are you running — ERP, PLM, MES, LIMS, QMS?" },
  { role: "user",      content: "SYSPRO ERP (8 years). No PLM — formulas in Excel on a shared drive. No MES — paper batch records. MasterControl for QMS document storage only. No LIMS — all lab data in Excel." },
  { role: "assistant", content: "Have you evaluated Coptis or Ithos for PLM?" },
  { role: "user",      content: "Evaluated Coptis 2 years ago, didn't proceed due to budget. Back on radar — we had a production batch made from an outdated formula last quarter because R&D updated Excel but the shared drive copy wasn't replaced." },
  { role: "assistant", content: "Shop floor and lab: batch record right-first-time rate, and how are stability studies and CoAs managed?" },
  { role: "user",      content: "Batch record right-first-time ~65%. QA review takes 3–5 days post-production. Stability tracked in a master Excel file. CoAs generated manually from Word templates — sent incorrect CoAs twice this year. FDA audit issued a 483 observation for lack of audit trail on lab data." },
  { role: "assistant", content: "QMS and ERP integration: is MasterControl used for deviations and CAPA, and where does data fall out of SYSPRO?" },
  { role: "user",      content: "MasterControl is document storage only. Deviations in Excel, CAPAs in a shared Word doc — flagged in last internal audit. SYSPRO holds financials and POs. Demand planning, production scheduling, raw material lead times — all in separate spreadsheets. Nothing integrates." },
  { role: "assistant", content: "AI tools in use, IT team size, and transformation budget?" },
  { role: "user",      content: "Ad-hoc ChatGPT by a few individuals — no enterprise strategy. IT team is 2 people. Budget ~$400–600K. Top 3 priorities: (1) fix LIMS/data integrity before next FDA inspection, (2) formula version control, (3) reduce manual scheduling spreadsheets." },
  { role: "assistant", content: "I have everything I need. Type 'generate' to create your IT transformation documents." },
];

// ── Phase 1.5: Regulatory & Quality Assessment ────────────────────────────────
const REGULATORY_ASSESSMENT: Message[] = [
  { role: "assistant", content: "Hello, I'm CosmoLab AI — your regulatory and quality transformation advisor. What markets do you sell into and what product types — cosmetics, OTC drug, supplements?" },
  { role: "user",      content: "US and EU for cosmetics. US only for OTC drug products — acne and sunscreen. No supplements. About 70% cosmetics, 30% OTC drug by revenue." },
  { role: "assistant", content: "On MoCRA compliance — have you completed safety substantiation, registered a responsible person, and submitted product listings to the FDA CARES portal?" },
  { role: "user",      content: "We have a responsible person designated. Product listings — about 60% complete. Safety substantiation is a gap — we're relying on supplier safety data rather than our own dossiers. We know this needs to be addressed." },
  { role: "assistant", content: "For your OTC drug products — what's your cGMP posture? When was your last FDA inspection and were there findings?" },
  { role: "user",      content: "Last FDA inspection was 18 months ago. We received two 483 observations: one for batch record completeness, one for lab data integrity. Both are in remediation. We have a CAPA plan but it's behind schedule." },
  { role: "assistant", content: "EU Cosmetics Regulation — are your CPNP notifications current, and do you have Article 10 safety assessment dossiers in place?" },
  { role: "user",      content: "CPNP notifications are current for our top 40 SKUs. About 20 older SKUs haven't been updated since the 2013 regulation. We use a contract responsible person in Germany. Article 10 dossiers — we have them for new launches but the legacy portfolio is incomplete." },
  { role: "assistant", content: "LIMS and QMS maturity — how are stability studies tracked and how is CAPA managed?" },
  { role: "user",      content: "Stability in a master Excel file — the FDA flagged this. CoAs from Word templates. MasterControl for document storage only. CAPAs tracked manually in a shared spreadsheet. Last internal audit rated our QMS effectiveness as 2 out of 5." },
  { role: "assistant", content: "Label claim substantiation — how are performance claims supported today?" },
  { role: "user",      content: "In vitro testing for most cosmetic claims. No consumer panels or clinical studies. We rely heavily on ingredient supplier claims rather than our own data. A recent retailer asked for substantiation we couldn't provide quickly — almost lost the account." },
  { role: "assistant", content: "Supplier qualification — how do you manage incoming materials and approved supplier lists?" },
  { role: "user",      content: "We review CoAs on every incoming batch. Approved supplier list exists but hasn't been reviewed in 2 years. No supplier audits performed — budget has been the barrier. Had one supplier quality incident last year that reached a customer complaint." },
  { role: "assistant", content: "I have everything I need. Type 'generate' to create your regulatory transformation documents." },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\nCosmoLab Live Integration Test — Full Suite`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`User:   ${TEST_EMAIL}`);
  console.log(`Output: ${RESULTS_DIR}\n`);

  ensureDir(RESULTS_DIR);

  // Auth
  console.log("Creating session token...");
  const token = await makeSessionToken();
  pass("Session token created");

  const authRes  = await fetch(`${BASE_URL}/api/auth/session`, { headers: { Cookie: `${COOKIE_NAME}=${token}` } });
  const authBody = await authRes.text();
  if (authRes.status === 200 && authBody.includes(TEST_EMAIL)) pass("Session verified — " + TEST_EMAIL);
  else { fail("Session not recognized — aborting"); process.exit(1); }

  // ── Phase 1 combos ──────────────────────────────────────────────────────────
  await runCombo("Phase 1 — Sales × Skincare",
    "/api/generate-docs",
    (msgs) => ({ team: "sales", category: "skincare", messages: msgs }),
    SALES_SKINCARE, token);

  await runCombo("Phase 1 — R&D × OTC Drug",
    "/api/generate-docs",
    (msgs) => ({ team: "rd", category: "otc", messages: msgs }),
    RD_OTC, token);

  // ── Phase 1.5 combos ────────────────────────────────────────────────────────
  await runCombo("Phase 1.5 — Cross-Team Workflow Assessment",
    "/api/assessment/generate",
    (msgs) => ({ messages: msgs }),
    WORKFLOW_ASSESSMENT, token);

  await runCombo("Phase 1.5 — Business Strategy Session",
    "/api/strategy/generate",
    (msgs) => ({ messages: msgs }),
    STRATEGY_SESSION, token);

  await runCombo("Phase 1.5 — Client Portal × Skincare",
    "/api/portal/generate",
    (msgs) => ({ category: "skincare", messages: msgs }),
    CLIENT_PORTAL_SKINCARE, token,
    1); // Portal generates 1 document (Client Project Brief) — that is correct

  await runCombo("Phase 1.5 — IT & Digital Transformation Assessment",
    "/api/it-assessment/generate",
    (msgs) => ({ messages: msgs }),
    IT_ASSESSMENT, token);

  await runCombo("Phase 1.5 — Regulatory & Quality Assessment",
    "/api/regulatory-assessment/generate",
    (msgs) => ({ messages: msgs }),
    REGULATORY_ASSESSMENT, token);

  // ── Summary ─────────────────────────────────────────────────────────────────
  const passed = results.filter(r => r.passed).length;
  const total  = results.length;

  saveFile(path.join(RESULTS_DIR, "summary.json"),
    JSON.stringify({ runAt: new Date().toISOString(), target: BASE_URL, user: TEST_EMAIL, passed, total, combos: results }, null, 2));

  console.log("\n" + "═".repeat(60));
  console.log(`  Full suite complete — ${passed}/${total} combos passed`);
  console.log(`  Results: ${RESULTS_DIR}`);
  console.log("═".repeat(60) + "\n");

  results.forEach(r => {
    const icon = r.passed ? "✅" : "❌";
    const docs  = r.documentsGenerated !== null ? `${r.documentsGenerated} docs` : "failed";
    console.log(`  ${icon}  ${r.label}  (${docs})`);
    if (r.error) console.log(`       ${r.error}`);
  });
  console.log();
}

main().catch(console.error);
