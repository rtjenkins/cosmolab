"use client";

import { useState } from "react";
import { TEAMS, PRODUCT_CATEGORIES, TeamId, ProductCategory } from "@/lib/teams";
import { features } from "@/lib/phase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

type Tab = "discovery" | "assessments";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("discovery");
  const [selectedTeam, setSelectedTeam] = useState<TeamId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  const canStart = selectedTeam && selectedCategory;

  function handleStart() {
    if (!canStart) return;
    router.push(`/session?team=${selectedTeam}&category=${selectedCategory}`);
  }

  const colorMap: Record<string, string> = {
    blue:   "border-blue-200   bg-blue-50   hover:border-blue-400",
    purple: "border-purple-200 bg-purple-50 hover:border-purple-400",
    orange: "border-orange-200 bg-orange-50 hover:border-orange-400",
    gray:   "border-gray-200   bg-gray-50   hover:border-gray-400",
    green:  "border-green-200  bg-green-50  hover:border-green-400",
    teal:   "border-teal-200   bg-teal-50   hover:border-teal-400",
  };

  const selectedColorMap: Record<string, string> = {
    blue:   "border-blue-500   bg-blue-100   ring-2 ring-blue-300",
    purple: "border-purple-500 bg-purple-100 ring-2 ring-purple-300",
    orange: "border-orange-500 bg-orange-100 ring-2 ring-orange-300",
    gray:   "border-gray-500   bg-gray-100   ring-2 ring-gray-300",
    green:  "border-green-500  bg-green-100  ring-2 ring-green-300",
    teal:   "border-teal-500   bg-teal-100   ring-2 ring-teal-300",
  };

  const assessments = [
    {
      icon: "🔍",
      title: "Cross-Team Workflow Assessment",
      description: "Map your 9 critical team handoffs, score inefficiencies, and get a prioritized automation roadmap.",
      tags: ["Heat Map", "Automation Report", "90-Day Roadmap", "Exec Summary"],
      color: "violet",
      route: "/assessment",
    },
    {
      icon: "🎯",
      title: "Business Strategy Session",
      description: "Define your growth goals, competitive position, and capability gaps — with a 12-month priorities plan.",
      tags: ["Situation Assessment", "Growth Matrix", "Gap Analysis", "12-Month Plan"],
      color: "amber",
      route: "/strategy",
    },
    {
      icon: "🌐",
      title: "Client Self-Service Portal",
      description: "Let brand clients run their own AI discovery. Your team receives a structured, pre-qualified brief.",
      tags: ["Intake Chat", "Project Brief", "Word Download"],
      color: "teal",
      route: "/portal",
    },
    {
      icon: "💻",
      title: "IT & Digital Transformation",
      description: "Assess your PLM, MES, LIMS, QMS, and ERP landscape. Get a prioritized roadmap and AI guidance.",
      tags: ["Readiness Assessment", "Transformation Roadmap", "AI Build vs. Buy"],
      color: "indigo",
      route: "/it-assessment",
    },
    {
      icon: "⚖️",
      title: "Regulatory & Quality",
      description: "Assess your compliance posture across MoCRA, FDA OTC, and EU Cosmetics. Get a risk-first modernization plan.",
      tags: ["Maturity Assessment", "Compliance Roadmap", "Quality Gap Analysis"],
      color: "rose",
      route: "/regulatory-assessment",
    },
  ];

  const assessmentStyles: Record<string, { card: string; tag: string }> = {
    violet: { card: "border-violet-200 bg-violet-50 hover:border-violet-400", tag: "border-violet-200 text-violet-600" },
    amber:  { card: "border-amber-200  bg-amber-50  hover:border-amber-400",  tag: "border-amber-200  text-amber-600"  },
    teal:   { card: "border-teal-200   bg-teal-50   hover:border-teal-400",   tag: "border-teal-200   text-teal-600"   },
    indigo: { card: "border-indigo-200 bg-indigo-50 hover:border-indigo-400", tag: "border-indigo-200 text-indigo-600" },
    rose:   { card: "border-rose-200   bg-rose-50   hover:border-rose-400",   tag: "border-rose-200   text-rose-600"   },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="text-xl font-bold text-slate-800">CosmoLab</span>
          </div>
          <div className="flex items-center gap-4">
            {features.institutionalMemory && (
              <button
                onClick={() => router.push("/history")}
                className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <span>📂</span> History
              </button>
            )}
            {session?.user && (
              <div className="flex items-center gap-3">
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

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            AI-Powered Intelligence for<br />
            <span className="text-blue-600">Cosmetic Manufacturers</span>
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Run a guided AI session. Get professional documents ready in minutes — not days.
          </p>
        </div>

        {/* Tabs */}
        {features.workflowAssessment && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("discovery")}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "discovery"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Discovery Sessions
              </button>
              <button
                onClick={() => setActiveTab("assessments")}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "assessments"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Assessments &amp; Strategy
              </button>
            </div>
          </div>
        )}

        {/* ── Discovery Tab ── */}
        {activeTab === "discovery" && (
          <>
            {/* Step 1: Team */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">1</span>
                <h2 className="text-base font-semibold text-slate-700">Select Your Team</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TEAMS.map((team) => {
                  const isSelected = selectedTeam === team.id;
                  return (
                    <Card
                      key={team.id}
                      className={`cursor-pointer border-2 transition-all ${isSelected ? selectedColorMap[team.color] : colorMap[team.color]}`}
                      onClick={() => setSelectedTeam(team.id)}
                    >
                      <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <span className="text-lg">{team.icon}</span>
                          {team.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-xs text-slate-500 leading-relaxed">{team.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Category */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
                <h2 className="text-base font-semibold text-slate-700">Select Product Category</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                      <CardHeader className="pb-1 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold">{cat.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-xs text-slate-500">{cat.description}</p>
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
                  ~15 minute session · Downloadable Word documents
                </p>
              )}
            </div>
          </>
        )}

        {/* ── Assessments Tab ── */}
        {activeTab === "assessments" && features.workflowAssessment && (
          <>
            <p className="text-center text-sm text-slate-500 mb-8 max-w-xl mx-auto">
              Go deeper than a discovery session. Assess your operations, strategy, compliance, and systems — and walk away with a professional report.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.map((a) => {
                const s = assessmentStyles[a.color];
                return (
                  <Card
                    key={a.route}
                    className={`cursor-pointer border-2 transition-all ${s.card}`}
                    onClick={() => router.push(a.route)}
                  >
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <span className="text-xl">{a.icon}</span>
                        {a.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{a.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {a.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs border rounded-full px-2 py-0.5 ${s.tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
