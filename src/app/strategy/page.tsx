"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/lib/prompts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWordDoc, GeneratedDocument } from "@/lib/docBuilder";

const STRATEGY_TOPICS = [
  "Business overview & revenue mix",
  "Growth performance & trends",
  "Capacity & utilization",
  "Capability gaps & market demand",
  "Client concentration & risk",
  "Competitive position & differentiation",
  "Geographic expansion readiness",
  "Strategic options under consideration",
  "Leadership & talent",
];

export default function StrategyPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documents, setDocuments] = useState<GeneratedDocument[] | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [generateError, setGenerateError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const readyToGenerate = messages.some(
    (m) => m.role === "assistant" && m.content.toLowerCase().includes("type 'generate'")
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isGenerating, documents, generateError]);

  async function startSession() {
    setSessionStarted(true);
    setIsLoading(true);
    try {
      const response = await fetch("/api/strategy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
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
    setMessages([...currentMessages, { role: "assistant", content: fullText }]);
    setStreamingText("");
  }

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    if (input.trim().toLowerCase() === "generate") {
      await generateDocuments(updatedMessages);
      return;
    }

    try {
      const response = await fetch("/api/strategy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
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
      const response = await fetch("/api/strategy/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs }),
      });
      const rawText = await response.text();
      let data: { documents?: GeneratedDocument[]; error?: string };
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Invalid JSON from server: ${rawText.slice(0, 200)}`);
      }
      if (!response.ok || data.error) throw new Error(data.error || `Server error: ${response.status}`);
      if (!data.documents) throw new Error("No documents returned. Please try again.");
      setDocuments(data.documents);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  }

  async function downloadWord() {
    if (!documents) return;
    setIsDownloading(true);
    try {
      const blob = await buildWordDoc(
        documents,
        "Business Strategy Session",
        "",
        "CosmoLab"
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CosmoLab_Strategy_Assessment_${new Date().toISOString().slice(0, 10)}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

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
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
              🎯 Business Strategy
            </Badge>
            <Badge variant="secondary" className="text-xs">Phase 1.5</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 flex flex-col gap-4">

        {/* Not started */}
        {!sessionStarted && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Business Strategy Session</h2>
            <p className="text-slate-500 mb-6 max-w-lg">
              A senior strategy AI will conduct a focused discovery session with CM leadership — covering growth performance, capability gaps, competitive position, and strategic options — then generate a complete strategic assessment package.
            </p>

            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-2xl w-full text-left">
              {STRATEGY_TOPICS.map((t, i) => (
                <div key={t} className="text-xs bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-amber-700 font-medium">
                  <span className="text-amber-400 mr-1">{i + 1}.</span> {t}
                </div>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {[
                "Strategic Situation Assessment",
                "Growth Opportunity Matrix",
                "Capability Gap Analysis",
                "12-Month Strategic Priorities",
              ].map((doc) => (
                <Badge key={doc} variant="outline" className="text-xs border-amber-200 text-amber-600">
                  📄 {doc}
                </Badge>
              ))}
            </div>

            <Button size="lg" onClick={startSession} className="px-10 bg-amber-600 hover:bg-amber-700">
              Begin Strategy Session →
            </Button>
            <p className="mt-3 text-xs text-slate-400">
              ~30 minute session · 4 downloadable Word documents · Board-ready output
            </p>
          </div>
        )}

        {/* Chat messages */}
        {sessionStarted && (
          <div className="flex-1 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-amber-600 text-white rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-white border border-slate-200 text-slate-800 shadow-sm">
                  {streamingText}
                  <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse rounded-sm" />
                </div>
              </div>
            )}

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

        {readyToGenerate && !documents && !isGenerating && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-amber-800 font-medium">Strategy session complete! Ready to generate your assessment.</span>
            <Button size="sm" onClick={() => generateDocuments(messages)} className="bg-amber-600 hover:bg-amber-700">
              Generate Assessment →
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <div className="text-amber-600 font-semibold mb-1">⏳ Generating your strategic assessment...</div>
            <div className="text-sm text-amber-400">Building your Growth Opportunity Matrix and 12-Month Priorities. This may take 30–60 seconds.</div>
          </div>
        )}

        {generateError && (
          <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-red-700">⚠️ {generateError}</span>
            <Button size="sm" variant="outline" onClick={() => generateDocuments(messages)} className="shrink-0 ml-3">Retry</Button>
          </div>
        )}

        {documents && (
          <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">✅ {documents.length} strategic documents generated</h2>
                <p className="text-sm text-slate-500">
                  Business Strategy Assessment · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <Button onClick={downloadWord} disabled={isDownloading} className="gap-2 bg-amber-600 hover:bg-amber-700">
                {isDownloading ? "Preparing..." : "⬇ Download Word (.docx)"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {documents.map((doc) => (
                <div key={doc.title} className="text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800 font-medium">
                  📄 {doc.title}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              This assessment is based on a single strategy session. Validate assumptions with your full leadership team and financial data before acting on recommendations.
            </p>
          </div>
        )}

        <div ref={bottomRef} />

        {sessionStarted && !documents && !isGenerating && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex items-end gap-3 p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={readyToGenerate ? "Type 'generate' to create your strategic assessment..." : "Type your response..."}
              rows={2}
              disabled={isLoading}
              className="flex-1 resize-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent leading-relaxed"
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="sm" className="shrink-0 bg-amber-600 hover:bg-amber-700">
              Send
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
