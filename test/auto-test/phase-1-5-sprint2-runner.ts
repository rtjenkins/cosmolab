/**
 * CosmoLab Phase 1.5 Sprint 2 — Zero-Cost Test Runner
 *
 * Tests Track A (Handoff Automation) and Track B (Business Strategy Session)
 * using handcrafted fixture conversations and fixture documents.
 *
 * API calls made: 0  |  Cost: $0.00
 *
 * Run with: npx tsx test/auto-test/phase-1-5-sprint2-runner.ts
 */

import { Document, Packer, Paragraph, HeadingLevel, BorderStyle } from "docx";
import fs from "fs";
import path from "path";

const BASE = path.join(process.cwd(), "test", "auto-test", "results", "phase-1-5");
const STRATEGY_DIR = path.join(BASE, "strategy-session");
const HANDOFF_DIR  = path.join(BASE, "handoff-automation");

type Message = { role: "user" | "assistant"; content: string };
type Section = { heading: string; content: string };
type Doc     = { title: string; sections: Section[] };

// ============================================================================
// TRACK B — Business Strategy Session fixtures
// ============================================================================

const STRATEGY_CONVERSATION: Message[] = [
  {
    role: "assistant",
    content: "Hello, I'm CosmoLab AI — your strategy consultant for today's session. I'm here to build a complete picture of your company's current strategic position and help surface the clearest opportunities for growth. This will take about 30 minutes.\n\nLet's start with the fundamentals. Can you give me a brief overview of the business — approximate annual revenue, what product categories you manufacture, and what type of clients you primarily serve?",
  },
  {
    role: "user",
    content: "We're about $85 million in annual revenue. Our mix is roughly 60% skincare, 25% haircare, and 15% OTC drug products. Our clients are a mix — about 40% are established mid-market brands, 35% are indie brands, and 25% are enterprise or retail private label.",
  },
  {
    role: "assistant",
    content: "Good — a diversified category and client mix. What's been the revenue trajectory over the last two to three years? And which categories or client segments are driving growth versus declining?",
  },
  {
    role: "user",
    content: "We've grown from $68M to $85M over 3 years — about 7.5% CAGR. Skincare is the engine, especially premium anti-aging and clean beauty. OTC has been flat — we're capacity constrained there. Haircare is growing but at a lower margin than skincare. Indie brands are our fastest growing segment but also highest churn.",
  },
  {
    role: "assistant",
    content: "7.5% CAGR is solid for a CM in this market. On capacity — you mentioned OTC is constrained. What's your overall capacity utilization across the business? And where do you have headroom to grow without additional capital investment?",
  },
  {
    role: "user",
    content: "Our skincare lines are running at about 85% utilization — we have some headroom but not a lot. OTC is at 95% plus, which is why we're losing business there. Haircare is at about 70%. We have a $12M capex plan to expand OTC capacity and add a new high-speed skincare filling line — we expect that to come online in 18 months.",
  },
  {
    role: "assistant",
    content: "So OTC expansion is already in motion, which removes one constraint. What categories or formats is the market asking for that you currently can't serve — and how much business have you turned away in the last 12 months?",
  },
  {
    role: "user",
    content: "We've turned away an estimated $8-10M in supplements business because we don't have a softgel or encapsulation capability. We also get requests for aerosol products — dry shampoos, setting sprays — and we have no aerosol line. And we're seeing strong demand for APAC-compliant formulations, especially for K-beauty inspired products, but our regulatory expertise is US and EU focused.",
  },
  {
    role: "assistant",
    content: "That's a significant opportunity cost — $8–10M in identified turns-away in supplements alone. Let's talk about client concentration. What do your top 3 to 5 clients represent as a percentage of revenue?",
  },
  {
    role: "user",
    content: "Our top client is about 18% of revenue. Top 5 combined is about 45%. We've been working on diversification — 3 years ago the top 5 was 58%, so we've made progress but we're still exposed.",
  },
  {
    role: "assistant",
    content: "Good progress on concentration. Where do you win competitively — and where do you lose deals? What are the one or two reasons clients choose you over another CM?",
  },
  {
    role: "user",
    content: "We win on formulation capability and speed — our R&D team is strong and we can turn around a prototype in 3 weeks versus the industry average of 6–8. We also win on regulatory depth for US and EU markets. We lose deals on price when clients are purely cost-driven, and we lose on format capability — the aerosol and supplements gaps cost us deals every quarter.",
  },
  {
    role: "assistant",
    content: "Speed and formulation quality are powerful differentiators — those are hard to replicate. On geographic expansion — you mentioned APAC regulatory gaps. Is international expansion a strategic priority, or is the focus domestic growth for the next 12 months?",
  },
  {
    role: "user",
    content: "It's on the radar but not an immediate priority. We have a few clients asking us to support their APAC launches and we keep having to refer them out. We'd like to build that capability but it's not in this year's plan.",
  },
  {
    role: "assistant",
    content: "Understood — an emerging priority rather than an active investment. Finally, any M&A, partnership, or technology investments currently under consideration beyond the $12M capex?",
  },
  {
    role: "user",
    content: "We've had informal conversations with a small supplements CM — they have the encapsulation capability we lack. A bolt-on acquisition could solve the supplements gap faster than building. We're also looking at upgrading our ERP and considering whether to invest in a formulation management system to replace our current Coptis setup.",
  },
  {
    role: "assistant",
    content: "That's a strategically interesting acquisition angle — capability acquisition rather than revenue acquisition. And the Coptis replacement aligns with the digital transformation work.\n\nI have everything I need. Type 'generate' to create your strategic assessment.",
  },
];

