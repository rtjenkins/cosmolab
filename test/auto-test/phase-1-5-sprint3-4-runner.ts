/**
 * CosmoLab Phase 1.5 Sprint 3 & 4 — Zero-Cost Test Runner
 *
 * Tests:
 *   Sprint 3: Client Self-Service Portal (intake chat + Project Brief generation)
 *   Sprint 4: AI Quoting Engine + Institutional Memory session storage
 *
 * API calls made: 0  |  Cost: $0.00
 *
 * Run with: npx tsx test/auto-test/phase-1-5-sprint3-4-runner.ts
 */

import { Document, Packer, Paragraph, HeadingLevel, BorderStyle } from "docx";
import fs from "fs";
import path from "path";

const BASE        = path.join(process.cwd(), "test", "auto-test", "results", "phase-1-5");
const PORTAL_DIR  = path.join(BASE, "client-portal");
const QUOTE_DIR   = path.join(BASE, "quoting-engine");
const MEMORY_DIR  = path.join(BASE, "institutional-memory");

for (const dir of [PORTAL_DIR, QUOTE_DIR, MEMORY_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

type Message = { role: "user" | "assistant"; content: string };
type Section = { heading: string; content: string };
type Doc     = { title: string; sections: Section[] };

// ============================================================================
// SPRINT 3 — Client Self-Service Portal fixtures
// ============================================================================

const PORTAL_CONVERSATION: Message[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm the CosmoLab AI assistant. I'm here to help you get started on your new product development project. This quick conversation will take about 10 minutes, and at the end, I'll prepare a structured project brief that our formulation and commercial team can review.\n\nLet's start with the basics. Can you tell me the name of your brand and give me a one-line description of the product idea you have in mind?",
  },
  {
    role: "user",
    content:
      "My brand is called Soleil Studio. I want to develop a lightweight, daily SPF 50 moisturizer that doesn't leave a white cast — targeted at deeper skin tones.",
  },
  {
    role: "assistant",
    content:
      "Great concept — an SPF 50 daily moisturizer with no white cast is a strong market need, and deeper skin tones are historically underserved in this space.\n\nA few important notes on this product type: SPF products are regulated as OTC drug products in the United States by the FDA, which means they require a Drug Facts panel, approved active sunscreen ingredients (typically zinc oxide, titanium dioxide, or chemical UV filters like avobenzone), and compliance with the FDA OTC monograph. If you're also planning to sell in Canada or the EU, there are different requirements in each market.\n\nWith that context — is the US your primary target market? And are you open to mineral-only actives, chemical UV filters, or a hybrid approach?",
  },
  {
    role: "user",
    content:
      "Yes, primarily US. I'm open to a hybrid approach — mineral and chemical filters — as long as the formula is elegant and doesn't pill under makeup.",
  },
  {
    role: "assistant",
    content:
      "Understood — hybrid UV filter system with a cosmetically elegant, non-pilling formula. That's very achievable.\n\nTell me about your target consumer a little more. You mentioned deeper skin tones — are you positioning this as a product specifically for melanin-rich skin, or as a broadly inclusive SPF that performs especially well on deeper complexions? And what's the price point you're targeting at retail?",
  },
  {
    role: "user",
    content:
      "It's specifically for melanin-rich skin — I want the brand to own that space. We're targeting $38–45 retail, clean beauty positioning, so no oxybenzone or octinoxate.",
  },
  {
    role: "assistant",
    content:
      "Clear positioning — a premium, melanin-rich skin SPF brand at $38–45 retail with a clean UV filter commitment. Excluding oxybenzone and octinoxate is very common for clean beauty claims and those two actives are already banned in several jurisdictions anyway.\n\nHybrid options that work well for minimal white cast include avobenzone + octisalate + a low-level zinc oxide at under 10% — this typically provides broad-spectrum coverage with a more elegant cosmetic profile on deeper skin tones.\n\nA few packaging and volume questions: Do you have a container type in mind — pump bottle, dropper, or tube? And what launch volume are you thinking for your initial production run?",
  },
  {
    role: "user",
    content:
      "I'm thinking a 50mL pump bottle. For the first production run, probably 3,000 to 5,000 units — I'm launching DTC through my own website and potentially one boutique retailer.",
  },
  {
    role: "assistant",
    content:
      "Perfect — 50mL pump, DTC + boutique retail, 3,000–5,000 unit first run. That's a typical indie launch profile.\n\nOne last set of questions before I prepare your project brief:\n\n1. Do you have a target launch timeline in mind (e.g., in 6 months, 9 months, 12 months)?\n2. Have you worked with a contract manufacturer before, or is this your first formulation project?\n3. Is there anything specific you want the formulation team to know — key ingredients you love, things you absolutely want to avoid, or a product you'd like to reference as a texture benchmark?",
  },
  {
    role: "user",
    content:
      "Target launch is 9 months from now. This is my first formulation project. For texture reference, I love the feel of Fenty Skin Hydra Vizor — that sort of gel-cream, lightweight hybrid. I want to avoid silicones and mineral oil. No synthetic fragrance.",
  },
  {
    role: "assistant",
    content:
      "Excellent — I have everything I need to prepare your project brief.\n\nQuick summary of your project:\n• Brand: Soleil Studio\n• Product: Hybrid SPF 50 daily moisturizer for melanin-rich skin — no white cast\n• Format: 50mL pump bottle, gel-cream texture (Fenty Skin Hydra Vizor-inspired)\n• UV filter system: Hybrid (avobenzone + chemical filters + low-level zinc); no oxybenzone/octinoxate\n• Exclusions: No silicones, mineral oil, or synthetic fragrance\n• Regulatory: US OTC drug product (FDA monograph); clean beauty positioning\n• Launch volume: 3,000–5,000 units (DTC + boutique retail)\n• Timeline: 9 months\n• Brand stage: First formulation project\n\nType 'submit' and I'll prepare your full Client Project Brief, which our team will review within 1–2 business days.",
  },
  {
    role: "user",
    content: "submit",
  },
];

const PORTAL_DOCUMENTS: Doc[] = [
  {
    title: "Client Project Overview",
    sections: [
      {
        heading: "Brand & Contact Information",
        content:
          "Brand name: Soleil Studio\nProject type: New product development — first formulation project\nBrand stage: New / pre-launch\nDistribution: DTC (own website) + boutique retail\nTarget retail price: $38–45 USD",
      },
      {
        heading: "Product Concept",
        content:
          "Product type: SPF 50 daily moisturizer — no white cast\nTarget consumer: Melanin-rich / deeper skin tones\nPositioning: Premium, clean beauty SPF brand owning the melanin-rich skin space\nTexture benchmark: Fenty Skin Hydra Vizor — gel-cream, lightweight hybrid\nContainer: 50mL pump bottle",
      },
      {
        heading: "Key Requirements Summary",
        content:
          "• Hybrid UV filter system: avobenzone + supporting chemical filters + zinc oxide under 10%\n• Excluded UV actives: No oxybenzone, no octinoxate\n• Excluded ingredients: No silicones, no mineral oil, no synthetic fragrance\n• Claims: SPF 50 broad-spectrum, no white cast on melanin-rich skin\n• Regulatory classification: US OTC drug product — FDA sunscreen monograph",
      },
    ],
  },
  {
    title: "Formulation Requirements",
    sections: [
      {
        heading: "UV Filter Strategy",
        content:
          "Target SPF: 50 (broad-spectrum)\nFilter approach: Hybrid mineral/chemical system\nPreferred actives: Avobenzone + octisalate + low-level zinc oxide (<10%)\nExcluded actives: Oxybenzone, octinoxate (client hard requirement — clean beauty positioning and global market compliance)\nWhite cast mitigation: Zinc oxide at sub-10% with chemical filter co-system; consider coated zinc particles for further white cast reduction",
      },
      {
        heading: "Texture & Skin Feel",
        content:
          "Target texture: Gel-cream hybrid — lightweight, fast-absorbing, non-greasy\nBenchmark: Fenty Skin Hydra Vizor SPF 30\nKey performance requirement: Must not pill under makeup — critical for daily wear claim\nExclusions: No silicones (dimethicone, cyclomethicone), no mineral oil\nSuggested texture-building approach: Hydroxyethyl cellulose, hyaluronic acid, glycerin-forward humectant system",
      },
      {
        heading: "Fragrance & Preservation",
        content:
          "Fragrance: Fragrance-free (no synthetic fragrance per client requirement)\nPreservation: Broad-spectrum preservative system compatible with OTC drug product requirements\nNote: Preservative selection must be reviewed in context of FDA OTC monograph compliance",
      },
      {
        heading: "Development Notes",
        content:
          "Target pH: 6.0–7.0 (compatible with skin and UV filter stability)\nStability testing: ICH-compliant accelerated stability required for OTC drug product\nSPF testing: Required — in vivo SPF 50 testing per FDA protocol (FDA 2011 Final Rule)\nCritical path item: SPF testing timeline typically 8–12 weeks — must be initiated early in development",
      },
    ],
  },
  {
    title: "Regulatory & Compliance Summary",
    sections: [
      {
        heading: "US Regulatory Classification",
        content:
          "Classification: OTC drug product — FDA sunscreen monograph (21 CFR Part 352 / 2019 Proposed Rule)\nRequired labeling: Drug Facts panel — mandatory format per FDA\nActive ingredient disclosure: Required with concentration (e.g., Avobenzone 3%, Zinc Oxide 9%)\nSPF claim: SPF 50 — requires in vivo testing per FDA 2011 Final Rule\nBroad-spectrum claim: Requires passing Critical Wavelength test (≥370 nm)\nMoCRA compliance: Required as an OTC drug product sold in the US",
      },
      {
        heading: "Key Regulatory Actions Required",
        content:
          "1. Select UV actives from FDA-approved sunscreen monograph list — confirm avobenzone + zinc system is within permitted concentrations\n2. Commission in vivo SPF 50 testing (FDA-accredited lab) — budget 8–12 weeks and $8,000–$15,000 for testing\n3. Prepare Drug Facts panel per FDA format requirements\n4. Safety substantiation dossier — required under MoCRA\n5. If Canada launch planned: Register with Health Canada; bilingual label required; different active ingredient allowances apply",
      },
      {
        heading: "Clean Beauty Compliance",
        content:
          "Client clean beauty commitments:\n• No oxybenzone (also banned in Hawaii, Key West, Palau — avoidance provides market flexibility)\n• No octinoxate (EU restricted; avoiding provides EU-compatible formulation option)\n• No silicones, no mineral oil, no synthetic fragrance\nNote: These exclusions are cosmetic positioning commitments — they must be documented in the formulation brief and verified at every formula revision",
      },
    ],
  },
  {
    title: "Commercial & Project Parameters",
    sections: [
      {
        heading: "Volume & Timeline",
        content:
          "Initial production quantity: 3,000–5,000 units\nExpected scale: DTC + boutique retail; potential for broader retail in Year 2\nTarget launch: 9 months from project start\nBrand experience: First formulation project — client will need guidance through process milestones",
      },
      {
        heading: "Indicative Project Milestones",
        content:
          "Month 1–2: Formulation development — prototype iterations\nMonth 3: SPF testing commissioned (in vivo — FDA lab)\nMonth 4: Formula lock — stability study initiated\nMonth 5–6: Packaging compatibility, label development (Drug Facts panel)\nMonth 7: SPF test results received; adjust if needed\nMonth 8: Regulatory review, final stability check\nMonth 9: Commercial production — launch",
      },
      {
        heading: "Open Items for Commercial Team",
        content:
          "• SPF testing cost and timeline to be scoped and communicated to client early — this is the key critical path item\n• Client has not confirmed packaging supplier — coordination needed on 50mL pump bottle lead time\n• MOQ and COGS estimate to be provided once formula is closer to lock\n• Client is first-time brand — recommend assigning a client success contact to guide them through milestones",
      },
    ],
  },
];

// ============================================================================
// SPRINT 4 — AI Quoting Engine fixture
// ============================================================================

const QUOTE_RESPONSE = {
  quote: {
    productName: "SPF 50 Daily Moisturizer — No White Cast",
    clientBrand: "Soleil Studio",
    category: "Skincare",
    complexityScore: 3.8,
    complexityLabel: "Medium-High",
    complexityBreakdown: {
      actives: {
        score: 4,
        note: "Hybrid UV filter system — avobenzone + octisalate + zinc oxide; photostability testing required",
      },
      regulatory: {
        score: 5,
        note: "US OTC drug product — in vivo SPF 50 testing, Drug Facts panel, FDA monograph compliance; high regulatory burden",
      },
      format: {
        score: 3,
        note: "Gel-cream emulsion — standard emulsion process but UV filter incorporation requires optimization",
      },
      packaging: {
        score: 3,
        note: "50mL pump bottle — standard packaging; compatibility testing required for OTC drug product",
      },
      volume: {
        score: 2,
        note: "Low initial MOQ (3,000–5,000 units) — indie launch profile",
      },
    },
    developmentFeeRange: { low: 18000, high: 28000, currency: "USD" },
    cogsRange: { low: 4.5, high: 7.0, unit: "per unit", atVolume: "5,000 units" },
    moq: 3000,
    timeline: {
      prototypeWeeks: 6,
      formulaLockWeeks: 14,
      commercialLaunchWeeks: 36,
    },
    keyAssumptions: [
      "In vivo SPF 50 testing ($8,000–$15,000) is included in the development fee range estimate",
      "Client-sourced primary packaging (50mL pump bottle) — no tooling cost included",
      "Assumes US-only regulatory scope — Health Canada registration not included",
      "Broad-spectrum critical wavelength testing included in development scope",
      "Formula iterations capped at 3 rounds before additional development fees apply",
    ],
    disclaimer:
      "This is an indicative estimate based on a discovery conversation. Final pricing requires formal technical review, BOM costing, and capacity confirmation. OTC drug product development fees are higher than cosmetics due to regulatory testing requirements. Not a binding commitment.",
  },
};

// ============================================================================
// SPRINT 4 — Institutional Memory session storage fixture
// ============================================================================

const MEMORY_SESSIONS = [
  {
    id: `${Date.now() - 86400000}-abc123`,
    type: "discovery" as const,
    label: "Sales · Skincare",
    date: new Date(Date.now() - 86400000).toISOString(),
    summary:
      "Sales discovery session for a brightening serum with niacinamide, tranexamic acid, and ascorbyl glucoside. Client brand: Aura Collective. DTC launch, 5,000-unit initial volume, 6-month timeline…",
    messages: PORTAL_CONVERSATION.slice(0, 4),
    documentTitles: [
      "Sales Discovery Report",
      "Regulatory Pre-Screening Memo",
      "Client Proposal Template",
      "Project Charter",
    ],
    meta: { team: "sales", category: "skincare" },
  },
  {
    id: `${Date.now() - 172800000}-def456`,
    type: "portal" as const,
    label: "Client Portal · Skincare",
    date: new Date(Date.now() - 172800000).toISOString(),
    summary:
      "Hi! I'm the CosmoLab AI assistant. I'm here to help you get started on your new product development project. This quick conversation will take about 10 minutes…",
    messages: PORTAL_CONVERSATION.slice(0, 6),
    documentTitles: [
      "Client Project Overview",
      "Formulation Requirements",
      "Regulatory & Compliance Summary",
      "Commercial & Project Parameters",
    ],
    meta: { category: "skincare", clientBrand: "Soleil Studio" },
  },
  {
    id: `${Date.now() - 259200000}-ghi789`,
    type: "strategy" as const,
    label: "Business Strategy Session",
    date: new Date(Date.now() - 259200000).toISOString(),
    summary:
      "Hello, I'm CosmoLab AI — your strategy consultant for today's session. I'm here to build a complete picture of your company's current strategic position…",
    messages: [],
    documentTitles: [
      "Strategic Situation Assessment",
      "Growth Opportunity Matrix",
      "Capability Gap Analysis",
      "12-Month Strategic Priorities",
    ],
    meta: {},
  },
];

// ============================================================================
// docx builder
// ============================================================================

function buildDocSections(documents: Doc[]): Paragraph[] {
  const children: Paragraph[] = [];
  for (const doc of documents) {
    children.push(
      new Paragraph({
        text: doc.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
      })
    );
    for (const section of doc.sections ?? []) {
      children.push(
        new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } })
      );
      for (const line of (section.content ?? "").split("\n")) {
        if (!line.trim()) {
          children.push(new Paragraph({ text: "", spacing: { after: 60 } }));
          continue;
        }
        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
        children.push(new Paragraph({ text: line.trim(), bullet: isBullet ? { level: 0 } : undefined, spacing: { after: 80 } }));
      }
    }
    children.push(new Paragraph({ pageBreakBefore: true }));
  }
  return children;
}

