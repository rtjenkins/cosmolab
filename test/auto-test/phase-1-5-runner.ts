/**
 * CosmoLab Phase 1.5 — Zero-Cost Test Runner
 *
 * Tests the Cross-Team Workflow Assessment (Sprint 1) using:
 *   1. A handcrafted fixture conversation (realistic CM scenario)
 *   2. A handcrafted fixture response (4 assessment documents)
 *   3. Real .docx build via Packer.toBuffer()
 *
 * API calls made: 0  |  Cost: $0.00
 *
 * Run with: npx tsx test/auto-test/phase-1-5-runner.ts
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from "docx";
import fs from "fs";
import path from "path";

const RESULTS_DIR = path.join(
  process.cwd(), "test", "auto-test", "results", "phase-1-5", "workflow-assessment"
);

// ---------------------------------------------------------------------------
// Fixture conversation
// Realistic assessment session for a mid-size cosmetic CM (~$80M revenue).
// 9 handoffs scored, mix of tight (4) and loose (1-2) flows.
// ---------------------------------------------------------------------------

type Message = { role: "user" | "assistant"; content: string };

const FIXTURE_CONVERSATION: Message[] = [
  {
    role: "assistant",
    content: "Hi, I'm CosmoLab AI. I'm here to conduct a Cross-Team Workflow Assessment for your organization. Over the next 20–25 minutes, we'll systematically walk through all 9 critical cross-team handoffs — I'll score each one on a Handoff Tightness Scale from 1 (broken) to 5 (fully automated), and at the end I'll generate a prioritized roadmap for improvement.\n\nLet's start at the very beginning of your project lifecycle. When a Sales rep closes a new client project — what triggers the handoff to your R&D / Formulation team? How does R&D find out a new project exists?",
  },
  {
    role: "user",
    content: "Honestly it's pretty informal. The Sales rep usually sends an email to our VP of R&D with a summary of what the client wants. Sometimes it's detailed, sometimes it's just a one-liner. There's no standard format.",
  },
  {
    role: "assistant",
    content: "Got it — email-based and variable in completeness. When R&D receives that email, do they typically have everything they need to start scoping the project, or do they usually have to go back to Sales with follow-up questions?",
  },
  {
    role: "user",
    content: "They almost always go back. I'd say 80% of the time there are missing details — target markets, desired claims, benchmark products, packaging constraints. It causes a lot of back-and-forth before R&D can even start.",
  },
  {
    role: "assistant",
    content: "That's a significant rework rate. Is there any documentation trail — can you go back and find what was originally agreed between Sales and R&D for a project from 18 months ago?",
  },
  {
    role: "user",
    content: "Not reliably. It's buried in email threads. If the Sales rep has left the company, it's very hard to reconstruct what was originally agreed.",
  },
  {
    role: "assistant",
    content: "Understood — that's a knowledge continuity risk as well. Now let's look at the Sales → Demand Planning handoff. When a client project is confirmed with a volume commitment and timeline, how does that information reach your Demand Planning team?",
  },
  {
    role: "user",
    content: "Same issue — it's usually a Slack message or email to the Planning manager. There's no formal intake. The planner often finds out about a new launch a week after Sales has already committed a date to the client.",
  },
  {
    role: "assistant",
    content: "So there's a timing lag between commitment and Planning being informed — and sometimes Planning is working backwards against a date they didn't set. How do they handle the volume assumptions — is there any documented forecast or is it verbal?",
  },
  {
    role: "user",
    content: "Usually verbal or a number in the email. No structured forecast document. The planner builds their own spreadsheet from there.",
  },
  {
    role: "assistant",
    content: "Noted. Let's move to R&D → Manufacturing. When a formula is locked and ready for scale-up, how does Manufacturing receive the handover?",
  },
  {
    role: "user",
    content: "We have a formula handover packet — a Word template that R&D fills out. It includes the formula, BOM, manufacturing notes, and key process parameters. Manufacturing reviews it and signs off before scale-up starts.",
  },
  {
    role: "assistant",
    content: "That's meaningfully more structured. Is the template consistently used, or does it vary by formulator?",
  },
  {
    role: "user",
    content: "It's pretty consistently used — we've had that process for about 3 years. The main gap is that the template doesn't always get updated when there are late formula tweaks. Manufacturing sometimes works off a version that's been superseded.",
  },
  {
    role: "assistant",
    content: "Version control is a known risk then. Moving on — when R&D identifies that a new product requires new equipment or line modifications, how does Engineering get involved?",
  },
  {
    role: "user",
    content: "We have a formal Engineering Change Request form that R&D submits. Engineering reviews it, assigns an engineer, and we have a formal kickoff meeting. That process is actually pretty solid.",
  },
  {
    role: "assistant",
    content: "Good — that sounds like one of the tighter handoffs. Is there a defined SLA for Engineering to respond to a new request?",
  },
  {
    role: "user",
    content: "Yes, 5 business days for initial assessment. They hit that most of the time.",
  },
  {
    role: "assistant",
    content: "Strong. Now R&D → Quality. When does QA/QC get brought into a new product — and how do they receive the testing requirements from R&D?",
  },
  {
    role: "user",
    content: "It's informal. R&D usually sends Quality an email when they're approaching formula lock asking them to set up a QC plan. There's no standard template — QA has to go back and forth to understand what claims are being made and what markets are targeted.",
  },
  {
    role: "assistant",
    content: "So similar to the Sales → R&D dynamic — lots of back-and-forth before Quality can actually start their work. Is there a risk that Quality's involvement comes too late in the development cycle?",
  },
  {
    role: "user",
    content: "Yes, definitely. We've had situations where QA flags a regulatory issue at formula lock that could have been caught at brief stage. It's a timing problem.",
  },
  {
    role: "assistant",
    content: "Understood. Now Manufacturing → Quality. During and after production, how does batch information flow to the Quality team for release?",
  },
  {
    role: "user",
    content: "We use a physical batch record — operators fill it out on the floor, supervisors sign it, and then QA does a full batch record review before releasing. It's thorough but slow — batch record review can take 3–5 days.",
  },
  {
    role: "assistant",
    content: "Is the batch record a paper document, or has any of it been digitized?",
  },
  {
    role: "user",
    content: "Still paper. We've talked about going electronic but haven't done it yet. The review process is manual and any discrepancies require physical annotation.",
  },
  {
    role: "assistant",
    content: "Got it — structured process, but paper-based creates throughput constraints. Let's look at Demand Planning → Manufacturing. How does the production schedule reach the shop floor?",
  },
  {
    role: "user",
    content: "We have a weekly S&OP meeting where Planning presents the 4-week rolling schedule. It gets entered into our ERP after the meeting. Manufacturing supervisors access it from ERP.",
  },
  {
    role: "assistant",
    content: "That's reasonably structured. Are there situations where the schedule changes mid-week and Manufacturing doesn't find out quickly enough?",
  },
  {
    role: "user",
    content: "Yes — if a client expedites an order, the change goes into ERP but Manufacturing supervisors don't always check ERP in real time. They rely on Planning emailing or calling them about urgent changes.",
  },
  {
    role: "assistant",
    content: "So the ERP is the system of record but real-time communication still relies on email and phone. Now Demand Planning → Procurement for raw materials. How does Procurement know when to buy?",
  },
  {
    role: "user",
    content: "Planning generates a weekly material requirements report from ERP and emails it to the Procurement team. Procurement reviews it and places orders. It mostly works but there's sometimes a 2–3 day lag between the report being generated and orders being placed for long-lead-time items.",
  },
  {
    role: "assistant",
    content: "And finally — Quality to All Teams for non-conformances. When a batch fails or a deviation is identified, how does that information escalate and reach the relevant teams?",
  },
  {
    role: "user",
    content: "We have a deviation log in our QMS, but the notification process is manual. QA fills out the NC form and then emails the relevant department head. There's no automatic alert. Sometimes it takes a day or two for Manufacturing or R&D to find out about a batch that's been put on hold.",
  },
  {
    role: "assistant",
    content: "So the QMS exists but escalation is manual and inconsistent. Are there situations where a deviation in one batch affects other batches in production — and the impacted teams don't find out fast enough?",
  },
  {
    role: "user",
    content: "Yes, that's happened. A raw material OOS result sat in QA for a day before Manufacturing was told to stop using the affected lot. Some of it had already been consumed.",
  },
  {
    role: "assistant",
    content: "That's the clearest example of a high-impact broken flow — one where the lag has direct quality and cost consequences.\n\nI have everything I need. Type 'generate' to create your assessment reports.",
  },
];

// ---------------------------------------------------------------------------
// Fixture response — 4 assessment documents
// Scores: S→R&D:2, S→Plan:2, R&D→Mfg:3, R&D→Eng:4, R&D→Qual:2,
//         Mfg→Qual:3, Plan→Mfg:3, Plan→Proc:3, Qual→All:1  → avg 2.6
// ---------------------------------------------------------------------------

type Section = { heading: string; content: string };
type Doc = { title: string; sections: Section[] };

const FIXTURE_DOCUMENTS: Doc[] = [
  {
    title: "Handoff Tightness Assessment",
    sections: [
      {
        heading: "Executive Summary",
        content:
          "This assessment evaluated all 9 critical cross-team handoffs at the organization. The overall Handoff Tightness score is 2.6 / 5 — classified as Ad Hoc to Guided. Five of the nine handoffs operate below a score of 3, indicating significant reliance on email, verbal communication, and individual knowledge rather than standardized systems. The highest-risk flows are at both ends of the project lifecycle: project intake (Sales → R&D / Planning) and non-conformance escalation (Quality → All Teams).",
      },
      {
        heading: "Handoff Scores",
        content:
          "Score | Handoff | Tool Used | Primary Pain Point\n" +
          "2 | Sales → R&D / Formulation | Email (unstructured) | 80% rework rate; missing brief data; no documentation trail\n" +
          "2 | Sales → Demand Planning | Slack / email | Planning uninformed until after client commitment; no forecast document\n" +
          "3 | R&D → Manufacturing | Word template | Consistent but version control gap; late formula tweaks not always captured\n" +
          "4 | R&D → Engineering | Formal ECR form | Well-structured; 5-day SLA; formal kickoff meeting\n" +
          "2 | R&D → Quality | Email (unstructured) | Late QA involvement; claims and market info not transferred systematically\n" +
          "3 | Manufacturing → Quality | Paper batch record | Structured process but paper-based; 3–5 day review cycle\n" +
          "3 | Demand Planning → Manufacturing | ERP + S&OP meeting | Schedule in ERP but real-time changes rely on email/phone\n" +
          "3 | Demand Planning → Procurement | Weekly ERP report | 2–3 day lag on long-lead-time POs; mostly manual\n" +
          "1 | Quality → All Teams | Manual email from QMS | No automated alert; 1–2 day lag on NC escalation; direct quality and cost impact confirmed",
      },
      {
        heading: "Key Themes",
        content:
          "• Email dependency: 5 of 9 handoffs rely primarily on unstructured email as the communication mechanism\n" +
          "• Late team involvement: Quality and Planning are frequently informed after key decisions are already made\n" +
          "• Version control risk: Formula and specification document versioning is manual and inconsistently applied\n" +
          "• Paper bottleneck: Batch record process is thorough but paper-based, creating a 3–5 day throughput constraint on batch release\n" +
          "• Single points of failure: Key handoffs depend on specific individuals — no documented owner or SLA for most flows",
      },
      {
        heading: "Overall Maturity Rating",
        content:
          "Score: 2.6 / 5 — Ad Hoc to Guided\n\nThe organization has pockets of strong structure (Engineering ECR process, R&D → Manufacturing handover template) but the majority of inter-team handoffs are email- and person-dependent. This creates rework, delays, knowledge loss on staff turnover, and — in the case of quality escalations — direct product and cost risk.\n\nNote: This assessment is based on information provided in a single session. Findings should be validated with all relevant team leads before implementation.",
      },
    ],
  },
  {
    title: "Automation Opportunity Report",
    sections: [
      {
        heading: "Overview",
        content:
          "Opportunities are ranked by the combination of operational impact (rework reduction, time saving, risk reduction) and implementation effort. Quick Wins require minimal tool investment and can be completed within 30 days. Medium-Term improvements require process redesign. Deep Integration opportunities require system or tool investment.",
      },
      {
        heading: "Quick Wins — Addressable Within 30 Days",
        content:
          "1. Standardize the Sales → R&D Client Brief\n" +
          "   Handoff: Sales → R&D / Formulation\n" +
          "   Current gap: Unstructured email; 80% rework rate\n" +
          "   Action: Create a mandatory digital intake form (minimum: product category, target markets, key claims, benchmark, timeline, volume)\n" +
          "   Effort: Low\n" +
          "   Estimated weekly saving: 4–6 hours (R&D rework + Sales back-and-forth)\n\n" +
          "2. Add Quality to the New Project Brief Distribution\n" +
          "   Handoff: R&D → Quality\n" +
          "   Current gap: Quality engaged too late; regulatory issues caught at formula lock\n" +
          "   Action: QA receives a copy of every new client brief at project initiation; QA registers regulatory risk flags within 48 hours\n" +
          "   Effort: Low\n" +
          "   Estimated weekly saving: 2–4 hours (prevents late-stage regulatory rework)\n\n" +
          "3. Formalize Planning Notification at Sales Commitment\n" +
          "   Handoff: Sales → Demand Planning\n" +
          "   Current gap: Planning informed after client commitment; no structured forecast\n" +
          "   Action: Sales completes a one-page launch brief (volume, timeline, channel) at point of client commitment, cc'd to Planning\n" +
          "   Effort: Low\n" +
          "   Estimated weekly saving: 2–3 hours (Planning re-work and schedule scrambles)",
      },
      {
        heading: "Medium-Term Improvements — 1 to 3 Months",
        content:
          "4. Version-Controlled Formula Handover Package\n" +
          "   Handoff: R&D → Manufacturing\n" +
          "   Current gap: Late formula tweaks not captured; Manufacturing may work off superseded version\n" +
          "   Action: Move formula handover to a controlled document management system (SharePoint or Coptis/Ithos); version numbering required; Manufacturing acknowledges latest version before scale-up\n" +
          "   Effort: Medium\n" +
          "   Estimated weekly saving: 2–3 hours (prevents scale-up errors from outdated specs)\n\n" +
          "5. ERP Real-Time Schedule Alert for Manufacturing\n" +
          "   Handoff: Demand Planning → Manufacturing\n" +
          "   Current gap: Schedule changes in ERP not seen by Manufacturing in real time\n" +
          "   Action: Configure ERP to push automated alerts (email or SMS) to Manufacturing supervisors when priority changes are made to the 5-day horizon\n" +
          "   Effort: Medium\n" +
          "   Estimated weekly saving: 1–2 hours (reduces emergency verbal communication)",
      },
      {
        heading: "Deep Integration Opportunities — 3 to 6 Months",
        content:
          "6. Electronic Batch Record (eBMR) Implementation\n" +
          "   Handoff: Manufacturing → Quality\n" +
          "   Current gap: Paper batch records; 3–5 day review cycle; manual annotation\n" +
          "   Action: Implement eBMR system (MasterControl, Tulip, or SAP PM module); exception-based QA review reduces review time to 1 day\n" +
          "   Effort: High\n" +
          "   Estimated weekly saving: 8–12 hours QA review time; 1–2 day improvement in batch release cycle\n\n" +
          "7. Automated NC Escalation Alerts from QMS\n" +
          "   Handoff: Quality → All Teams\n" +
          "   Current gap: Manual email notification; 1–2 day lag; confirmed quality and cost impact\n" +
          "   Action: Configure QMS to automatically notify relevant department heads within 1 hour of NC classification; include affected lot numbers, severity, and hold status\n" +
          "   Effort: Medium–High (QMS configuration + workflow design)\n" +
          "   Estimated weekly saving: Prevents recurring raw material over-consumption; estimated $15–40K annual cost avoidance based on one confirmed incident",
      },
      {
        heading: "Effort vs. Impact Summary",
        content:
          "Highest ROI (low effort, high impact): Items 1, 2, 3 — implement immediately\n" +
          "Best risk reduction: Item 7 (NC escalation) — high urgency despite medium-high effort\n" +
          "Highest throughput improvement: Item 6 (eBMR) — largest time saving but requires capital investment\n" +
          "Foundational for scale: Item 4 (version control) — prevents compounding errors as project volume grows",
      },
    ],
  },
  {
    title: "90-Day Implementation Roadmap",
    sections: [
      {
        heading: "Guiding Principles",
        content:
          "Success at 90 days means: (1) the three worst-scoring handoffs have measurably improved, (2) all teams have a clear understanding of who owns each handoff and what information is required, and (3) the groundwork is laid for electronic batch records and automated QMS alerts.",
      },
      {
        heading: "Month 1 — Stabilize the Worst Flows",
        content:
          "Week 1:\n" +
          "• Design and publish a standard Sales → R&D Client Brief template (digital form preferred — Google Form, SharePoint form, or CRM intake)\n" +
          "• Define the minimum required fields: product category, target markets, key claims, benchmark product, estimated volume, target launch date\n" +
          "• Brief the Sales team; make completion mandatory before R&D engagement\n\n" +
          "Week 2:\n" +
          "• Add Quality to the new project distribution list for all incoming client briefs\n" +
          "• Define QA's obligation: register regulatory risk assessment within 48 hours of receiving brief\n" +
          "• Create a simple one-page Sales → Planning Launch Brief template for volume and timeline commitments\n\n" +
          "Week 3–4:\n" +
          "• Run the first full project cycle through the new intake templates\n" +
          "• Measure: how many briefs submitted without chasing? Rework rate vs. baseline?\n" +
          "• Responsible function: Sales leadership (template design); R&D lead (QA flag process); Planning manager (launch brief)\n\n" +
          "Success metric: R&D rework rate on new briefs drops from ~80% to <30%",
      },
      {
        heading: "Month 2 — Standardize Remaining Handoffs",
        content:
          "• Implement version-controlled formula handover: move to SharePoint or Coptis/Ithos with version numbering; Manufacturing to acknowledge latest version before scale-up proceeds\n" +
          "• Configure ERP alert for schedule changes in the 5-day manufacturing horizon\n" +
          "• Formalize the Planning → Procurement material requirements process: define a standing deadline (e.g., Wednesday 9am weekly) for long-lead-time PO release\n" +
          "• Document owners and SLAs for all 9 handoffs in a one-page Handoff Charter; distribute to all team leads\n" +
          "• Responsible function: IT (ERP config); R&D and Manufacturing leads (formula version control); Supply Chain (Procurement SLA)\n\n" +
          "Success metric: Zero scale-up errors from outdated formula versions; ERP change alerts in place",
      },
      {
        heading: "Month 3 — Systematize for Scale",
        content:
          "• Issue RFI/RFP for eBMR system (shortlist: MasterControl, Tulip, SAP PM module); involve IT, QA, and Manufacturing in evaluation\n" +
          "• Scope QMS automated NC alert configuration: define severity tiers, alert routing rules, and hold notification format with QA and IT\n" +
          "• Present Month 1–2 results to leadership with measured impact vs. baseline\n" +
          "• Responsible function: QA Director (eBMR + QMS scoping); IT (system evaluation); Operations VP (leadership review)\n\n" +
          "Success metric: eBMR vendor selected; QMS alert design approved; leadership buy-in confirmed for capital investment",
      },
      {
        heading: "Responsible Functions",
        content:
          "• Sales leadership: intake template design and enforcement\n" +
          "• R&D lead: formula handover version control; QA early involvement process\n" +
          "• QA Director: eBMR and QMS scoping; regulatory risk flag SLA\n" +
          "• Planning Manager: launch brief template; S&OP and Procurement process formalization\n" +
          "• IT: ERP alert configuration; eBMR and QMS system evaluation\n" +
          "• Operations VP: Handoff Charter sign-off; leadership progress review",
      },
      {
        heading: "Success Metrics",
        content:
          "• R&D rework rate on new briefs: baseline ~80% → target <30% at Day 30\n" +
          "• Planning lead time on new launches: baseline 1 week lag → target same-day notification at Day 30\n" +
          "• Formula version control errors: baseline unknown → target tracked and reported from Day 45\n" +
          "• NC escalation lag: baseline 1–2 days → target <1 hour at Day 90\n" +
          "• Batch release cycle time: baseline 3–5 days → tracked pending eBMR decision\n\n" +
          "Note: This assessment is based on information provided in a single session. Findings should be validated with all relevant team leads before implementation.",
      },
    ],
  },
  {
    title: "Executive Summary",
    sections: [
      {
        heading: "Assessment Overview",
        content:
          "Assessment type: Cross-Team Workflow Assessment\n" +
          "Scope: All 9 critical inter-team handoffs\n" +
          "Method: Structured AI-facilitated diagnostic session\n" +
          "Conducted via: CosmoLab Phase 1.5 — Transformation Platform",
      },
      {
        heading: "Key Finding",
        content:
          "The organization's cross-team handoffs score 2.6 / 5 on the Handoff Tightness Scale — the majority are email-dependent and person-reliant, creating rework, delays, and in one documented case, direct quality and raw material cost impact. The Engineering ECR process is a best-practice example that the rest of the organization should model.",
      },
      {
        heading: "Top 3 Handoff Gaps",
        content:
          "1. Quality → All Teams (Score: 1 — Broken)\n" +
          "   Non-conformance escalation is manual, slow, and has confirmed cost consequences. A raw material OOS event was not communicated for 24+ hours, resulting in consumption of an affected lot. This is the highest-urgency gap.\n\n" +
          "2. Sales → R&D / Formulation (Score: 2 — Ad Hoc)\n" +
          "   80% of new project briefs require follow-up before R&D can begin work. This delays project start dates and consumes 4–6 hours of combined Sales and R&D time per project. At scale, this is a significant throughput constraint.\n\n" +
          "3. Sales → Demand Planning (Score: 2 — Ad Hoc)\n" +
          "   Planning is routinely informed about new launches after the client commitment has been made. This forces Planning to work backwards against dates they did not set, increasing schedule risk and inventory overages.",
      },
      {
        heading: "Top 3 Recommended Actions",
        content:
          "1. Implement a standard Client Brief template for Sales (this week)\n" +
          "   Expected ROI: 4–6 hours saved per project; R&D rework rate drops from ~80% to <30%\n\n" +
          "2. Configure automated NC escalation alerts in the QMS (Month 3)\n" +
          "   Expected ROI: Prevents repeat of raw material over-consumption; estimated $15–40K annual cost avoidance; direct quality risk reduction\n\n" +
          "3. Add Quality to new project distribution at intake (this week)\n" +
          "   Expected ROI: Regulatory issues caught at brief stage instead of formula lock; prevents costly reformulation cycles",
      },
      {
        heading: "Next Steps",
        content:
          "1. Share this assessment with all team leads for validation (this week)\n" +
          "2. Convene a 60-minute leadership review to prioritize the 90-Day Roadmap actions\n" +
          "3. Assign Month 1 owners by end of week — Sales template, QA early involvement, Planning launch brief\n" +
          "4. Schedule a 30-day progress check to measure rework rate improvement\n\n" +
          "CosmoLab is available to facilitate the team lead validation sessions and leadership review. The Cross-Team Handoff Automation module (Phase 1.5 Sprint 2) can automate the intake and escalation flows identified in this assessment once the manual templates are validated.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Build .docx (same pattern as lower-cost-runner)
// ---------------------------------------------------------------------------

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
        new Paragraph({
          text: section.heading,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 120 },
        })
      );
      const lines = (section.content ?? "").split("\n");
      for (const line of lines) {
        if (!line.trim()) {
          children.push(new Paragraph({ text: "", spacing: { after: 60 } }));
          continue;
        }
        const isBullet =
          line.trim().startsWith("•") ||
          line.trim().startsWith("-") ||
          line.trim().startsWith("□");
        children.push(
          new Paragraph({
            text: line.trim(),
            bullet: isBullet ? { level: 0 } : undefined,
            spacing: { after: 80 },
          })
        );
      }
    }
    children.push(new Paragraph({ pageBreakBefore: true }));
  }
  return children;
}

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

type TestResult = { pass: boolean; message: string };

function assertDocStructure(documents: Doc[]): TestResult[] {
  const results: TestResult[] = [];

  results.push({
    pass: Array.isArray(documents),
    message: "documents is an array",
  });
  results.push({
    pass: documents.length === 4,
    message: `document count: expected 4, got ${documents.length}`,
  });

  const expectedTitles = [
    "Handoff Tightness Assessment",
    "Automation Opportunity Report",
    "90-Day Implementation Roadmap",
    "Executive Summary",
  ];

  for (const expected of expectedTitles) {
    const found = documents.some((d) => d.title.includes(expected));
    results.push({ pass: found, message: `document "${expected}" present` });
  }

  for (const doc of documents) {
    results.push({
      pass: Array.isArray(doc.sections) && doc.sections.length > 0,
      message: `"${doc.title}" has sections`,
    });
    for (const sec of doc.sections ?? []) {
      results.push({
        pass: typeof sec.content === "string" && sec.content.length > 20,
        message: `  section "${sec.heading}" has content`,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║   CosmoLab Phase 1.5 — Sprint 1 Zero-Cost Test Runner        ║");
  console.log("║   Workflow Assessment · Fixture-based · $0.00 API cost       ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  const dir = RESULTS_DIR;
  let totalPassed = 0;
  let totalFailed = 0;

  // ── Test 1: Conversation fixture ──────────────────────────────────────────
  console.log("TEST 1: Fixture conversation structure");
  const convoTests: TestResult[] = [
    { pass: FIXTURE_CONVERSATION.length >= 20, message: `conversation has ${FIXTURE_CONVERSATION.length} turns (≥20 expected)` },
    { pass: FIXTURE_CONVERSATION[0].role === "assistant", message: "first message is from assistant" },
    { pass: FIXTURE_CONVERSATION[FIXTURE_CONVERSATION.length - 1].content.includes("Type 'generate'"), message: "last assistant message includes 'Type generate'" },
    { pass: FIXTURE_CONVERSATION.some((m) => m.content.includes("Sales → R&D")), message: "Sales → R&D handoff covered" },
    { pass: FIXTURE_CONVERSATION.some((m) => m.content.includes("Engineering")), message: "Engineering handoff covered" },
    { pass: FIXTURE_CONVERSATION.some((m) => m.content.toLowerCase().includes("quality") && m.content.toLowerCase().includes("all teams")), message: "Quality → All Teams handoff covered" },
    { pass: FIXTURE_CONVERSATION.some((m) => m.content.includes("Procurement")), message: "Procurement handoff covered" },
    { pass: FIXTURE_CONVERSATION.some((m) => m.content.includes("batch record")), message: "Mfg → Quality batch record covered" },
  ];
  for (const t of convoTests) {
    const icon = t.pass ? "✅" : "❌";
    console.log(`  ${icon} ${t.message}`);
    t.pass ? totalPassed++ : totalFailed++;
  }
  fs.writeFileSync(path.join(dir, "conversation.json"), JSON.stringify(FIXTURE_CONVERSATION, null, 2));
  console.log(`  📁 Saved conversation.json (${FIXTURE_CONVERSATION.length} turns)\n`);

  // ── Test 2: Document fixture structure ────────────────────────────────────
  console.log("TEST 2: Fixture document structure");
  const docTests = assertDocStructure(FIXTURE_DOCUMENTS);
  for (const t of docTests) {
    const icon = t.pass ? "✅" : "❌";
    console.log(`  ${icon} ${t.message}`);
    t.pass ? totalPassed++ : totalFailed++;
  }
  fs.writeFileSync(path.join(dir, "response.json"), JSON.stringify({ documents: FIXTURE_DOCUMENTS }, null, 2));
  console.log(`  📁 Saved response.json (${FIXTURE_DOCUMENTS.length} documents)\n`);

  // ── Test 3: .docx build ───────────────────────────────────────────────────
  console.log("TEST 3: Word document build (.docx)");
  try {
    const wordDoc = new Document({
      creator: "CosmoLab AI",
      title: "CosmoLab — Cross-Team Workflow Assessment",
      sections: [{ children: buildDocSections(FIXTURE_DOCUMENTS) }],
    });
    const buffer = await Packer.toBuffer(wordDoc);
    fs.writeFileSync(path.join(dir, "documents.docx"), buffer);
    const kb = (buffer.byteLength / 1024).toFixed(1);
    console.log(`  ✅ Packer.toBuffer() succeeded`);
    console.log(`  ✅ File size: ${kb}KB`);
    console.log(`  ✅ documents.docx saved`);
    console.log(`  📁 Saved documents.docx (${kb}KB)\n`);
    totalPassed += 3;
  } catch (err) {
    console.log(`  ❌ docx build failed: ${String(err)}`);
    totalFailed++;
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = totalPassed + totalFailed;
  console.log("══════════════════════════════════════════════════════════════");
  console.log(`RESULTS: ${totalPassed}/${total} assertions passed  |  ${totalFailed} failed`);
  console.log(`API calls made: 0  |  Cost: $0.00`);
  console.log("══════════════════════════════════════════════════════════════");
  console.log(`\n📁 Results saved to: ${RESULTS_DIR}`);
  console.log("   • conversation.json  — 23-turn fixture assessment session");
  console.log("   • response.json      — 4 assessment documents (fixture)");
  console.log("   • documents.docx     — built Word file (open to verify)");

  if (totalFailed > 0) process.exit(1);
}

run().catch((err) => {
  console.error("Runner crashed:", err);
  process.exit(1);
});