const STRATEGY_DOCUMENTS: Doc[] = [
  {
    title: "Strategic Situation Assessment",
    sections: [
      {
        heading: "Company Snapshot",
        content:
          "Revenue: ~$85M annual\nCategory mix: Skincare 60%, Haircare 25%, OTC Drug 15%\nClient mix: Mid-market brands 40%, Indie brands 35%, Enterprise/Retail private label 25%\nManufacturing model: Contract manufacturer serving multiple clients across shared and semi-dedicated lines",
      },
      {
        heading: "Growth Performance",
        content:
          "Revenue CAGR (3-year): ~7.5% ($68M → $85M)\n• Skincare: primary growth engine — premium anti-aging and clean beauty driving volume\n• Haircare: growing but margin dilutive relative to skincare mix\n• OTC Drug: flat — constrained by capacity, not demand\n• Indie brand segment: fastest growing client type, highest churn rate\n• Mid-market and enterprise clients: stable, lower churn",
      },
      {
        heading: "Capacity Position",
        content:
          "Skincare lines: ~85% utilization — limited headroom without the new filling line\nOTC Drug: ~95%+ utilization — actively losing business; $12M capex in progress\nHaircare: ~70% utilization — meaningful headroom available\nCapex plan: $12M investment for OTC capacity expansion + new high-speed skincare filling line; expected online in 18 months",
      },
      {
        heading: "Competitive Strengths",
        content:
          "• Formulation speed: 3-week prototype turnaround vs. 6–8 week industry average — a genuine, hard-to-replicate differentiator\n• R&D capability: strong formulation team enabling premium product development\n• Regulatory depth: strong US and EU expertise — a barrier to entry for less specialized CMs\n• Diversified client base: top-5 concentration reduced from 58% to 45% over 3 years",
      },
      {
        heading: "Key Vulnerabilities",
        content:
          "• Format capability gaps: no aerosol line, no softgel/encapsulation — estimated $8–10M in annual turns-away in supplements alone\n• Client concentration: top client still represents 18% of revenue; top-5 at 45%\n• APAC regulatory gap: losing APAC launch support opportunities as clients expand globally\n• Indie brand churn: fastest growing segment but least sticky — requires ongoing new client acquisition to offset\n• ERP and formulation system: aging Coptis setup and ERP infrastructure may limit scalability",
      },
      {
        heading: "Strategic Context",
        content:
          "This company is at a proven-and-growing stage: a high-quality CM with genuine competitive differentiation in formulation speed and regulatory expertise, a clear growth trajectory, and identified capability gaps that are costing real revenue today. The next strategic chapter is about closing the capability gaps that are turning away known demand, capitalizing on the capacity expansion coming online in 18 months, and building the operational systems to support growth to the $120–140M revenue range.\n\nNote: This assessment is based on a single strategy session. Validate assumptions with your full leadership team and financial data before acting on recommendations.",
      },
    ],
  },
  {
    title: "Growth Opportunity Matrix",
    sections: [
      {
        heading: "Methodology",
        content:
          "Opportunities are assessed on two dimensions: revenue impact potential (size of addressable demand) and execution effort (capital, time, capability required). Tier 1 opportunities have clear near-term revenue impact with feasible execution paths. Tier 2 requires meaningful investment or capability build.",
      },
      {
        heading: "Tier 1 — High Impact, Lower Effort (pursue now)",
        content:
          "1. OTC Capacity Expansion (capex already committed)\n   Revenue potential: $5–8M incremental from unmet current demand\n   Required actions: Execute on $12M capex plan; begin pre-selling capacity to OTC clients in pipeline now\n   Timeline: 18 months to capture\n\n2. Haircare Margin Improvement\n   Revenue potential: $2–3M EBITDA improvement without revenue growth\n   Required actions: Product mix optimization toward premium haircare formats; pricing review; R&D efficiency on haircare projects\n   Timeline: 6–12 months\n\n3. Indie Brand Churn Reduction\n   Revenue potential: Retaining even 20% of current annual indie churn worth $1.5–2.5M in preserved revenue\n   Required actions: Structured client success program; project milestone tracking; proactive renewal engagement\n   Timeline: Immediate — process change, no capital required",
      },
      {
        heading: "Tier 2 — High Impact, Higher Effort (plan for)",
        content:
          "4. Supplements Capability via Acquisition\n   Revenue potential: $8–10M in Year 1 from identified turns-away; significantly more at scale\n   Required actions: Formalize M&A evaluation of supplements CM target; assess capability, culture, regulatory compliance fit; structure deal\n   Effort: High — M&A process, integration, capital\n   Timeline: 12–18 months\n\n5. Aerosol Line Investment\n   Revenue potential: $4–6M in haircare and skincare aerosol demand currently being turned away\n   Required actions: Feasibility study for aerosol line addition; capex planning for Phase 2 investment post-OTC expansion\n   Effort: High — capital intensive, regulatory complexity (flammable goods)\n   Timeline: 24–30 months",
      },
      {
        heading: "Tier 3 — Monitor, Not Pursue Now",
        content:
          "• APAC regulatory capability: real demand but requires dedicated regulatory investment and expertise hiring; defer 12–18 months pending other priorities\n• New category entry (beyond supplements): market opportunity exists but management bandwidth is constrained — sequence after supplements gap is closed",
      },
      {
        heading: "Recommended Focus",
        content:
          "The single clearest growth bet for the next 12 months: pursue the supplements CM acquisition while executing the OTC capex plan in parallel. Both address known demand being left on the table today, and the acquisition path is faster than building supplements capability from scratch.",
      },
    ],
  },
  {
    title: "Capability Gap Analysis",
    sections: [
      {
        heading: "Market Demand vs. Current Capability",
        content:
          "Gap 1: Supplements (softgel/encapsulation)\n• Market demand: Strong and growing — beauty-from-within, collagen supplements, women's wellness\n• Current capability: None — no encapsulation equipment\n• Annual revenue impact: $8–10M in confirmed turns-away\n\nGap 2: Aerosol (haircare and skincare)\n• Market demand: Dry shampoos, setting sprays, hairspray — large and stable category\n• Current capability: None — no aerosol filling line\n• Annual revenue impact: $4–6M estimated turns-away\n\nGap 3: APAC Regulatory Expertise\n• Market demand: Existing clients expanding to Japan, Korea, China, Australia\n• Current capability: Strong US/EU; no APAC regulatory staff or processes\n• Annual revenue impact: Difficult to quantify — primarily relationship and retention risk",
      },
      {
        heading: "Cost of the Gaps",
        content:
          "• Supplements gap: $8–10M confirmed annual turns-away — highest cost gap\n• Aerosol gap: $4–6M estimated — second highest cost gap\n• APAC gap: Primarily retention and expansion risk rather than new revenue — hard to quantify but strategically significant as existing clients grow globally\n• Total identified opportunity cost: $12–16M annually from the top two format gaps alone",
      },
      {
        heading: "Build vs. Buy vs. Partner Assessment",
        content:
          "Supplements:\n• Build: 24–30 months, $8–12M capex for encapsulation line — slow relative to demand\n• Buy: 12–18 months, M&A premium but immediate capability — preferred path given identified acquisition target\n• Partner: Toll manufacturing arrangement could bridge near-term while acquisition is evaluated\n\nAerosol:\n• Build: 24–30 months, $6–10M capex — sequenced after OTC expansion\n• Buy: No obvious acquisition target identified — evaluate opportunistically\n• Partner: Toll arrangement feasible short-term; lower strategic value than owning the capability\n\nAPAC Regulatory:\n• Build: Hire regulatory specialist with APAC expertise; 3–6 months to operationalize\n• Partner: Engage APAC regulatory consulting firm on a per-project basis — lower cost, lower commitment\n• Recommended: Start with a regulatory consulting partner while assessing whether volume justifies a hire",
      },
      {
        heading: "Priority Order",
        content:
          "1. Supplements acquisition (highest revenue impact, fastest path via acquisition)\n2. APAC regulatory consulting engagement (low cost, protects existing client relationships)\n3. Aerosol feasibility study (plan for Phase 2 capex post-OTC expansion)\n4. Formulation system upgrade (Coptis replacement to support scale)",
      },
      {
        heading: "Investment Estimate Range",
        content:
          "• Supplements acquisition: $5–15M depending on target size and structure; potential for earn-out to reduce upfront capital\n• Aerosol line: $6–10M capex; 18–24 months to commission\n• APAC regulatory: $50–100K annually for consulting; $150–200K fully-loaded cost if in-house hire\n\nNote: All estimates are directional. Formal feasibility studies required before capital commitment.",
      },
    ],
  },
  {
    title: "12-Month Strategic Priorities",
    sections: [
      {
        heading: "Strategic Intent",
        content:
          "In 12 months, this company will have closed the supplements capability gap via acquisition or formal partnership, defended its client concentration position, and initiated the operational upgrades needed to support growth toward $110M+ revenue.",
      },
      {
        heading: "Priority 1 — Supplements Capability Acquisition",
        content:
          "Objective: Secure encapsulation capability to capture $8–10M in identified demand\n• Key actions: Formalize M&A evaluation process; engage advisor; complete due diligence on identified target by Q2; close or establish toll partnership by Q3\n• Owner function: CEO + CFO + Corporate Development\n• Success metric: Capability in place and first supplements client contracted by month 12",
      },
      {
        heading: "Priority 2 — OTC Expansion Execution",
        content:
          "Objective: Bring new OTC capacity online on time and pre-sell to pipeline clients\n• Key actions: Maintain capex project on schedule; assign commercial lead to OTC pipeline; pre-sell at least 60% of new capacity before commissioning\n• Owner function: COO (capex execution) + VP Sales (pipeline)\n• Success metric: New OTC line commissioned on schedule; $4M in new OTC contracts signed before go-live",
      },
      {
        heading: "Priority 3 — Indie Brand Retention Program",
        content:
          "Objective: Reduce indie brand churn by 20%+ through structured client success\n• Key actions: Define client health scoring model; assign client success ownership; implement quarterly business reviews for top 20 indie clients; create early-warning process for at-risk accounts\n• Owner function: VP Sales + Client Services\n• Success metric: Indie brand churn rate tracked and reduced from current baseline by month 6",
      },
      {
        heading: "Priority 4 — Formulation System Modernization",
        content:
          "Objective: Replace Coptis with Ithos or equivalent to support R&D scalability and regulatory depth\n• Key actions: Complete Ithos evaluation by Q1; make build/buy decision; begin migration planning by Q2\n• Owner function: VP R&D + IT\n• Success metric: New system selected and migration plan approved by month 6",
      },
      {
        heading: "What We Are NOT Doing",
        content:
          "• Aerosol line investment — defer until OTC capex is complete and supplements gap is resolved\n• APAC market entry as a primary initiative — address via consulting partnership only\n• New category entry beyond supplements — maintain focus\n• Significant new enterprise client pursuits that would increase top-client concentration",
      },
      {
        heading: "90-Day Milestones",
        content:
          "1. Month 1: Appoint M&A lead for supplements acquisition evaluation; engage advisor or begin direct diligence on identified target\n2. Month 1: Launch indie brand health scoring — baseline current churn rate and identify top 10 at-risk accounts\n3. Month 2: Complete Ithos vs. alternatives evaluation; present recommendation to leadership\n\nNote: This assessment is based on a single strategy session. Validate assumptions with your full leadership team and financial data before acting on recommendations.",
      },
    ],
  },
];

