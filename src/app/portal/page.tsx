"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCategory, PRODUCT_CATEGORIES } from "@/lib/teams";
import { Message } from "@/lib/prompts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildWordDoc, GeneratedDocument } from "@/lib/docBuilder";
import { saveSession, buildTypedSession } from "@/lib/sessionStorage";

const CATEGORY_LABELS: Record<ProductCategory, { icon: string; consumer: string; desc: string }> = {
  skincare:    { icon: "✨", consumer: "Skincare",            desc: "Serums, moisturizers, cleansers, treatments, SPF" },
  haircare:    { icon: "💆", consumer: "Hair Care",           desc: "Shampoos, conditioners, treatments, styling products" },
  otc:         { icon: "💊", consumer: "Medicated / OTC",     desc: "Acne treatments, anti-itch, sunscreen drug products" },
  supplements: { icon: "🌿", consumer: "Wellness Supplements", desc: "Vitamins, collagen, beauty-from-within formulas" },
};

function PortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") as ProductCategory | null;

  const [category, setCategory] = useState<ProductCategory | null>(categoryParam);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documents, setDocuments] = useState<GeneratedDocument[] | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const readyToSubmit = messages.some(
    (m) => m.role === "assistant" && m.content.toLowerCase().includes("type 'submit'")
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isGenerating, documents]);

  async function startSession(cat: ProductCategory) {
    setCategory(cat);
    setSessionStarted(true);
    setIsLoading(true);
    try {
      const response = await fetch("/api/portal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], category: cat }),
      });
      await streamResponse(response, [], cat);
    } finally {
      setIsLoading(false);
    }
  }

  async function streamResponse(response: Response, currentMessages: Message[], cat?: ProductCategory) {
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
    if (!input.trim() || isLoading || !category) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    if (input.trim().toLowerCase() === "submit") {
      await generateBrief(updatedMessages);
      return;
    }

    try {
      const response = await fetch("/api/portal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, category }),
      });
      await streamResponse(response, updatedMessages);
    } finally {
      setIsLoading(false);
    }
  }

  async function generateBrief(msgs: Message[]) {
    if (!category) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const response = await fetch("/api/portal/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, category }),
      });
      const rawText = await response.text();
      let data: { documents?: GeneratedDocument[]; error?: string };
      try { data = JSON.parse(rawText); } catch {
        throw new Error(`Invalid response: ${rawText.slice(0, 200)}`);
      }
      if (!response.ok || data.error) throw new Error(data.error || `Server error: ${response.status}`);
      if (!data.documents) throw new Error("No brief returned. Please try again.");
      setDocuments(data.documents);
      setSubmitted(true);
      saveSession(buildTypedSession("portal", `Client Portal · ${CATEGORY_LABELS[category].consumer}`, msgs, data.documents, { category }));
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  }

  async function downloadBrief() {
    if (!documents || !category) return;
    setIsDownloading(true);
    try {
      const blob = await buildWordDoc(documents, "Client Project Brief", CATEGORY_LABELS[category].consumer, "CosmoLab");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CosmoLab_Client_Brief_${new Date().toISOString().slice(0, 10)}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ── Category selection screen ──────────────────────────────────────────────
  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧬</span>
              <span className="text-xl font-bold text-slate-800">CosmoLab</span>
              <Badge variant="secondary" className="text-xs">Brand Portal</Badge>
            </div>
            <span className="text-sm text-slate-400">Powered by CosmoLab AI</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Start Your Product Development Inquiry</h1>
          <p className="text-slate-500 mb-10 max-w-xl mx-auto">
            Tell us about your product idea and we&apos;ll prepare a structured project brief for our team — no technical knowledge required. The whole process takes about 10 minutes.
          </p>

          <p className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">What are you looking to develop?</p>
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
            {(Object.entries(CATEGORY_LABELS) as [ProductCategory, typeof CATEGORY_LABELS[ProductCategory]][]).map(([id, cfg]) => (
              <Card
                key={id}
                className="cursor-pointer border-2 border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all text-left"
                onClick={() => startSession(id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-2xl">{cfg.icon}</span> {cfg.consumer}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{cfg.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-slate-400">~10 minute conversation · Your brief is sent directly to our team · No commitment required</p>
        </main>
      </div>
    );
  }

  // ── Chat session screen ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🧬</span>
            <span className="font-bold text-slate-800">CosmoLab</span>
          </div>
          <div className="flex items-center gap-2">
            {category && (
              <Badge variant="secondary">
                {CATEGORY_LABELS[category].icon} {CATEGORY_LABELS[category].consumer}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">Brand Portal</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-6 flex flex-col gap-4">
        <div className="flex-1 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
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
                <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-1 animate-pulse rounded-sm" />
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

        {readyToSubmit && !documents && !isGenerating && (
          <div className="bg-blue-50 border border-blue-300 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-800 font-medium">Ready to send your project brief to our team!</span>
            <Button size="sm" onClick={() => generateBrief(messages)}>Submit Brief →</Button>
          </div>
        )}

        {isGenerating && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="text-blue-600 font-semibold mb-1">⏳ Preparing your project brief…</div>
            <div className="text-sm text-blue-400">This will only take a moment.</div>
          </div>
        )}

        {generateError && (
          <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-red-700">⚠️ {generateError}</span>
            <Button size="sm" variant="outline" onClick={() => generateBrief(messages)} className="shrink-0 ml-3">Retry</Button>
          </div>
        )}

        {documents && submitted && (
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl mb-3">✅</div>
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Your project brief has been prepared!</h2>
            <p className="text-sm text-slate-500 mb-4">
              Our team will review your brief and reach out within 1–2 business days to schedule a kickoff call.
            </p>
            <Button onClick={downloadBrief} disabled={isDownloading} className="gap-2">
              {isDownloading ? "Preparing…" : "⬇ Download Your Project Brief"}
            </Button>
            <p className="mt-4 text-xs text-slate-400">
              A copy of your project brief has been saved. No commitment is required at this stage.
            </p>
          </div>
        )}

        <div ref={bottomRef} />

        {!documents && !isGenerating && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex items-end gap-3 p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={readyToSubmit ? "Type 'submit' to send your brief…" : "Type your response…"}
              rows={2}
              disabled={isLoading}
              className="flex-1 resize-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent leading-relaxed"
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="sm" className="shrink-0">Send</Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PortalPage() {
  return <Suspense><PortalContent /></Suspense>;
}
