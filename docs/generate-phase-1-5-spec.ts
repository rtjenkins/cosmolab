/**
 * Generates phase-1.5-spec.docx — CosmoLab Phase 1.5 Product Specification
 * Run with: npx tsx docs/generate-phase-1-5-spec.ts
 */

import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType,
} from "docx";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function h1(text: string): Paragraph {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 } },
  });
}
function h2(text: string): Paragraph {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 320, after: 120 } });
}
function h3(text: string): Paragraph {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 80 } });
}
function body(text: string): Paragraph {
  return new Paragraph({ text, spacing: { after: 100 } });
}
function bullet(text: string, level = 0): Paragraph {
  return new Paragraph({ text, bullet: { level }, spacing: { after: 80 } });
}
function pageBreak(): Paragraph {
  return new Paragraph({ pageBreakBefore: true });
}
function spacer(): Paragraph {
  return new Paragraph({ text: "", spacing: { after: 160 } });
}
function tRow(cells: string[], isHeader = false): TableRow {
  return new TableRow({
    children: cells.map((c, i) =>
      new TableCell({
        children: [new Paragraph({
          children: [new TextRun({ text: c, bold: isHeader, size: isHeader ? 18 : 17 })],
          spacing: { after: 60 },
        })],
        width: { size: i === 0 ? 3000 : Math.floor(6000 / (cells.length - 1)), type: WidthType.DXA },
      })
    ),
  });
}

// ---------------------------------------------------------------------------
// Document content
// ---------------------------------------------------------------------------

const children: Paragraph[] = [];