// ============================================================================
// TRACK A — Handoff Automation fixtures (Sales → R&D)
// ============================================================================

const HANDOFF_SALES_RD_DOC: Doc = {
  title: "Technical Formulation Brief — Luminance Brightening Serum (Indie Brand: Aura Collective)",
  sections: [
    {
      heading: "Project Overview",
      content:
        "Client brand: Aura Collective (indie brand, DTC-first, clean beauty positioning)\nProduct concept: Lightweight brightening serum with visible dark spot reduction\nTarget consumer: Women 28–45, hyperpigmentation concerns, clean beauty committed\nProduct category: Skincare — face serum",
    },
    {
      heading: "Product Specifications",
      content:
        "Format/texture: Lightweight water-based serum; fast-absorbing, non-greasy finish\nKey actives and target concentrations:\n• Niacinamide — 5% (brightening, pore minimizing)\n• Tranexamic acid — 3% (dark spot reduction)\n• Vitamin C (ascorbyl glucoside, stable form) — 2–3%\n• Hyaluronic acid (low and high MW) — 1% combined\nFragrance: Fragrance-free (client hard requirement — clean beauty positioning)\nColor: Clear to very slightly pale yellow — no added color\nKey claims to support: Reduces appearance of dark spots in 8 weeks, brightens skin tone, minimizes pores",
    },
    {
      heading: "Regulatory & Market Requirements",
      content:
        "Target launch markets: United States (primary), Canada (secondary launch, 6 months post-US)\nUS: FDA MoCRA compliance — cosmetic product; no drug claims; safety substantiation required\nCanada: Health Canada Cosmetic Regulations — INCI labeling, bilingual label (English/French)\nClaim substantiation required: '8-week dark spot reduction' claim requires clinical or consumer perception study\nNo market-specific restricted ingredient concerns identified for niacinamide or tranexamic acid at target concentrations — confirm ascorbyl glucoside status in Canada",
    },
    {
      heading: "Packaging Constraints",
      content:
        "Primary container: 30mL glass dropper bottle (client has sourced — R&D to confirm compatibility)\nClosure: Pipette dropper\nKey constraint: Glass packaging — formula must be tested for glass interaction; pH management critical\nNo aerosol or pressurized packaging",
    },
    {
      heading: "Development Parameters",
      content:
        "Target shelf life: 24 months from manufacture date\nTarget pH: 5.5–6.0 (optimal for niacinamide stability and skin compatibility)\nKnown exclusions: No parabens, no synthetic fragrance, no mineral oil, no silicones (clean beauty formulation standard)\nBenchmark products provided by client: The Ordinary Niacinamide 10% + Zinc 1%, Paula's Choice 10% Niacinamide Booster\nClient note: Does NOT want to match benchmark exactly — wants a more sophisticated, skin-feel-optimized formula at lower niacinamide concentration with tranexamic acid synergy",
    },
    {
      heading: "Commercial Context",
      content:
        "Estimated launch volume: 5,000 units (initial), scaling to 15,000–20,000 units/month by month 6\nTarget launch date: 6 months from project start\nBudget: Development fee budget not disclosed; client is cost-sensitive on COGS — target formula cost under $4.50/unit at 10,000 unit scale\nTimeline pressure: Client has a retail pitch in 7 months — formula lock required by week 8",
    },
    {
      heading: "Open Questions for R&D",
      content:
        "• Confirm ascorbyl glucoside stability at target pH with niacinamide — niacin flush risk at pH above 6.5\n• Assess tranexamic acid supplier options and lead time — confirm availability at required purity\n• Confirm glass bottle compatibility — pH and any potential for leaching\n• Determine whether 8-week claim requires partnered clinical study or consumer panel — flag to Sales to discuss with client\n• Confirm preservative system compatible with clean beauty positioning (no phenoxyethanol preference from client — to confirm)",
    },
  ],
};

