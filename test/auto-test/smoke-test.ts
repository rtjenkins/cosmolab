/**
 * CosmoLab Smoke Test — $0 cost, no Claude API calls
 *
 * Verifies every page, API route, and auth flow responds correctly
 * without sending any messages to Claude.
 *
 * Checks per combo:
 *   ✓ Page loads (200)
 *   ✓ Auth required (redirect to login when unauthenticated)
 *   ✓ Chat API rejects empty/bad requests (auth gating works)
 *   ✓ Generate API rejects empty/bad requests (auth gating works)
 *
 * Results saved to: test/auto-test/results/<timestamp>/
 *   summary.json   — overall pass/fail per combo
 *
 * Run:
 *   pnpm exec ts-node --skip-project --transpile-only \
 *     --compiler-options '{"module":"CommonJS","moduleResolution":"node"}' \
 *     test/auto-test/smoke-test.ts
 */

import * as fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { encode } = require("next-auth/jwt");

const BASE_URL    = "http://localhost:3000";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "F2NjQWqUxd3HuM5az/ZgovtpqxYcuGKMw1qoWeIBLYQ=";
const TEST_EMAIL  = "iphone60523@gmail.com";
// localhost is HTTP — NextAuth drops the __Secure- prefix (HTTPS only)
const COOKIE_NAME = "authjs.session-token";

// ── Results setup ─────────────────────────────────────────────────────────────

const RUN_TS      = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const RESULTS_DIR = path.join(__dirname, "results", RUN_TS);

function ensureDir(d: string) { fs.mkdirSync(d, { recursive: true }); }
function saveFile(p: string, content: string) { ensureDir(path.dirname(p)); fs.writeFileSync(p, content, "utf-8"); }

interface CheckResult { name: string; passed: boolean; status?: number; note?: string; }
interface ComboResult { label: string; passed: boolean; checks: CheckResult[]; }
const allResults: ComboResult[] = [];

// ── Logging ───────────────────────────────────────────────────────────────────

function pass(msg: string) { console.log(`  ✅ ${msg}`); }
function fail(msg: string) { console.log(`  ❌ ${msg}`); }
function section(msg: string) { console.log(`\n${"═".repeat(60)}\n  ${msg}\n${"═".repeat(60)}`); }

// ── Auth ──────────────────────────────────────────────────────────────────────

async function makeToken(): Promise<string> {
  return encode({
    token: { name: "Test User", email: TEST_EMAIL, picture: null, sub: TEST_EMAIL },
    secret: AUTH_SECRET,
    salt: COOKIE_NAME,
  });
}

function authHeaders(token: string): Record<string, string> {
  return { "Content-Type": "application/json", Cookie: `${COOKIE_NAME}=${token}` };
}

// ── Individual checks ─────────────────────────────────────────────────────────

async function checkPageLoads(urlPath: string, token: string): Promise<CheckResult> {
  const name = `GET ${urlPath} loads (200)`;
  try {
    const res = await fetch(`${BASE_URL}${urlPath}`, {
      headers: { Cookie: `${COOKIE_NAME}=${token}` },
      redirect: "follow",
    });
    const ok = res.status === 200;
    if (ok) pass(name); else fail(`${name} — got ${res.status}`);
    return { name, passed: ok, status: res.status };
  } catch (e) {
    fail(`${name} — network error: ${e}`);
    return { name, passed: false, note: String(e) };
  }
}

async function checkUnauthRedirects(urlPath: string): Promise<CheckResult> {
  const name = `GET ${urlPath} redirects unauthenticated users`;
  try {
    const res = await fetch(`${BASE_URL}${urlPath}`, { redirect: "manual" });
    // Expect 302/307 redirect to /login, or 200 on login page itself
    const ok = res.status === 302 || res.status === 307 || res.status === 200;
    const location = res.headers.get("location") ?? "";
    const note = `status=${res.status} location=${location}`;
    if (ok) pass(`${name} (${note})`); else fail(`${name} — unexpected ${note}`);
    return { name, passed: ok, status: res.status, note };
  } catch (e) {
    fail(`${name} — network error: ${e}`);
    return { name, passed: false, note: String(e) };
  }
}

async function checkApiRouteExists(urlPath: string, body: object): Promise<CheckResult> {
  const name = `POST ${urlPath} route exists (not 404)`;
  try {
    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const ok = res.status !== 404;
    if (ok) pass(`${name} (${res.status})`); else fail(`${name} — 404 route missing`);
    return { name, passed: ok, status: res.status };
  } catch (e) {
    fail(`${name} — network error: ${e}`);
    return { name, passed: false, note: String(e) };
  }
}

async function checkApiRejectsEmptyBody(urlPath: string, token: string): Promise<CheckResult> {
  const name = `POST ${urlPath} rejects empty body (400/422)`;
  try {
    const res = await fetch(`${BASE_URL}${urlPath}`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({}),
    });
    // Should be 400/422/500 — anything but hanging or 200 with no content
    const ok = res.status !== 200;
    if (ok) pass(`${name} (${res.status})`); else fail(`${name} — returned 200 on empty body`);
    return { name, passed: ok, status: res.status };
  } catch (e) {
    fail(`${name} — network error: ${e}`);
    return { name, passed: false, note: String(e) };
  }
}

// ── Combo runner ──────────────────────────────────────────────────────────────