// Cover
children.push(
  new Paragraph({
    children: [new TextRun({ text: "CosmoLab", bold: true, size: 56, color: "1A56DB" })],
    alignment: AlignmentType.CENTER, spacing: { before: 800, after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Phase 1.5 — Transformation Platform", bold: true, size: 36 })],
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Product Specification", size: 28, color: "555555" })],
    alignment: AlignmentType.CENTER, spacing: { after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({ text: `${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, size: 20, color: "888888" })],
    alignment: AlignmentType.CENTER, spacing: { after: 600 },
  }),
);

// ---------------------------------------------------------------------------
// 1. Vision & Rationale
// ---------------------------------------------------------------------------
children.push(h1("1. Vision & Rationale"));
children.push(body("Phase 1 proved that CosmoLab can run AI-powered discovery sessions for any team × product category combination and produce structured Word documents. Phase 1.5 transforms CosmoLab from a document generator into a full operational and strategic transformation platform for cosmetic and personal care contract manufacturers."));
spacer();
children.push(body("The target customer for Phase 1.5 is an established contract manufacturer — a company like Cosmetic Solutions — that already has Sales, R&D, Manufacturing, Engineering, Demand Planning, and Quality teams operating, but faces inefficiencies in how those teams hand off work, capture knowledge, serve clients, and make strategic decisions."));
children.push(spacer());
children.push(h2("Phase Rationale"));
children.push(new Table({
  rows: [
    tRow(["Phase", "Question It Answers", "Status"], true),
    tRow(["1", "Can CosmoLab run a discovery session?", "✅ Complete"]),
    tRow(["1.5", "Can CosmoLab transform how a CM operates?", "🔄 In Progress"]),
    tRow(["2", "Can we sell this to many CMs at scale?", "Pending"]),
    tRow(["3", "Can we monetize at scale?", "Pending"]),
  ],
  width: { size: 9000, type: WidthType.DXA },
}));

// ---------------------------------------------------------------------------
// 2. Transformation Areas
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("2. Transformation Areas Overview"));
children.push(body("Phase 1.5 is organized into five transformation areas. Each area has a set of features that build on the Phase 1 discovery session foundation."));
children.push(spacer());

children.push(new Table({
  rows: [
    tRow(["Area", "Core Features", "Primary Beneficiary"], true),
    tRow(["Operational", "Cross-team workflow assessment, handoff automation, formula catalog matching", "All teams"]),
    tRow(["Commercial", "Client self-service portal, AI quoting engine, CRM integration", "Sales, Leadership"]),
    tRow(["Digital", "Full IT ecosystem integration (Coptis/Ithos, RedZone, LIMS, QMS, ERP), institutional memory, AI build vs. buy strategy, trend intelligence", "IT, Leadership, All teams"]),
    tRow(["Strategic", "Business strategy sessions, competitive intelligence, market expansion", "Leadership"]),
    tRow(["Regulatory", "Real-time ingredient compliance, change alerts, market readiness scoring", "R&D, Quality"]),
  ],
  width: { size: 9000, type: WidthType.DXA },
}));

// ---------------------------------------------------------------------------
// 3. Operational Transformation
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("3. Operational Transformation"));

children.push(h2("3.1 Cross-Team Workflow Assessment (Priority Feature)"));
children.push(body("This is the flagship Phase 1.5 feature. It is a new AI-powered session type — separate from product discovery sessions — specifically designed to assess and improve a CM's internal cross-team handoff processes."));
children.push(spacer());

children.push(h3("What It Does"));
children.push(body("CosmoLab conducts a structured discovery conversation with a CM leadership team member or process owner. It systematically maps every critical handoff between the 6 teams and scores each one on a Handoff Tightness Scale."));
children.push(spacer());

children.push(h3("Handoffs Assessed"));
const handoffs = [
  ["Sales → R&D / Formulation", "New client brief to formulation team"],
  ["Sales → Demand Planning", "Committed volume and timeline to planning"],
  ["R&D → Manufacturing", "Locked formula and scale-up specs"],
  ["R&D → Engineering", "New line or equipment requirements"],
  ["R&D → Quality", "Formula and testing requirements"],
  ["Manufacturing → Quality", "Batch release and in-process control"],
  ["Demand Planning → Manufacturing", "Production schedule and volume signals"],
  ["Demand Planning → Procurement", "Raw material purchase orders and lead times"],
  ["Quality → all teams", "Non-conformance and deviation escalation"],
];
children.push(new Table({
  rows: [
    tRow(["Handoff", "Description"], true),
    ...handoffs.map(([h, d]) => tRow([h, d])),
  ],
  width: { size: 9000, type: WidthType.DXA },
}));

children.push(spacer());
children.push(h3("Assessment Dimensions (per handoff)"));
const dims = [
  ["Trigger", "What initiates the handoff? Meeting, email, ERP record, shared doc?"],
  ["Information Completeness", "Does the receiving team get everything they need, or do they chase?"],
  ["Time Lag", "How long between handoff event and receiving team starting work?"],
  ["Rework Rate", "How often does the receiving team send it back with questions?"],
  ["Tool Used", "Email, Word doc, ERP module, spreadsheet, verbal conversation?"],
  ["Single Point of Failure", "Does this handoff depend on one specific person?"],
  ["Documentation Trail", "Is there an auditable record of what was handed off and when?"],
];
children.push(new Table({
  rows: [tRow(["Dimension", "Question Asked"], true), ...dims.map(([d, q]) => tRow([d, q]))],
  width: { size: 9000, type: WidthType.DXA },
}));

children.push(spacer());
children.push(h3("Handoff Tightness Scale (1–5)"));
const scale = [
  ["5 — Automated", "System-to-system. No human intervention required. ERP-to-ERP or API-driven."],
  ["4 — Structured", "Standard template, clear owner, defined SLA. Consistent every time."],
  ["3 — Guided", "Informal template or checklist. Usually works but varies by person."],
  ["2 — Ad Hoc", "Mostly email or verbal. Significant variation in completeness and timing."],
  ["1 — Broken", "Frequent rework, delays, and lost information. A known pain point."],
];
children.push(new Table({
  rows: [tRow(["Score", "Description"], true), ...scale.map(([s, d]) => tRow([s, d]))],
  width: { size: 9000, type: WidthType.DXA },
}));

children.push(spacer());
children.push(h3("Output Documents Generated"));
children.push(bullet("Handoff Heat Map — visual matrix of all handoffs scored by tightness"));
children.push(bullet("Automation Opportunity Report — ranked list of automation opportunities by ROI"));
children.push(bullet("Quick Wins vs. Deep Integration classification per opportunity"));
children.push(bullet("Estimated time savings and risk reduction per handoff if automated"));
children.push(bullet("Recommended implementation roadmap"));

children.push(spacer());
children.push(h2("3.2 Cross-Team Handoff Automation"));
children.push(body("Once the assessment identifies loose handoffs, CosmoLab automates them. A Sales discovery session no longer ends at document download — it triggers a pre-filled R&D brief, a Demand Planning intake, and a Quality requirements draft automatically."));
children.push(spacer());
children.push(h3("Automation Flows"));
const flows = [
  ["Sales → R&D", "Sales session output auto-generates a pre-filled Technical Formulation Brief for R&D"],
  ["Sales → Planning", "Volume and timeline commitments auto-populate a Demand Planning intake"],
  ["R&D → Manufacturing", "Formula lock auto-generates BOM draft and Process Order skeleton"],
  ["R&D → Quality", "Actives, markets, and claims auto-populate QC Plan and Regulatory Checklist"],
  ["R&D → Engineering", "New format or line requirement triggers Engineering Feasibility intake"],
];
children.push(new Table({
  rows: [tRow(["Trigger", "Automated Output"], true), ...flows.map(([t, o]) => tRow([t, o]))],
  width: { size: 9000, type: WidthType.DXA },
}));

children.push(spacer());
children.push(h2("3.3 Formula Catalog Matching"));
children.push(body("A CM like Cosmetic Solutions has hundreds of existing base formulas. When a client brief is captured in CosmoLab, the AI matches it against the internal formula catalog and identifies the closest existing bases — reducing formulation-from-scratch work and dramatically improving speed-to-prototype."));
children.push(bullet("Match score: % alignment between client brief and existing formula"));
children.push(bullet("Gap analysis: what needs to change to adapt the base"));
children.push(bullet("Estimated development time reduction vs. new formulation"));

// ---------------------------------------------------------------------------
// 4. Commercial Transformation
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("4. Commercial Transformation"));

children.push(h2("4.1 Client Self-Service Portal"));
children.push(body("Instead of internal Sales staff running the discovery session, the brand client runs it themselves through a guided AI conversation. The CM receives a structured, pre-qualified brief instead of a vague email or unstructured intake call."));
children.push(spacer());
children.push(h3("Client Journey"));
children.push(bullet("Client receives a branded portal link from the CM's Sales team"));
children.push(bullet("Client selects product category and completes a guided AI discovery conversation"));
children.push(bullet("CosmoLab generates a structured project brief and submits it to the CM"));
children.push(bullet("CM Sales team receives a notification with the pre-qualified brief attached"));
children.push(bullet("Sales reviews, enriches if needed, and initiates the internal handoff workflow"));
children.push(spacer());
children.push(h3("Business Impact"));
children.push(bullet("Reduces intake call time by an estimated 60–80%"));
children.push(bullet("Standardizes client briefs — every submission has the same structure"));
children.push(bullet("Qualifies clients before Sales time is invested"));
children.push(bullet("Creates a 24/7 intake channel — clients in any timezone can submit"));

children.push(spacer());
children.push(h2("4.2 AI-Powered Quoting Engine"));
children.push(body("Sales discovery output is used to auto-generate a ballpark quote based on product complexity, volume, category, and regulatory market. The quote is a starting point for the formal proposal, not a binding commitment."));
children.push(bullet("Complexity scoring based on number of actives, regulatory markets, format novelty"));
children.push(bullet("Volume-based unit cost estimation connected to internal cost models"));
children.push(bullet("Development fee estimate based on formulation complexity score"));
children.push(bullet("Auto-populates into client proposal document generated by Phase 1 pipeline"));

children.push(spacer());
children.push(h2("4.3 CRM Integration"));
children.push(body("Every CosmoLab session is synced to the CM's CRM (Salesforce, HubSpot, or similar) as a new opportunity or project record. No double data entry."));
children.push(bullet("Session summary pushed as CRM opportunity notes"));
children.push(bullet("Client contact and brand details auto-populated"));
children.push(bullet("Pipeline stage updated based on session type (discovery, proposal, active project)"));

// ---------------------------------------------------------------------------
// 5. Digital Transformation
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("5. Digital Transformation — IT Ecosystem & AI Strategy"));

children.push(body("A cosmetic contract manufacturer like Cosmetic Solutions operates across a complex ecosystem of specialized software systems. Effective digital transformation requires understanding what each system does, where data lives, and how CosmoLab — as an AI orchestration layer — integrates with, enriches, and connects them."));

// 5.1 — The CM Technology Ecosystem Map
children.push(spacer());
children.push(h2("5.1 The CM Technology Ecosystem"));
children.push(body("The table below maps the full technology landscape for a cosmetic CM, organized by operational domain."));
children.push(spacer());
children.push(new Table({
  rows: [
    tRow(["Domain", "Function", "Representative Systems"], true),
    tRow(["Formulation & Regulatory", "Formula lifecycle management, ingredient compliance, INCI, SDS/label generation, stability tracking", "Coptis Lab → Ithos (CS transition), UL Prospector"]),
    tRow(["Manufacturing Execution", "Connected worker, real-time OEE, shop floor communication, shift handoffs, digital work instructions", "RedZone, Tulip, Parsable"]),
    tRow(["Batch Records (eBMR)", "Electronic batch manufacturing records, production traceability, deviation capture at batch level", "MasterControl, Tulip, SAP PM"]),
    tRow(["Quality Management (QMS)", "Document control (SOPs, WIs), NCR/CAPA, audit management, supplier quality", "MasterControl, Veeva Vault QMS, ETQ Reliance, TrackWise"]),
    tRow(["Laboratory (LIMS)", "Sample management, test results, CoA generation, stability study tracking, method management", "LabVantage, STARLIMS, LabWare"]),
    tRow(["ERP", "Finance, procurement, inventory, order management, customer billing, demand planning modules", "SAP S/4HANA, Oracle ERP Cloud, NetSuite, Sage"]),
    tRow(["Warehouse (WMS)", "Raw material receipt and traceability, finished goods, pick/pack/ship, lot tracking", "SAP WM/EWM, Manhattan, Fishbowl"]),
    tRow(["CRM", "Client management, opportunity tracking, project history, account intelligence", "Salesforce, HubSpot"]),
    tRow(["Market Intelligence", "Consumer trend data, retail sales signals, competitor formulation benchmarking", "Mintel, Euromonitor, SPINS, Selerant Decernis"]),
    tRow(["Regulatory Intelligence", "Global ingredient restriction databases, SCCS opinions, MoCRA, labeling compliance", "Selerant Decernis, Coptis Regulatory, Covance Alchemy"]),
    tRow(["Document & Knowledge Mgmt", "SOPs, project documents, knowledge base, internal collaboration", "SharePoint, Confluence, Notion"]),
  ],
  width: { size: 9500, type: WidthType.DXA },
}));

// 5.2 — Formulation & Regulatory Systems
children.push(spacer());
children.push(h2("5.2 Formulation & Regulatory Systems: Coptis → Ithos"));
children.push(body("For a cosmetic CM, the formulation system is the most critical piece of software — it is where formulas are created, versioned, and validated for regulatory compliance across markets. Cosmetic Solutions is currently evaluating Ithos as a replacement for Coptis Lab. This transition is a significant digital transformation opportunity in its own right."));
children.push(spacer());
children.push(h3("What These Systems Manage"));
children.push(bullet("Formula repository: base formulas, variants, customer-specific versions, version history"));
children.push(bullet("INCI name mapping and ingredient master data (supplier-specific vs. regulatory name)"));
children.push(bullet("Regulatory compliance per market: EU Annex II/III/IV/V/VI, US MoCRA, Health Canada, ASEAN, China NMPA"));
children.push(bullet("Concentration limits and restricted substance checking per formula per market"));
children.push(bullet("SDS (Safety Data Sheet) and product label generation"));
children.push(bullet("Stability protocol management and results tracking"));
children.push(bullet("Claim substantiation linking (active → supporting study)"));
children.push(spacer());
children.push(h3("CosmoLab Integration Opportunities"));
children.push(bullet("Formula Catalog Matching: when a client brief is captured, CosmoLab queries Coptis/Ithos for closest existing base formulas — reducing formulation-from-scratch work"));
children.push(bullet("Pre-Formulation Regulatory Screening: ingredients mentioned in a discovery session are checked against the formula system's regulatory database before R&D starts"));
children.push(bullet("Specification Auto-Population: CosmoLab discovery output pre-fills formula spec fields in Ithos — product category, claims, target markets, key actives"));
children.push(bullet("Stability Plan Generation: CosmoLab generates a stability protocol template that maps to Ithos stability module structure"));
children.push(bullet("Coptis → Ithos Migration Support: CosmoLab can assist in validating migrated data — flagging formula records with incomplete regulatory mapping in the new system"));

// 5.3 — Shop Floor Systems
children.push(spacer());
children.push(h2("5.3 Manufacturing Execution: RedZone & Shop Floor Systems"));
children.push(body("RedZone is a connected worker platform widely adopted in CPG and personal care manufacturing. It transforms the shop floor from a manual, paper-and-whiteboard operation into a real-time, data-driven environment where frontline workers, supervisors, and leadership share a live view of production."));
children.push(spacer());
children.push(h3("What RedZone Does"));
children.push(bullet("Real-time OEE (Overall Equipment Effectiveness) tracking: availability, performance, quality rates per line"));
children.push(bullet("Digital shift handoffs: outgoing shift summarizes line state, open issues, and in-progress batches — incoming shift starts informed"));
children.push(bullet("Downtime classification and root cause tagging: every stoppage is logged with reason code"));
children.push(bullet("Frontline worker communications: announcements, safety alerts, and process updates pushed to line displays"));
children.push(bullet("Performance leaderboards and gamification: drives frontline engagement and continuous improvement culture"));
children.push(bullet("Integration with ERP work orders: pulls planned production schedule; pushes actual output and downtime events"));
children.push(spacer());
children.push(h3("CosmoLab Integration Opportunities with RedZone"));
children.push(bullet("Batch Setup Intelligence: when a new production order is launched, CosmoLab generates a 'batch readiness brief' for the operator — formula highlights, known risks from prior batches, critical control points"));
children.push(bullet("Downtime Pattern Analysis: CosmoLab analyzes RedZone downtime data and generates a root cause summary and recommended PM actions for Engineering"));
children.push(bullet("Shift Handoff Enrichment: CosmoLab synthesises the RedZone shift data into a structured narrative handoff memo for supervisors — reducing verbal miscommunication"));
children.push(bullet("OEE Trend Narrative: instead of raw charts, CosmoLab generates a plain-English weekly OEE narrative for leadership with anomaly callouts and recommendations"));
children.push(spacer());
children.push(h3("Electronic Batch Records (eBMR)"));
children.push(body("Paper batch records are a persistent bottleneck in cosmetic manufacturing — time to complete, errors, and manual review slow batch release. An eBMR system (standalone or embedded in QMS/ERP) closes this gap."));
children.push(bullet("CosmoLab generates a pre-filled eBMR template from the formula spec and production order data — operators confirm rather than transcribe"));
children.push(bullet("Exception-based review: CosmoLab flags out-of-spec entries in the completed eBMR for QA review, reducing review time"));
children.push(bullet("Deviation pre-classification: CosmoLab drafts the initial deviation report when a batch parameter falls outside tolerance, accelerating the CAPA process"));

// 5.4 — Quality & Lab Systems
children.push(spacer());
children.push(h2("5.4 Quality & Laboratory Systems: LIMS + QMS"));
children.push(body("Quality is the most document-intensive function in a cosmetic CM. A LIMS manages laboratory data; a QMS manages the quality management system documents, events, and actions. Together they hold the operational quality record of the company."));
children.push(spacer());
children.push(h3("LIMS Integration"));
children.push(bullet("CoA Auto-Generation: CosmoLab generates the Certificate of Analysis narrative from LIMS test results — summary language, pass/fail callouts, and customer-specific formatting"));
children.push(bullet("Stability Report Drafting: LIMS stability data + CosmoLab = structured stability summary report for regulatory submissions or client review"));
children.push(bullet("Out-of-Spec (OOS) Investigation Starter: when LIMS flags an OOS result, CosmoLab drafts the initial OOS investigation report — hypothesis generation, prior history pull, recommended retest protocol"));
children.push(spacer());
children.push(h3("QMS Integration"));
children.push(bullet("NCR / Deviation Drafting: CosmoLab takes a brief description of the non-conformance and drafts the full NCR report — event description, impact assessment, immediate containment actions, root cause hypotheses"));
children.push(bullet("CAPA Generation: based on root cause analysis, CosmoLab drafts the CAPA plan — corrective actions, responsible owners, due dates, verification criteria"));
children.push(bullet("SOP Refresh: CosmoLab reviews an existing SOP and drafts a redlined updated version when a process change is captured in a discovery session"));
children.push(bullet("Audit Preparation: CosmoLab generates an audit readiness checklist and gap assessment based on the applicable standard (ISO 22716, FDA 21 CFR, NSF)"));

// 5.5 — ERP Integration
children.push(spacer());
children.push(h2("5.5 ERP Integration"));
children.push(body("The ERP is the financial and operational spine of the CM. CosmoLab does not replace ERP functionality — it feeds structured data into it and enriches information coming out of it."));
children.push(bullet("New project record creation: CosmoLab discovery session output triggers a new project/job record in ERP with correct category, client, product type, and target timeline"));
children.push(bullet("BOM skeleton generation: R&D session output creates a draft Bill of Materials in ERP/PLM — formula actives, estimated quantities, packaging components"));
children.push(bullet("Demand Planning intake: Sales session volume commitments auto-populate a demand planning record — no manual re-entry"));
children.push(bullet("Procurement signal: ingredient requirements surfaced in R&D sessions generate a procurement alert for long-lead-time raw materials"));
children.push(bullet("Supported ERP systems: SAP S/4HANA, Oracle ERP Cloud, NetSuite, Sage (via API, file export, or middleware like MuleSoft/Boomi)"));

// 5.6 — AI Strategy: Build vs Buy
children.push(spacer());
children.push(h2("5.6 AI Strategy: Build vs. Buy"));
children.push(body("Not all AI capability needs to be built in CosmoLab. A pragmatic AI strategy for a cosmetic CM distinguishes between off-the-shelf AI tools that address general productivity needs and internally built AI (via CosmoLab) that delivers domain-specific, company-specific intelligence unavailable from any commercial product."));
children.push(spacer());
children.push(h3("Off-the-Shelf AI: Deploy and Get ROI Quickly"));
children.push(new Table({
  rows: [
    tRow(["Tool", "What It Does", "Best Fit for CM"], true),
    tRow(["Microsoft Copilot (M365)", "AI embedded in Word, Excel, Outlook, Teams, SharePoint — drafts emails, summarizes meetings, analyzes spreadsheets", "All departments — highest ROI if already on M365"]),
    tRow(["Salesforce Einstein / Agentforce", "AI within Salesforce CRM — opportunity scoring, email drafting, next-best-action", "Sales team — if using Salesforce"]),
    tRow(["Gong / Chorus.ai", "AI-powered call recording and analysis — extracts action items, flags client sentiment, surfaces coaching insights from Sales calls", "Sales — captures unstructured client intelligence from calls"]),
    tRow(["Power BI Copilot / Tableau Pulse", "AI-generated narratives and anomaly detection on BI dashboards — operations and finance leaders ask questions in plain English", "Leadership and Planning — replaces static reporting"]),
    tRow(["GitHub Copilot", "AI code completion and generation for internal development teams", "IT / any internal dev team"]),
    tRow(["Selerant Decernis AI", "AI-augmented global regulatory intelligence — ingredient restriction monitoring, label compliance checking", "R&D, Quality, Regulatory — if not using Coptis/Ithos regulatory module"]),
    tRow(["RedZone embedded AI", "OEE prediction and anomaly detection built into RedZone platform", "Manufacturing — already available if on RedZone"]),
    tRow(["Notion AI / Confluence AI", "AI within knowledge base tools — summarizes documents, drafts SOPs, answers questions about internal content", "All departments — best if already on one of these platforms"]),
  ],
  width: { size: 9500, type: WidthType.DXA },
}));

children.push(spacer());
children.push(h3("Internally Built AI via CosmoLab: Where Generic Tools Cannot Compete"));
children.push(body("CosmoLab's unique advantage is deep, company-specific intelligence — understanding the CM's own formulas, clients, processes, and documents. No off-the-shelf tool can deliver this without months of expensive customisation."));
children.push(new Table({
  rows: [
    tRow(["CosmoLab Capability", "Why Off-the-Shelf AI Cannot Replicate This"], true),
    tRow(["Formula Catalog Matching", "Requires knowledge of the CM's proprietary formula library — not available to any external AI tool"]),
    tRow(["Cross-Team Handoff Assessment", "Requires domain model of a CM's specific team structure, handoff types, and cosmetic industry workflows"]),
    tRow(["Client Self-Service Discovery Portal", "Requires product category knowledge, regulatory awareness, and CM-specific intake logic baked in"]),
    tRow(["Ingredient Compliance Screening (in-session)", "Requires real-time mapping of client-mentioned actives to regulatory databases during the AI conversation"]),
    tRow(["NCR / Deviation Drafting from QMS Data", "Requires understanding of GMP documentation structure and the CM's specific QMS event taxonomy"]),
    tRow(["eBMR Pre-Fill from Formula Spec", "Requires integration of Coptis/Ithos formula data with ERP production order data — custom to each CM's system configuration"]),
    tRow(["Trend Intelligence from Session History", "Requires aggregation across the CM's own client session history — proprietary data Microsoft Copilot does not have"]),
  ],
  width: { size: 9500, type: WidthType.DXA },
}));

children.push(spacer());
children.push(h3("Decision Framework: Build vs. Buy"));
children.push(bullet("Buy (off-the-shelf AI): general productivity tasks, CRM AI, BI narratives, code assistance, meeting summarisation — these apply to any business and off-the-shelf tools deliver good ROI"));
children.push(bullet("Build with CosmoLab: anywhere the CM's own data (formulas, clients, processes, history) is the source of value — that data is only accessible internally, and generic AI cannot access it"));
children.push(bullet("Integrate: where off-the-shelf AI produces structured output (e.g., Gong call summary), CosmoLab ingests that output and combines it with internal data to generate richer documents"));

// 5.7 — Institutional Memory
children.push(spacer());
children.push(h2("5.7 Institutional Memory & Project Search"));
children.push(body("Every CosmoLab session becomes part of a searchable knowledge base. Teams can search across all past sessions to find similar projects, past decisions, and resolved problems — preventing the reinvention of the wheel and preserving knowledge when staff turn over."));
children.push(spacer());
children.push(h3("Search Capabilities"));
children.push(bullet("Natural language search: 'vitamin C serum for clean beauty brand, US + EU'"));
children.push(bullet("Filter by team, category, date, client type, market, active ingredient"));
children.push(bullet("'Similar projects' suggestions when a new session starts"));
children.push(bullet("Exportable project history per client or product line"));
children.push(bullet("Complements — does not replace — SharePoint or Confluence for formal document storage"));

// 5.8 — Trend Intelligence
children.push(spacer());
children.push(h2("5.8 Trend Intelligence Dashboard"));
children.push(body("Aggregate signals from all CosmoLab sessions to surface emerging trends across the CM's client base and the broader market."));
children.push(bullet("Most requested actives, formats, and claims this quarter"));
children.push(bullet("Emerging categories and regulatory markets clients are targeting"));
children.push(bullet("Comparison to external market trend data (optional integration with Mintel or Euromonitor API)"));
children.push(bullet("Helps CM proactively develop capabilities and stock popular actives before demand peaks"));

// ---------------------------------------------------------------------------
// 6. Strategic Transformation
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("6. Strategic Transformation"));

children.push(h2("6.1 Business Strategy Discovery Sessions"));
children.push(body("A new session type targeting CM leadership. Instead of capturing a product brief, this session captures the CM's strategic context — growth goals, capability gaps, competitive position, and market opportunities. CosmoLab generates a structured strategic assessment and prioritized opportunity list."));
children.push(spacer());
children.push(h3("Session Topics"));
children.push(bullet("Current revenue mix by category, client type, and channel"));
children.push(bullet("Capacity utilisation and headroom for growth"));
children.push(bullet("Capability gaps vs. market demand (e.g., 'we can't do OTC drug yet')"));
children.push(bullet("Client concentration risk and diversification opportunities"));
children.push(bullet("M&A or partnership opportunities to accelerate capability build"));
children.push(bullet("Geographic expansion readiness"));
children.push(spacer());
children.push(h3("Output Documents"));
children.push(bullet("Strategic Situation Assessment"));
children.push(bullet("Growth Opportunity Matrix (high/low effort vs. high/low impact)"));
children.push(bullet("Capability Gap Analysis"));
children.push(bullet("12-Month Strategic Priorities"));

children.push(spacer());
children.push(h2("6.2 Competitive Intelligence"));
children.push(body("When a client references a competitor product as a benchmark, CosmoLab enriches the session with competitive intelligence — ingredient analysis, positioning, price tier, and market performance signals."));
children.push(bullet("Benchmark product deconstruction (INCI, claims, price, channel)"));
children.push(bullet("Competitive differentiation recommendations for the CM's formula"));
children.push(bullet("White space identification: what the benchmark doesn't do well"));

children.push(spacer());
children.push(h2("6.3 Market Expansion Analysis"));
children.push(body("A structured session to evaluate entry into a new product category or geographic market. CosmoLab assesses the opportunity, regulatory requirements, capability gaps, and investment needed."));
children.push(bullet("Category attractiveness scoring (market size, growth, margin profile)"));
children.push(bullet("Regulatory entry requirements by market"));
children.push(bullet("Capability gap vs. required capabilities to compete"));
children.push(bullet("Build vs. acquire vs. partner recommendation"));

// ---------------------------------------------------------------------------
// 7. Regulatory Transformation
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("7. Regulatory Transformation"));

children.push(h2("7.1 Real-Time Ingredient Compliance Checking"));
children.push(body("During a discovery or formulation session, CosmoLab checks every ingredient mentioned against applicable regulatory frameworks in real time — flagging restricted, prohibited, or concentration-limited ingredients before the formula is designed."));
children.push(spacer());
children.push(h3("Regulatory Frameworks Covered"));
children.push(bullet("EU Cosmetics Regulation 1223/2009 — Annexes II, III, IV, V, VI"));
children.push(bullet("FDA MoCRA — US cosmetic safety and labeling requirements"));
children.push(bullet("Health Canada Cosmetic Regulations"));
children.push(bullet("21 CFR 333 / 700 series — OTC Drug monographs"));
children.push(bullet("DSHEA / 21 CFR Part 111 — Dietary supplements"));
children.push(bullet("ISO 22716 — GMP for cosmetics"));

children.push(spacer());
children.push(h2("7.2 Regulatory Change Alerts"));
children.push(body("CosmoLab monitors regulatory changes and alerts the team when an update affects an active project. For example, if the EU restricts a preservative that is used in a formula currently in development, the relevant R&D and Quality teams are notified automatically."));
children.push(bullet("Monitors EU SCCS opinions, FDA guidance, Health Canada updates"));
children.push(bullet("Maps regulatory changes to active project ingredients"));
children.push(bullet("Generates impact assessment per affected project"));

children.push(spacer());
children.push(h2("7.3 Multi-Market Launch Readiness Scoring"));
children.push(body("For a client targeting multiple markets simultaneously, CosmoLab generates a launch readiness score per market — identifying the regulatory, labeling, and safety documentation gaps that must be closed before launch."));
children.push(bullet("Per-market readiness checklist (US, EU, UK, Canada, APAC)"));
children.push(bullet("Gap-to-launch timeline estimate per market"));
children.push(bullet("Documentation tracker: what's complete, what's outstanding"));

// ---------------------------------------------------------------------------
// 8. Implementation Roadmap
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("8. Phase 1.5 Implementation Roadmap"));
children.push(body("Features are sequenced by business impact and implementation dependency. The Cross-Team Workflow Assessment is the starting point — it surfaces all the other automation opportunities."));
children.push(spacer());

children.push(new Table({
  rows: [
    tRow(["Sprint", "Feature", "Area", "Rationale"], true),
    tRow(["1", "Cross-Team Workflow Assessment session type", "Operational", "Flagship feature — surfaces all automation opportunities"]),
    tRow(["1", "Handoff Heat Map + Automation Opportunity Report", "Operational", "Output of the assessment — immediate client value"]),
    tRow(["2", "Cross-team handoff automation flows", "Operational", "Directly implements the assessment findings"]),
    tRow(["2", "Business Strategy discovery session type", "Strategic", "Opens leadership as a new buyer within the CM"]),
    tRow(["3", "Client self-service portal", "Commercial", "Highest commercial leverage — 24/7 intake channel"]),
    tRow(["3", "Real-time ingredient compliance checking", "Regulatory", "Embeds in existing discovery sessions — low new UI"]),
    tRow(["4", "AI-powered quoting engine", "Commercial", "Requires cost model integration from CM"]),
    tRow(["4", "Institutional memory & project search", "Digital", "Requires session history data accumulation"]),
    tRow(["5", "Formula catalog matching (Coptis / Ithos integration)", "Operational + Digital", "Requires CM formula library API access — coordinate with Ithos migration timeline"]),
    tRow(["5", "RedZone integration: shift handoff enrichment + OEE narratives", "Digital", "API access to RedZone; high frontline impact, builds Manufacturing buy-in"]),
    tRow(["5", "Trend intelligence dashboard", "Digital", "Requires sufficient session volume to be meaningful"]),
    tRow(["6", "ERP integration (BOM, project record, procurement signal)", "Digital", "Highest technical complexity — requires CM IT and SAP/NetSuite access"]),
    tRow(["6", "LIMS integration: CoA auto-generation, OOS investigation starter", "Digital", "LIMS API access; QA team must be engaged early"]),
    tRow(["6", "QMS integration: NCR/CAPA drafting, SOP refresh, audit prep", "Digital", "Requires QMS write access and QA champion"]),
    tRow(["6", "CRM integration", "Commercial", "Standard API integration with Salesforce / HubSpot"]),
    tRow(["6", "Regulatory change alerts (Selerant Decernis / Coptis Regulatory feed)", "Regulatory", "Requires regulatory data feed integration or Ithos regulatory module API"]),
  ],
  width: { size: 9500, type: WidthType.DXA },
}));

// ---------------------------------------------------------------------------
// 9. Success Metrics
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("9. Success Metrics"));
children.push(body("Phase 1.5 success is measured by demonstrable operational improvements at the CM, not just feature completion."));
children.push(spacer());

children.push(new Table({
  rows: [
    tRow(["Metric", "Target", "How Measured"], true),
    tRow(["Intake-to-brief time reduction", "≥60%", "Time from client contact to structured brief in system"]),
    tRow(["Cross-team handoff rework rate", "≥40% reduction", "Number of 'chase' communications per project"]),
    tRow(["Formula-from-scratch rate", "≥30% reduction", "% projects using existing base vs. new formulation"]),
    tRow(["Time to first quote", "≥50% reduction", "Days from discovery session to quote issued"]),
    tRow(["Regulatory flags caught pre-formulation", "Track and report", "Ingredients flagged before formula development starts"]),
    tRow(["Knowledge reuse rate", "Track and report", "% new projects referencing a past similar project"]),
  ],
  width: { size: 9000, type: WidthType.DXA },
}));

// ---------------------------------------------------------------------------
// 10. Open Questions
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("10. Open Questions & Decisions Required"));
children.push(spacer());
children.push(h3("Formulation & Regulatory Systems"));
children.push(bullet("Coptis → Ithos migration: What is the current timeline for Cosmetic Solutions' migration to Ithos? Should CosmoLab build Coptis integration first, or wait and build Ithos-native integration?"));
children.push(bullet("Formula catalog API: Does Ithos (or Coptis) expose a REST API for formula search and retrieval, or does integration require file export/import?"));
children.push(bullet("Formula data completeness: What % of the formula catalog has complete INCI mapping, regulatory status, and specification data — and who owns remediation of gaps?"));
children.push(spacer());
children.push(h3("Shop Floor & Quality Systems"));
children.push(bullet("RedZone API access: What data does RedZone expose via API — OEE metrics, downtime events, shift notes? Is there a webhook model for real-time event push?"));
children.push(bullet("eBMR system: Does CS currently use an eBMR system, or are batch records paper-based? If paper, what is the appetite to digitize?"));
children.push(bullet("LIMS: Which LIMS is in use (LabVantage, STARLIMS, other)? What data is accessible via API — test results, CoA templates, stability study results?"));
children.push(bullet("QMS: Which QMS is in use (MasterControl, ETQ, other)? What is the process for AI-drafted NCRs entering the QMS — will they be manually reviewed before being saved as official records?"));
children.push(spacer());
children.push(h3("AI Strategy"));
children.push(bullet("Microsoft 365 adoption: Is CS on M365? If so, Microsoft Copilot is the fastest off-the-shelf AI win — worth evaluating before building CosmoLab equivalents for general productivity tasks."));
children.push(bullet("Gong / Chorus: Does the Sales team record client discovery calls? If so, Gong integration with CosmoLab could auto-ingest call summaries into the discovery session context."));
children.push(bullet("Selerant Decernis: Is there an existing subscription? This is the most practical source for real-time regulatory intelligence — CosmoLab should integrate with it rather than building a regulatory database from scratch."));
children.push(spacer());
children.push(h3("Other"));
children.push(bullet("Formula catalog format: How will the CM's existing formula library be ingested into CosmoLab?"));
children.push(bullet("ERP system and API access: Which ERP is in use and what is the API access model for project record creation and BOM integration?"));
children.push(bullet("CRM integration: Which CRM does the target CM use? Is API access available?"));
children.push(bullet("Cost model integration: Who owns the CM's BOM cost model and in what format does it exist?"));
children.push(bullet("Client portal branding: Will the client portal be co-branded (CM + CosmoLab) or fully white-labelled?"));
children.push(bullet("Assessment session owner: Who at the CM will be the process owner for the Cross-Team Workflow Assessment?"));
children.push(bullet("Data privacy: How will client brief data be stored, accessed, and governed across teams?"));

// ---------------------------------------------------------------------------
// Write file
// ---------------------------------------------------------------------------

const doc = new Document({
  creator: "CosmoLab",
  title: "CosmoLab Phase 1.5 — Transformation Platform Product Specification",
  sections: [{ children }],
});

const outPath = path.join(process.cwd(), "docs", "phase-1.5-spec.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Saved: ${outPath}`);
});