const HANDOFF_SALES_PLANNING_DOC: Doc = {
  title: "Demand Planning Launch Brief — Luminance Brightening Serum (Aura Collective)",
  sections: [
    {
      heading: "Product & Project Summary",
      content:
        "Product name: Luminance Brightening Serum\nClient brand: Aura Collective\nCategory: Skincare — face serum\nProject status: In formulation development — formula lock target week 8\nLaunch market: United States (primary); Canada +6 months",
    },
    {
      heading: "Launch Parameters",
      content:
        "Target US launch date: Month 6 from project start\nDistribution channels: DTC (Shopify-based, client-owned) — primary channel\nSecondary channel: Potential boutique retail placement; no confirmed retail accounts yet\nPackaging: 30mL glass dropper bottle, single SKU at launch",
    },
    {
      heading: "Volume Forecast",
      content:
        "Initial stocking quantity: 5,000 units\nExpected monthly run rate by month 6: 15,000–20,000 units\nYear 1 volume estimate: ~120,000–150,000 units (assumes ramp from launch)\nForecast basis: Client sales projections based on existing DTC audience size and planned paid media spend\nNote: This is a new brand launch — no historical sales data available. Forecast is marketing-model driven.",
    },
    {
      heading: "SKU Structure",
      content:
        "SKUs at launch: 1 (30mL glass dropper)\nFuture variants: Client has mentioned potential 50mL size for retail — not confirmed, not in Year 1 plan\nNo secondary packaging variants planned at launch",
    },
    {
      heading: "Seasonality & Promotional Calendar",
      content:
        "No strong seasonal pattern expected for a brightening serum\nKnown promotional events: Launch campaign planned (exact date TBD); Black Friday / Cyber Monday likely promotional push\nInfluencer seeding: Client plans pre-launch influencer program — may generate short-term demand spike 2–4 weeks post-launch",
    },
    {
      heading: "Supply Constraints",
      content:
        "• Tranexamic acid: Specialty active — confirm supplier lead time with R&D; may require 4–6 week advance procurement\n• Glass dropper bottle: Client-sourced primary packaging — confirm lead time with client; Planning to track independently\n• Ascorbyl glucoside: Confirm availability and lead time with R&D during formulation\n• MOQ: To be confirmed once formula is locked and BOM is finalized",
    },
    {
      heading: "Assumptions & Risks",
      content:
        "Key assumptions:\n• Client DTC audience conversion rate as projected — no validation data available\n• Retail placement does not materialize in Year 1 (upside risk if it does)\n• Formula lock achieved by week 8 — any delay directly compresses launch window\n\nTop demand risks:\n• New brand with no sales history — forecast confidence is low; plan for +/- 40% variance in months 1–3\n• Influencer-driven spike may create short-term stockout risk if not buffered\n• Retail pitch success (positive risk) could require rapid scale-up beyond current plan",
    },
    {
      heading: "Planning Actions Required",
      content:
        "1. Confirm formula lock date from R&D (target week 8) to finalize production scheduling\n2. Obtain BOM from R&D post-formula lock to assess raw material lead times\n3. Coordinate with client on glass bottle packaging lead time and delivery schedule\n4. Set initial safety stock policy — recommend 4-week cover given forecast uncertainty\n5. Flag tranexamic acid as long-lead-time item to Procurement immediately",
    },
  ],
};