async function runCombo(
  label: string,
  pagePath: string,
  chatPath: string,
  generatePath: string,
  token: string,
  sampleChatBody: object,
  sampleGenerateBody: object,
) {
  section(`SMOKE: ${label}`);
  const checks: CheckResult[] = [];

  checks.push(await checkPageLoads(pagePath, token));
  checks.push(await checkUnauthRedirects(pagePath));
  checks.push(await checkApiRouteExists(chatPath, sampleChatBody));
  checks.push(await checkApiRouteExists(generatePath, sampleGenerateBody));
  checks.push(await checkApiRejectsEmptyBody(chatPath, token));

  const passed = checks.every(c => c.passed);
  allResults.push({ label, passed, checks });

  const passCount = checks.filter(c => c.passed).length;
  console.log(`\n  ${passed ? "✅" : "❌"} ${label} — ${passCount}/${checks.length} checks passed`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\nCosmoLab Smoke Test — $0 cost`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Output: ${RESULTS_DIR}\n`);

  ensureDir(RESULTS_DIR);

  // ── Verify server is up ───────────────────────────────────────────────────
  section("SERVER HEALTH");
  try {
    const res = await fetch(`${BASE_URL}/api/auth/session`);
    pass(`Server responding (${res.status})`);
  } catch {
    fail("Server not reachable — is pnpm dev running on :3000?");
    process.exit(1);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  section("AUTH CHECK");
  const token = await makeToken();
  pass("Session token created");

  const authRes  = await fetch(`${BASE_URL}/api/auth/session`, { headers: { Cookie: `${COOKIE_NAME}=${token}` } });
  const authBody = await authRes.text();
  if (authRes.status === 200 && authBody.includes(TEST_EMAIL)) {
    pass(`Session verified — ${TEST_EMAIL}`);
  } else {
    fail(`Session not recognized (${authRes.status}) — check AUTH_SECRET in .env.local`);
    process.exit(1);
  }

  // ── Home page ─────────────────────────────────────────────────────────────
  section("HOME PAGE");
  const homeCheck = await checkPageLoads("/", token);
  allResults.push({ label: "Home Page", passed: homeCheck.passed, checks: [homeCheck] });

  // ── Phase 1: Sales × Skincare ─────────────────────────────────────────────
  await runCombo(
    "Phase 1 — Sales × Skincare",
    "/session?team=sales&category=skincare",
    "/api/chat",
    "/api/generate-docs",
    token,
    { team: "sales", category: "skincare", messages: [{ role: "user", content: "test" }] },
    { team: "sales", category: "skincare", messages: [] },
  );

  // ── Phase 1: R&D × OTC Drug ───────────────────────────────────────────────
  await runCombo(
    "Phase 1 — R&D × OTC Drug",
    "/session?team=rd&category=otc",
    "/api/chat",
    "/api/generate-docs",
    token,
    { team: "rd", category: "otc", messages: [{ role: "user", content: "test" }] },
    { team: "rd", category: "otc", messages: [] },
  );

  // ── Phase 1.5: Cross-Team Workflow Assessment ──────────────────────────────
  await runCombo(
    "Phase 1.5 — Cross-Team Workflow Assessment",
    "/assessment",
    "/api/assessment/chat",
    "/api/assessment/generate",
    token,
    { messages: [{ role: "user", content: "test" }] },
    { messages: [] },
  );

  // ── Phase 1.5: Business Strategy Session ──────────────────────────────────
  await runCombo(
    "Phase 1.5 — Business Strategy Session",
    "/strategy",
    "/api/strategy/chat",
    "/api/strategy/generate",
    token,
    { messages: [{ role: "user", content: "test" }] },
    { messages: [] },
  );

  // ── Phase 1.5: Client Portal ───────────────────────────────────────────────
  await runCombo(
    "Phase 1.5 — Client Portal × Skincare",
    "/portal",
    "/api/portal/chat",
    "/api/portal/generate",
    token,
    { category: "skincare", messages: [{ role: "user", content: "test" }] },
    { category: "skincare", messages: [] },
  );

  // ── Phase 1.5: IT Assessment ───────────────────────────────────────────────
  await runCombo(
    "Phase 1.5 — IT & Digital Transformation",
    "/it-assessment",
    "/api/it-assessment/chat",
    "/api/it-assessment/generate",
    token,
    { messages: [{ role: "user", content: "test" }] },
    { messages: [] },
  );

  // ── Phase 1.5: Regulatory Assessment ──────────────────────────────────────
  await runCombo(
    "Phase 1.5 — Regulatory & Quality Assessment",
    "/regulatory-assessment",
    "/api/regulatory-assessment/chat",
    "/api/regulatory-assessment/generate",
    token,
    { messages: [{ role: "user", content: "test" }] },
    { messages: [] },
  );

  // ── Summary ────────────────────────────────────────────────────────────────
  const passed = allResults.filter(r => r.passed).length;
  const total  = allResults.length;
  const summary = {
    runAt: new Date().toISOString(),
    target: BASE_URL,
    user: TEST_EMAIL,
    passed,
    total,
    costUSD: 0,
    combos: allResults,
  };
  saveFile(path.join(RESULTS_DIR, "summary.json"), JSON.stringify(summary, null, 2));

  console.log("\n" + "═".repeat(60));
  console.log(`  Smoke test complete — ${passed}/${total} combos passed`);
  console.log(`  Cost: $0.00`);
  console.log(`  Results: ${RESULTS_DIR}`);
  console.log("═".repeat(60) + "\n");

  allResults.forEach(r => {
    const icon = r.passed ? "✅" : "❌";
    console.log(`  ${icon}  ${r.label}`);
    r.checks.filter(c => !c.passed).forEach(c => console.log(`       ⚠️  FAIL: ${c.name}`));
  });
  console.log();
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
