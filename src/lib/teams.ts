export type ProductCategory = "skincare" | "haircare" | "otc" | "supplements";
export type TeamId = "sales" | "rd" | "manufacturing" | "engineering" | "planning" | "quality";

export interface TeamConfig {
  id: TeamId;
  name: string;
  description: string;
  icon: string;
  color: string;
  outputs: string[];
}

export interface CategoryConfig {
  id: ProductCategory;
  name: string;
  description: string;
  regulatoryNote?: string;
}

export const TEAMS: TeamConfig[] = [
  {
    id: "sales",
    name: "Sales",
    description: "Generate client-ready briefs, quotes, and proposals from discovery conversations.",
    icon: "💼",
    color: "blue",
    outputs: [
      "Formulation Brief",
      "RFQ / Quote Request",
      "Market Positioning Summary",
      "Client Proposal Draft",
      "Competitive Landscape Snapshot",
    ],
  },
  {
    id: "rd",
    name: "R&D / Formulation",
    description: "Translate product vision into technical specifications and development plans.",
    icon: "🧪",
    color: "purple",
    outputs: [
      "Technical Formulation Brief",
      "Ingredient Compatibility Notes",
      "Regulatory Checklist",
      "Stability & Compatibility Testing Plan",
      "Raw Material Sourcing Requirements",
      "Formula Development Timeline",
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Define production requirements, BOMs, and scale-up considerations.",
    icon: "🏭",
    color: "orange",
    outputs: [
      "Bill of Materials (BOM) Draft",
      "Process Order / Batch Record Outline",
      "Scale-Up Considerations",
      "Capacity Planning Estimate",
      "Equipment & Line Requirements",
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Specify equipment, process flows, and facility requirements for new lines.",
    icon: "⚙️",
    color: "gray",
    outputs: [
      "Equipment Specification Sheet",
      "Process Flow Outline",
      "Line / Facility Requirements Summary",
      "Validation Plan Skeleton",
    ],
  },
  {
    id: "planning",
    name: "Demand Planning",
    description: "Forecast demand, plan inventory, and align supply for new and existing products.",
    icon: "📊",
    color: "green",
    outputs: [
      "Demand Forecast",
      "Launch Demand Estimate",
      "Inventory Planning Assumptions",
      "Seasonal Demand Profile",
      "S&OP Input Summary",
      "Supply Risk & Demand Risk Assessment",
    ],
  },
  {
    id: "quality",
    name: "Quality / QA-QC",
    description: "Generate quality plans, specs, compliance checklists, and testing protocols.",
    icon: "✅",
    color: "teal",
    outputs: [
      "Quality Control Plan",
      "Specification Sheet Outline",
      "Certificate of Analysis (CoA) Template",
      "Regulatory Compliance Checklist",
      "Stability Protocol Outline",
      "Non-Conformance / Deviation Report Template",
    ],
  },
];

export const PRODUCT_CATEGORIES: CategoryConfig[] = [
  {
    id: "skincare",
    name: "Skincare",
    description: "Moisturizers, serums, cleansers, treatments, SPF products",
  },
  {
    id: "haircare",
    name: "Haircare",
    description: "Shampoos, conditioners, treatments, styling products",
  },
  {
    id: "otc",
    name: "OTC Drug",
    description: "Acne treatments, sunscreens (SPF 15+), anti-dandruff, first aid",
    regulatoryNote: "Requires FDA OTC Drug monograph or NDA compliance (21 CFR)",
  },
  {
    id: "supplements",
    name: "Supplements",
    description: "Vitamins, minerals, botanicals, nutraceuticals",
    regulatoryNote: "Regulated under DSHEA; FDA cGMP 21 CFR Part 111 required",
  },
];
