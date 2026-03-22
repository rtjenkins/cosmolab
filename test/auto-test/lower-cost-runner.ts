/**
 * CosmoLab Phase 1 — Lower-Cost Test Runner
 *
 * Completes the 12 combos in results/lower-cost/ using pre-built fixture JSON
 * instead of calling the Claude API. Zero API cost.
 *
 * What it does per combo:
 *   1. Reads the existing conversation.json and stream-response.txt (already saved)
 *   2. Uses a fixture response.json (team-appropriate template, product-adapted title)
 *   3. Builds a real documents.docx using Packer.toBuffer()
 *   4. Saves response.json + documents.docx into the combo folder
 *
 * Run with: npx tsx test/auto-test/lower-cost-runner.ts
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from "docx";
import fs from "fs";
import path from "path";

const RESULTS_DIR = path.join(process.cwd(), "test", "auto-test", "results", "lower-cost");

const TEAM_NAMES: Record<string, string> = {
  rd: "R&D / Formulation",
  quality: "Quality / QA-QC",
  engineering: "Engineering",
  manufacturing: "Manufacturing",
};

const CATEGORY_NAMES: Record<string, string> = {
  skincare: "Skincare",
  haircare: "Haircare",
  otc: "OTC Drug",
  supplements: "Supplements",
};

// Product labels per combo for document titles
const PRODUCT_LABEL: Record<string, string> = {
  "rd-skincare": "Luxury Eye Cream (Dark Circles)",
  "rd-haircare": "Bond-Repair Leave-In Conditioner (Haircare)",
  "rd-otc": "1% Hydrocortisone Anti-Itch Cream (OTC Drug)",
  "rd-supplements": "Women's Beauty Collagen Capsules (Supplement)",
  "quality-skincare": "Luxury Eye Cream (Dark Circles)",
  "quality-haircare": "Bond-Repair Leave-In Cream (Haircare)",
  "quality-otc": "1% Hydrocortisone Cream (OTC Drug)",
  "quality-supplements": "Women's Beauty Collagen Capsules (Supplement)",
  "engineering-otc": "1% Hydrocortisone Cream — Tube Filling Line (OTC Drug)",
  "engineering-supplements": "Women's Beauty Collagen Capsules — Encapsulation Line (Supplement)",
  "manufacturing-otc": "1% Hydrocortisone Cream 30g Tube (OTC Drug)",
  "manufacturing-supplements": "Women's Beauty Collagen Capsules 90-Count Bottle (Supplement)",
};

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

type Section = { heading: string; content: string };
type Doc = { title: string; sections: Section[] };

function rdFixture(productLabel: string): Doc[] {
  return [
    {
      title: `Technical Formulation Brief — ${productLabel}`,
      sections: [
        { heading: "Product Overview", content: `Product: ${productLabel}\nFormulation objective and target consumer defined in discovery session.\nAll specifications to be confirmed during prototype development.` },
        { heading: "Key Active Ingredients", content: "Active ingredients confirmed during discovery session.\n• Selection rationale documented\n• Use levels to be finalised at prototype stage\n• Supplier qualification required for all actives" },
        { heading: "Formulation Type & Texture", content: "Recommended base and texture confirmed per discovery session.\nTarget pH, viscosity, and appearance to be specified at formula lock." },
        { heading: "Exclusions & Constraints", content: "Excluded ingredients confirmed during discovery session.\nAll constraints documented and communicated to formulation team." },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Ingredient Compatibility & Risk Notes — ${productLabel}`,
      sections: [
        { heading: "Compatibility Considerations", content: "Key active ingredient interactions to be assessed during prototype phase.\nPreservative compatibility study required.\npH sensitivity of actives documented." },
        { heading: "Stability Risk Flags", content: "• Light-sensitive actives: opaque/airless packaging recommended\n• Oxidation-sensitive actives: antioxidant co-actives to be considered\n• Temperature-sensitive actives: cool-down addition protocol required" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Regulatory Checklist — ${productLabel}`,
      sections: [
        { heading: "Applicable Frameworks", content: "Regulatory frameworks confirmed per discovery session (target markets as stated).\nAll frameworks to be verified with regulatory affairs team." },
        { heading: "Key Compliance Items", content: "• Product classification confirmed\n• Restricted ingredients verified against applicable annexes\n• Labeling requirements documented\n• Safety assessment / CPSR requirement identified" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Stability & Compatibility Testing Plan — ${productLabel}`,
      sections: [
        { heading: "Study Types Required", content: "• Accelerated stability (40°C / 75% RH)\n• Real-time stability (25°C / 60% RH)\n• Freeze-thaw cycling\n• Photo-stability (where applicable)" },
        { heading: "Testing Parameters", content: "Physical: Appearance, color, odor, pH, viscosity\nChemical: Active ingredient assay (HPLC), degradants\nMicrobiological: TAMC, TYMC, PET per USP/Ph. Eur." },
        { heading: "Timepoints", content: "T=0, T=2 weeks, T=4 weeks, T=8 weeks (within development window)\nT=3, 6, 12, 24 months (real-time program)" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Raw Material Sourcing Requirements — ${productLabel}`,
      sections: [
        { heading: "Key Actives — Sourcing", content: "All key actives identified in discovery session.\nSupplier qualification documentation required:\n• Certificate of Analysis (CoA)\n• Safety Data Sheet (SDS)\n• Technical Data Sheet (TDS)\n• REACH compliance (if EU)\n• Allergen declaration" },
        { heading: "Supporting Ingredients", content: "Emollients, humectants, emulsifier system, preservatives, and antioxidants to be finalised at formulation stage.\nAll to meet applicable pharmacopoeial or cosmetic grade standards." },
        { heading: "Lead Time Risk", content: "Specialty actives may carry 4–8 week lead times.\nSourcing must be initiated in Week 1 of the development program." },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Formula Development Timeline — ${productLabel}`,
      sections: [
        { heading: "Development Milestones", content: "Week 1–2: Brief finalization, raw material sourcing initiation\nWeek 3–4: First prototype (F1)\nWeek 5–6: Internal evaluation, stability initiation\nWeek 7–8: Optimized prototype (F2), reformulation if required\nWeek 9: Formula lock\nWeek 10: Handover to regulatory and manufacturing" },
        { heading: "Critical Path", content: "• Specialty active sourcing — highest lead time risk\n• Stability data availability at formula lock decision\n• Regulatory jurisdiction confirmation required by Week 2" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
  ];
}

function qualityFixture(productLabel: string): Doc[] {
  return [
    {
      title: `Quality Control Plan — ${productLabel}`,
      sections: [
        { heading: "Scope", content: `This quality control plan covers incoming materials, in-process controls, and finished goods release testing for ${productLabel}.` },
        { heading: "Incoming Material Controls", content: "• CoA review and verification against approved specifications for each lot\n• Identity testing on first receipt and per approved sampling plan thereafter\n• Microbiological testing per risk-based sampling plan\n• Visual inspection: appearance, packaging integrity, labeling" },
        { heading: "In-Process Controls", content: "• pH check at each manufacturing stage\n• Viscosity measurement at batch completion\n• Fill weight verification (continuous during filling)\n• Appearance and color checks throughout" },
        { heading: "Finished Goods Release", content: "Release tests as defined in Specification Sheet.\nAll results must meet acceptance criteria before batch disposition.\nQA sign-off required for batch release." },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Specification Sheet Outline — ${productLabel}`,
      sections: [
        { heading: "Physical Parameters", content: "• Appearance: [To be defined at formula lock]\n• Color: [To be defined]\n• Odor: [To be defined]\n• pH: [Target ± tolerance]\n• Viscosity: [Target ± tolerance]" },
        { heading: "Chemical Parameters", content: "• Active ingredient assay: ≥ [X]% of label claim (per HPLC method)\n• Preservative assay: Within approved range\n• Degradants: NMT [X]% per stability data" },
        { heading: "Microbiological Parameters", content: "Per ISO 17516 / Ph. Eur. 5.1.3 (cosmetics) or USP <61>/<62> (OTC/supplements as applicable):\n• TAMC: NMT 100 CFU/g\n• TYMC: NMT 10 CFU/g\n• Specified organisms: Absent" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Certificate of Analysis (CoA) Template — ${productLabel}`,
      sections: [
        { heading: "Header Information", content: "Product Name:\nProduct Code:\nBatch Number:\nManufacture Date:\nExpiry / Best Before Date:\nBatch Size:\nManufacturing Site:" },
        { heading: "Test Results Table", content: "Test | Method | Specification | Result | Pass/Fail\nAppearance | Visual | [Spec] | | \npH | USP <791> | [Range] | | \nViscosity | [Method] | [Range] | | \nActive Assay | HPLC | ≥[X]% | | \nMicro (TAMC) | USP <61> | NMT 100 CFU/g | | \nMicro (TYMC) | USP <61> | NMT 10 CFU/g | | " },
        { heading: "Disposition", content: "Reviewed by (QC): _________________ Date: _______\nApproved for Release (QA): _________________ Date: _______" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Regulatory Compliance Checklist — ${productLabel}`,
      sections: [
        { heading: "Applicable Regulations", content: "Regulatory frameworks confirmed per discovery session.\n□ FDA (MoCRA / 21 CFR as applicable)\n□ EU Cosmetics Regulation 1223/2009 (if applicable)\n□ 21 CFR 211 / Part 111 (OTC / Supplement as applicable)\n□ Third-party certifications (as required)" },
        { heading: "Documentation Requirements", content: "□ Product safety assessment / CPSR completed\n□ Product Information File (PIF) maintained\n□ Facility registration current\n□ Responsible Person designated (EU/UK)\n□ Labeling reviewed for compliance\n□ Claims substantiation on file" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Stability Protocol Outline — ${productLabel}`,
      sections: [
        { heading: "Study Design", content: "• Accelerated: 40°C / 75% RH — 6 months\n• Long-term: 25°C / 60% RH — 24 months\n• Freeze-thaw: 3 cycles (-10°C ↔ +40°C)\n• Photo-stability: ICH Q1B (where applicable)" },
        { heading: "Test Parameters", content: "Physical: Appearance, pH, viscosity\nChemical: Active assay, degradants (HPLC)\nMicrobiological: TAMC, TYMC, PET at T=0 and end of study" },
        { heading: "Acceptance Criteria", content: "• No significant change in appearance\n• pH within ±0.5 units of T=0\n• Viscosity within ±20% of T=0\n• Active retention ≥90% of label claim at accelerated conditions\n• Microbial counts within limits" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
    {
      title: `Non-Conformance / Deviation Report Template — ${productLabel}`,
      sections: [
        { heading: "Event Details", content: "NC/Deviation Reference Number:\nDate Identified:\nProduct / Batch:\nIdentified By:\nDepartment:" },
        { heading: "Description of Non-Conformance", content: "Description of the event:\n\nAffected parameters / test results:\n\nPotential impact on product quality or safety:" },
        { heading: "Root Cause Analysis", content: "Root cause category: □ Equipment □ Materials □ Method □ Personnel □ Environment\nRoot cause description:\n\nEvidence / investigation summary:" },
        { heading: "CAPA", content: "Corrective action:\n\nPreventive action:\n\nImplementation owner:\n\nTarget completion date:\n\nEffectiveness review date:" },
        { heading: "Disposition", content: "Batch disposition: □ Release □ Rework □ Reject □ Quarantine pending investigation\nQA sign-off: _________________ Date: _______" },
        { heading: "Regulatory Disclaimer", content: "The regulatory information in this document is provided for guidance only. Please verify all regulatory requirements with your qualified regulatory affairs team before acting on it." },
      ],
    },
  ];
}

// For engineering and manufacturing, reuse the saved higher-cost fixtures
function loadHigherCostFixture(team: string): Doc[] {
  const fixturePath = path.join(
    process.cwd(),
    "test", "auto-test", "results", "higher-cost",
    `${team}-skincare`, "response.json"
  );
  const raw = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  return Array.isArray(raw) ? raw : raw.documents ?? [];
}

function getFixture(team: string, category: string): Doc[] {
  const productLabel = PRODUCT_LABEL[`${team}-${category}`] ?? `${CATEGORY_NAMES[category]} Product`;
  switch (team) {
    case "rd":          return rdFixture(productLabel);
    case "quality":     return qualityFixture(productLabel);
    case "engineering":
    case "manufacturing": {
      const docs = loadHigherCostFixture(team);
      // Update titles to reflect the actual category
      return docs.map((d) => ({
        ...d,
        title: d.title.replace(/—.*$/, `— ${productLabel}`),
      }));
    }
    default:
      throw new Error(`No fixture defined for team: ${team}`);
  }
}

// ---------------------------------------------------------------------------
// Build .docx (Node-side, same as test-runner)
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
      children.push(new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 120 } }));
      const lines = (section.content ?? "").split("\n").filter((l) => l.trim());
      for (const line of lines) {
        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("□");
        children.push(new Paragraph({ text: line.trim(), bullet: isBullet ? { level: 0 } : undefined, spacing: { after: 80 } }));
      }
    }
    children.push(new Paragraph({ pageBreakBefore: true }));
  }
  return children;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║      CosmoLab Phase 1 — Lower-Cost Test Runner           ║");
  console.log("║      Zero API calls — fixture-based docx generation      ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  const combos = fs.readdirSync(RESULTS_DIR).filter((d) =>
    fs.statSync(path.join(RESULTS_DIR, d)).isDirectory()
  );

  let passed = 0;
  let failed = 0;

  for (const combo of combos.sort()) {
    const [team, ...catParts] = combo.split("-");
    const category = catParts.join("-");
    const dir = path.join(RESULTS_DIR, combo);

    console.log(`[${combo}]  ${TEAM_NAMES[team] ?? team} × ${CATEGORY_NAMES[category] ?? category}`);

    // Check existing files
    const hasStream = fs.existsSync(path.join(dir, "stream-response.txt"));
    const hasConvo  = fs.existsSync(path.join(dir, "conversation.json"));
    console.log(`  ↳ Chat stream    ... ${hasStream ? "✅ already saved" : "⚠ missing"}`);
    console.log(`  ↳ Conversation   ... ${hasConvo  ? "✅ already saved" : "⚠ missing"}`);

    // Generate response.json from fixture
    process.stdout.write("  ↳ Fixture docs   ... ");
    try {
      const documents = getFixture(team, category);
      fs.writeFileSync(path.join(dir, "response.json"), JSON.stringify(documents, null, 2));
      console.log(`✅ ${documents.length} docs written to response.json (fixture — no API call)`);

      // Build .docx
      process.stdout.write("  ↳ Build .docx    ... ");
      const wordDoc = new Document({
        creator: "CosmoLab AI",
        title: `${TEAM_NAMES[team] ?? team} ${CATEGORY_NAMES[category] ?? category} Discovery Documents`,
        sections: [{ children: buildDocSections(documents) }],
      });
      const buffer = await Packer.toBuffer(wordDoc);
      fs.writeFileSync(path.join(dir, "documents.docx"), buffer);
      console.log(`✅ ${(buffer.byteLength / 1024).toFixed(1)}KB saved`);

      console.log(`  ✅ ${combo} — COMPLETE\n`);
      passed++;
    } catch (err) {
      console.log(`❌ ${String(err)}`);
      console.log(`  ❌ ${combo} — FAILED\n`);
      failed++;
    }
  }

  console.log("══════════════════════════════════════════════════════════");
  console.log(`RESULTS: ${passed}/${combos.length} complete  |  ${failed} failed`);
  console.log(`API calls made: 0  |  Cost: $0.00`);
  console.log("══════════════════════════════════════════════════════════");
  console.log(`\n📁 Results in: ${RESULTS_DIR}`);
}

run().catch((err) => {
  console.error("Runner crashed:", err);
  process.exit(1);
});
