"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoredSession, getSessions, searchSessions, deleteSession, clearAllSessions } from "@/lib/sessionStorage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SESSION_TYPE_CONFIG: Record<
  StoredSession["type"],
  { label: string; badgeClass: string; icon: string }
> = {
  discovery:              { label: "Discovery",              badgeClass: "bg-blue-100 text-blue-700 border-blue-200",   icon: "🔵" },
  assessment:             { label: "Workflow Assessment",    badgeClass: "bg-violet-100 text-violet-700 border-violet-200", icon: "🔍" },
  strategy:               { label: "Strategy Session",       badgeClass: "bg-amber-100 text-amber-700 border-amber-200",  icon: "🎯" },
  portal:                 { label: "Client Portal",          badgeClass: "bg-teal-100 text-teal-700 border-teal-200",    icon: "🌐" },
  "it-assessment":        { label: "IT Assessment",          badgeClass: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "💻" },
  "regulatory-assessment":{ label: "Regulatory Assessment",  badgeClass: "bg-rose-100 text-rose-700 border-rose-200",   icon: "⚖️" },
};

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [query, setQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setSessions(query.trim() ? searchSessions(query) : getSessions());
  }, [query]);

  function handleDelete(id: string) {
    deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function handleClearAll() {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearAllSessions();
    setSessions([]);
    setConfirmClear(false);
  }

  const allSessions = getSessions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-600 text-sm">
              ← Back
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-xl">🧬</span>
            <span className="text-xl font-bold text-slate-800">CosmoLab</span>
            <Badge variant="secondary" className="text-xs">Institutional Memory</Badge>
          </div>
          <span className="text-sm text-slate-400">
            {allSessions.length} session{allSessions.length !== 1 ? "s" : ""} stored
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Project History &amp; Search</h1>
          <p className="text-slate-500 text-sm">
            All completed sessions are stored locally in your browser. Search across products, teams, client brands, and session content.
          </p>
        </div>

        {/* Search + controls */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setConfirmClear(false); }}
            placeholder="Search by product, team, client brand, keyword…"
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
          />
          {allSessions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className={confirmClear ? "border-red-300 text-red-600 hover:bg-red-50" : ""}
            >
              {confirmClear ? "Confirm clear all" : "Clear all"}
            </Button>
          )}
        </div>

        {/* Empty state */}
        {sessions.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-4">📂</div>
            <p className="font-medium text-slate-500">
              {query.trim() ? "No sessions match your search." : "No sessions saved yet."}
            </p>
            <p className="text-sm mt-1">
              {query.trim()
                ? "Try a different keyword."
                : "Complete a discovery, assessment, or strategy session to see it here."}
            </p>
          </div>
        )}

        {/* Session cards */}
        <div className="flex flex-col gap-4">
          {sessions.map((session) => {
            const cfg = SESSION_TYPE_CONFIG[session.type] ?? SESSION_TYPE_CONFIG.discovery;
            const date = new Date(session.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Card key={session.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <Badge className={`text-xs border shrink-0 ${cfg.badgeClass}`}>
                        {cfg.icon} {cfg.label}
                      </Badge>
                      <CardTitle className="text-base text-slate-800 truncate">{session.label}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400 whitespace-nowrap">{date}</span>
                      <button
                        className="text-slate-300 hover:text-red-500 text-lg leading-none font-light transition-colors"
                        onClick={() => handleDelete(session.id)}
                        title="Delete session"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{session.summary}</p>
                  {session.documentTitles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {session.documentTitles.map((title) => (
                        <span
                          key={title}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-600"
                        >
                          📄 {title}
                        </span>
                      ))}
                    </div>
                  )}
                  {session.meta && Object.values(session.meta).some(Boolean) && (
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400 mt-1">
                      {session.meta.team     && <span>Team: <span className="text-slate-500">{session.meta.team}</span></span>}
                      {session.meta.category && <span>· Category: <span className="text-slate-500">{session.meta.category}</span></span>}
                      {session.meta.productName  && <span>· Product: <span className="text-slate-500">{session.meta.productName}</span></span>}
                      {session.meta.clientBrand  && <span>· Brand: <span className="text-slate-500">{session.meta.clientBrand}</span></span>}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
