/**
 * Generates test-plan.docx — CosmoLab Phase 1 Test Plan & Test Data
 * Run with: npx tsx test/auto-test/generate-test-plan-doc.ts
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function h1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC", space: 4 },
    },
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
  });
}

function h3(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
  });
}

function body(text: string): Paragraph {
  return new Paragraph({ text, spacing: { after: 100 } });
}

function bullet(text: string, level = 0): Paragraph {
  return new Paragraph({ text, bullet: { level }, spacing: { after: 80 } });
}

function meta(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, color: "888888", size: 18 })],
    spacing: { after: 200 },
  });
}

function pageBreak(): Paragraph {
  return new Paragraph({ pageBreakBefore: true });
}

function tableRow(cells: string[], isHeader = false): TableRow {
  return new TableRow({
    children: cells.map(
      (c) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: c,
                  bold: isHeader,
                  size: isHeader ? 18 : 17,
                }),
              ],
              spacing: { after: 60 },
            }),
          ],
          width: { size: Math.floor(9000 / cells.length), type: WidthType.DXA },
        })
    ),
  });
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const TEAMS = ["sales", "rd", "manufacturing", "engineering", "planning", "quality"];
const TEAM_NAMES: Record<string, string> = {
  sales: "Sales",
  rd: "R&D / Formulation",
  manufacturing: "Manufacturing",
  engineering: "Engineering",
  planning: "Demand Planning",
  quality: "Quality / QA-QC",
};
const CATEGORIES = ["skincare", "haircare", "otc", "supplements"];
const CATEGORY_NAMES: Record<string, string> = {
  skincare: "Skincare",
  haircare: "Haircare",
  otc: "OTC Drug",
  supplements: "Supplements",
};

// ---------------------------------------------------------------------------
// Test conversations (24 combos)
// ---------------------------------------------------------------------------

// Skincare conversations (from demoConversations.ts — existing)
const skincareConvos: Record<string, Array<{ role: string; content: string }>> = {
  sales: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for a skincare opportunity. What's the client brand and what are they looking to develop?" },
    { role: "user", content: "A clean beauty indie brand called Lumière. They want a vitamin C brightening serum." },
    { role: "assistant", content: "Great. Who is their target consumer and what price point are they targeting at retail?" },
    { role: "user", content: "Millennial women, clean beauty enthusiasts. Retail $65-85." },
    { role: "assistant", content: "What key claims are they looking to make — brightening, anti-aging, hyperpigmentation correction?" },
    { role: "user", content: "Brightening, even skin tone, and antioxidant protection. No drug claims." },
    { role: "assistant", content: "What markets are they launching in — US only, or international?" },
    { role: "user", content: "US first, then Canada within 6 months." },
    { role: "assistant", content: "What MOQ and volume are they anticipating for the initial run?" },
    { role: "user", content: "Around 3,000 units for the first run, scaling to 10,000 within a year." },
    { role: "assistant", content: "Do they have an existing formula or benchmark, or do they need full formulation development?" },
    { role: "user", content: "They have a brand aesthetic reference — Drunk Elephant C-Firma — but need full formulation from scratch." },
    { role: "assistant", content: "What is their target launch date?" },
    { role: "user", content: "Q4 of this year, so about 8 months from now." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  rd: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. I'll be guiding you through an R&D discovery session for your skincare project. Let's start: what type of skincare product are you looking to develop?" },
    { role: "user", content: "A luxury eye cream targeting dark circles and puffiness." },
    { role: "assistant", content: "What texture and finish are you aiming for — rich cream, lightweight gel-cream, or something else?" },
    { role: "user", content: "Lightweight gel-cream, suitable for morning and evening. Quick absorption is important." },
    { role: "assistant", content: "Who is the target consumer and what price tier is this positioned at?" },
    { role: "user", content: "Women 35-55, premium luxury tier, retail price around $120-150." },
    { role: "assistant", content: "What key actives do you want to feature for the dark circle and puffiness claims?" },
    { role: "user", content: "Caffeine for puffiness, Vitamin K for dark circles, and ideally some peptides — maybe Haloxyl or Eyeliss." },
    { role: "assistant", content: "Are there any ingredients you want to exclude — alcohol, fragrance, parabens, etc.?" },
    { role: "user", content: "No alcohol, no fragrance, and no known allergens." },
    { role: "assistant", content: "What are the target markets for regulatory purposes?" },
    { role: "user", content: "US and EU launch simultaneously." },
    { role: "assistant", content: "What packaging format are you considering?" },
    { role: "user", content: "Airless pump to protect actives and give a premium feel." },
    { role: "assistant", content: "What is your target development timeline?" },
    { role: "user", content: "First prototype within 10-12 weeks." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  manufacturing: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session. What product are we setting up production for?" },
    { role: "user", content: "A gel-cream eye cream in 15mL airless pump bottles." },
    { role: "assistant", content: "What are the target batch sizes — lab scale, pilot, and commercial?" },
    { role: "user", content: "Lab: 5kg. Pilot: 50kg. Commercial: 500kg." },
    { role: "assistant", content: "What is the fill temperature and are there any heat-sensitive actives?" },
    { role: "user", content: "Fill at room temperature. Contains caffeine, Vitamin K, and peptides — all heat-sensitive." },
    { role: "assistant", content: "What mixing process do you anticipate?" },
    { role: "user", content: "High-shear homogenization for emulsification, then overhead mixing for actives addition at cool-down." },
    { role: "assistant", content: "What is your target line speed and annual volume?" },
    { role: "user", content: "40 units per minute. Estimated 120,000 units annually in year one." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  engineering: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session. Is this a new production line or a retrofit?" },
    { role: "user", content: "New line addition in our existing facility." },
    { role: "assistant", content: "What is the target throughput in units per hour and annual volume?" },
    { role: "user", content: "Target 2,400 units/hour. Annual volume approximately 120,000 units." },
    { role: "assistant", content: "What utilities are available at the planned installation point?" },
    { role: "user", content: "Compressed air and chilled water available. No steam at that location." },
    { role: "assistant", content: "What are the regulatory validation requirements?" },
    { role: "user", content: "Full IQ/OQ/PQ required for FDA compliance. We're a cGMP facility." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  planning: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session. Is this a new product launch or an existing SKU?" },
    { role: "user", content: "New product launch — a luxury eye cream, first run." },
    { role: "assistant", content: "What distribution channels are planned at launch?" },
    { role: "user", content: "DTC e-commerce first, then specialty retail (Credo, Follain) within 3 months." },
    { role: "assistant", content: "What is the initial stocking quantity?" },
    { role: "user", content: "3,000 units. Based on our DTC subscriber base and projected conversion rate." },
    { role: "assistant", content: "Are there any single-source supply risks?" },
    { role: "user", content: "Eyeliss and Haloxyl are single-source from Givaudan. We have no backup supplier currently." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  quality: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session. What product are we establishing quality requirements for?" },
    { role: "user", content: "A luxury eye cream — gel-cream format, targeting dark circles. US and EU launch." },
    { role: "assistant", content: "What are the applicable regulatory frameworks?" },
    { role: "user", content: "Both FDA and EU. We also want Leaping Bunny cruelty-free certification." },
    { role: "assistant", content: "What is your target shelf life?" },
    { role: "user", content: "24 months shelf life, 6-month PAO after opening. Stability study under ICH conditions." },
    { role: "assistant", content: "What testing panels are required at release?" },
    { role: "user", content: "Micro (USP 51/61), pH, viscosity, appearance, color, odor, and preservative efficacy." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
};

// Haircare conversations
const haircareConvos: Record<string, Array<{ role: string; content: string }>> = {
  sales: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for a haircare opportunity. What's the client brand and product concept?" },
    { role: "user", content: "A salon professional brand called Revive. They want a bond-repair shampoo + conditioner system." },
    { role: "assistant", content: "Who is the target consumer and what retail price are they targeting?" },
    { role: "user", content: "Salon clients and at-home users. Shampoo $28, conditioner $32 — prestige mass market." },
    { role: "assistant", content: "What claims are they looking to make?" },
    { role: "user", content: "Bond repair, breakage reduction, frizz control. No drug claims." },
    { role: "assistant", content: "What is the initial launch volume and target market?" },
    { role: "user", content: "US and Canada. 5,000 units each SKU to start, scaling to 25,000 within 18 months." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  rd: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an R&D discovery session for your haircare project. What product type are you developing?" },
    { role: "user", content: "A bond-repair leave-in conditioner for color-treated, damaged hair." },
    { role: "assistant", content: "What key actives or technology are you targeting for bond repair?" },
    { role: "user", content: "Bis-aminopropyl diglycol dimaleate (similar to Olaplex No.6), plus hydrolyzed keratin and panthenol." },
    { role: "assistant", content: "What texture and application format — spray, cream, or lightweight serum?" },
    { role: "user", content: "Lightweight cream. Should not weigh hair down. Humidity-resistant finish." },
    { role: "assistant", content: "Any ingredients to exclude?" },
    { role: "user", content: "Sulfate-free, silicone-free, paraben-free. Vegan formula." },
    { role: "assistant", content: "Target markets and timeline?" },
    { role: "user", content: "US launch in Q3, EU follow 6 months later. First prototype in 8 weeks." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  manufacturing: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session for your haircare product. What are we producing?" },
    { role: "user", content: "A leave-in bond-repair cream in 150mL HDPE pump bottles." },
    { role: "assistant", content: "What are the target batch sizes?" },
    { role: "user", content: "Lab: 10kg. Pilot: 100kg. Commercial: 1,000kg." },
    { role: "assistant", content: "Any special mixing requirements or heat-sensitive ingredients?" },
    { role: "user", content: "Heat-sensitive actives added at cool-down below 40°C. Standard overhead mixing sufficient." },
    { role: "assistant", content: "What is your annual volume target?" },
    { role: "user", content: "300,000 units annually by year two." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  engineering: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session for your haircare line. New line or retrofit?" },
    { role: "user", content: "Retrofit of an existing cream-filling line to handle 150mL pump bottles." },
    { role: "assistant", content: "What is the target throughput and annual volume?" },
    { role: "user", content: "60 units/minute. 300,000 units annually." },
    { role: "assistant", content: "What utilities are available and what are the space constraints?" },
    { role: "user", content: "Full utilities available. 15x30 foot footprint maximum for the retrofit." },
    { role: "assistant", content: "Validation requirements?" },
    { role: "user", content: "IQ/OQ required. PQ on first commercial batch." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  planning: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session. Is this a new haircare launch or existing SKU?" },
    { role: "user", content: "New launch — bond-repair leave-in cream, two SKUs (travel 75mL + full size 150mL)." },
    { role: "assistant", content: "What channels and initial stocking quantity?" },
    { role: "user", content: "Salon distribution first, then Ulta within 6 months. 5,000 full-size units, 2,000 travel." },
    { role: "assistant", content: "Any seasonality or supply risks?" },
    { role: "user", content: "Holiday gift sets spike in Q4. Key active (bis-aminopropyl dimaleate) has 8-10 week lead time from one EU supplier." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  quality: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session for your haircare product. What product are we qualifying?" },
    { role: "user", content: "A bond-repair leave-in cream. US and EU markets." },
    { role: "assistant", content: "What regulatory frameworks apply?" },
    { role: "user", content: "FDA cosmetics (MoCRA) for US, EU Cosmetics Regulation 1223/2009 for EU. Vegan Society certification required." },
    { role: "assistant", content: "Target shelf life and testing panel?" },
    { role: "user", content: "36 months. Testing: micro (USP 51/61), pH, viscosity, color, odor, preservative efficacy, and freeze-thaw cycling." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
};

// OTC Drug conversations
const otcConvos: Record<string, Array<{ role: string; content: string }>> = {
  sales: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for an OTC Drug opportunity. What is the client and product concept?" },
    { role: "user", content: "A dermatology brand called ClearMD. They want a 2.5% benzoyl peroxide acne spot treatment." },
    { role: "assistant", content: "What is their target consumer and retail price point?" },
    { role: "user", content: "Teens and adults 15-35 with acne-prone skin. Retail $18-22. Mass market / drug store." },
    { role: "assistant", content: "Are they looking at the FDA OTC Acne Monograph pathway?" },
    { role: "user", content: "Yes — 21 CFR 333 acne monograph, 2.5% BPO within allowed range." },
    { role: "assistant", content: "Target market and initial volume?" },
    { role: "user", content: "US only. 10,000 units first run, scaling to 50,000 within 12 months." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  rd: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an R&D discovery session for your OTC drug product. What are we formulating?" },
    { role: "user", content: "A 1% hydrocortisone anti-itch cream — FDA OTC External Analgesic/Skin Protectant monograph." },
    { role: "assistant", content: "What is the target format and application?" },
    { role: "user", content: "Lightweight cream, fast-absorbing. For insect bites, poison ivy, minor skin irritations." },
    { role: "assistant", content: "Any excipient constraints or preferred inactive ingredients?" },
    { role: "user", content: "Fragrance-free, alcohol-free, no lanolin. Suitable for sensitive skin." },
    { role: "assistant", content: "What stability and compatibility studies are planned?" },
    { role: "user", content: "ICH Q1A accelerated (40°C/75% RH) and long-term (25°C/60% RH) for 24 months. API assay, degradants, pH, viscosity." },
    { role: "assistant", content: "Timeline for NDA/ANDA vs monograph pathway?" },
    { role: "user", content: "Monograph pathway. Target first batch in 12 weeks." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  manufacturing: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session for your OTC product. What are we producing?" },
    { role: "user", content: "A 1% hydrocortisone cream in 30g tubes. FDA OTC regulated." },
    { role: "assistant", content: "What cGMP standard applies — 21 CFR 211 drug cGMP?" },
    { role: "user", content: "Yes, full 21 CFR 211. We are an FDA-registered drug manufacturer." },
    { role: "assistant", content: "What are batch sizes and fill equipment requirements?" },
    { role: "user", content: "Pilot: 50kg. Commercial: 500kg. Tube filling at 60 units/min." },
    { role: "assistant", content: "Any controlled environment or cleanroom requirements?" },
    { role: "user", content: "ISO 8 cleanroom for filling and packaging. HVAC-controlled temperature and humidity." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  engineering: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session for your OTC line. New line or retrofit?" },
    { role: "user", content: "New dedicated OTC line in our existing FDA-registered facility." },
    { role: "assistant", content: "What is the target throughput and annual volume?" },
    { role: "user", content: "60 tubes/minute. 500,000 units annually." },
    { role: "assistant", content: "What cleanroom classification and HVAC requirements?" },
    { role: "user", content: "ISO 8 filling area. Temperature 20-22°C, RH 45-55%. Full HEPA filtration." },
    { role: "assistant", content: "Validation requirements?" },
    { role: "user", content: "Full IQ/OQ/PQ per FDA 21 CFR 211. Process validation on first three commercial batches." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  planning: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session for your OTC product." },
    { role: "user", content: "New OTC launch — 1% hydrocortisone cream 30g, US drug store channel." },
    { role: "assistant", content: "What are the initial stocking quantities and distribution channels?" },
    { role: "user", content: "CVS and Walgreens planogram entry. 15,000 units initial stocking across both chains." },
    { role: "assistant", content: "Any seasonality and key supply risks?" },
    { role: "user", content: "Summer spike (insect bites/poison ivy season). API (hydrocortisone) sourced from a single EU supplier with 10-week lead time." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  quality: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session for your OTC drug product." },
    { role: "user", content: "1% hydrocortisone cream — 21 CFR 211 drug cGMP, FDA OTC monograph." },
    { role: "assistant", content: "What release testing panel is required?" },
    { role: "user", content: "API assay (HPLC), degradants, pH, viscosity, micro (USP <51>/<61>), sterility confirmation, particulate matter." },
    { role: "assistant", content: "What is your stability program?" },
    { role: "user", content: "ICH Q1A — accelerated (40°C/75% RH 6 months) + long-term (25°C/60% RH 24 months). API, degradants, pH, viscosity at each timepoint." },
    { role: "assistant", content: "Supplier qualification requirements?" },
    { role: "user", content: "Drug Master File (DMF) required for API. Full audit of API manufacturer every 2 years. CoA + CoC on every lot." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
};

// Supplements conversations
const supplementsConvos: Record<string, Array<{ role: string; content: string }>> = {
  sales: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for a supplements opportunity. What's the client and product concept?" },
    { role: "user", content: "A wellness brand called Viva Nutra. They want a women's beauty collagen supplement — capsule format." },
    { role: "assistant", content: "What are the target consumer and retail price point?" },
    { role: "user", content: "Women 25-50, health-conscious. Retail $45-55 for a 30-day supply. Premium specialty retail." },
    { role: "assistant", content: "What label claims are they targeting?" },
    { role: "user", content: "Structure/function claims: 'supports skin elasticity and hydration', 'promotes hair and nail growth'. DSHEA compliant." },
    { role: "assistant", content: "Initial volume and target markets?" },
    { role: "user", content: "US and Canada. 5,000 units first run. Amazon and DTC primary channels." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  rd: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an R&D discovery session for your supplement product. What are we formulating?" },
    { role: "user", content: "A women's beauty collagen supplement — 10g hydrolyzed marine collagen per serving, capsule format." },
    { role: "assistant", content: "What other actives are you including in the formula?" },
    { role: "user", content: "Biotin 5000mcg, Vitamin C 250mg (cofactor for collagen synthesis), Hyaluronic Acid 100mg, and Bamboo extract for silica." },
    { role: "assistant", content: "Any allergen or dietary restrictions?" },
    { role: "user", content: "Marine collagen (fish) — must label as fish allergen. No gluten, no dairy, non-GMO." },
    { role: "assistant", content: "DSHEA cGMP requirements — which 21 CFR 111 controls apply?" },
    { role: "user", content: "Full 21 CFR Part 111 cGMP. NSF Certified for Sport certification is a target." },
    { role: "assistant", content: "Target dosage form and timeline?" },
    { role: "user", content: "Size 0 gelatin capsule, 3 capsules per serving. First prototype in 10 weeks." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  manufacturing: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session for your supplement. What are we producing?" },
    { role: "user", content: "Women's beauty collagen capsules — 3-capsule serving, 90-count bottle. 21 CFR Part 111 cGMP." },
    { role: "assistant", content: "What are the target batch sizes?" },
    { role: "user", content: "Pilot: 50,000 capsules. Commercial: 500,000 capsules per batch." },
    { role: "assistant", content: "What blending and encapsulation equipment is required?" },
    { role: "user", content: "Ribbon blender for dry blend, then automatic capsule filler. Tamper-evident bottling line with desiccant insertion." },
    { role: "assistant", content: "Annual volume target?" },
    { role: "user", content: "2 million capsules (approx. 22,000 bottles) in year one." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  engineering: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session for your supplement line. New line or retrofit?" },
    { role: "user", content: "New supplement encapsulation and bottling line in our 21 CFR Part 111 registered facility." },
    { role: "assistant", content: "What is the target throughput and annual volume?" },
    { role: "user", content: "Encapsulation at 100,000 capsules/hour. Bottling at 80 bottles/minute. 2 million capsules annually." },
    { role: "assistant", content: "Utilities and footprint available?" },
    { role: "user", content: "Compressed air, temperature-controlled room (18-22°C, RH <50%). Available footprint: 25x50 feet." },
    { role: "assistant", content: "Validation requirements?" },
    { role: "user", content: "IQ/OQ/PQ per 21 CFR 211 analogues for dietary supplement cGMP. Weight verification and metal detection validation." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  planning: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session for your supplement product." },
    { role: "user", content: "New launch — women's beauty collagen capsules, 90-count, US and Canada." },
    { role: "assistant", content: "What are the distribution channels and initial stocking quantities?" },
    { role: "user", content: "Amazon FBA + DTC Shopify. Initial inventory: 5,000 bottles (450,000 capsules). Target 2,000 units/month run rate by month 6." },
    { role: "assistant", content: "Seasonality and supply risks?" },
    { role: "user", content: "New Year wellness spike in January. Marine collagen sourced from one Japanese supplier — 10-12 week lead time." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
  quality: [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session for your supplement product." },
    { role: "user", content: "Women's beauty collagen capsules — 21 CFR Part 111 cGMP, targeting NSF Certified for Sport." },
    { role: "assistant", content: "What release testing panel is required?" },
    { role: "user", content: "Identity (FTIR/HPLC for collagen, biotin, Vitamin C), assay per label claim, micro (USP <2021>/<2022>), heavy metals (USP <232>/<233>), disintegration." },
    { role: "assistant", content: "What is your stability program?" },
    { role: "user", content: "Real-time and accelerated stability (40°C/75% RH) for 24 months. Assay, micro, appearance, disintegration at each timepoint." },
    { role: "assistant", content: "Supplier qualification for marine collagen?" },
    { role: "user", content: "CoA, allergen declaration, heavy metals certificate, BSE/TSE declaration. On-site audit every 2 years. Japanese supplier is certified to FSSC 22000." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
};

const allConvos: Record<string, Record<string, Array<{ role: string; content: string }>>> = {
  skincare: skincareConvos,
  haircare: haircareConvos,
  otc: otcConvos,
  supplements: supplementsConvos,
};

// ---------------------------------------------------------------------------
// Build document
// ---------------------------------------------------------------------------

const children: Paragraph[] = [];

// Cover / title
children.push(
  new Paragraph({
    children: [new TextRun({ text: "CosmoLab Phase 1 — Test Plan & Test Data", bold: true, size: 48 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 800, after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Automated & Manual Testing", color: "555555", size: 24 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }),
  new Paragraph({
    children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, color: "888888", size: 20 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
  })
);

// ---------------------------------------------------------------------------
// Section 1 — Overview
// ---------------------------------------------------------------------------
children.push(h1("1. Test Plan Overview"));
children.push(body("This document covers the full Phase 1 test plan for CosmoLab, including automated tests for all 6 teams × 4 product categories (24 combinations), plus manual UI/UX checks."));

children.push(h2("1.1 Scope"));
const scopeItems = [
  "Streaming chat API — /api/chat (all 24 combos)",
  "Document generation API — /api/generate-docs (all 24 combos)",
  ".docx file generation — Node-side using Packer.toBuffer() (all 24 combos)",
  "Expected document keys present per team (assertions)",
  "Manual UI flow — landing page, session page, Quick Test, download",
];
scopeItems.forEach((s) => children.push(bullet(s)));

children.push(h2("1.2 Out of Scope (Phase 1)"));
const oosItems = [
  "Multi-tenancy / white-label routing (Phase 2)",
  "Billing / usage analytics (Phase 3)",
  "Load / performance testing",
];
oosItems.forEach((s) => children.push(bullet(s)));

children.push(h2("1.3 Test Infrastructure"));
children.push(body("• Runner: TypeScript test script via npx tsx"));
children.push(body("• Server: Next.js dev server at http://localhost:3000"));
children.push(body("• Dependencies: docx (already installed), Node fetch (built-in Node 18+)"));
children.push(body("• Output folder: cosmolab/test/auto-test/results/{team}-{category}/"));

// ---------------------------------------------------------------------------
// Section 2 — Test Matrix
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("2. Test Matrix (24 Combos)"));
children.push(body("All 6 teams × 4 product categories are tested. Each combo runs three automated tests."));

const matrixRows: TableRow[] = [
  tableRow(["Combo", "Team", "Category", "Chat Stream", "Generate Docs", "Build .docx"], true),
];
TEAMS.forEach((team) => {
  CATEGORIES.forEach((cat) => {
    matrixRows.push(tableRow([
      `${team}-${cat}`,
      TEAM_NAMES[team],
      CATEGORY_NAMES[cat],
      "✓",
      "✓",
      "✓",
    ]));
  });
});
children.push(new Table({ rows: matrixRows, width: { size: 9000, type: WidthType.DXA } }));

// ---------------------------------------------------------------------------
// Section 3 — Automated Tests
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("3. Automated Tests"));

children.push(h2("3.1 Streaming Chat Test"));
children.push(body("Endpoint: POST http://localhost:3000/api/chat"));
children.push(body("Payload: { messages: [], team, category } — empty messages triggers 'Begin the session.' internally."));
children.push(body("Pass criteria:"));
children.push(bullet("HTTP status 200"));
children.push(bullet("Content-Type: text/plain; charset=utf-8"));
children.push(bullet("Response body non-empty (stream produces at least one chunk)"));
children.push(bullet("Stream completes without error"));
children.push(body("Output saved to: results/{team}-{category}/stream-response.txt"));

children.push(h2("3.2 Document Generation Test"));
children.push(body("Endpoint: POST http://localhost:3000/api/generate-docs"));
children.push(body("Payload: { messages: <test conversation>, team, category }"));
children.push(body("Pass criteria:"));
children.push(bullet("HTTP status 200"));
children.push(bullet("Response is valid JSON"));
children.push(bullet("JSON contains expected document keys for the team (see Section 5)"));
children.push(bullet("Each document has title and non-empty sections array"));
children.push(body("Output saved to: results/{team}-{category}/response.json"));

children.push(h2("3.3 Word Document Build Test"));
children.push(body("Method: Calls buildWordDoc logic using Packer.toBuffer() (Node-compatible equivalent of browser's Packer.toBlob())"));
children.push(body("Input: JSON response from the generate-docs API call above"));
children.push(body("Pass criteria:"));
children.push(bullet("Packer.toBuffer() completes without throwing"));
children.push(bullet("Buffer size > 0 bytes"));
children.push(bullet("File saved as valid .docx (can be opened in Word / LibreOffice)"));
children.push(body("Output saved to: results/{team}-{category}/documents.docx"));

children.push(h2("3.4 Test Summary Output"));
children.push(body("All results are aggregated into: test/auto-test/test-results.json"));
children.push(body("Fields per combo: team, category, chatStream (pass/fail/error), generateDocs (pass/fail/error), buildDocx (pass/fail/error), durationMs, timestamp"));

// ---------------------------------------------------------------------------
// Section 4 — Manual Tests
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("4. Manual Test Checklist"));
children.push(meta("Refer to test/manual-test/README.md for full step-by-step instructions."));

children.push(h2("4.1 Landing Page"));
children.push(bullet("All 6 team cards render with correct name, icon, description, and color"));
children.push(bullet("All 4 category cards render with correct name and regulatory note (OTC, Supplements)"));
children.push(bullet("Start Session button is disabled until both team and category are selected"));
children.push(bullet("Selecting team + category enables Start Session button"));
children.push(bullet("Clicking Start Session navigates to /session?team=X&category=Y"));

children.push(h2("4.2 Session Page — Live Chat"));
children.push(bullet("First AI message streams in automatically on load"));
children.push(bullet("User can type and send messages"));
children.push(bullet("AI responses stream character-by-character"));
children.push(bullet("Typing 'generate' triggers document generation UI"));

children.push(h2("4.3 Quick Test Mode"));
children.push(bullet("⚡ Quick Test button is visible on the session page"));
children.push(bullet("Clicking it loads a pre-built conversation"));
children.push(bullet("Typing 'generate' after Quick Test triggers document generation"));

children.push(h2("4.4 Document Generation & Download"));
children.push(bullet("Clicking Generate shows a loading state"));
children.push(bullet("Documents JSON is returned and displayed"));
children.push(bullet("Download .docx button appears and triggers a file download"));
children.push(bullet("Downloaded .docx opens correctly in Microsoft Word / LibreOffice"));
children.push(bullet("Document contains correct team name, category, and generated content"));

// ---------------------------------------------------------------------------
// Section 5 — Expected Document Keys Per Team
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("5. Expected Document Keys Per Team"));
children.push(body("The generate-docs API must return documents matching these titles for each team. The automated tests assert these keys are present."));

const teamOutputs: Record<string, string[]> = {
  Sales: ["Formulation Brief", "RFQ / Quote Request", "Market Positioning Summary", "Client Proposal Draft", "Competitive Landscape Snapshot"],
  "R&D / Formulation": ["Technical Formulation Brief", "Ingredient Compatibility Notes", "Regulatory Checklist", "Stability & Compatibility Testing Plan", "Raw Material Sourcing Requirements", "Formula Development Timeline"],
  Manufacturing: ["Bill of Materials (BOM) Draft", "Process Order / Batch Record Outline", "Scale-Up Considerations", "Capacity Planning Estimate", "Equipment & Line Requirements"],
  Engineering: ["Equipment Specification Sheet", "Process Flow Outline", "Line / Facility Requirements Summary", "Validation Plan Skeleton"],
  "Demand Planning": ["Demand Forecast", "Launch Demand Estimate", "Inventory Planning Assumptions", "Seasonal Demand Profile", "S&OP Input Summary", "Supply Risk & Demand Risk Assessment"],
  "Quality / QA-QC": ["Quality Control Plan", "Specification Sheet Outline", "Certificate of Analysis (CoA) Template", "Regulatory Compliance Checklist", "Stability Protocol Outline", "Non-Conformance / Deviation Report Template"],
};

Object.entries(teamOutputs).forEach(([team, outputs]) => {
  children.push(h2(team));
  outputs.forEach((o) => children.push(bullet(o)));
});

// ---------------------------------------------------------------------------
// Section 6 — Test Data (all 24 conversations)
// ---------------------------------------------------------------------------
children.push(pageBreak());
children.push(h1("6. Test Data — Conversations (All 24 Combos)"));
children.push(body("Each combo uses a realistic multi-turn conversation as input to the generate-docs API. Skincare conversations are sourced from the existing demoConversations.ts. Haircare, OTC, and Supplements conversations are purpose-written for this test suite."));

CATEGORIES.forEach((cat) => {
  children.push(pageBreak());
  children.push(h2(`6.${CATEGORIES.indexOf(cat) + 1} ${CATEGORY_NAMES[cat]}`));

  TEAMS.forEach((team) => {
    children.push(h3(`${TEAM_NAMES[team]} × ${CATEGORY_NAMES[cat]}`));
    const convo = allConvos[cat][team];
    convo.forEach((msg) => {
      const label = msg.role === "user" ? "User" : "AI";
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true, size: 18 }),
            new TextRun({ text: msg.content, size: 18 }),
          ],
          spacing: { after: 80 },
          indent: { left: 360 },
        })
      );
    });
    children.push(new Paragraph({ spacing: { after: 120 } }));
  });
});

// ---------------------------------------------------------------------------
// Write file
// ---------------------------------------------------------------------------

const doc = new Document({
  creator: "CosmoLab Test Suite",
  title: "CosmoLab Phase 1 — Test Plan & Test Data",
  description: "Full automated and manual test plan for CosmoLab Phase 1",
  sections: [{ children }],
});

const outPath = path.join(process.cwd(), "test", "auto-test", "CosmoLab-Phase1-TestPlan.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Saved: ${outPath}`);
});
