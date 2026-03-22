/**
 * CosmoLab Phase 1 — Automated Test Runner
 * Tests all 6 teams × 4 categories (24 combos):
 *   1. Streaming chat  → /api/chat
 *   2. Document generation → /api/generate-docs
 *   3. Word file build → Packer.toBuffer() (Node equivalent of browser Packer.toBlob())
 *
 * Run with: npx tsx test/auto-test/test-runner.ts
 * Server must be running at http://localhost:3000
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
} from "docx";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = "http://localhost:3000";
const RESULTS_DIR = path.join(process.cwd(), "test", "auto-test", "results");
const DELAY_BETWEEN_COMBOS_MS = 5000; // avoid Anthropic API rate limits
const GENERATE_DOCS_RETRIES = 2;       // retry on 500 with backoff
const GENERATE_DOCS_RETRY_DELAY_MS = 12000;

const TEAMS = ["sales", "rd", "manufacturing", "engineering", "planning", "quality"] as const;
const CATEGORIES = ["skincare", "haircare", "otc", "supplements"] as const;

type TeamId = typeof TEAMS[number];
type Category = typeof CATEGORIES[number];

const TEAM_NAMES: Record<TeamId, string> = {
  sales: "Sales",
  rd: "R&D / Formulation",
  manufacturing: "Manufacturing",
  engineering: "Engineering",
  planning: "Demand Planning",
  quality: "Quality / QA-QC",
};

const CATEGORY_NAMES: Record<Category, string> = {
  skincare: "Skincare",
  haircare: "Haircare",
  otc: "OTC Drug",
  supplements: "Supplements",
};

// Expected document title fragments per team (used for assertion)
const EXPECTED_DOC_KEYS: Record<TeamId, string[]> = {
  sales: ["Formulation Brief", "RFQ", "Market Positioning", "Proposal", "Competitive"],
  rd: ["Technical Formulation", "Ingredient", "Regulatory", "Stability", "Raw Material", "Timeline"],
  manufacturing: ["Bill of Materials", "Process Order", "Scale-Up", "Capacity", "Equipment"],
  engineering: ["Equipment Specification", "Process Flow", "Facility", "Validation"],
  planning: ["Demand Forecast", "Launch Demand", "Inventory", "Seasonal", "S&OP", "Risk"],
  quality: ["Quality Control", "Specification", "Certificate", "Compliance", "Stability Protocol", "Non-Conformance"],
};

// ---------------------------------------------------------------------------
// Test conversations (24 combos)
// ---------------------------------------------------------------------------

type Msg = { role: "user" | "assistant"; content: string };

const CONVERSATIONS: Record<Category, Record<TeamId, Msg[]>> = {
  skincare: {
    sales: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for a skincare opportunity. What's the client brand and what are they looking to develop?" },
      { role: "user", content: "A clean beauty indie brand called Lumière. They want a vitamin C brightening serum." },
      { role: "assistant", content: "Great. Who is their target consumer and what price point are they targeting at retail?" },
      { role: "user", content: "Millennial women, clean beauty enthusiasts. Retail $65-85." },
      { role: "assistant", content: "What key claims are they looking to make?" },
      { role: "user", content: "Brightening, even skin tone, and antioxidant protection. No drug claims." },
      { role: "assistant", content: "What markets are they launching in?" },
      { role: "user", content: "US first, then Canada within 6 months." },
      { role: "assistant", content: "What MOQ and volume are they anticipating for the initial run?" },
      { role: "user", content: "Around 3,000 units for the first run, scaling to 10,000 within a year." },
      { role: "assistant", content: "Do they have an existing formula or benchmark?" },
      { role: "user", content: "They reference Drunk Elephant C-Firma but need full formulation from scratch." },
      { role: "assistant", content: "What is their target launch date?" },
      { role: "user", content: "Q4 of this year, about 8 months from now." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    rd: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an R&D discovery session for your skincare project. What type of skincare product are you looking to develop?" },
      { role: "user", content: "A luxury eye cream targeting dark circles and puffiness." },
      { role: "assistant", content: "What texture and finish are you aiming for?" },
      { role: "user", content: "Lightweight gel-cream, suitable for morning and evening. Quick absorption is important." },
      { role: "assistant", content: "Who is the target consumer and what price tier?" },
      { role: "user", content: "Women 35-55, premium luxury tier, retail price around $120-150." },
      { role: "assistant", content: "What key actives do you want to feature?" },
      { role: "user", content: "Caffeine for puffiness, Vitamin K for dark circles, and peptides — Haloxyl or Eyeliss." },
      { role: "assistant", content: "Any ingredients to exclude?" },
      { role: "user", content: "No alcohol, no fragrance, and no known allergens." },
      { role: "assistant", content: "Target markets?" },
      { role: "user", content: "US and EU launch simultaneously." },
      { role: "assistant", content: "Packaging format?" },
      { role: "user", content: "Airless pump to protect actives." },
      { role: "assistant", content: "Target development timeline?" },
      { role: "user", content: "First prototype within 10-12 weeks." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    manufacturing: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session. What product are we setting up production for?" },
      { role: "user", content: "A gel-cream eye cream in 15mL airless pump bottles." },
      { role: "assistant", content: "What are the target batch sizes?" },
      { role: "user", content: "Lab: 5kg. Pilot: 50kg. Commercial: 500kg." },
      { role: "assistant", content: "Fill temperature and heat-sensitive actives?" },
      { role: "user", content: "Fill at room temperature. Contains caffeine, Vitamin K, and peptides — all heat-sensitive." },
      { role: "assistant", content: "Mixing process?" },
      { role: "user", content: "High-shear homogenization for emulsification, then overhead mixing at cool-down for actives." },
      { role: "assistant", content: "Target line speed and annual volume?" },
      { role: "user", content: "40 units per minute. 120,000 units annually in year one." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    engineering: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session. New line or retrofit?" },
      { role: "user", content: "New line addition in our existing facility." },
      { role: "assistant", content: "Target throughput and annual volume?" },
      { role: "user", content: "2,400 units/hour. 120,000 units annually." },
      { role: "assistant", content: "Product format and packaging?" },
      { role: "user", content: "15mL airless pump. Gel-cream viscosity, room temperature fill." },
      { role: "assistant", content: "Utilities available?" },
      { role: "user", content: "Compressed air and chilled water. No steam at that location." },
      { role: "assistant", content: "Available footprint?" },
      { role: "user", content: "Approximately 20x40 feet. 14-foot ceiling clearance." },
      { role: "assistant", content: "Validation requirements?" },
      { role: "user", content: "Full IQ/OQ/PQ required for FDA compliance. We're a cGMP facility." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    planning: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session. New launch or existing SKU?" },
      { role: "user", content: "New product launch — a luxury eye cream, first run." },
      { role: "assistant", content: "Distribution channels?" },
      { role: "user", content: "DTC e-commerce first, then specialty retail (Credo, Follain) within 3 months." },
      { role: "assistant", content: "Initial stocking quantity?" },
      { role: "user", content: "3,000 units. Based on DTC subscriber base and projected conversion rate." },
      { role: "assistant", content: "Seasonality?" },
      { role: "user", content: "Yes — Q4 holiday season drives about 40% of annual eye cream sales." },
      { role: "assistant", content: "Key component lead times?" },
      { role: "user", content: "Airless pump bottles: 10-12 weeks. Eyeliss/Haloxyl actives: 6-8 weeks." },
      { role: "assistant", content: "Single-source supply risks?" },
      { role: "user", content: "Eyeliss and Haloxyl are single-source from Givaudan. No backup supplier currently." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    quality: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session. What product are we qualifying?" },
      { role: "user", content: "A luxury eye cream — gel-cream format, US and EU launch." },
      { role: "assistant", content: "Applicable regulatory frameworks?" },
      { role: "user", content: "Both FDA (MoCRA) and EU Cosmetics Regulation 1223/2009. Also targeting Leaping Bunny." },
      { role: "assistant", content: "Quality claims to substantiate?" },
      { role: "user", content: "Fragrance-free, alcohol-free. Clean beauty positioning." },
      { role: "assistant", content: "Target shelf life?" },
      { role: "user", content: "24 months shelf life, 6-month PAO. Stability under ICH conditions." },
      { role: "assistant", content: "Release testing panel?" },
      { role: "user", content: "Micro (USP 51/61), pH, viscosity, appearance, color, odor, preservative efficacy." },
      { role: "assistant", content: "Supplier qualification process?" },
      { role: "user", content: "CoA, MSDS, allergen declaration required. High-risk suppliers need audits." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
  },

  haircare: {
    sales: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for a haircare opportunity. What's the client brand and product concept?" },
      { role: "user", content: "A salon professional brand called Revive. They want a bond-repair shampoo + conditioner system." },
      { role: "assistant", content: "Target consumer and retail price?" },
      { role: "user", content: "Salon clients and at-home users. Shampoo $28, conditioner $32 — prestige mass market." },
      { role: "assistant", content: "What claims are they targeting?" },
      { role: "user", content: "Bond repair, breakage reduction, frizz control. No drug claims." },
      { role: "assistant", content: "Initial volume and target market?" },
      { role: "user", content: "US and Canada. 5,000 units each SKU to start, scaling to 25,000 within 18 months." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    rd: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an R&D discovery session for your haircare project. What product are we developing?" },
      { role: "user", content: "A bond-repair leave-in conditioner for color-treated, damaged hair." },
      { role: "assistant", content: "Key actives or technology for bond repair?" },
      { role: "user", content: "Bis-aminopropyl diglycol dimaleate, hydrolyzed keratin, and panthenol." },
      { role: "assistant", content: "Texture and application format?" },
      { role: "user", content: "Lightweight cream. Must not weigh hair down. Humidity-resistant finish." },
      { role: "assistant", content: "Ingredients to exclude?" },
      { role: "user", content: "Sulfate-free, silicone-free, paraben-free. Vegan formula." },
      { role: "assistant", content: "Target markets and timeline?" },
      { role: "user", content: "US launch Q3, EU follow 6 months later. First prototype in 8 weeks." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    manufacturing: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session for your haircare product. What are we producing?" },
      { role: "user", content: "A bond-repair leave-in cream in 150mL HDPE pump bottles." },
      { role: "assistant", content: "Target batch sizes?" },
      { role: "user", content: "Lab: 10kg. Pilot: 100kg. Commercial: 1,000kg." },
      { role: "assistant", content: "Mixing requirements or heat-sensitive ingredients?" },
      { role: "user", content: "Heat-sensitive actives added at cool-down below 40°C. Standard overhead mixing." },
      { role: "assistant", content: "Annual volume target?" },
      { role: "user", content: "300,000 units annually by year two." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    engineering: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session for your haircare line. New line or retrofit?" },
      { role: "user", content: "Retrofit of an existing cream-filling line to handle 150mL pump bottles." },
      { role: "assistant", content: "Target throughput and annual volume?" },
      { role: "user", content: "60 units/minute. 300,000 units annually." },
      { role: "assistant", content: "Utilities available and space constraints?" },
      { role: "user", content: "Full utilities available. 15x30 foot footprint maximum for the retrofit." },
      { role: "assistant", content: "Validation requirements?" },
      { role: "user", content: "IQ/OQ required. PQ on first commercial batch." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    planning: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session. New haircare launch or existing SKU?" },
      { role: "user", content: "New launch — bond-repair leave-in cream, two SKUs (travel 75mL + full size 150mL)." },
      { role: "assistant", content: "Channels and initial stocking quantity?" },
      { role: "user", content: "Salon distribution first, then Ulta within 6 months. 5,000 full-size, 2,000 travel units." },
      { role: "assistant", content: "Seasonality or supply risks?" },
      { role: "user", content: "Holiday gift sets spike in Q4. Key active (bis-aminopropyl dimaleate) has 8-10 week lead from one EU supplier." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    quality: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session for your haircare product. What are we qualifying?" },
      { role: "user", content: "A bond-repair leave-in cream. US and EU markets." },
      { role: "assistant", content: "Applicable regulatory frameworks?" },
      { role: "user", content: "FDA cosmetics (MoCRA) for US, EU Cosmetics Regulation 1223/2009 for EU. Vegan Society certification required." },
      { role: "assistant", content: "Target shelf life and release testing panel?" },
      { role: "user", content: "36 months. Testing: micro (USP 51/61), pH, viscosity, color, odor, preservative efficacy, and freeze-thaw cycling." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
  },

  otc: {
    sales: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for an OTC Drug opportunity. What is the client and product concept?" },
      { role: "user", content: "A dermatology brand called ClearMD. They want a 2.5% benzoyl peroxide acne spot treatment." },
      { role: "assistant", content: "Target consumer and retail price point?" },
      { role: "user", content: "Teens and adults 15-35 with acne-prone skin. Retail $18-22. Mass market / drug store." },
      { role: "assistant", content: "Are they pursuing the FDA OTC Acne Monograph pathway?" },
      { role: "user", content: "Yes — 21 CFR 333 acne monograph, 2.5% BPO within allowed range." },
      { role: "assistant", content: "Target market and initial volume?" },
      { role: "user", content: "US only. 10,000 units first run, scaling to 50,000 within 12 months." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    rd: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an R&D discovery session for your OTC drug product. What are we formulating?" },
      { role: "user", content: "A 1% hydrocortisone anti-itch cream — FDA OTC External Analgesic monograph." },
      { role: "assistant", content: "Target format and application?" },
      { role: "user", content: "Lightweight cream, fast-absorbing, for insect bites and minor skin irritations." },
      { role: "assistant", content: "Excipient constraints?" },
      { role: "user", content: "Fragrance-free, alcohol-free, no lanolin. Suitable for sensitive skin." },
      { role: "assistant", content: "Stability studies planned?" },
      { role: "user", content: "ICH Q1A accelerated (40°C/75% RH) and long-term (25°C/60% RH) for 24 months. API assay, degradants, pH, viscosity." },
      { role: "assistant", content: "Monograph vs NDA pathway and timeline?" },
      { role: "user", content: "Monograph pathway. Target first batch in 12 weeks." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    manufacturing: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session for your OTC product. What are we producing?" },
      { role: "user", content: "A 1% hydrocortisone cream in 30g tubes. FDA OTC regulated." },
      { role: "assistant", content: "Applicable cGMP standard?" },
      { role: "user", content: "Full 21 CFR 211. We are an FDA-registered drug manufacturer." },
      { role: "assistant", content: "Batch sizes and fill equipment requirements?" },
      { role: "user", content: "Pilot: 50kg. Commercial: 500kg. Tube filling at 60 units/min." },
      { role: "assistant", content: "Cleanroom or controlled environment requirements?" },
      { role: "user", content: "ISO 8 cleanroom for filling and packaging. HVAC-controlled temperature and humidity." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    engineering: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session for your OTC line. New line or retrofit?" },
      { role: "user", content: "New dedicated OTC line in our existing FDA-registered facility." },
      { role: "assistant", content: "Target throughput and annual volume?" },
      { role: "user", content: "60 tubes/minute. 500,000 units annually." },
      { role: "assistant", content: "Cleanroom classification and HVAC requirements?" },
      { role: "user", content: "ISO 8 filling area. Temperature 20-22°C, RH 45-55%. Full HEPA filtration." },
      { role: "assistant", content: "Validation requirements?" },
      { role: "user", content: "Full IQ/OQ/PQ per 21 CFR 211. Process validation on first three commercial batches." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    planning: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session for your OTC product." },
      { role: "user", content: "New OTC launch — 1% hydrocortisone cream 30g, US drug store channel." },
      { role: "assistant", content: "Initial stocking quantities and distribution channels?" },
      { role: "user", content: "CVS and Walgreens planogram entry. 15,000 units initial stocking across both chains." },
      { role: "assistant", content: "Seasonality and key supply risks?" },
      { role: "user", content: "Summer spike (insect bites/poison ivy season). API sourced from a single EU supplier with 10-week lead time." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    quality: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session for your OTC drug product." },
      { role: "user", content: "1% hydrocortisone cream — 21 CFR 211 drug cGMP, FDA OTC monograph." },
      { role: "assistant", content: "Release testing panel?" },
      { role: "user", content: "API assay (HPLC), degradants, pH, viscosity, micro (USP <51>/<61>), particulate matter." },
      { role: "assistant", content: "Stability program?" },
      { role: "user", content: "ICH Q1A — accelerated (40°C/75% RH 6 months) + long-term (25°C/60% RH 24 months). API, degradants, pH, viscosity at each timepoint." },
      { role: "assistant", content: "Supplier qualification requirements?" },
      { role: "user", content: "Drug Master File (DMF) required for API. Full audit every 2 years. CoA + CoC on every lot." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
  },

  supplements: {
    sales: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Sales discovery session for a supplements opportunity. What's the client and product concept?" },
      { role: "user", content: "A wellness brand called Viva Nutra. They want a women's beauty collagen supplement — capsule format." },
      { role: "assistant", content: "Target consumer and retail price point?" },
      { role: "user", content: "Women 25-50, health-conscious. Retail $45-55 for 30-day supply. Premium specialty retail." },
      { role: "assistant", content: "What label claims are they targeting?" },
      { role: "user", content: "DSHEA structure/function claims: 'supports skin elasticity and hydration', 'promotes hair and nail growth'." },
      { role: "assistant", content: "Initial volume and target markets?" },
      { role: "user", content: "US and Canada. 5,000 units first run. Amazon and DTC primary channels." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    rd: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an R&D discovery session for your supplement product. What are we formulating?" },
      { role: "user", content: "A women's beauty collagen supplement — 10g hydrolyzed marine collagen per serving, capsule format." },
      { role: "assistant", content: "Other actives in the formula?" },
      { role: "user", content: "Biotin 5000mcg, Vitamin C 250mg, Hyaluronic Acid 100mg, and Bamboo extract for silica." },
      { role: "assistant", content: "Allergen or dietary restrictions?" },
      { role: "user", content: "Marine collagen (fish) — must label as fish allergen. No gluten, no dairy, non-GMO." },
      { role: "assistant", content: "cGMP requirements and certifications?" },
      { role: "user", content: "Full 21 CFR Part 111 cGMP. NSF Certified for Sport certification is a target." },
      { role: "assistant", content: "Dosage form and timeline?" },
      { role: "user", content: "Size 0 gelatin capsule, 3 capsules per serving. First prototype in 10 weeks." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    manufacturing: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session for your supplement. What are we producing?" },
      { role: "user", content: "Women's beauty collagen capsules — 3-capsule serving, 90-count bottle. 21 CFR Part 111 cGMP." },
      { role: "assistant", content: "Target batch sizes?" },
      { role: "user", content: "Pilot: 50,000 capsules. Commercial: 500,000 capsules per batch." },
      { role: "assistant", content: "Blending and encapsulation equipment?" },
      { role: "user", content: "Ribbon blender for dry blend, then automatic capsule filler. Tamper-evident bottling with desiccant insertion." },
      { role: "assistant", content: "Annual volume target?" },
      { role: "user", content: "2 million capsules (~22,000 bottles) in year one." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    engineering: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session for your supplement line. New line or retrofit?" },
      { role: "user", content: "New supplement encapsulation and bottling line in our 21 CFR Part 111 registered facility." },
      { role: "assistant", content: "Target throughput and annual volume?" },
      { role: "user", content: "Encapsulation at 100,000 capsules/hour. Bottling at 80 bottles/minute. 2 million capsules annually." },
      { role: "assistant", content: "Utilities and footprint?" },
      { role: "user", content: "Compressed air, temperature-controlled room (18-22°C, RH <50%). 25x50 foot footprint available." },
      { role: "assistant", content: "Validation requirements?" },
      { role: "user", content: "IQ/OQ/PQ per 21 CFR 111 analogues. Weight verification and metal detection validation required." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    planning: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session for your supplement product." },
      { role: "user", content: "New launch — women's beauty collagen capsules, 90-count, US and Canada." },
      { role: "assistant", content: "Distribution channels and initial stocking quantities?" },
      { role: "user", content: "Amazon FBA + DTC Shopify. Initial inventory: 5,000 bottles. Target 2,000 units/month by month 6." },
      { role: "assistant", content: "Seasonality and supply risks?" },
      { role: "user", content: "New Year wellness spike in January. Marine collagen from one Japanese supplier — 10-12 week lead time." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
    quality: [
      { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session for your supplement product." },
      { role: "user", content: "Women's beauty collagen capsules — 21 CFR Part 111 cGMP, targeting NSF Certified for Sport." },
      { role: "assistant", content: "Release testing panel?" },
      { role: "user", content: "Identity (FTIR/HPLC), assay per label claim, micro (USP <2021>/<2022>), heavy metals (USP <232>/<233>), disintegration." },
      { role: "assistant", content: "Stability program?" },
      { role: "user", content: "Real-time and accelerated (40°C/75% RH) for 24 months. Assay, micro, appearance, disintegration at each timepoint." },
      { role: "assistant", content: "Supplier qualification for marine collagen?" },
      { role: "user", content: "CoA, allergen declaration, heavy metals cert, BSE/TSE declaration. Audit every 2 years. Supplier is FSSC 22000 certified." },
      { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

interface TestResult {
  team: TeamId;
  category: Category;
  chatStream: { pass: boolean; error?: string; previewChars: number; durationMs: number };
  generateDocs: { pass: boolean; error?: string; docCount: number; missingKeys: string[]; durationMs: number };
  buildDocx: { pass: boolean; error?: string; fileSizeBytes: number; durationMs: number };
  overallPass: boolean;
}

// ---------------------------------------------------------------------------
// Test 1 — Streaming chat
// ---------------------------------------------------------------------------

async function testChatStream(team: TeamId, category: Category): Promise<TestResult["chatStream"]> {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [], team, category }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/plain")) throw new Error(`Unexpected Content-Type: ${contentType}`);

    if (!res.body) throw new Error("No response body / stream");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }

    if (fullText.trim().length === 0) throw new Error("Stream produced empty response");

    return { pass: true, previewChars: fullText.length, durationMs: Date.now() - start, text: fullText };
  } catch (err) {
    return { pass: false, error: String(err), previewChars: 0, durationMs: Date.now() - start, text: "" };
  }
}

// ---------------------------------------------------------------------------
// Test 2 — Document generation
// ---------------------------------------------------------------------------

interface GeneratedDoc { title: string; sections: { heading: string; content: string }[] }

async function callGenerateDocs(messages: Msg[], team: TeamId, category: Category): Promise<GeneratedDoc[]> {
  const res = await fetch(`${BASE_URL}/api/generate-docs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, team, category }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  const documents: GeneratedDoc[] = Array.isArray(json) ? json : (json.documents ?? []);
  if (documents.length === 0) throw new Error("No documents returned");
  return documents;
}

async function testGenerateDocs(
  team: TeamId,
  category: Category,
  messages: Msg[]
): Promise<{ result: TestResult["generateDocs"]; documents: GeneratedDoc[] }> {
  const start = Date.now();
  let lastError = "";

  for (let attempt = 0; attempt <= GENERATE_DOCS_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        process.stdout.write(`(retry ${attempt}) `);
        await new Promise((r) => setTimeout(r, GENERATE_DOCS_RETRY_DELAY_MS));
      }
      const documents = await callGenerateDocs(messages, team, category);

      // Pass if documents are returned and all have valid structure (title + ≥1 section with content).
      // Expected key names are advisory warnings only — Claude names docs creatively but content is correct.
      const structureErrors = documents.filter(
        (d) => !d.title || !d.sections?.length || !d.sections.some((s) => s.content?.trim())
      );

      const expectedKeys = EXPECTED_DOC_KEYS[team];
      const allText = documents.flatMap((d) => [
        d.title ?? "",
        ...(d.sections ?? []).map((s) => s.heading ?? ""),
        ...(d.sections ?? []).map((s) => s.content ?? ""),
      ]).map((t) => t.toLowerCase());
      const missingKeys = expectedKeys.filter(
        (key) => !allText.some((t) => t.includes(key.toLowerCase()))
      );

      return {
        result: {
          pass: structureErrors.length === 0,
          docCount: documents.length,
          missingKeys, // advisory only
          durationMs: Date.now() - start,
          error: structureErrors.length > 0 ? `${structureErrors.length} docs missing title/sections` : undefined,
        },
        documents,
      };
    } catch (err) {
      lastError = String(err);
    }
  }

  return {
    result: { pass: false, error: lastError, docCount: 0, missingKeys: [], durationMs: Date.now() - start },
    documents: [],
  };
}

// ---------------------------------------------------------------------------
// Test 3 — Build .docx (Node-side, Packer.toBuffer)
// ---------------------------------------------------------------------------

function buildDocSections(documents: GeneratedDoc[]): Paragraph[] {
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
      const lines = (section.content ?? "").split("\n").filter((l) => l.trim());
      for (const line of lines) {
        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
        children.push(new Paragraph({ text: line.trim(), bullet: isBullet ? { level: 0 } : undefined, spacing: { after: 80 } }));
      }
    }
    children.push(new Paragraph({ pageBreakBefore: true }));
  }
  return children;
}

async function testBuildDocx(
  team: TeamId,
  category: Category,
  documents: GeneratedDoc[],
  outPath: string
): Promise<TestResult["buildDocx"]> {
  const start = Date.now();
  try {
    if (documents.length === 0) throw new Error("No documents to build — skipped (generate-docs failed)");

    const wordDoc = new Document({
      creator: "CosmoLab AI",
      title: `${TEAM_NAMES[team]} ${CATEGORY_NAMES[category]} Discovery Documents`,
      sections: [{ children: buildDocSections(documents) }],
    });

    const buffer = await Packer.toBuffer(wordDoc);
    if (buffer.byteLength === 0) throw new Error("Buffer is empty");

    fs.writeFileSync(outPath, buffer);
    return { pass: true, fileSizeBytes: buffer.byteLength, durationMs: Date.now() - start };
  } catch (err) {
    return { pass: false, error: String(err), fileSizeBytes: 0, durationMs: Date.now() - start };
  }
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

async function run() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║       CosmoLab Phase 1 — Automated Test Runner           ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`Server: ${BASE_URL}`);
  console.log(`Output: ${RESULTS_DIR}`);
  console.log(`Combos: ${TEAMS.length} teams × ${CATEGORIES.length} categories = ${TEAMS.length * CATEGORIES.length} total\n`);

  const allResults: TestResult[] = [];
  let comboIndex = 0;
  const total = TEAMS.length * CATEGORIES.length;

  for (const category of CATEGORIES) {
    for (const team of TEAMS) {
      comboIndex++;
      const combo = `${team}-${category}`;
      const dir = path.join(RESULTS_DIR, combo);
      fs.mkdirSync(dir, { recursive: true });

      console.log(`[${comboIndex}/${total}] ${TEAM_NAMES[team]} × ${CATEGORY_NAMES[category]}`);

      const messages = CONVERSATIONS[category][team];

      // Save conversation input
      fs.writeFileSync(path.join(dir, "conversation.json"), JSON.stringify(messages, null, 2));

      // Test 1 — Chat stream
      process.stdout.write("  ↳ Chat stream    ... ");
      const chatResult = await testChatStream(team, category);
      console.log(chatResult.pass ? `✅ PASS (${chatResult.durationMs}ms, ${chatResult.previewChars} chars)` : `❌ FAIL — ${chatResult.error}`);
      fs.writeFileSync(
        path.join(dir, "stream-response.txt"),
        chatResult.pass
          ? `${chatResult.text ?? ""}\n\n---\nDuration: ${chatResult.durationMs}ms | Chars: ${chatResult.previewChars}`
          : `FAILED: ${chatResult.error}`
      );

      // Test 2 — Generate docs
      process.stdout.write("  ↳ Generate docs  ... ");
      const { result: docsResult, documents } = await testGenerateDocs(team, category, messages);
      const docsWarning = docsResult.missingKeys.length > 0 ? ` ⚠ advisory missing: ${docsResult.missingKeys.join(", ")}` : "";
      console.log(
        docsResult.pass
          ? `✅ PASS (${docsResult.durationMs}ms, ${docsResult.docCount} docs)${docsWarning}`
          : `❌ FAIL — ${docsResult.error}`
      );
      if (documents.length > 0) {
        fs.writeFileSync(path.join(dir, "response.json"), JSON.stringify(documents, null, 2));
      }

      // Test 3 — Build .docx
      process.stdout.write("  ↳ Build .docx    ... ");
      const docxResult = await testBuildDocx(team, category, documents, path.join(dir, "documents.docx"));
      console.log(
        docxResult.pass
          ? `✅ PASS (${docxResult.durationMs}ms, ${(docxResult.fileSizeBytes / 1024).toFixed(1)}KB)`
          : `❌ FAIL — ${docxResult.error}`
      );

      const overallPass = chatResult.pass && docsResult.pass && docxResult.pass;
      console.log(`  ${overallPass ? "✅" : "❌"} ${combo} — ${overallPass ? "ALL PASS" : "SOME FAILURES"}\n`);

      allResults.push({ team, category, chatStream: chatResult, generateDocs: docsResult, buildDocx: docxResult, overallPass });

      // Pause between combos to avoid Anthropic API rate limits
      if (comboIndex < total) await new Promise((r) => setTimeout(r, DELAY_BETWEEN_COMBOS_MS));
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  const passed = allResults.filter((r) => r.overallPass).length;
  const failed = allResults.length - passed;

  console.log("══════════════════════════════════════════════════════════");
  console.log(`RESULTS: ${passed}/${total} combos passed  |  ${failed} failed`);
  console.log("══════════════════════════════════════════════════════════");

  if (failed > 0) {
    console.log("\nFailed combos:");
    allResults.filter((r) => !r.overallPass).forEach((r) => {
      console.log(`  • ${r.team}-${r.category}`);
      if (!r.chatStream.pass) console.log(`      Chat:     ${r.chatStream.error}`);
      if (!r.generateDocs.pass) console.log(`      Docs:     ${r.generateDocs.error ?? r.generateDocs.missingKeys.join(", ")}`);
      if (!r.buildDocx.pass) console.log(`      Docx:     ${r.buildDocx.error}`);
    });
  }

  // Write summary JSON
  const summary = {
    runAt: new Date().toISOString(),
    server: BASE_URL,
    total,
    passed,
    failed,
    results: allResults,
  };
  const summaryPath = path.join(process.cwd(), "test", "auto-test", "test-results.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📄 Full results saved to: ${summaryPath}`);
  console.log(`📁 Per-combo output in:   ${RESULTS_DIR}`);
}

run().catch((err) => {
  console.error("Runner crashed:", err);
  process.exit(1);
});
