/**
 * CosmoLab Phase Feature Flags
 *
 * Controls which features are visible in the UI.
 * Set via the NEXT_PUBLIC_PHASE environment variable.
 *
 * Usage:
 *   pnpm dev              → Phase 1.5 (default / latest)
 *   pnpm dev:phase1       → Phase 1 only  (safe demo mode)
 *   pnpm dev:phase15      → Phase 1.5     (transformation platform)
 *
 * Or set in .env.local:
 *   NEXT_PUBLIC_PHASE=1
 *   NEXT_PUBLIC_PHASE=1.5
 */

export type PhaseId = "1" | "1.5";

export const PHASE = (process.env.NEXT_PUBLIC_PHASE ?? "1.5") as PhaseId;

export const PHASE_LABELS: Record<PhaseId, string> = {
  "1":   "AI Discovery",
  "1.5": "Transformation Platform",
};

/**
 * Individual feature flags. Import and check these in components/pages
 * instead of comparing PHASE directly — makes future phase additions cleaner.
 */
export const features = {
  // ── Phase 1 (always enabled) ──────────────────────────────────────────────
  discoverySession:    true as const,
  documentGeneration:  true as const,

  // ── Phase 1.5 ─────────────────────────────────────────────────────────────
  /** Cross-Team Workflow Assessment session type */
  workflowAssessment:  PHASE === "1.5",
  /** Client self-service intake portal */
  clientPortal:        PHASE === "1.5",
  /** AI-powered quoting engine */
  aiQuoting:           PHASE === "1.5",
  /** Institutional memory & project search */
  institutionalMemory: PHASE === "1.5",
  /** Trend intelligence dashboard */
  trendIntelligence:   PHASE === "1.5",
  /** Real-time regulatory change alerts */
  regulatoryAlerts:    PHASE === "1.5",
  /** Business strategy session type */
  strategySession:     PHASE === "1.5",
  /** Cross-team handoff automation — post-generation Send to Team panel */
  handoffAutomation:     PHASE === "1.5",
  /** IT Systems & Digital Transformation Advisory session */
  itAssessment:          PHASE === "1.5",
  /** Regulatory & Quality Transformation Advisory session */
  regulatoryAssessment:  PHASE === "1.5",
} as const;

export type FeatureKey = keyof typeof features;
