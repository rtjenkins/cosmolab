"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TeamId, ProductCategory, TEAMS, PRODUCT_CATEGORIES } from "@/lib/teams";
import { Message, HANDOFF_CONFIGS, HandoffKey, getHandoffsForTeam } from "@/lib/prompts";
import { features } from "@/lib/phase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWordDoc, GeneratedDocument } from "@/lib/docBuilder";
import { getDemoConversation } from "@/lib/demoConversations";
import { saveSession, buildDiscoverySession } from "@/lib/sessionStorage";

interface QuoteData {
  productName: string;
  clientBrand: string;
  category: string;
  complexityScore: number;
  complexityLabel: string;
  complexityBreakdown: Record<string, { score: number; note: string }>;
  developmentFeeRange: { low: number; high: number; currency: string };
  cogsRange: { low: number; high: number; unit: string; atVolume: string };
  moq: number;
  timeline: { prototypeWeeks: number; formulaLockWeeks: number; commercialLaunchWeeks: number };
  keyAssumptions: string[];
  disclaimer: string;
}

/** Render a message, highlighting ⚠️ Regulatory Flag lines in amber */
function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <span>
      {lines.map((line, i) => {
        const isFlag = line.startsWith("⚠️ Regulatory Flag:");
        return (
          <span key={i}>
            {isFlag ? (
              <span className="block bg-amber-50 border border-amber-300 rounded px-2 py-1 my-1 text-amber-800 text-xs font-medium">
                {line}
              </span>
            ) : (
              line
            )}
            {i < lines.length - 1 && !isFlag && "\n"}
          </span>
        );
      })}
    </span>
  );
}

function SessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const team = searchParams.get("team") as TeamId;
  const category = searchParams.get("category") as ProductCategory;

  const teamConfig = TEAMS.find((t) => t.id === team);
  const categoryConfig = PRODUCT_CATEGORIES.find((c) => c.id === category);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documents, setDocuments] = useState<GeneratedDocument[] | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [handoffStates, setHandoffStates] = useState<
    Record<HandoffKey, { status: "idle" | "generating" | "done" | "error"; doc?: GeneratedDocument; error?: string }>
  >({} as Record<HandoffKey, { status: "idle" | "generating" | "done" | "error"; doc?: GeneratedDocument; error?: string }>);
  const [streamingText, setStreamingText] = useState("");
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const readyToGenerate = messages.some(
    (m) => m.role === "assistant" && m.content.toLowerCase().includes("type 'generate'")
  );

  useEffect(() => {
    if (!team || !category || !teamConfig) {
      router.push("/");
    }
  }, [team, category, teamConfig, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isGenerating, documents, generateError]);

  async function startSession() {
    setSessionStarted(true);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], team, category }),
      });

      await streamResponse(response, []);
    } finally {
      setIsLoading(false);
    }
  }

  async function streamResponse(response: Response, currentMessages: Message[]) {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let fullText = "";

    setStreamingText("");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
      setStreamingText(fullText);
    }

    const assistantMessage: Message = { role: "assistant", content: fullText };
    setMessages([...currentMessages, assistantMessage]);
    setStreamingText("");
  }

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Check if user typed "generate"
    if (input.trim().toLowerCase() === "generate") {
      await generateDocuments(updatedMessages);
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, team, category }),
      });
      await streamResponse(response, updatedMessages);
    } finally {
      setIsLoading(false);
    }
  }

  async function generateDocuments(msgs: Message[]) {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const response = await fetch("/api/generate-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, team, category }),
      });
      const rawText = await response.text();
      console.log("[generate-docs] raw response:", rawText.slice(0, 500));
      let data: { documents?: GeneratedDocument[]; error?: string };
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Invalid JSON from server: ${rawText.slice(0, 200)}`);
      }
      if (!response.ok || data.error) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      if (!data.documents) {
        throw new Error("No documents returned. Please try again.");
      }
      setDocuments(data.documents);
      saveSession(buildDiscoverySession(
        team,
        teamConfig?.name ?? team,
        category,
        categoryConfig?.name ?? category,
        msgs,
        data.documents
      ));
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  }

  function loadDemo() {
    const demo = getDemoConversation(team, category);
    if (!demo) return;
    setSessionStarted(true);
    setMessages(demo);
  }

  async function downloadWord() {
    if (!documents) return;
    setIsDownloading(true);
    try {
      const blob = await buildWordDoc(
        documents,
        teamConfig?.name ?? team,
        categoryConfig?.name ?? category,
        "CosmoLab"
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CosmoLab_${teamConfig?.name}_${categoryConfig?.name}_Discovery.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  async function generateHandoff(handoffKey: HandoffKey) {
    setHandoffStates((prev) => ({ ...prev, [handoffKey]: { status: "generating" } }));
    try {
      const response = await fetch("/api/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handoffKey, messages, category }),
      });
      const rawText = await response.text();
      let data: { documents?: GeneratedDocument[]; error?: string };
      try { data = JSON.parse(rawText); } catch {
        throw new Error(`Invalid response: ${rawText.slice(0, 200)}`);
      }
      if (!response.ok || data.error) throw new Error(data.error || `Server error: ${response.status}`);
      const doc = data.documents?.[0];
      if (!doc) throw new Error("No document returned.");
      setHandoffStates((prev) => ({ ...prev, [handoffKey]: { status: "done", doc } }));
    } catch (err) {
      setHandoffStates((prev) => ({
        ...prev,
        [handoffKey]: { status: "error", error: err instanceof Error ? err.message : "Failed" },
      }));
    }
  }

  async function downloadHandoffDoc(doc: GeneratedDocument, handoffKey: HandoffKey) {
    const blob = await buildWordDoc([doc], HANDOFF_CONFIGS[handoffKey].toTeamName, categoryConfig?.name ?? category, "CosmoLab");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CosmoLab_${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function generateQuote() {
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, team, category }),
      });
      const rawText = await response.text();
      let data: { quote?: QuoteData; error?: string };
      try { data = JSON.parse(rawText); } catch {
        throw new Error(`Invalid response: ${rawText.slice(0, 200)}`);
      }
      if (!response.ok || data.error) throw new Error(data.error || `Server error: ${response.status}`);
      if (!data.quote) throw new Error("No quote returned. Please try again.");
      setQuote(data.quote);
    } catch (err) {
      setQuoteError(err instanceof Error ? err.message : "Quote generation failed. Please try again.");
    } finally {
      setIsQuoting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!teamConfig || !categoryConfig) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-600 text-sm">
              ← Back
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-lg">🧬</span>
            <span className="font-bold text-slate-800">CosmoLab</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{teamConfig.icon} {teamConfig.name}</Badge>
            <Badge variant="outline">{categoryConfig.name}</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 flex flex-col gap-4">

        {/* Not started */}
        {!sessionStarted && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div className="text-5xl mb-4">{teamConfig.icon}</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{teamConfig.name} Discovery Session</h2>
            <p className="text-slate-500 mb-2 max-w-md">
              CosmoLab AI will ask you focused questions about your {categoryConfig.name.toLowerCase()} project
              and generate all the documents your team needs.
            </p>
            <div className="mb-6 flex flex-wrap justify-center gap-2 max-w-md">
              {teamConfig.outputs.map((o) => (
                <Badge key={o} variant="outline" className="text-xs">{o}</Badge>
              ))}
            </div>
            {categoryConfig.regulatoryNote && (
              <div className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-md">
                ⚠️ {categoryConfig.regulatoryNote}
              </div>
            )}
            <div className="flex gap-3">
              <Button size="lg" onClick={startSession} className="px-8">
                Begin Session →
              </Button>
              <Button size="lg" variant="outline" onClick={loadDemo} className="px-8">
                ⚡ Quick Test
              </Button>
            </div>
            <p className="mt-2 text-xs text-slate-400">Quick Test loads a pre-filled conversation so you can test document generation instantly.</p>
          </div>
        )}

        {/* Chat messages */}
        {sessionStarted && (
          <div className="flex-1 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.role === "assistant"
                    ? <MessageContent content={msg.content} />
                    : msg.content}
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-white border border-slate-200 text-slate-800 shadow-sm">
                  {streamingText}
                  <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-1 animate-pulse rounded-sm" />
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Ready to generate banner */}
        {readyToGenerate && !documents && !isGenerating && (
          <div className="bg-green-50 border border-green-300 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-green-800 font-medium">Discovery complete! Ready to generate your documents.</span>
            <Button size="sm" onClick={() => generateDocuments(messages)} className="bg-green-600 hover:bg-green-700">
              Generate Documents →
            </Button>
          </div>
        )}

        {/* Generating state */}
        {isGenerating && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="text-blue-600 font-semibold mb-1">⏳ Generating your documents...</div>
            <div className="text-sm text-blue-400">This may take 30–60 seconds. Please wait.</div>
          </div>
        )}

        {/* Generation error */}
        {generateError && (
          <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-red-700">⚠️ {generateError}</span>
            <Button size="sm" variant="outline" onClick={() => generateDocuments(messages)} className="shrink-0 ml-3">
              Retry
            </Button>
          </div>
        )}

        {/* Document Output */}
        {documents && (
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  ✅ {documents.length} documents generated
                </h2>
                <p className="text-sm text-slate-500">Ready to download for {teamConfig.name} · {categoryConfig.name}</p>
              </div>
              <Button onClick={downloadWord} disabled={isDownloading} className="gap-2">
                {isDownloading ? "Preparing..." : "⬇ Download Word (.docx)"}
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {documents.map((doc) => (
                <div key={doc.title} className="text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-800 font-medium">
                  📄 {doc.title}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Regulatory information is for guidance only. Verify all requirements with your qualified regulatory affairs team.
            </p>
          </div>
        )}

        {/* Handoff Automation Panel — Phase 1.5 */}
        {features.handoffAutomation && documents && (() => {
          const handoffs = getHandoffsForTeam(team);
          if (handoffs.length === 0) return null;
          return (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-800">Send to downstream teams</span>
                <Badge className="text-xs bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">Phase 1.5</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Generate a pre-filled intake document for each downstream team — ready to hand off immediately.
              </p>
              <div className="flex flex-col gap-3">
                {handoffs.map((key) => {
                  const config = HANDOFF_CONFIGS[key];
                  const state = handoffStates[key] ?? { status: "idle" };
                  return (
                    <div key={key} className="border border-slate-100 rounded-lg p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-slate-700">{config.toTeamName}</div>
                          <div className="text-xs text-slate-400">{config.description}</div>
                        </div>
                        {state.status === "idle" && (
                          <Button size="sm" variant="outline" onClick={() => generateHandoff(key)} className="shrink-0">
                            {config.label}
                          </Button>
                        )}
                        {state.status === "generating" && (
                          <span className="text-xs text-slate-400 shrink-0">Generating…</span>
                        )}
                        {state.status === "error" && (
                          <Button size="sm" variant="outline" onClick={() => generateHandoff(key)} className="shrink-0 text-red-600 border-red-200">
                            Retry
                          </Button>
                        )}
                        {state.status === "done" && state.doc && (
                          <Button size="sm" variant="outline" onClick={() => downloadHandoffDoc(state.doc!, key)} className="shrink-0 text-green-700 border-green-200">
                            ⬇ Download
                          </Button>
                        )}
                      </div>
                      {state.status === "done" && state.doc && (
                        <div className="mt-2 text-xs bg-green-50 border border-green-200 rounded px-2 py-1 text-green-700 font-medium">
                          ✅ {state.doc.title}
                        </div>
                      )}
                      {state.status === "error" && (
                        <div className="mt-2 text-xs text-red-600">{state.error}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* AI Quoting Engine — Phase 1.5, Sales only */}
        {features.aiQuoting && documents && team === "sales" && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-slate-800">Indicative Project Quote</span>
              <Badge className="text-xs bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">Phase 1.5</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Generate an AI-estimated development fee, COGS range, and timeline based on this discovery session.
            </p>

            {!quote && !isQuoting && (
              <Button size="sm" variant="outline" onClick={generateQuote} disabled={isQuoting}>
                Generate Indicative Quote →
              </Button>
            )}
            {isQuoting && (
              <div className="text-sm text-slate-400">⏳ Analyzing session and generating quote…</div>
            )}
            {quoteError && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-600">⚠️ {quoteError}</span>
                <Button size="sm" variant="outline" onClick={generateQuote}>Retry</Button>
              </div>
            )}

            {quote && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">{quote.productName || "—"}</div>
                    {quote.clientBrand && <div className="text-xs text-slate-500">Brand: {quote.clientBrand}</div>}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-700">Complexity: <span className="text-blue-600">{quote.complexityLabel}</span></div>
                    <div className="text-xs text-slate-400">{quote.complexityScore.toFixed(1)} / 5.0</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">Development Fee</div>
                    <div className="text-sm font-semibold text-slate-800">
                      ${quote.developmentFeeRange.low.toLocaleString()} – ${quote.developmentFeeRange.high.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">{quote.developmentFeeRange.currency}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">COGS Range</div>
                    <div className="text-sm font-semibold text-slate-800">
                      ${quote.cogsRange.low.toFixed(2)} – ${quote.cogsRange.high.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">{quote.cogsRange.unit} @ {quote.cogsRange.atVolume}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">Commercial Launch</div>
                    <div className="text-sm font-semibold text-slate-800">{quote.timeline.commercialLaunchWeeks} wks</div>
                    <div className="text-xs text-slate-400">MOQ: {quote.moq.toLocaleString()} units</div>
                  </div>
                </div>

                {quote.complexityBreakdown && (
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-2">Complexity Breakdown</div>
                    <div className="flex flex-col gap-1">
                      {Object.entries(quote.complexityBreakdown).map(([factor, { score, note }]) => (
                        <div key={factor} className="flex items-start gap-2 text-xs">
                          <span className="text-slate-400 capitalize w-20 shrink-0">{factor}</span>
                          <span className="font-medium text-blue-600 shrink-0">{score}/5</span>
                          <span className="text-slate-500">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {quote.keyAssumptions?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-1">Key Assumptions</div>
                    <ul className="list-disc list-inside space-y-0.5">
                      {quote.keyAssumptions.map((a, i) => (
                        <li key={i} className="text-xs text-slate-500">{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">{quote.disclaimer}</p>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />

        {/* Input */}
        {sessionStarted && !documents && !isGenerating && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex items-end gap-3 p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={readyToGenerate ? "Type 'generate' to create your documents..." : "Type your response..."}
              rows={2}
              disabled={isLoading}
              className="flex-1 resize-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent leading-relaxed"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="shrink-0"
            >
              Send
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionContent />
    </Suspense>
  );
}
