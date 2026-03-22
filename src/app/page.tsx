"use client";

import { useState } from "react";
import { TEAMS, PRODUCT_CATEGORIES, TeamId, ProductCategory } from "@/lib/teams";
import { features, PHASE_LABELS, PHASE } from "@/lib/phase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedTeam, setSelectedTeam] = useState<TeamId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const canStart = selectedTeam && selectedCategory;

  function handleStart() {
    if (!canStart) return;
    router.push(`/session?team=${selectedTeam}&category=${selectedCategory}`);
  }

  const colorMap: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50 hover:border-blue-400",
    purple: "border-purple-200 bg-purple-50 hover:border-purple-400",
    orange: "border-orange-200 bg-orange-50 hover:border-orange-400",
    gray: "border-gray-200 bg-gray-50 hover:border-gray-400",
    green: "border-green-200 bg-green-50 hover:border-green-400",
    teal: "border-teal-200 bg-teal-50 hover:border-teal-400",
  };

  const selectedColorMap: Record<string, string> = {
    blue: "border-blue-500 bg-blue-100 ring-2 ring-blue-300",
    purple: "border-purple-500 bg-purple-100 ring-2 ring-purple-300",
    orange: "border-orange-500 bg-orange-100 ring-2 ring-orange-300",
    gray: "border-gray-500 bg-gray-100 ring-2 ring-gray-300",
    green: "border-green-500 bg-green-100 ring-2 ring-green-300",
    teal: "border-teal-500 bg-teal-100 ring-2 ring-teal-300",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧬</span>
            <span className="text-xl font-bold text-slate-800">CosmoLab</span>
            <Badge variant="secondary" className="text-xs">{PHASE_LABELS[PHASE]}</Badge>
          </div>
          <div className="flex items-center gap-3">
            {features.institutionalMemory && (
              <button
                onClick={() => router.push("/history")}
                className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <span>📂</span> History
              </button>
            )}
            {session?.user && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:block">{session.user.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AI-Powered Discovery for<br />
            <span className="text-blue-600">Cosmetic Manufacturers</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Select your team and product category. CosmoLab AI will conduct a tailored discovery session,
            generate all the documents your team needs, and hand off pre-filled briefs to downstream teams — in minutes.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">15 min</div>
              <div className="text-sm text-slate-500">vs. days of back-and-forth</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">6 teams</div>
              <div className="text-sm text-slate-500">Sales, R&D, Mfg, Eng, Demand Planning, QA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">20+ docs</div>
              <div className="text-sm text-slate-500">downloadable Word documents</div>
            </div>
          </div>
        </div>

        {/* Step 1: Team Selection */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
            <h2 className="text-xl font-semibold text-slate-800">Select Your Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEAMS.map((team) => {
              const isSelected = selectedTeam === team.id;
              const baseStyle = colorMap[team.color];
              const activeStyle = selectedColorMap[team.color];
              return (
                <Card
                  key={team.id}
                  className={`cursor-pointer border-2 transition-all ${isSelected ? activeStyle : baseStyle}`}
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">{team.icon}</span>
                      {team.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed">{team.description}</CardDescription>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {team.outputs.slice(0, 2).map((o) => (
                        <Badge key={o} variant="outline" className="text-xs py-0">{o}</Badge>
                      ))}
                      {team.outputs.length > 2 && (
                        <Badge variant="outline" className="text-xs py-0">+{team.outputs.length - 2} more</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Step 2: Product Category */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
            <h2 className="text-xl font-semibold text-slate-800">Select Product Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <Card
                  key={cat.id}
                  className={`cursor-pointer border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">{cat.description}</CardDescription>
                    {cat.regulatoryNote && (
                      <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                        ⚠️ FDA regulated
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={!canStart}
            onClick={handleStart}
            className="px-10 py-6 text-base font-semibold"
          >
            {canStart
              ? `Start ${TEAMS.find((t) => t.id === selectedTeam)?.name} Discovery →`
              : "Select a team and category to begin"}
          </Button>
          {canStart && (
            <p className="mt-3 text-sm text-slate-400">
              ~15 minute session · Downloadable Word documents · No data stored
            </p>
          )}
        </div>

        {/* Phase 1.5 — Transformation Tools */}
        {features.workflowAssessment && (
          <>
            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-slate-50 to-slate-100 px-4 text-sm font-semibold text-slate-400 tracking-wide uppercase">
                  Phase 1.5 — Transformation Platform
                </span>
              </div>
            </div>

            <section>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Operational & Strategic Transformation
                </h2>
                <p className="text-slate-500 max-w-xl mx-auto text-sm">
                  Go beyond discovery sessions. Assess your cross-team workflows, identify automation opportunities, and drive structural efficiency across the organization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Workflow Assessment — active */}
                <Card
                  className="cursor-pointer border-2 border-violet-200 bg-violet-50 hover:border-violet-400 transition-all"
                  onClick={() => router.push("/assessment")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🔍</span>
                      Cross-Team Workflow Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed mb-3">
                      Map all 9 critical cross-team handoffs. Score each on the Handoff Tightness Scale. Get a prioritized automation roadmap and executive summary.
                    </CardDescription>
                    <div className="flex flex-wrap gap-1">
                      {["Heat Map", "Automation Report", "90-Day Roadmap", "Exec Summary"].map((o) => (
                        <Badge key={o} variant="outline" className="text-xs py-0 border-violet-200 text-violet-600">{o}</Badge>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Badge className="text-xs bg-violet-600 hover:bg-violet-600">Available now →</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Strategy — active */}
                <Card
                  className="cursor-pointer border-2 border-amber-200 bg-amber-50 hover:border-amber-400 transition-all"
                  onClick={() => router.push("/strategy")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      Business Strategy Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed mb-3">
                      Capture your CM&apos;s strategic context — growth goals, capability gaps, competitive position. Generate a strategic assessment and 12-month priorities.
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {["Situation Assessment", "Growth Matrix", "Gap Analysis", "12-Month Plan"].map((o) => (
                        <Badge key={o} variant="outline" className="text-xs py-0 border-amber-200 text-amber-600">{o}</Badge>
                      ))}
                    </div>
                    <Badge className="text-xs bg-amber-600 hover:bg-amber-600">Available now →</Badge>
                  </CardContent>
                </Card>

                {/* Client Self-Service Portal — active */}
                <Card
                  className="cursor-pointer border-2 border-teal-200 bg-teal-50 hover:border-teal-400 transition-all"
                  onClick={() => router.push("/portal")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">🌐</span>
                      Client Self-Service Portal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed mb-3">
                      Let brand clients run their own AI discovery session. Your team receives a structured, pre-qualified brief — 24/7, any timezone.
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {["Intake Chat", "Project Brief", "Word Download"].map((o) => (
                        <Badge key={o} variant="outline" className="text-xs py-0 border-teal-200 text-teal-600">{o}</Badge>
                      ))}
                    </div>
                    <Badge className="text-xs bg-teal-600 hover:bg-teal-600">Available now →</Badge>
                  </CardContent>
                </Card>
                {/* IT Systems & Digital Transformation — active */}
                <Card
                  className="cursor-pointer border-2 border-indigo-200 bg-indigo-50 hover:border-indigo-400 transition-all"
                  onClick={() => router.push("/it-assessment")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">💻</span>
                      IT & Digital Transformation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed mb-3">
                      Assess your systems landscape — PLM, MES, LIMS, QMS, ERP. Get a prioritized transformation roadmap and AI build-vs-buy guidance for your specific operation.
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {["Readiness Assessment", "Transformation Roadmap", "AI Build vs. Buy", "Integration Brief"].map((o) => (
                        <Badge key={o} variant="outline" className="text-xs py-0 border-indigo-200 text-indigo-600">{o}</Badge>
                      ))}
                    </div>
                    <Badge className="text-xs bg-indigo-600 hover:bg-indigo-600">Available now →</Badge>
                  </CardContent>
                </Card>

                {/* Regulatory & Quality Transformation — active */}
                <Card
                  className="cursor-pointer border-2 border-rose-200 bg-rose-50 hover:border-rose-400 transition-all"
                  onClick={() => router.push("/regulatory-assessment")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-xl">⚖️</span>
                      Regulatory & Quality Transformation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed mb-3">
                      Assess your compliance posture across MoCRA, FDA OTC, EU Cosmetics Regulation, and quality systems. Get a risk-first modernization roadmap and market expansion playbook.
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {["Maturity Assessment", "Compliance Roadmap", "Quality Gap Analysis", "Market Playbook"].map((o) => (
                        <Badge key={o} variant="outline" className="text-xs py-0 border-rose-200 text-rose-600">{o}</Badge>
                      ))}
                    </div>
                    <Badge className="text-xs bg-rose-600 hover:bg-rose-600">Available now →</Badge>
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
