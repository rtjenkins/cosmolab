import { TeamId, ProductCategory } from "./teams";
import { Message } from "./prompts";

// Pre-built realistic conversations for quick testing of document generation
// Keyed by `${team}-${category}`

const conversations: Partial<Record<string, Message[]>> = {
  "rd-skincare": [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. I'll be guiding you through an R&D discovery session for your skincare project. Let's start: what type of skincare product are you looking to develop?" },
    { role: "user", content: "A luxury eye cream targeting dark circles and puffiness." },
    { role: "assistant", content: "Great starting point. What texture and finish are you aiming for — rich cream, lightweight gel-cream, or something else? And should it be suitable for morning use, evening, or both?" },
    { role: "user", content: "Lightweight gel-cream, suitable for morning and evening. Quick absorption is important." },
    { role: "assistant", content: "Noted. Who is the target consumer and what price tier is this positioned at?" },
    { role: "user", content: "Women 35-55, premium luxury tier, retail price around $120-150." },
    { role: "assistant", content: "What key actives do you want to feature for the dark circle and puffiness claims?" },
    { role: "user", content: "Caffeine for puffiness, Vitamin K for dark circles, and ideally some peptides — maybe Haloxyl or Eyeliss." },
    { role: "assistant", content: "Excellent choices. Are there any ingredients you want to exclude — alcohol, fragrance, parabens, etc.?" },
    { role: "user", content: "No alcohol, no fragrance, and no known allergens." },
    { role: "assistant", content: "What are the target markets for regulatory purposes — US only, or also EU and/or other regions?" },
    { role: "user", content: "US and EU launch simultaneously." },
    { role: "assistant", content: "For a US + EU launch with these actives, I'd recommend ensuring Haloxyl/Eyeliss supplier documentation supports EU Cosmetics Regulation 1223/2009 compliance. Please verify this with your regulatory affairs team before acting on it. What packaging format are you considering — glass jar, airless pump, or tube?" },
    { role: "user", content: "Airless pump to protect actives and give a premium feel." },
    { role: "assistant", content: "Smart choice for preserving sensitive actives. Do you have any benchmark or reference products your formulation team should reference for texture and performance?" },
    { role: "user", content: "GoPure Eye Cream is a good reference for the clean aesthetic. Otherwise let R&D recommend." },
    { role: "assistant", content: "Perfect — GoPure gives R&D a clean, efficacy-forward benchmark. What is your target development timeline?" },
    { role: "user", content: "No hard deadline, but ideally first prototype within 10-12 weeks." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],

  "sales-skincare": [
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

  "quality-skincare": [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Quality / QA-QC discovery session. What product are we establishing quality requirements for?" },
    { role: "user", content: "A luxury eye cream — gel-cream format, targeting dark circles. US and EU launch." },
    { role: "assistant", content: "What are the applicable regulatory frameworks — FDA cosmetics (MoCRA), EU Cosmetics Regulation 1223/2009, and any third-party certifications?" },
    { role: "user", content: "Both FDA and EU. We also want Leaping Bunny cruelty-free certification." },
    { role: "assistant", content: "Are there any quality claims we need to substantiate — preservative-free, hypoallergenic, vegan?" },
    { role: "user", content: "Fragrance-free and alcohol-free. Targeting clean beauty positioning." },
    { role: "assistant", content: "What is your target shelf life and how do you plan to support it?" },
    { role: "user", content: "24 months shelf life, 6-month PAO after opening. Stability study under ICH conditions." },
    { role: "assistant", content: "What testing panels are required at release — micro, pH, viscosity, appearance?" },
    { role: "user", content: "Micro (USP 51/61), pH, viscosity, appearance, color, odor, and preservative efficacy." },
    { role: "assistant", content: "Do you have a supplier qualification process for raw materials?" },
    { role: "user", content: "Yes — we require CoA, MSDS, and allergen declaration from all suppliers. High-risk suppliers need audits." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],

  "manufacturing-skincare": [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Manufacturing discovery session. What product are we setting up production for?" },
    { role: "user", content: "A gel-cream eye cream in 15mL airless pump bottles." },
    { role: "assistant", content: "What are the target batch sizes — lab scale, pilot, and commercial?" },
    { role: "user", content: "Lab: 5kg. Pilot: 50kg. Commercial: 500kg." },
    { role: "assistant", content: "What is the fill temperature and are there any heat-sensitive actives?" },
    { role: "user", content: "Fill at room temperature. Contains caffeine, Vitamin K, and peptides — all heat-sensitive." },
    { role: "assistant", content: "What mixing process do you anticipate — high-shear homogenization, overhead mixing, or both?" },
    { role: "user", content: "High-shear homogenization for emulsification, then overhead mixing for actives addition at cool-down." },
    { role: "assistant", content: "What is your target line speed and annual volume?" },
    { role: "user", content: "40 units per minute. Estimated 120,000 units annually in year one." },
    { role: "assistant", content: "Any special handling requirements — cleanroom, temperature control, hazmat?" },
    { role: "user", content: "Controlled environment, not full cleanroom. No hazmat ingredients." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],

  "planning-skincare": [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run a Demand Planning discovery session. Is this a new product launch or an existing SKU?" },
    { role: "user", content: "New product launch — a luxury eye cream, first run." },
    { role: "assistant", content: "What distribution channels are planned at launch?" },
    { role: "user", content: "DTC e-commerce first, then specialty retail (Credo, Follain) within 3 months." },
    { role: "assistant", content: "What is the initial stocking quantity and how did you arrive at that number?" },
    { role: "user", content: "3,000 units. Based on our DTC subscriber base and projected conversion rate." },
    { role: "assistant", content: "Do you anticipate any seasonality for this product?" },
    { role: "user", content: "Yes — Q4 holiday season typically drives 40% of annual eye cream sales in this category." },
    { role: "assistant", content: "What are the raw material and packaging lead times for key components?" },
    { role: "user", content: "Airless pump bottles: 10-12 weeks. Key actives (Eyeliss, Haloxyl): 6-8 weeks." },
    { role: "assistant", content: "Are there any single-source supply risks we should plan around?" },
    { role: "user", content: "Eyeliss and Haloxyl are single-source from Givaudan. We have no backup supplier currently." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],

  "engineering-skincare": [
    { role: "assistant", content: "Hi, I'm CosmoLab AI. Let's run an Engineering discovery session. Is this a new production line or a retrofit of existing equipment?" },
    { role: "user", content: "New line addition in our existing facility." },
    { role: "assistant", content: "What is the target throughput in units per hour and annual volume?" },
    { role: "user", content: "Target 2,400 units/hour. Annual volume approximately 120,000 units." },
    { role: "assistant", content: "What is the product format and primary packaging — airless pump, 15mL?" },
    { role: "user", content: "Yes, 15mL airless pump. Gel-cream viscosity, room temperature fill." },
    { role: "assistant", content: "What utilities are available at the planned installation point — steam, chilled water, compressed air?" },
    { role: "user", content: "Compressed air and chilled water available. No steam at that location." },
    { role: "assistant", content: "What is the available footprint for the new line?" },
    { role: "user", content: "Approximately 20x40 feet. 14-foot ceiling clearance." },
    { role: "assistant", content: "What are the regulatory validation requirements — IQ/OQ/PQ?" },
    { role: "user", content: "Full IQ/OQ/PQ required for FDA compliance. We're a cGMP facility." },
    { role: "assistant", content: "I have everything I need. Type 'generate' to create your documents." },
  ],
};

export function getDemoConversation(team: TeamId, category: ProductCategory): Message[] | null {
  const key = `${team}-${category}`;
  return conversations[key] ?? conversations[`${team}-skincare`] ?? null;
}
