/**
 * CosmoLab Phase 1.5 Sprint 5 & 6 — Zero-Cost Test Runner
 *
 * Tests:
 *   Sprint 5: IT Systems & Digital Transformation Advisory
 *   Sprint 6: Regulatory & Quality Transformation Advisory
 *
 * API calls made: 0  |  Cost: $0.00
 *
 * Run with: npx tsx test/auto-test/phase-1-5-sprint5-6-runner.ts
 */

import { Document, Packer, Paragraph, HeadingLevel, BorderStyle } from "docx";
import fs from "fs";
import path from "path";

const BASE    = path.join(process.cwd(), "test", "auto-test", "results", "phase-1-5");
const IT_DIR  = path.join(BASE, "it-assessment");
const REG_DIR = path.join(BASE, "regulatory-assessment");

for (const dir of [IT_DIR, REG_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

type Message = { role: "user" | "assistant"; content: string };
type Section = { heading: string; content: string };
type Doc     = { title: string; sections: Section[] };

// ============================================================================
// SPRINT 5 — IT Systems & Digital Transformation Advisory fixtures
// ============================================================================

const IT_CONVERSATION: Message[] = [
  {
    role: "assistant",
    content:
      "Hello — I'm CosmoLab AI, your IT and digital transformation advisor. I'm here to build a clear picture of your current systems landscape and identify where the highest-value transformation opportunities are. Let's start at the top: can you walk me through which systems you're currently running across formulation management, shop floor, ERP, lab, and quality — even just naming the tools will help me understand where we are?",
  },
  {
    role: "user",
    content:
      "Sure. For formulation management we're on Coptis — we've been on it for about 8 years. Shop floor we use a mix of RedZone on two of our four lines and paper batch records on the other two. ERP is NetSuite, been live for 3 years. For lab, we have a custom spreadsheet-based LIMS that IT built internally about 5 years ago. Quality is MasterControl for document control and deviations, but we're only using maybe 40% of its functionality.",
  },
  {
    role: "assistant",
    content:
      "That's a helpful overview — you have a fairly typical mid-size CM footprint with a few clear maturity gaps. Let me dig into Coptis first since formulation management sits at the center of everything. What are the biggest pain points you're experiencing with it day-to-day? And have you started any evaluation of Ithos or other alternatives?",
  },
  {
    role: "user",
    content:
      "The main pain points with Coptis are formula versioning — it's clunky to manage multiple iterations — and the regulatory dossier generation is basically manual. You can export a formula but you still have to build the safety dossier by hand. We did a demo of Ithos about six months ago. The formulation team loved it. IT is more hesitant because of the migration complexity and cost. We haven't made a decision yet.",
  },
  {
    role: "assistant",
    content:
      "The Ithos hesitation from IT is common — the migration of 8 years of formulas and ingredient data is a legitimate concern, but it's manageable if scoped properly. The regulatory dossier gap in Coptis is also a real bottleneck in many MoCRA-compliance conversations. On RedZone: you said two of four lines are live. What's driving the delay on the other two — budget, prioritization, or something operational?",
  },
  {
    role: "user",
    content:
      "Combination of budget and the fact that those two lines are our OTC drug lines. There's more complexity in the batch record requirements for OTC — we weren't sure RedZone could handle the 21 CFR Part 211 electronic batch record requirements out of the box. So we've been holding off until we can get that answered.",
  },
  {
    role: "assistant",
    content:
      "That's a smart pause — electronic batch records for OTC drug lines need to meet FDA 21 CFR Part 11 requirements for electronic records, not just Part 211 cGMP. RedZone does have a compliant configuration but it requires proper validation, audit trail setup, and the system must be part of your quality system documentation. Worth a targeted conversation with RedZone's pharma/OTC implementation team.\n\nMoving to your LIMS — you mentioned it's a custom internally-built spreadsheet system. How are you managing stability data, micro testing results, and CoA generation today? And what are the data integrity risks you're aware of?",
  },
  {
    role: "user",
    content:
      "Stability data is in Excel — each project has its own workbook. Micro results come from our contract lab and get manually transcribed into another spreadsheet. CoA generation is semi-automated — we have a Word template that pulls from a master spec spreadsheet, but someone still has to manually fill in actual results. The data integrity risk is real: we've had a couple of instances where incorrect values were transcribed. Nothing that caused a product release issue, but it's a concern.",
  },
  {
    role: "assistant",
    content:
      "Manual transcription between a contract lab and a spreadsheet LIMS is one of the highest data integrity risk points in a CM operation — and it's exactly what FDA data integrity guidance targets. The combination of manual CoA population and Excel-based stability tracking is also going to be increasingly problematic as you grow and as regulatory scrutiny increases.\n\nOn MasterControl — you said you're using about 40% of its capability. What's not being used? And is the QMS gap a training issue, a configuration issue, or is the system not meeting your needs?",
  },
  {
    role: "user",
    content:
      "The CAPA module is barely used — deviations get raised but CAPA is done in emails and tracked in a separate spreadsheet. Change control exists in MasterControl but the workflow is configured poorly so people work around it. We also have supplier document management outside the system entirely. It's partly a training issue and partly that the initial implementation was rushed and nobody went back to fix the configuration.",
  },
  {
    role: "assistant",
    content:
      "A poorly configured QMS that gets worked around is often worse than no QMS — you have the compliance liability without the operational benefit. The CAPA gap is significant: if deviations aren't linked to formal CAPA actions in the system, you're producing documentation that wouldn't survive an audit.\n\nLet me ask about AI tools and organizational readiness. What AI tools is the business using today — anything in production, anything being piloted? And roughly what's the IT team size and the appetite for transformation investment over the next 12 months?",
  },
  {
    role: "user",
    content:
      "AI tools — we're using ChatGPT informally across the business, nothing sanctioned. R&D has started experimenting with it for formulation research. Nothing in production. IT team is 4 people including myself. Budget for transformation is probably $400K–$600K over the next 12 months if we can make the business case. The CEO is supportive — she's the one who pushed for this assessment.",
  },
  {
    role: "assistant",
    content:
      "A $400–600K transformation budget with CEO sponsorship is actually a strong position for a CM your size. That's enough to make the Coptis-to-Ithos decision, fix the MasterControl configuration, and start a proper LIMS replacement — if prioritized correctly.\n\nLast question before I pull together your documents: if you had to pick the top three things that cost your business the most time or money right now from a systems perspective, what would they be?",
  },
  {
    role: "user",
    content:
      "Number one is the manual regulatory dossier work from Coptis — it probably costs us 2–3 days per new product launch and we're doing 40+ launches a year. Number two is the LIMS situation — the transcription errors and the time spent building CoAs manually. Number three is the MasterControl workarounds — we're spending significant time managing deviations outside the system and it creates audit risk.",
  },
  {
    role: "assistant",
    content:
      "That's exactly the prioritization I'd recommend — regulatory dossier automation, LIMS replacement, and QMS remediation map perfectly onto your stated budget and are sequenceable without significant dependencies between them.\n\nI have everything I need. Type 'generate' to create your IT transformation documents.",
  },
  {
    role: "user",
    content: "generate",
  },
];

const IT_DOCUMENTS: Doc[] = [
  {
    title: "IT Systems Readiness Assessment",
    sections: [
      {
        heading: "Executive Summary",
        content:
          "This CM operates a mid-maturity technology stack with three systemic risk areas requiring prioritized investment: (1) formulation management automation gaps in Coptis that are creating regulatory dossier bottlenecks at scale; (2) a custom spreadsheet-based LIMS with documented data integrity risks in micro transcription and CoA generation; and (3) a MasterControl QMS that is significantly under-utilized due to poor initial configuration, resulting in CAPA and change control processes running outside the system. The company has strong executive sponsorship and a credible $400–600K budget for transformation.",
      },
      {
        heading: "System Landscape Overview",
        content:
          "PLM / Formulation Management: Coptis — 8 years old — Readiness Score: 2/5\nShop Floor / MES: RedZone (2 of 4 lines) + paper batch records (2 lines) — Readiness Score: 2/5\nERP: NetSuite — 3 years old — Readiness Score: 3/5\nLIMS: Custom internal spreadsheet system — 5 years old — Readiness Score: 1/5\nQMS: MasterControl (40% utilized) — Readiness Score: 2/5",
      },
      {
        heading: "PLM / Formulation Management",
        content:
          "Current state: Coptis has been in place for 8 years. Core pain points are formula versioning management (clunky for multi-iteration products) and manual regulatory dossier generation, which costs an estimated 2–3 days per new product launch across 40+ launches annually — approximately 80–120 person-days per year lost to manual dossier work.\nIthos evaluation: Demo completed 6 months ago; formulation team favors migration; IT hesitant due to migration complexity and cost.\nGap: No automated regulatory dossier output (EU safety assessment, MoCRA safety substantiation); manual process at scale is unsustainable and MoCRA-exposed.",
      },
      {
        heading: "Shop Floor & MES",
        content:
          "Current state: RedZone active on 2 of 4 lines; paper batch records on OTC drug lines (2 lines).\nOTC line gap: Paper batch records for FDA-regulated OTC drug lines carry significant compliance risk. Electronic batch records require FDA 21 CFR Part 11 compliance (audit trails, access controls, record integrity) in addition to cGMP (21 CFR Part 211) requirements.\nRedZone OTC path: RedZone supports compliant electronic batch record configurations for drug manufacturing, but requires proper IQ/OQ/PQ validation and integration with the quality system. A targeted RedZone engagement is needed to scope the OTC line implementation.",
      },
      {
        heading: "LIMS & Lab Data Management",
        content:
          "Current state: Custom Excel-based LIMS. Stability data managed per-project in individual workbooks. Micro results manually transcribed from contract lab. CoA generation via Word template with manual result entry.\nData integrity risk: HIGH. Manual transcription between external lab and internal spreadsheet creates FDA 21 CFR Part 11 / data integrity exposure. Documented transcription errors have occurred. As MoCRA and OTC compliance scrutiny increases, this system is the highest regulatory risk point in the IT landscape.\nRecommendation urgency: Replace within 12 months — this is the highest-priority system investment.",
      },
      {
        heading: "QMS Assessment",
        content:
          "Current state: MasterControl deployed but only 40% utilized. CAPA module not used in practice — deviations are raised but corrective actions tracked in email and spreadsheets. Change control workflow configured incorrectly and routinely bypassed. Supplier document management outside the system entirely.\nCompliance risk: Working around a QMS creates a dual-record situation — the system shows one state, actual practice shows another. This is a high-audit-risk configuration. FDA investigators and third-party auditors regularly identify QMS workarounds as significant findings.\nPath forward: MasterControl reconfiguration is the right first step — replace the workflows, mandate CAPA closure in-system, and migrate supplier documents. Full replacement is not warranted; the system is capable but poorly deployed.",
      },
      {
        heading: "Critical Risk Register",
        content:
          "Risk 1: LIMS data integrity — manual transcription of lab results — Severity: HIGH — Action: Begin LIMS replacement evaluation immediately; interim control: dual-check transcription process\nRisk 2: OTC paper batch records — 21 CFR Part 211 / Part 11 exposure — Severity: HIGH — Action: Scope RedZone OTC implementation; interim: ensure paper records are fully complete and reviewed\nRisk 3: QMS CAPA not in-system — audit-risk documentation gap — Severity: HIGH — Action: MasterControl reconfiguration project within 90 days\nRisk 4: Coptis dossier bottleneck — regulatory substantiation manual at scale — Severity: MEDIUM — Action: Ithos decision within 6 months\nRisk 5: Unsanctioned AI tool use (ChatGPT) — data security and IP risk — Severity: MEDIUM — Action: Establish AI usage policy within 30 days",
      },
    ],
  },
  {
    title: "Digital Transformation Roadmap",
    sections: [
      {
        heading: "Roadmap Overview",
        content:
          "This roadmap is sequenced by risk-and-impact priority, not ease. The three areas with the highest compliance risk and operational cost are addressed first: LIMS replacement, QMS remediation, and OTC batch record digitization. The Coptis/Ithos PLM decision, while strategically important, does not carry the same immediate compliance risk and is sequenced at 6 months. AI tooling is sequenced last — after the foundational data infrastructure is improved — to ensure AI tools are built on clean, reliable data.",
      },
      {
        heading: "90-Day Quick Wins",
        content:
          "1. Establish AI usage policy — formalize acceptable use of AI tools (ChatGPT, etc.); assign IT owner; communicate company-wide. Owner: IT Director. Cost: minimal.\n2. MasterControl CAPA and change control remediation — engage MasterControl implementation partner to reconfigure CAPA module and change control workflow; mandate in-system CAPA closure. Owner: VP Quality + IT. Cost: $20–40K consulting.\n3. LIMS vendor evaluation — issue RFP or begin demos for a commercial LIMS (LabVantage, STARLIMS, or mid-market options such as LabArchives or Qualio); prioritize vendors with cosmetic/OTC CM references. Owner: IT Director + VP R&D. Cost: evaluation time only.\n4. RedZone OTC scoping — engage RedZone to scope 21 CFR Part 11 compliant electronic batch record implementation for OTC lines; get proposal and timeline. Owner: IT Director + VP Manufacturing. Cost: scoping only.",
      },
      {
        heading: "6-Month Initiatives",
        content:
          "1. LIMS selection and implementation start — select vendor; begin implementation (phased: stability first, then micro/analytical, then CoA automation). Budget: $80–150K. Owner: IT + VP R&D.\n2. Coptis vs. Ithos decision — complete business case; make go/no-go decision on Ithos migration; if go, begin migration planning and data audit. Budget: $150–250K for full migration. Owner: IT Director + VP R&D.\n3. RedZone OTC implementation — execute IQ/OQ/PQ validated electronic batch record deployment on OTC lines. Budget: $60–100K. Owner: IT + VP Manufacturing + VP Quality.\n4. Supplier document migration to MasterControl — migrate supplier COAs, qualification records, and approved supplier list into MasterControl. Owner: VP Quality + IT. Cost: internal labor.",
      },
      {
        heading: "12-Month Strategic Investments",
        content:
          "1. Ithos migration completion (if approved at 6 months) — full formula and ingredient data migration from Coptis; staff training; regulatory dossier automation go-live. Expected benefit: 80–120 person-days per year recovered from dossier work.\n2. LIMS full rollout — stability, micro, analytical, and CoA generation all running in the new LIMS; contract lab data integrated via API or structured import. Expected benefit: elimination of manual transcription errors; FDA data integrity risk resolved.\n3. AI pilot deployment — with clean LIMS and PLM data, launch first AI pilot (recommended: formula search and retrieval — see AI Build vs. Buy document). Budget: $30–60K. Owner: IT + VP R&D.",
      },
      {
        heading: "Coptis / Ithos Decision Path",
        content:
          "Recommended path: Proceed to Ithos migration. The 2–3 day/launch manual dossier work is a quantifiable, growing cost — at 40+ launches per year, you are paying for Ithos in avoided labor within 18 months. The formulation team's buy-in is a significant de-risker.\nDecision timeline: Complete internal business case by month 3; make go/no-go decision by month 6; begin migration by month 7 with target completion at month 12–14.\nMigration risk mitigation: Run Coptis and Ithos in parallel for 3 months; prioritize migrating the last 3 years of active formulas first; archive older formulas in read-only Coptis access.",
      },
      {
        heading: "Implementation Sequencing Rationale",
        content:
          "LIMS before PLM: Data integrity risk is more immediate than formulation workflow efficiency. A LIMS incident could trigger regulatory action; a Coptis inefficiency costs time but not compliance standing.\nQMS remediation before new QMS: MasterControl is capable — the problem is configuration and discipline. Reconfiguring costs $20–40K; replacement would cost $200–400K and 12–18 months.\nAI last: AI tools built on spreadsheet LIMS data will produce unreliable outputs. Clean the data infrastructure first.",
      },
    ],
  },
  {
    title: "AI Build vs. Buy Recommendation",
    sections: [
      {
        heading: "Framework",
        content:
          "For a CM IT team of 4 with a $400–600K total transformation budget, the default position should be Buy or Partner — not Build. Internal build requires ongoing maintenance, security patching, and product management capability that a 4-person IT team cannot sustain while also running a transformation program. Build is appropriate only for narrow, high-IP use cases where no vendor solution exists and the business has a clear competitive advantage to protect.",
      },
      {
        heading: "Use Case Analysis",
        content:
          "Formula Search & Retrieval | Buy (Ithos native or add-on) | Ithos includes semantic formula search; avoid building a duplicate capability | Use Ithos built-in after migration\n\nRegulatory Pre-Screening | Buy (CosmoLab AI or equivalent SaaS) | Regulatory rules change frequently; maintaining a bespoke engine is costly | Evaluate CosmoLab AI regulatory flagging module\n\nDemand Forecasting | Buy (NetSuite AI add-on or Inventory Planner) | NetSuite has native or partner AI forecasting; no need to build | NetSuite Einstein or Inventory Planner SaaS\n\nBatch Record Anomaly Detection | Partner (RedZone AI features) | RedZone has native OEE anomaly detection in roadmap; leverage platform | RedZone built-in after OTC line deployment\n\nStability Data Prediction | Defer | Requires clean LIMS data first; premature without data foundation | Revisit at month 18\n\nCoA Auto-Generation | Buy (LIMS native) | All commercial LIMS platforms include CoA generation; not a build case | Included in LIMS selection criteria\n\nSupplier Qualification Automation | Buy (MasterControl vendor portal or add-on) | MasterControl has supplier portal capability — activate it | Phase 2 of MasterControl remediation\n\nCustomer Inquiry Routing | Defer | Not a current bottleneck based on session; no AI investment justified yet | Revisit if customer volume grows significantly\n\nClaim Substantiation Assistance | Partner (regulatory AI vendor) | Requires regulatory expertise baked into model; not a build case for IT | Evaluate specialist vendors\n\nInternal Knowledge Search (formulas, SOPs, specs) | Buy (Microsoft Copilot / SharePoint AI) | Company likely already has M365 licensing; Copilot adds AI search across SharePoint/Teams | M365 Copilot — estimated $30/user/month",
      },
      {
        heading: "Prioritized Implementation Order",
        content:
          "Priority 1 — Formula Search (Ithos): Directly addresses the #1 stated pain point (dossier bottleneck); included in Ithos migration cost; no separate investment.\nPriority 2 — CoA Auto-Generation (LIMS native): Directly addresses the #2 stated pain point; included in LIMS selection criteria; no separate AI investment.\nPriority 3 — Internal Knowledge Search (M365 Copilot): Low cost, high utility for a 4-person IT team supporting a 40+ launch/year business; enables SOP and spec search across the organization.",
      },
      {
        heading: "Internal Capability Assessment",
        content:
          "A 4-person IT team running a transformation program does not have capacity for bespoke AI development. Every hour spent on a custom build is an hour not spent on LIMS implementation or QMS remediation. The recommendation is categorical: Buy or Partner for all AI use cases in the next 18 months. Revisit build feasibility after the core systems transformation is complete and if the IT team grows.",
      },
      {
        heading: "Key Risks",
        content:
          "• Over-investing in AI before fixing data infrastructure: AI tools trained on Excel-based LIMS data will produce low-quality outputs and erode trust in AI broadly. Fix LIMS first.\n• Shadow AI proliferation: Unsanctioned ChatGPT use is already occurring. Without a policy and a sanctioned alternative, employees will continue to use unsanctioned tools — including pasting formula and client data into public AI systems. Address immediately.\n• Vendor lock-in: Prefer SaaS/cloud AI tools with data portability over deeply embedded proprietary AI that would be costly to migrate away from.",
      },
    ],
  },
  {
    title: "Integration Architecture Brief",
    sections: [
      {
        heading: "Current Integration State",
        content:
          "Based on the assessment conversation, the current integration landscape has significant gaps:\n• Coptis and MasterControl: not integrated — formula and ingredient data does not flow to QMS\n• LIMS (spreadsheet): completely isolated — no inbound data from contract lab, no outbound data to ERP or QMS\n• RedZone and NetSuite: not confirmed integrated — production actuals may not flow to ERP automatically\n• MasterControl and NetSuite: not confirmed integrated — quality holds may not automatically update inventory availability\nConclusion: This is a largely siloed system landscape. Data moves between systems via email, manual transcription, or spreadsheet exports.",
      },
      {
        heading: "Recommended Integration Sequence",
        content:
          "Phase 1 (0–6 months): Fix the foundations before connecting systems. LIMS replacement and QMS remediation come first. Connecting a broken system to others spreads the problem.\nPhase 2 (6–12 months): Connect LIMS to ERP (NetSuite). When a batch is released by QC, the CoA and release status should flow to NetSuite automatically — eliminating the manual inventory release step.\nPhase 3 (12–18 months): Connect PLM (Ithos) to QMS (MasterControl). Formula changes should trigger change control notifications automatically. Ingredient regulatory status should inform deviation investigation context.\nPhase 4 (18–24 months): Connect MES (RedZone) to ERP. Production actuals, OEE data, and batch completion should update NetSuite work orders without manual entry.",
      },
      {
        heading: "Integration Approach Options",
        content:
          "For a 4-person IT team, the recommended approach is native connectors and vendor-supported integrations — not custom middleware:\n• LIMS → NetSuite: Most commercial LIMS platforms offer a NetSuite connector or REST API. Use the vendor-supported connector. Do not build a custom integration.\n• Ithos → MasterControl: Ithos has a documented API; MasterControl supports webhooks and API triggers. A lightweight integration layer (Zapier for Business or a minimal custom API script) is sufficient — middleware platforms like MuleSoft are over-engineered for this use case at this company's size.\n• RedZone → NetSuite: RedZone offers native ERP integration — confirm NetSuite is on the supported list during the OTC scoping engagement.\nGeneral principle: Prefer vendor-native integrations over custom builds. Every custom integration is a maintenance burden.",
      },
      {
        heading: "Data Governance Principles",
        content:
          "1. Single source of truth per data type: Formula specifications live in PLM (Ithos). Batch records live in MES (RedZone) and QMS (MasterControl). Financial data lives in ERP (NetSuite). No data type should have two authoritative sources.\n2. No manual transcription as a permanent process: If data is being manually copied between systems, that is a gap in the integration architecture that must be closed — not a process to be improved with better checklists.\n3. Data integrity by design: All systems that hold regulated data (LIMS, QMS, MES for OTC lines) must meet FDA 21 CFR Part 11 requirements: audit trails, access controls, and record integrity.\n4. Change-control-gated master data: Changes to formulas, specifications, and approved suppliers must flow through MasterControl change control before they take effect in downstream systems.\n5. Vendor data portability as a selection criterion: Do not select any system that cannot export your data in a standard format. Avoid lock-in.\n6. Staged validation: All systems used for regulated data require IQ/OQ/PQ validation before use in a GMP or GLP context. Build validation into the project plan and budget from day one.",
      },
      {
        heading: "Recommended Next Steps",
        content:
          "1. Month 1: Issue LIMS RFP — include NetSuite integration capability as a scored selection criterion. Shortlist to 2–3 vendors within 45 days.\n2. Month 1: Engage MasterControl implementation partner for CAPA and change control reconfiguration — target go-live in 90 days.\n3. Month 2: Brief the Ithos team on migration scope — request a data migration estimate based on your Coptis formula count and ingredient library size.\n4. Month 2: Engage RedZone for OTC line scoping — request a 21 CFR Part 11 compliant implementation proposal including validation deliverables.\n5. Month 1: Establish and communicate AI usage policy — this is a 1–2 week task with no budget requirement and immediate risk reduction value.",
      },
    ],
  },
];

// ============================================================================
// SPRINT 6 — Regulatory & Quality Transformation Advisory fixtures
// ============================================================================

const REGULATORY_CONVERSATION: Message[] = [
  {
    role: "assistant",
    content:
      "Hello — I'm CosmoLab AI, your regulatory and quality transformation advisor. I'm here to build a clear picture of your current compliance posture and identify where the highest-risk gaps are. Let's start with scope: which markets do you currently manufacture for, and which product types — cosmetics, OTC drug products, dietary supplements, or a mix?",
  },
  {
    role: "user",
    content:
      "We manufacture for the US primarily — about 85% of our volume. We have some EU business through a brand that distributes in Germany and France, probably 10% of volume. The remaining 5% is Canada. Product types: about 65% cosmetics, 25% OTC drug products (primarily acne and sunscreen), and 10% supplements.",
  },
  {
    role: "assistant",
    content:
      "That's a significant regulatory footprint — you're operating under US FDA cosmetics (MoCRA), US FDA OTC drug cGMP (21 CFR Parts 210/211), EU Cosmetics Regulation 1223/2009, DSHEA, and Health Canada simultaneously. Let me start with MoCRA since it's the most recent and often the least fully implemented. How far along is your MoCRA compliance program — specifically: safety substantiation status for your cosmetic portfolio, responsible person designation, and product listing in the FDA CARES portal?",
  },
  {
    role: "user",
    content:
      "MoCRA is partially done. We have a responsible person designation in place. Product listing — we've listed about 60% of our cosmetic portfolio; the other 40% is behind because our regulatory team is small (2 people) and they've been prioritizing the OTC work. Safety substantiation is the biggest gap — we have safety data for most products but it's not compiled in a format that would constitute a formal substantiation dossier. It's in various places across product files.",
  },
  {
    role: "assistant",
    content:
      "A 40% product listing gap is a real exposure — MoCRA listing is legally required for cosmetics marketed in the US and FDA enforcement is ramping up. The safety substantiation gap is the more significant medium-term risk: while FDA hasn't issued broad enforcement actions yet, the requirement is live and the expectation is that manufacturers have substantiation on file and accessible.\n\nOn OTC drug products — you mentioned acne and sunscreen. Those are both FDA monograph products. How would you characterize your cGMP compliance posture for the OTC drug lines? And when did you last have an FDA inspection, and what were the findings?",
  },
  {
    role: "user",
    content:
      "Our cGMP posture is solid for the core requirements — batch records, specifications, testing. Last FDA inspection was 18 months ago, OTC lines only. We received two 483 observations: one on our CAPA system (investigator noted that CAPAs weren't being formally closed out in our QMS) and one on laboratory data integrity (some raw lab data entries lacked contemporaneous dating — a documentation practice issue, not an analytical error). We submitted a response and it was accepted. We haven't had a follow-up inspection.",
  },
  {
    role: "assistant",
    content:
      "Two 483 observations, both accepted — that's a manageable history. But the CAPA observation is a repeat risk if your QMS CAPA closure is still running outside the system. Is that gap resolved since the inspection?\n\nAnd on the lab data integrity observation — was that on your in-house lab or the contract lab, and has the documentation practice been formally corrected with a procedure update and training record?",
  },
  {
    role: "user",
    content:
      "The CAPA gap is partially addressed — we've been better about closing CAPAs in MasterControl for new investigations, but there's still a backlog of older CAPAs that were never formally closed. On the lab data integrity: it was in-house. We updated the SOP and did training. We have the training records. I'm reasonably confident that specific issue is resolved.",
  },
  {
    role: "assistant",
    content:
      "The open CAPA backlog is a risk — if FDA returns and finds CAPAs that were open at the prior inspection still unresolved in the system, that's a repeat observation, which carries more weight than a first-time finding. I'd prioritize closing that backlog before any next inspection.\n\nLet me move to EU. You said you have EU volume in Germany and France. Do you have a formal EU Responsible Person designated, your products notified in CPNP, and Article 10 Product Information Files with safety assessments completed?",
  },
  {
    role: "user",
    content:
      "We work through a European distributor who acts as the responsible person — they handle CPNP notifications for the products they distribute. Article 10 safety assessments — this is where I'm less confident. The distributor has told us they have safety assessments, but we've never reviewed them and they're not in our files. We're essentially trusting that the distributor is compliant.",
  },
  {
    role: "assistant",
    content:
      "That's a significant compliance gap. As the manufacturer, you have joint liability with the responsible person for product safety. If a product is recalled or investigated by a German or French market authority, 'our distributor said they had it covered' is not a defensible position. You need to request and retain copies of the Article 10 safety assessments and the CPNP notification confirmations.\n\nA few more questions. How does your team currently track regulatory changes — MoCRA updates, EU regulation amendments, new restricted ingredient decisions? And how did you first learn about MoCRA?",
  },
  {
    role: "user",
    content:
      "We learned about MoCRA from a trade association newsletter — probably 6 months after it was signed into law. Our regulatory intelligence is mostly reactive: newsletters, conferences, occasionally a regulatory consultant we bring in. We don't have a formal process for monitoring changes or assessing impact on our portfolio.",
  },
  {
    role: "assistant",
    content:
      "Learning about a landmark piece of legislation 6 months post-signing through a newsletter is a reactive posture that creates risk at your scale — particularly with EU regulations which change more frequently. For a CM with your regulatory scope, a more systematic approach (regulatory intelligence software or a retained regulatory consultant on a monitoring retainer) is a reasonable investment.\n\nLast area: supplier qualification. How do you manage your approved supplier list, CoA review, and incoming QC for raw materials?",
  },
  {
    role: "user",
    content:
      "We have an approved supplier list in a spreadsheet. CoA review is done by QC when materials are received — we check that results are within spec. Incoming QC testing: we do skip-lot testing for most materials, full lot testing for OTC drug actives. We had one significant supplier issue two years ago — a silicone supplier sent a mislabeled batch and it made it to the manufacturing floor before someone caught the discrepancy. That was a wake-up call but we haven't done a formal supplier qualification program overhaul since then.",
  },
  {
    role: "assistant",
    content:
      "A mislabeled batch reaching the manufacturing floor is exactly the scenario that supplier qualification programs are designed to prevent. Skip-lot testing relies on supplier CoA accuracy — if a supplier mislabels, skip-lot provides no protection. For OTC drug actives, FDA expects identity testing on every lot, not skip-lot.\n\nI have everything I need. Type 'generate' to create your regulatory transformation documents.",
  },
  {
    role: "user",
    content: "generate",
  },
];

const REGULATORY_DOCUMENTS: Doc[] = [
  {
    title: "Regulatory Maturity Assessment",
    sections: [
      {
        heading: "Executive Summary",
        content:
          "This CM operates with a partially mature regulatory program that is managing significant simultaneous compliance obligations: US FDA cosmetics (MoCRA), FDA OTC drug cGMP, EU Cosmetics Regulation, and Health Canada. Three areas carry immediate compliance risk: (1) 40% of the cosmetic portfolio is not yet listed in the FDA CARES portal in violation of MoCRA; (2) EU Article 10 safety assessments are held by a distributor but have never been reviewed by the manufacturer, creating joint liability exposure; and (3) an open CAPA backlog from the prior FDA 483 observation remains unresolved, creating repeat observation risk at the next inspection.",
      },
      {
        heading: "Maturity Scorecard",
        content:
          "MoCRA Compliance: 2/5 — Responsible person designated; 60% product listing complete; safety substantiation uncompiled\nFDA OTC Drug cGMP: 3/5 — Solid core cGMP; 483 history managed; CAPA backlog is the primary residual risk\nEU Cosmetics Regulation: 2/5 — Distributor acting as RP; CPNP notifications delegated; Article 10 safety assessments not reviewed or retained by manufacturer\nLIMS Maturity: 1/5 — Spreadsheet-based; data integrity risks documented; manual transcription from contract lab\nQMS Effectiveness: 2/5 — MasterControl deployed but underutilized; CAPA closure gap identified in FDA inspection; open backlog\nClaim Substantiation: 2/5 — Safety data exists but not in formal dossier format; no systematic substantiation program\nRegulatory Intelligence: 1/5 — Reactive only; no formal monitoring process; learned about MoCRA 6 months post-enactment",
      },
      {
        heading: "MoCRA Compliance Deep Dive",
        content:
          "Status:\n• Responsible person: Designated — compliant\n• Product listing: 60% complete — NON-COMPLIANT for unlisted products\n• Safety substantiation: Data exists but not in formal dossier format — AT RISK\n• Labeling: Not assessed in this session — VERIFY\n\nGaps:\n• 40% product listing gap is a legal violation requiring immediate action. FDA CARES portal listing is required for all cosmetic products marketed in the US.\n• Safety substantiation: FDA has not begun broad enforcement, but the expectation is that substantiation is on file and organized. At 65% cosmetics volume, the substantiation gap represents material compliance risk.\n\nUrgency: Immediate for product listing completion. 6-month for substantiation dossier compilation.",
      },
      {
        heading: "FDA OTC Drug Compliance",
        content:
          "cGMP posture: Generally solid. Batch records, specifications, and testing are in order per the inspection history.\n\n483 history: Two observations at last inspection (18 months ago): CAPA system — CAPAs not formally closed in QMS; Lab data integrity — raw data entries lacked contemporaneous dating.\n\nCurrent risk:\n• CAPA backlog: older investigations never formally closed in MasterControl. If FDA returns and finds these still open, this becomes a repeat observation — significantly higher regulatory weight than a first-time finding.\n• Lab data integrity: SOP updated and training documented — risk likely resolved. Maintain training records as evidence.\n\nNext inspection readiness: Moderate. Core cGMP is sound; CAPA backlog is the primary vulnerability.",
      },
      {
        heading: "EU Regulatory Position",
        content:
          "Current structure: European distributor acts as EU Responsible Person; CPNP notifications handled by distributor.\n\nCritical gap: Article 10 Product Information Files (including safety assessments) are held by the distributor and have never been reviewed or retained by the manufacturer. As the manufacturing company, you have joint responsibility for product safety regardless of the RP arrangement. If a product is recalled or investigated, 'the distributor managed it' is not a defensible position with a market authority.\n\nImmediate action required: Request copies of all Article 10 safety assessments and CPNP notification confirmations from the distributor for all products distributed in Germany and France. Review for completeness and retain in your Quality Management System.",
      },
      {
        heading: "Quality Systems Assessment",
        content:
          "QMS: MasterControl — 40% utilized. Key gaps: CAPA module not consistently used for older investigations (open backlog). Change control workflow poorly configured and routinely bypassed. Supplier documents managed outside the system.\n\nLIMS: Custom spreadsheet system — highest data integrity risk in the operation. Manual transcription from contract lab documented. CoA generation manual. Not compliant with FDA data integrity expectations for a company with OTC drug product lines.\n\nSupplier controls: Approved supplier list in spreadsheet. Skip-lot testing for most materials — RISK for OTC drug actives (FDA expects identity testing per lot). One prior mislabeling incident — no formal supplier qualification overhaul completed.",
      },
      {
        heading: "Critical Risk Register",
        content:
          "Risk 1: MoCRA product listing gap (40% unlisted) — Severity: HIGH — Action: Complete CARES portal listing within 60 days. Assign dedicated resource.\nRisk 2: EU Article 10 safety assessments not retained — Severity: HIGH — Action: Request and review all EU safety assessment dossiers from distributor within 30 days.\nRisk 3: Open CAPA backlog from FDA 483 — Severity: HIGH — Action: Close all open CAPAs in MasterControl before next inspection. Set 90-day deadline.\nRisk 4: LIMS data integrity (manual transcription, spreadsheet system) — Severity: HIGH — Action: Begin LIMS replacement evaluation immediately.\nRisk 5: OTC drug active identity testing — skip-lot not FDA-compliant — Severity: MEDIUM-HIGH — Action: Implement lot-by-lot identity testing for OTC drug actives immediately.",
      },
    ],
  },
  {
    title: "Compliance Modernization Roadmap",
    sections: [
      {
        heading: "Roadmap Overview",
        content:
          "This roadmap is sequenced by regulatory risk, not implementation ease. Three items carry immediate legal or inspection risk and are addressed in the first 30–60 days regardless of resource constraints. Medium-term initiatives build compliance infrastructure. Long-term investments address systemic gaps in intelligence, systems, and supplier controls.",
      },
      {
        heading: "Immediate Actions (0–90 Days)",
        content:
          "Action 1: Complete MoCRA product listing — Owner: Regulatory Affairs team. Deadline: 60 days. Resource: Dedicate one regulatory staff member full-time until complete. Success criteria: 100% of cosmetic portfolio listed in FDA CARES portal.\n\nAction 2: Obtain and review EU Article 10 safety assessments — Owner: VP Quality + Regulatory Affairs. Deadline: 30 days to request; 60 days to review and file. Success criteria: All Article 10 dossiers on file and reviewed; gaps documented and remediated.\n\nAction 3: Close open CAPA backlog in MasterControl — Owner: VP Quality. Deadline: 90 days. Success criteria: Zero CAPAs with open status predating the FDA inspection. If some investigations have no resolution, formally close with documented rationale.\n\nAction 4: Implement lot-by-lot identity testing for OTC drug actives — Owner: VP Quality + QC Manager. Deadline: 30 days. Success criteria: Updated SOPs in place; all incoming OTC drug active lots receiving identity testing per FDA expectation.",
      },
      {
        heading: "6-Month Capability Builds",
        content:
          "1. MoCRA safety substantiation dossier program — compile existing safety data into formal substantiation dossiers per FDA guidance. Start with highest-volume and highest-risk products. Owner: Regulatory Affairs + R&D. Budget: $30–60K for external regulatory consultant support.\n\n2. QMS CAPA and change control reconfiguration — engage MasterControl implementation partner; reconfigure CAPA module and change control workflow; mandate in-system closure. Owner: VP Quality + IT. Budget: $20–40K.\n\n3. Supplier qualification program overhaul — formal supplier risk tiering; enhanced qualification requirements for Tier 1 (OTC drug actives, novel cosmetic actives); updated approved supplier list in MasterControl. Owner: VP Quality + Procurement. Budget: internal labor + $10–20K for audit support.\n\n4. Regulatory intelligence subscription — evaluate and implement a regulatory monitoring tool (e.g., Alchemy, CIRS regulatory alerts, or equivalent) to replace the reactive newsletter-based approach. Owner: Regulatory Affairs. Budget: $5–15K/year.",
      },
      {
        heading: "12-Month Strategic Investments",
        content:
          "1. LIMS replacement — replace spreadsheet LIMS with a validated commercial system; prioritize stability data, micro, and CoA generation. Budget: $80–150K. Expected outcome: FDA data integrity risk resolved; CoA generation automated.\n\n2. EU responsible person relationship formalization — renegotiate distributor agreement to include mandatory Article 10 dossier sharing, CPNP notification confirmation, and joint incident reporting protocol. Owner: Legal + VP Quality + Regulatory Affairs.\n\n3. MoCRA safety substantiation completion — full portfolio covered; documented and accessible. Target: 100% substantiation coverage by month 12.\n\n4. Canada regulatory update — Health Canada notification and bilingual labeling compliance review for all Canadian-marketed products. Owner: Regulatory Affairs. Budget: $10–20K consulting.",
      },
      {
        heading: "Resource Implications",
        content:
          "Current regulatory team (2 FTEs) is insufficient to execute the full roadmap simultaneously. Prioritized recommendation:\n• External regulatory consultant: Retain for MoCRA substantiation dossier program and EU Article 10 review. Estimated cost: $40–80K over 12 months.\n• QA contractor: Consider a 6-month contract QA specialist to close the CAPA backlog and reconfigure MasterControl while the permanent team manages day-to-day compliance. Estimated cost: $60–90K.\n• No additional FTE hiring is required in the first 12 months if contract resources are used effectively.",
      },
      {
        heading: "What NOT to Defer",
        content:
          "The following items carry legal or inspection risk that makes deferral inadvisable regardless of resource pressure:\n• MoCRA product listing completion — this is a legal requirement, not a best practice\n• EU Article 10 safety assessment retrieval — joint manufacturer liability is active\n• Open CAPA backlog closure — a repeat 483 observation is a materially worse outcome than the resource cost of closing the backlog\n• OTC drug active lot-by-lot identity testing — FDA expects this; skip-lot on drug actives is non-compliant",
      },
    ],
  },
  {
    title: "Quality System Gap Analysis",
    sections: [
      {
        heading: "Current QMS State",
        content:
          "System: MasterControl (electronic QMS). Deployed but only 40% utilized. Core document control is functional. CAPA module is inadequate in practice — investigations are raised but corrective actions are tracked in email and spreadsheets, not in MasterControl. Change control workflow is poorly configured and routinely bypassed by staff. Supplier document management is external to the system entirely.",
      },
      {
        heading: "Document Control",
        content:
          "Strengths: Core SOPs and batch record templates appear to be managed in MasterControl based on inspection history.\nGaps: (1) Supplier qualification documents (CoAs, qualification records, approved supplier list) are not in MasterControl — these are required to be part of the quality system under 21 CFR Part 211 for OTC products. (2) Product-level safety substantiation files are scattered across product files, not centralized in the QMS. (3) Training records — confirm all MasterControl records are current; FDA inspectors review training completion regularly.\nRecommendation: Migrate supplier qualification documents and safety substantiation files into MasterControl within 6 months.",
      },
      {
        heading: "Deviation & CAPA Effectiveness",
        content:
          "Current state: Deviations are raised in MasterControl. CAPA assignments are made but corrective actions are tracked externally (email, spreadsheets). Open CAPA backlog exists from investigations predating the FDA inspection.\nPrimary risk: An FDA inspection that finds CAPAs marked 'open' in MasterControl — particularly those that were open at the prior inspection — will result in a repeat 483 observation. Repeat observations signal systemic non-compliance and increase the probability of a warning letter.\nRecommendation: (1) Close all pre-inspection CAPAs within 90 days — with documented rationale for each. (2) Reconfigure MasterControl to require in-system CAPA documentation before an investigation can be closed. (3) Implement a monthly CAPA aging review — any CAPA open beyond 90 days requires VP Quality escalation.",
      },
      {
        heading: "Change Control",
        content:
          "Current state: Change control process exists in MasterControl but the workflow is poorly configured; staff routinely bypass it, particularly for minor formula changes and packaging updates.\nRisk: Undocumented changes to OTC drug product formulas or manufacturing processes are a significant cGMP violation. Even 'minor' changes to a drug product may require stability data, specification updates, or regulatory notification depending on the nature of the change. A change that bypasses the change control system and later causes a quality issue creates both a compliance and a liability problem.\nRecommendation: (1) Reconfigure the change control workflow in MasterControl to reduce friction for low-risk changes while maintaining rigor for high-risk changes. (2) Define a tiered change classification: Minor (no regulatory impact), Major (specification or process change), Regulatory (requires FDA notification or stability data). (3) Mandatory management of change training within 60 days.",
      },
      {
        heading: "LIMS Assessment",
        content:
          "Current state: Custom Excel-based system. Stability data in per-project workbooks. Micro results manually transcribed from contract lab. CoA generation via Word template with manual result entry.\nData integrity risks: (1) Manual transcription between external lab and internal record — no audit trail, error-prone. (2) Excel workbooks have no access controls or audit trail — do not meet 21 CFR Part 11 requirements for electronic records used in OTC drug product release. (3) No automated review or out-of-specification detection — OOS investigations depend on a human noticing a result outside spec.\nFor OTC drug products specifically, the LIMS is the weakest link in the data integrity chain and is the most likely target of a future FDA data integrity observation.\nRecommendation: Replace within 12 months. In the interim: implement a mandatory dual-check process for all contract lab transcription (two reviewers sign off); do not use this system as the system of record for OTC drug product batch release without additional controls.",
      },
      {
        heading: "Supplier Controls",
        content:
          "Current state: Approved supplier list in spreadsheet. Skip-lot testing for most materials. Lot-by-lot identity testing for OTC drug actives — BUT this was identified as potentially not being consistently applied (see Critical Risk Register).\nPrior incident: Mislabeled silicone batch reached the manufacturing floor 2 years ago. No formal supplier qualification program overhaul completed since.\nGaps: (1) Supplier risk tiering — not all suppliers carry the same risk; OTC drug actives require more rigorous qualification than commodity excipients. (2) Skip-lot testing for non-drug materials is acceptable, but the program should be documented with clear criteria for what triggers full-lot testing. (3) Supplier audit program — no mention of periodic supplier audits; for Tier 1 suppliers (OTC drug actives) periodic on-site or remote audits are expected by FDA.\nRecommendation: (1) Implement formal supplier risk tiering (Tier 1: OTC drug actives and novel actives; Tier 2: standard cosmetic actives; Tier 3: commodity excipients). (2) Define testing frequency by tier in a formal SOP. (3) Establish a supplier audit schedule for Tier 1 suppliers — minimum annual remote audit, biennial on-site.",
      },
      {
        heading: "Benchmarks & Recommendations",
        content:
          "For a CM with this regulatory scope (MoCRA + OTC cGMP + EU), the current QMS maturity is below the expected standard for a company of this size and complexity. The primary gap is operational discipline and system configuration — not system selection. MasterControl is a capable QMS; the problem is that it was poorly implemented and has been worked around.\n\nTop 5 recommendations in priority order:\n1. Close open CAPA backlog and mandate in-system CAPA documentation — 90 days\n2. Reconfigure MasterControl change control workflow — 60 days\n3. Migrate supplier qualification documents into MasterControl — 6 months\n4. Implement formal supplier risk tiering and audit schedule — 6 months\n5. Replace LIMS — 12 months\n\nThis assessment is based on a single advisory session. All regulatory requirements should be verified with a qualified regulatory affairs professional before acting on them.",
      },
    ],
  },
  {
    title: "Market Expansion Regulatory Playbook",
    sections: [
      {
        heading: "How to Use This Playbook",
        content:
          "This playbook summarizes regulatory requirements for key markets. It is written for a US-based cosmetic and OTC drug CM that already manufactures for the US, EU (Germany/France), and Canada. Each section identifies what is already in place, what gaps exist, and what would be required to expand further into that market. Requirements change frequently — verify all information with a qualified regulatory affairs professional before acting.",
      },
      {
        heading: "United States (Current Requirements)",
        content:
          "Cosmetics (MoCRA): Responsible person designated (compliant). Product listing in CARES portal: 60% complete (40% gap — immediate action required). Safety substantiation: on file but not in formal dossier format (medium-term risk). Labeling: must comply with FD&C Act and MoCRA requirements including warning statements.\n\nOTC Drug Products (FDA Monograph): Must comply with 21 CFR Parts 210/211 (cGMP). Products must conform to applicable OTC monograph (acne — 21 CFR Part 333; sunscreen — FDA 2019 Proposed Rule / current enforcement policy). In vitro and/or in vivo testing required for efficacy claims. Drug Facts panel required on all OTC drug products.\n\nDietary Supplements (DSHEA): Must comply with 21 CFR Part 111 (dietary supplement cGMP). Substantiation of structure/function claims required. Serious adverse event reporting required within 15 days.",
      },
      {
        heading: "European Union",
        content:
          "Framework: EU Cosmetics Regulation 1223/2009 (as amended). Not applicable to OTC drug products (those are regulated as medicinal products under Directive 2001/83/EC — a significantly different and more complex pathway).\n\nKey requirements:\n• EU Responsible Person (RP): A legal entity established in the EU must be designated as RP. Current distributor arrangement is acceptable but must be formalized with reviewed Article 10 documentation.\n• CPNP notification: Required before placing any cosmetic product on the EU market. One notification per product per RP.\n• Article 10 Product Information File (PIF): Must include: product description, safety assessment (by a qualified safety assessor), manufacturing method statement, proof of claimed effects, and consumer exposure data.\n• Safety assessor: Must hold a pharmacy, toxicology, medicine, or equivalent degree. The safety assessment must be signed by a qualified assessor.\n• Labeling: Must comply with EU labeling requirements including INCI nomenclature, country of origin, RP name and address, shelf life marking.\n• Restricted/prohibited ingredients: EU restricted list is more extensive than US; regular monitoring required.\n\nGap for current company: Article 10 PIFs not on file at manufacturer. Resolve immediately.",
      },
      {
        heading: "Canada",
        content:
          "Cosmetics: Governed by the Canada Consumer Product Safety Act and Cosmetic Regulations. Notification to Health Canada required within 10 days of first sale. INCI ingredient listing required. Bilingual labeling (English and French) mandatory for all cosmetics sold in Canada.\n\nNatural Health Products / OTC drugs: Governed by the Natural Health Products Regulations (for NHPs) or Food and Drug Regulations (for OTC drugs). NHP requires a pre-market license (Natural Product Number / NPN). OTC drugs require a Drug Identification Number (DIN). These are significantly more burdensome than US monograph pathway.\n\nKey differences from US: Bilingual labeling is mandatory (many US-labeled products are non-compliant in Canada without a French label version). Some US-permitted cosmetic ingredients are restricted or require notification in Canada. Health Canada cosmetic ingredient hotlist should be reviewed against current formula portfolio.\n\nCurrent company gap: Confirm all Canadian-marketed products have Health Canada cosmetic notifications filed and bilingual labels in place.",
      },
      {
        heading: "United Kingdom (Post-Brexit)",
        content:
          "Framework: UK Cosmetics Regulation (retained EU law with Great Britain-specific amendments). Separate from EU since January 1, 2021.\n\nKey requirements:\n• UK Responsible Person: A legal entity established in Great Britain (England, Scotland, Wales) must be designated as RP for GB market. Separate from EU RP.\n• SCPN (Submit Cosmetic Product Notification): UK equivalent of CPNP — required before placing on GB market. Northern Ireland follows EU rules (CPNP applies).\n• Product Information File: Same requirements as EU Article 10.\n• Labeling: Must reference UK RP address. EU RP address is not sufficient for GB-labeled products.\n\nComplexity note: If you are currently serving the EU market through a German/French distributor and they are also distributing into the UK, verify whether they have a separate UK RP and SCPN notification — these are commonly overlooked post-Brexit.",
      },
      {
        heading: "APAC / China",
        content:
          "China (NMPA): Among the most complex non-EU regulatory frameworks for cosmetics. All cosmetics require NMPA registration or filing before sale. 'Special use' cosmetics (SPF, hair dye, depilatories) require pre-market registration (18–24 months, $50–150K+ per product). 'Ordinary' cosmetics require filing (faster but still substantial). Animal testing historically required — China has made exemptions for imported cosmetics in some categories; verify current status with specialist counsel. Recommend engaging a China regulatory specialist before any China market entry.\n\nAustralia (NICNAS/AICIS): Industrial chemicals (including cosmetic ingredients) regulated under AICIS. Generally more aligned with EU approach. Lower complexity than China for established formulas.\n\nSouth Korea: MFDS (Ministry of Food and Drug Safety) regulates cosmetics. Functional cosmetics (whitening, SPF, anti-wrinkle) require separate registration. K-beauty market entry is commercially attractive but requires dedicated regulatory preparation.\n\nJapan (PMDA): Cosmetics and quasi-drugs (functional cosmetics) are regulated under the Pharmaceutical and Medical Device Act. Quasi-drug category (comparable to EU borderline products) is significant and requires separate approval.",
      },
      {
        heading: "LATAM / Brazil",
        content:
          "Brazil (ANVISA): One of the most complex cosmetic regulatory frameworks globally. Cosmetics are classified as Grade 1 (lower risk — notification) or Grade 2 (higher risk — registration, pre-market approval). SPF products, anti-dandruff, products with certain actives are Grade 2 requiring registration. ANVISA registration can take 12–24 months and requires significant documentation in Portuguese. Manufacturing facility must be inspected or have a recognized GMP certificate (ISO 22716 is generally accepted). ANVISA is known for strict enforcement and product recalls. Recommend specialist ANVISA regulatory counsel before market entry.\n\nOther LATAM markets: Mexico (COFEPRIS) and Colombia (INVIMA) have less complex cosmetics frameworks — notification-based for most products, though still require Spanish labeling and local authorized representative.",
      },
      {
        heading: "Expansion Prioritization",
        content:
          "Based on this session, the company has existing presence in US, EU (DE/FR), and Canada. Recommended expansion prioritization:\n\n1. Consolidate EU compliance first: Resolve Article 10 gap, formalize RP relationship, ensure CPNP completeness before expanding EU footprint to other member states.\n2. UK (if EU clients have UK distribution): Low incremental cost if EU PIFs are in order — primarily RP designation and SCPN notification.\n3. Canada expansion (deepen existing presence): Bilingual labeling compliance review for full Canadian-marketed portfolio; consider full Health Canada notification audit.\n4. Australia: Moderate complexity, English-language market, growing demand for clean beauty and OTC-equivalent products. A reasonable next expansion market.\n5. South Korea: Commercially attractive for K-beauty-adjacent innovation; regulatory complexity manageable with specialist counsel.\n6. China and Brazil: Defer until core compliance program is mature and dedicated regulatory resources are in place. Both require significant investment and carry high enforcement risk for unprepared entrants.\n\nThis assessment is based on a single advisory session. All regulatory requirements should be verified with a qualified regulatory affairs professional before acting on them.",
      },
    ],
  },
];

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
      for (const line of (section.content ?? "").split("\n")) {
        if (!line.trim()) { children.push(new Paragraph({ text: "", spacing: { after: 60 } })); continue; }
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
    { pass: doc.title.toLowerCase().includes(expectedTitleFragment.toLowerCase()), message: `title contains "${expectedTitleFragment}"` },
    { pass: Array.isArray(doc.sections) && doc.sections.length >= minSections, message: `has ≥${minSections} sections (got ${doc.sections?.length ?? 0})` },
    ...doc.sections.map((s) => ({
      pass: typeof s.content === "string" && s.content.length > 30,
      message: `  section "${s.heading}" has content`,
    })),
  ];
}

function assertAmerican(text: string): TestResult[] {
  const checks: [string, string][] = [
    ["standardise", "standardize"], ["organise", "organize"],
    ["colour", "color"], ["labelling", "labeling"], ["programme", "program"],
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
  console.log("║  CosmoLab Phase 1.5 Sprint 5 & 6 — Zero-Cost Test Runner     ║");
  console.log("║  Sprint 5: IT Assessment  ·  Sprint 6: Regulatory Assessment ║");
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
  // SPRINT 5: IT Systems & Digital Transformation
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("══ SPRINT 5: IT Systems & Digital Transformation ════════════════\n");

  console.log("TEST 5-1: IT assessment conversation fixture");
  report([
    { pass: IT_CONVERSATION.length >= 12, message: `conversation has ${IT_CONVERSATION.length} turns (≥12 expected)` },
    { pass: IT_CONVERSATION[0].role === "assistant", message: "first message is from assistant" },
    { pass: IT_CONVERSATION[IT_CONVERSATION.length - 1].content === "generate", message: "final user message is 'generate'" },
    { pass: IT_CONVERSATION.some((m) => m.role === "assistant" && m.content.toLowerCase().includes("type 'generate'")), message: "assistant prompts 'Type generate'" },
    { pass: IT_CONVERSATION.some((m) => m.content.toLowerCase().includes("coptis") || m.content.toLowerCase().includes("ithos")), message: "PLM (Coptis/Ithos) covered" },
    { pass: IT_CONVERSATION.some((m) => m.content.toLowerCase().includes("redzone") || m.content.toLowerCase().includes("mes")), message: "MES / RedZone covered" },
    { pass: IT_CONVERSATION.some((m) => m.content.toLowerCase().includes("lims")), message: "LIMS covered" },
    { pass: IT_CONVERSATION.some((m) => m.content.toLowerCase().includes("mastercontrol") || m.content.toLowerCase().includes("qms")), message: "QMS covered" },
    { pass: IT_CONVERSATION.some((m) => m.content.toLowerCase().includes("erp") || m.content.toLowerCase().includes("netsuite")), message: "ERP covered" },
    { pass: IT_CONVERSATION.some((m) => m.content.toLowerCase().includes("ai") || m.content.toLowerCase().includes("chatgpt")), message: "AI tools discussed" },
    { pass: IT_CONVERSATION.some((m) => m.content.toLowerCase().includes("budget")), message: "budget / investment discussed" },
  ]);
  fs.writeFileSync(path.join(IT_DIR, "conversation.json"), JSON.stringify(IT_CONVERSATION, null, 2));
  console.log(`  📁 Saved conversation.json (${IT_CONVERSATION.length} turns)\n`);

  console.log("TEST 5-2: IT document structure");
  const expectedITTitles = [
    "IT Systems Readiness Assessment",
    "Digital Transformation Roadmap",
    "AI Build vs. Buy Recommendation",
    "Integration Architecture Brief",
  ];
  report([
    { pass: IT_DOCUMENTS.length === 4, message: `document count: 4 (got ${IT_DOCUMENTS.length})` },
    ...expectedITTitles.map((t) => ({ pass: IT_DOCUMENTS.some((d) => d.title.includes(t)), message: `document "${t}" present` })),
    ...IT_DOCUMENTS.flatMap((d) => assertDoc(d, d.title.split(" ")[0], 4)),
  ]);

  console.log("\nTEST 5-3: IT document content quality");
  const itText = IT_DOCUMENTS.map((d) => d.sections.map((s) => s.content).join(" ")).join(" ");
  report([
    { pass: itText.toLowerCase().includes("coptis"), message: "Coptis mentioned in documents" },
    { pass: itText.toLowerCase().includes("ithos"), message: "Ithos migration path documented" },
    { pass: itText.toLowerCase().includes("redzone"), message: "RedZone documented" },
    { pass: itText.toLowerCase().includes("21 cfr part 11") || itText.toLowerCase().includes("part 11"), message: "FDA 21 CFR Part 11 referenced for OTC lines" },
    { pass: itText.toLowerCase().includes("lims"), message: "LIMS replacement documented" },
    { pass: itText.toLowerCase().includes("build") && itText.toLowerCase().includes("buy"), message: "Build vs. Buy analysis present" },
    { pass: itText.toLowerCase().includes("data integrity"), message: "data integrity risk addressed" },
    { pass: itText.toLowerCase().includes("90-day") || itText.toLowerCase().includes("90 day"), message: "90-day quick wins present" },
    ...assertAmerican(itText),
  ]);

  fs.writeFileSync(path.join(IT_DIR, "response.json"), JSON.stringify({ documents: IT_DOCUMENTS }, null, 2));
  console.log(`  📁 Saved response.json\n`);

  console.log("TEST 5-4: IT .docx build");
  try {
    const size = await buildDocx(IT_DOCUMENTS, path.join(IT_DIR, "documents.docx"));
    console.log(`  ✅ Packer.toBuffer() succeeded`);
    console.log(`  ✅ File size: ${(size / 1024).toFixed(1)}KB`);
    console.log(`  📁 Saved documents.docx\n`);
    totalPassed += 2;
  } catch (err) {
    console.log(`  ❌ docx build failed: ${String(err)}`);
    totalFailed++;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPRINT 6: Regulatory & Quality Transformation
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("══ SPRINT 6: Regulatory & Quality Transformation ════════════════\n");

  console.log("TEST 6-1: Regulatory assessment conversation fixture");
  report([
    { pass: REGULATORY_CONVERSATION.length >= 12, message: `conversation has ${REGULATORY_CONVERSATION.length} turns (≥12 expected)` },
    { pass: REGULATORY_CONVERSATION[0].role === "assistant", message: "first message is from assistant" },
    { pass: REGULATORY_CONVERSATION[REGULATORY_CONVERSATION.length - 1].content === "generate", message: "final user message is 'generate'" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.role === "assistant" && m.content.toLowerCase().includes("type 'generate'")), message: "assistant prompts 'Type generate'" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.content.toLowerCase().includes("mocra")), message: "MoCRA covered" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.content.toLowerCase().includes("otc") || m.content.toLowerCase().includes("cgmp")), message: "OTC / cGMP covered" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.content.toLowerCase().includes("eu") || m.content.toLowerCase().includes("article 10")), message: "EU Cosmetics Regulation covered" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.content.toLowerCase().includes("lims") || m.content.toLowerCase().includes("data integrity")), message: "LIMS / data integrity covered" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.content.toLowerCase().includes("capa")), message: "CAPA covered" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.content.toLowerCase().includes("supplier")), message: "supplier qualification covered" },
    { pass: REGULATORY_CONVERSATION.some((m) => m.content.toLowerCase().includes("483") || m.content.toLowerCase().includes("inspection")), message: "inspection history discussed" },
  ]);
  fs.writeFileSync(path.join(REG_DIR, "conversation.json"), JSON.stringify(REGULATORY_CONVERSATION, null, 2));
  console.log(`  📁 Saved conversation.json (${REGULATORY_CONVERSATION.length} turns)\n`);

  console.log("TEST 6-2: Regulatory document structure");
  const expectedRegTitles = [
    "Regulatory Maturity Assessment",
    "Compliance Modernization Roadmap",
    "Quality System Gap Analysis",
    "Market Expansion Regulatory Playbook",
  ];
  report([
    { pass: REGULATORY_DOCUMENTS.length === 4, message: `document count: 4 (got ${REGULATORY_DOCUMENTS.length})` },
    ...expectedRegTitles.map((t) => ({ pass: REGULATORY_DOCUMENTS.some((d) => d.title.includes(t)), message: `document "${t}" present` })),
    ...REGULATORY_DOCUMENTS.flatMap((d) => assertDoc(d, d.title.split(" ")[0], 5)),
  ]);

  console.log("\nTEST 6-3: Regulatory document content quality");
  const regText = REGULATORY_DOCUMENTS.map((d) => d.sections.map((s) => s.content).join(" ")).join(" ");
  report([
    { pass: regText.toLowerCase().includes("mocra"), message: "MoCRA documented" },
    { pass: regText.toLowerCase().includes("483"), message: "FDA 483 inspection history documented" },
    { pass: regText.toLowerCase().includes("article 10"), message: "EU Article 10 gap documented" },
    { pass: regText.toLowerCase().includes("capa"), message: "CAPA backlog risk documented" },
    { pass: regText.toLowerCase().includes("data integrity"), message: "data integrity risk documented" },
    { pass: regText.toLowerCase().includes("supplier"), message: "supplier controls addressed" },
    { pass: regText.toLowerCase().includes("eu") && regText.toLowerCase().includes("canada"), message: "multi-market scope covered" },
    { pass: regText.toLowerCase().includes("brazil") || regText.toLowerCase().includes("anvisa"), message: "LATAM / Brazil in market expansion playbook" },
    { pass: regText.toLowerCase().includes("china") || regText.toLowerCase().includes("nmpa"), message: "China/APAC in market expansion playbook" },
    { pass: regText.toLowerCase().includes("1–5") || regText.toLowerCase().includes("1/5") || regText.toLowerCase().includes("maturity"), message: "1–5 maturity scale used" },
    ...assertAmerican(regText),
  ]);

  fs.writeFileSync(path.join(REG_DIR, "response.json"), JSON.stringify({ documents: REGULATORY_DOCUMENTS }, null, 2));
  console.log(`  📁 Saved response.json\n`);

  console.log("TEST 6-4: Regulatory .docx build");
  try {
    const size = await buildDocx(REGULATORY_DOCUMENTS, path.join(REG_DIR, "documents.docx"));
    console.log(`  ✅ Packer.toBuffer() succeeded`);
    console.log(`  ✅ File size: ${(size / 1024).toFixed(1)}KB`);
    console.log(`  📁 Saved documents.docx\n`);
    totalPassed += 2;
  } catch (err) {
    console.log(`  ❌ docx build failed: ${String(err)}`);
    totalFailed++;
  }

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