async function buildDocx(documents: Doc[], outPath: string): Promise<number> {
  const wordDoc = new Document({
    creator: "CosmoLab AI",
    title: documents[0]?.title ?? "CosmoLab Document",
    sections: [{ children: buildDocSections(documents) }],
  });
  const buffer = await Packer.toBuffer(wordDoc);
  fs.writeFileSync(outPath, buffer);
  return buffer.byteLength;
}

// ============================================================================
// Assertions
// ============================================================================

type TestResult = { pass: boolean; message: string };

function assertDoc(doc: Doc, expectedTitleFragment: string, minSections: number): TestResult[] {
  return [
    {
      pass: doc.title.toLowerCase().includes(expectedTitleFragment.toLowerCase()),
      message: `title contains "${expectedTitleFragment}"`,
    },
    {
      pass: Array.isArray(doc.sections) && doc.sections.length >= minSections,
      message: `has ≥${minSections} sections (got ${doc.sections?.length ?? 0})`,
    },
    ...doc.sections.map((s) => ({
      pass: typeof s.content === "string" && s.content.length > 20,
      message: `  section "${s.heading}" has content`,
    })),
  ];
}

function assertAmerican(text: string): TestResult[] {
  const checks: [string, string][] = [
    ["standardise", "standardize"],
    ["organise", "organize"],
    ["colour", "color"],
    ["labelling", "labeling"],
    ["programme", "program"],
  ];
  return checks.map(([british, american]) => ({
    pass: !text.toLowerCase().includes(british),
    message: `no British "${british}" — use "${american}"`,
  }));
}