// ============================================================================
// docx builder
// ============================================================================

function buildDocSections(documents: Doc[]): Paragraph[] {
  const children: Paragraph[] = [];
  for (const doc of documents) {
    children.push(new Paragraph({
      text: doc.title,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
    }));
    for (const section of doc.sections ?? []) {
      children.push(new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
      const lines = (section.content ?? "").split("\n");
      for (const line of lines) {
        if (!line.trim()) { children.push(new Paragraph({ text: "", spacing: { after: 60 } })); continue; }
        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("□");
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
    { pass: doc.title.includes(expectedTitleFragment), message: `title contains "${expectedTitleFragment}"` },
    { pass: Array.isArray(doc.sections) && doc.sections.length >= minSections, message: `has ≥${minSections} sections (got ${doc.sections?.length ?? 0})` },
    ...doc.sections.map((s) => ({
      pass: typeof s.content === "string" && s.content.length > 20,
      message: `  section "${s.heading}" has content`,
    })),
  ];
}

function assertAmerican(text: string): TestResult[] {
  const britishPatterns = [
    ["standardise", "standardize"],
    ["organise", "organize"],
    ["colour", "color"],
    ["labelling", "labeling"],
    ["programme", "program"],
  ];
  return britishPatterns.map(([british, american]) => ({
    pass: !text.toLowerCase().includes(british),
    message: `no British "${british}" — use "${american}"`,
  }));
}

// ============================================================================
// Main
// ============================================================================

async function run() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  CosmoLab Phase 1.5 Sprint 2 — Zero-Cost Test Runner         ║");
  console.log("║  Track A: Handoff Automation  ·  Track B: Strategy Session   ║");
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

  // ── Track B: Strategy Session ────────────────────────────────────────────
  console.log("══ TRACK B: Business Strategy Session ══════════════════════════\n");

  console.log("TEST B-1: Strategy conversation fixture");
  report([
    { pass: STRATEGY_CONVERSATION.length >= 14, message: `conversation has ${STRATEGY_CONVERSATION.length} turns (≥14 expected)` },
    { pass: STRATEGY_CONVERSATION[0].role === "assistant", message: "first message is from assistant" },
    { pass: STRATEGY_CONVERSATION[STRATEGY_CONVERSATION.length - 1].content.includes("Type 'generate'"), message: "ends with 'Type generate'" },
    { pass: STRATEGY_CONVERSATION.some((m) => m.content.includes("revenue")), message: "revenue covered" },
    { pass: STRATEGY_CONVERSATION.some((m) => m.content.toLowerCase().includes("capacity")), message: "capacity covered" },
    { pass: STRATEGY_CONVERSATION.some((m) => m.content.toLowerCase().includes("client concentration")), message: "client concentration covered" },
    { pass: STRATEGY_CONVERSATION.some((m) => m.content.toLowerCase().includes("competitive")), message: "competitive position covered" },
    { pass: STRATEGY_CONVERSATION.some((m) => m.content.toLowerCase().includes("acquisition")), message: "M&A / strategic options covered" },
  ]);
  fs.writeFileSync(path.join(STRATEGY_DIR, "conversation.json"), JSON.stringify(STRATEGY_CONVERSATION, null, 2));
  console.log(`  📁 Saved conversation.json (${STRATEGY_CONVERSATION.length} turns)\n`);

  console.log("TEST B-2: Strategy document fixture structure");
  const expectedStratTitles = ["Strategic Situation Assessment", "Growth Opportunity Matrix", "Capability Gap Analysis", "12-Month Strategic Priorities"];
  report([
    { pass: STRATEGY_DOCUMENTS.length === 4, message: `document count: 4 (got ${STRATEGY_DOCUMENTS.length})` },
    ...expectedStratTitles.map((t) => ({ pass: STRATEGY_DOCUMENTS.some((d) => d.title.includes(t)), message: `document "${t}" present` })),
    ...STRATEGY_DOCUMENTS.flatMap((d) => assertDoc(d, d.title.split(" ")[0], 4)),
  ]);

  console.log("\nTEST B-3: American English in strategy documents");
  const stratText = STRATEGY_DOCUMENTS.map((d) => d.sections.map((s) => s.content).join(" ")).join(" ");
  report(assertAmerican(stratText));

  fs.writeFileSync(path.join(STRATEGY_DIR, "response.json"), JSON.stringify({ documents: STRATEGY_DOCUMENTS }, null, 2));
  console.log(`  📁 Saved response.json\n`);

  console.log("TEST B-4: Strategy .docx build");
  try {
    const size = await buildDocx(STRATEGY_DOCUMENTS, path.join(STRATEGY_DIR, "documents.docx"));
    console.log(`  ✅ Packer.toBuffer() succeeded`);
    console.log(`  ✅ File size: ${(size / 1024).toFixed(1)}KB`);
    console.log(`  📁 Saved documents.docx\n`);
    totalPassed += 2;
  } catch (err) {
    console.log(`  ❌ docx build failed: ${String(err)}`);
    totalFailed++;
  }

  // ── Track A: Handoff Automation ──────────────────────────────────────────
  console.log("══ TRACK A: Handoff Automation ══════════════════════════════════\n");

  const handoffs = [
    { key: "sales-rd",      doc: HANDOFF_SALES_RD_DOC,      titleFrag: "Technical Formulation Brief",   minSec: 6 },
    { key: "sales-planning", doc: HANDOFF_SALES_PLANNING_DOC, titleFrag: "Demand Planning Launch Brief", minSec: 7 },
  ];

  for (const h of handoffs) {
    console.log(`TEST A-${h.key}: ${h.titleFrag}`);
    report(assertDoc(h.doc, h.titleFrag, h.minSec));

    console.log(`\nTEST A-${h.key}-american: American English`);
    const hText = h.doc.sections.map((s) => s.content).join(" ");
    report(assertAmerican(hText));

    const docPath = path.join(HANDOFF_DIR, `${h.key}.docx`);
    const jsonPath = path.join(HANDOFF_DIR, `${h.key}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify({ documents: [h.doc] }, null, 2));

    try {
      const size = await buildDocx([h.doc], docPath);
      console.log(`  ✅ .docx built: ${(size / 1024).toFixed(1)}KB — ${h.key}.docx\n`);
      totalPassed++;
    } catch (err) {
      console.log(`  ❌ docx build failed: ${String(err)}\n`);
      totalFailed++;
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = totalPassed + totalFailed;
  console.log("══════════════════════════════════════════════════════════════════");
  console.log(`RESULTS: ${totalPassed}/${total} assertions passed  |  ${totalFailed} failed`);
  console.log(`API calls made: 0  |  Cost: $0.00`);
  console.log("══════════════════════════════════════════════════════════════════");
  console.log("\n📁 Results:");
  console.log(`  Strategy:  ${STRATEGY_DIR}`);
  console.log(`  Handoffs:  ${HANDOFF_DIR}`);

  if (totalFailed > 0) process.exit(1);
}

run().catch((err) => { console.error("Runner crashed:", err); process.exit(1); });