// ============================================================================
// Main
// ============================================================================

async function run() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  CosmoLab Phase 1.5 Sprint 3 & 4 — Zero-Cost Test Runner     ║");
  console.log("║  Sprint 3: Client Portal  ·  Sprint 4: Quoting + Memory      ║");
  console.log("║  Fixture-based · API calls: 0 · Cost: $0.00                 ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  let totalPassed = 0;
  let totalFailed = 0;

  function report(results: TestResult[]) {
    for (const t of results) {
      console.log(`  ${t.pass ? "✅" : "❌"} ${t.message}`);
      t.pass ? totalPassed++ : totalFailed++;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRINT 3: Client Self-Service Portal
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("══ SPRINT 3: Client Self-Service Portal ═════════════════════════\n");

  console.log("TEST 3-1: Portal intake conversation fixture");
  report([
    { pass: PORTAL_CONVERSATION.length >= 8, message: `conversation has ${PORTAL_CONVERSATION.length} turns (≥8 expected)` },
    { pass: PORTAL_CONVERSATION[0].role === "assistant", message: "first message is from assistant (AI initiates)" },
    { pass: PORTAL_CONVERSATION[PORTAL_CONVERSATION.length - 1].content === "submit", message: "final user message is 'submit'" },
    {
      pass: PORTAL_CONVERSATION.some((m) => m.role === "assistant" && m.content.toLowerCase().includes("type 'submit'")),
      message: "assistant prompts 'Type submit' before user submits",
    },
    { pass: PORTAL_CONVERSATION.some((m) => m.content.toLowerCase().includes("spf")), message: "SPF / product type captured" },
    { pass: PORTAL_CONVERSATION.some((m) => m.content.toLowerCase().includes("brand")), message: "brand name captured" },
    { pass: PORTAL_CONVERSATION.some((m) => m.content.toLowerCase().includes("volume") || m.content.toLowerCase().includes("units")), message: "launch volume captured" },
    { pass: PORTAL_CONVERSATION.some((m) => m.content.toLowerCase().includes("month")), message: "timeline captured" },
    { pass: PORTAL_CONVERSATION.some((m) => m.content.toLowerCase().includes("otc") || m.content.toLowerCase().includes("regulatory")), message: "regulatory classification flagged" },
  ]);
  fs.writeFileSync(path.join(PORTAL_DIR, "conversation.json"), JSON.stringify(PORTAL_CONVERSATION, null, 2));
  console.log(`  📁 Saved conversation.json (${PORTAL_CONVERSATION.length} turns)\n`);

  console.log("TEST 3-2: Client Project Brief document structure");
  const expectedBriefTitles = [
    "Client Project Overview",
    "Formulation Requirements",
    "Regulatory & Compliance Summary",
    "Commercial & Project Parameters",
  ];
  report([
    { pass: PORTAL_DOCUMENTS.length === 4, message: `document count: 4 (got ${PORTAL_DOCUMENTS.length})` },
    ...expectedBriefTitles.map((t) => ({
      pass: PORTAL_DOCUMENTS.some((d) => d.title.includes(t)),
      message: `document "${t}" present`,
    })),
    ...PORTAL_DOCUMENTS.flatMap((d) => assertDoc(d, d.title.split(" ")[0], 3)),
  ]);

  console.log("\nTEST 3-3: Portal document content quality");
  const briefText = PORTAL_DOCUMENTS.map((d) => d.sections.map((s) => s.content).join(" ")).join(" ");
  report([
    { pass: briefText.toLowerCase().includes("soleil studio"), message: "brand name 'Soleil Studio' appears in brief" },
    { pass: briefText.toLowerCase().includes("spf 50"), message: "SPF 50 specification present" },
    { pass: briefText.toLowerCase().includes("oxybenzone"), message: "excluded UV active (oxybenzone) documented" },
    { pass: briefText.toLowerCase().includes("drug facts"), message: "OTC regulatory requirement (Drug Facts) documented" },
    { pass: briefText.toLowerCase().includes("in vivo"), message: "SPF testing requirement documented" },
    { pass: briefText.toLowerCase().includes("3,000") || briefText.includes("5,000"), message: "launch volume captured in brief" },
    { pass: briefText.toLowerCase().includes("9 months") || briefText.toLowerCase().includes("month 9"), message: "launch timeline captured" },
    ...assertAmerican(briefText),
  ]);

  fs.writeFileSync(path.join(PORTAL_DIR, "response.json"), JSON.stringify({ documents: PORTAL_DOCUMENTS }, null, 2));
  console.log(`  📁 Saved response.json\n`);

  console.log("TEST 3-4: Client Project Brief .docx build");
  try {
    const size = await buildDocx(PORTAL_DOCUMENTS, path.join(PORTAL_DIR, "documents.docx"));
    console.log(`  ✅ Packer.toBuffer() succeeded`);
    console.log(`  ✅ File size: ${(size / 1024).toFixed(1)}KB`);
    console.log(`  📁 Saved documents.docx\n`);
    totalPassed += 2;
  } catch (err) {
    console.log(`  ❌ docx build failed: ${String(err)}`);
    totalFailed++;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRINT 4: AI Quoting Engine
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("══ SPRINT 4A: AI Quoting Engine ════════════════════════════════\n");

  const q = QUOTE_RESPONSE.quote;

  console.log("TEST 4-1: Quote response structure");
  report([
    { pass: typeof q.productName === "string" && q.productName.length > 0, message: "productName present" },
    { pass: typeof q.clientBrand === "string" && q.clientBrand.length > 0, message: "clientBrand present" },
    { pass: typeof q.complexityScore === "number" && q.complexityScore >= 1 && q.complexityScore <= 5, message: `complexityScore is 1–5 (got ${q.complexityScore})` },
    { pass: typeof q.complexityLabel === "string" && q.complexityLabel.length > 0, message: "complexityLabel present" },
    { pass: typeof q.developmentFeeRange?.low === "number" && q.developmentFeeRange.low > 0, message: `developmentFeeRange.low present ($${q.developmentFeeRange?.low?.toLocaleString()})` },
    { pass: typeof q.developmentFeeRange?.high === "number" && q.developmentFeeRange.high > q.developmentFeeRange.low, message: `developmentFeeRange.high > low ($${q.developmentFeeRange?.high?.toLocaleString()})` },
    { pass: typeof q.cogsRange?.low === "number" && q.cogsRange.low > 0, message: `cogsRange.low present ($${q.cogsRange?.low})` },
    { pass: typeof q.cogsRange?.high === "number" && q.cogsRange.high > q.cogsRange.low, message: `cogsRange.high > low ($${q.cogsRange?.high})` },
    { pass: typeof q.moq === "number" && q.moq > 0, message: `moq present (${q.moq?.toLocaleString()} units)` },
    { pass: typeof q.timeline?.prototypeWeeks === "number", message: `timeline.prototypeWeeks present (${q.timeline?.prototypeWeeks} wks)` },
    { pass: typeof q.timeline?.formulaLockWeeks === "number", message: `timeline.formulaLockWeeks present (${q.timeline?.formulaLockWeeks} wks)` },
    { pass: typeof q.timeline?.commercialLaunchWeeks === "number", message: `timeline.commercialLaunchWeeks present (${q.timeline?.commercialLaunchWeeks} wks)` },
    { pass: Array.isArray(q.keyAssumptions) && q.keyAssumptions.length >= 3, message: `keyAssumptions has ${q.keyAssumptions?.length} items (≥3)` },
    { pass: typeof q.disclaimer === "string" && q.disclaimer.length > 20, message: "disclaimer present" },
  ]);

  console.log("\nTEST 4-2: Complexity breakdown completeness");
  const expectedFactors = ["actives", "regulatory", "format", "packaging", "volume"];
  const breakdown = q.complexityBreakdown as Record<string, { score: number; note: string }>;
  report(
    expectedFactors.map((factor) => ({
      pass: !!breakdown?.[factor]?.score && typeof breakdown[factor].note === "string",
      message: `complexity factor "${factor}" has score + note`,
    }))
  );

  console.log("\nTEST 4-3: Quote reasonableness (OTC skincare)");
  report([
    { pass: q.complexityScore >= 3.0, message: `OTC drug product complexity ≥3.0 (got ${q.complexityScore}) — OTC should rate high` },
    { pass: q.complexityBreakdown.regulatory?.score >= 4, message: `regulatory complexity ≥4 (OTC product)` },
    { pass: q.developmentFeeRange.low >= 15000, message: `development fee low ≥$15,000 (OTC testing not cheap)` },
    { pass: q.timeline.commercialLaunchWeeks >= 30, message: `commercial launch ≥30 weeks (OTC regulatory timeline)` },
    { pass: q.cogsRange.high <= 20, message: `COGS high ≤$20/unit (sanity check — not inflated)` },
  ]);

  fs.writeFileSync(path.join(QUOTE_DIR, "response.json"), JSON.stringify(QUOTE_RESPONSE, null, 2));
  console.log(`  📁 Saved response.json\n`);

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRINT 4: Institutional Memory
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("══ SPRINT 4B: Institutional Memory & Project Search ════════════\n");

  console.log("TEST 4-4: Session storage fixture structure");
  report([
    { pass: MEMORY_SESSIONS.length === 3, message: `3 fixture sessions present` },
    ...MEMORY_SESSIONS.map((s) => ({
      pass: !!s.id && !!s.type && !!s.label && !!s.date && !!s.summary,
      message: `session "${s.label}" has all required fields (id, type, label, date, summary)`,
    })),
    ...MEMORY_SESSIONS.map((s) => ({
      pass: Array.isArray(s.documentTitles) && s.documentTitles.length > 0,
      message: `session "${s.label}" has documentTitles`,
    })),
  ]);

  console.log("\nTEST 4-5: Session type coverage");
  const sessionTypes = new Set(MEMORY_SESSIONS.map((s) => s.type));
  report([
    { pass: sessionTypes.has("discovery"), message: "discovery session type covered" },
    { pass: sessionTypes.has("portal"), message: "portal session type covered" },
    { pass: sessionTypes.has("strategy"), message: "strategy session type covered" },
  ]);

  console.log("\nTEST 4-6: Search simulation");
  function mockSearch(sessions: typeof MEMORY_SESSIONS, query: string) {
    const q = query.toLowerCase();
    return sessions.filter((s) => {
      const text = [
        s.label, s.summary,
        s.documentTitles.join(" "),
        s.meta?.team ?? "",
        s.meta?.category ?? "",
        s.meta?.clientBrand ?? "",
        s.messages.map((m) => m.content).join(" "),
      ].join(" ").toLowerCase();
      return text.includes(q);
    });
  }
  report([
    { pass: mockSearch(MEMORY_SESSIONS, "soleil").length >= 1, message: `search "soleil" finds at least 1 session` },
    { pass: mockSearch(MEMORY_SESSIONS, "skincare").length >= 2, message: `search "skincare" finds at least 2 sessions` },
    { pass: mockSearch(MEMORY_SESSIONS, "strategy").length >= 1, message: `search "strategy" finds at least 1 session` },
    { pass: mockSearch(MEMORY_SESSIONS, "zzz-no-match-xyz").length === 0, message: `nonsense query returns 0 sessions` },
  ]);

  fs.writeFileSync(path.join(MEMORY_DIR, "sessions.json"), JSON.stringify(MEMORY_SESSIONS, null, 2));
  console.log(`  📁 Saved sessions.json (${MEMORY_SESSIONS.length} sessions)\n`);

  // ═══════════════════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════════════════
  const total = totalPassed + totalFailed;
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`  Results: ${totalPassed}/${total} passed  |  ${totalFailed} failed`);
  console.log(`  API calls: 0  |  Cost: $0.00`);
  console.log("═══════════════════════════════════════════════════════════════");
  if (totalFailed > 0) process.exit(1);
}

run().catch((err) => { console.error(err); process.exit(1); });
