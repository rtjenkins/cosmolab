/**
 * CosmoLab Institutional Memory — localStorage-based session persistence.
 * Stores up to MAX_SESSIONS completed sessions. Phase 2 will replace this
 * with a server-side database, but the interface stays the same.
 */

import { Message } from "./prompts";
import { GeneratedDocument } from "./docBuilder";

export type SessionType = "discovery" | "assessment" | "strategy" | "portal" | "it-assessment" | "regulatory-assessment";

export interface StoredSession {
  id: string;
  type: SessionType;
  /** For discovery sessions: "Sales · Skincare" etc. For others: session type label. */
  label: string;
  /** ISO date string */
  date: string;
  /** First meaningful assistant message — used as preview */
  summary: string;
  messages: Message[];
  documentTitles: string[];
  /** Optional metadata for richer search */
  meta?: {
    team?: string;
    category?: string;
    productName?: string;
    clientBrand?: string;
  };
}

const STORAGE_KEY = "cosmolab_sessions";
const MAX_SESSIONS = 50;

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function saveSession(session: StoredSession): void {
  if (!isClient()) return;
  try {
    const existing = getSessions();
    // Deduplicate by id — replace if exists
    const filtered = existing.filter((s) => s.id !== session.id);
    const updated = [session, ...filtered].slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage quota exceeded or unavailable — fail silently
  }
}

export function getSessions(): StoredSession[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession[]) : [];
  } catch {
    return [];
  }
}

export function searchSessions(query: string): StoredSession[] {
  const sessions = getSessions();
  if (!query.trim()) return sessions;
  const q = query.toLowerCase();
  return sessions.filter((s) => {
    const searchable = [
      s.label,
      s.summary,
      s.documentTitles.join(" "),
      s.meta?.team ?? "",
      s.meta?.category ?? "",
      s.meta?.productName ?? "",
      s.meta?.clientBrand ?? "",
      s.messages.map((m) => m.content).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return searchable.includes(q);
  });
}

export function deleteSession(id: string): void {
  if (!isClient()) return;
  const updated = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAllSessions(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Build a StoredSession from a completed discovery session */
export function buildDiscoverySession(
  team: string,
  teamName: string,
  category: string,
  categoryName: string,
  messages: Message[],
  documents: GeneratedDocument[]
): StoredSession {
  const firstAssistant = messages.find((m) => m.role === "assistant");
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "discovery",
    label: `${teamName} · ${categoryName}`,
    date: new Date().toISOString(),
    summary: firstAssistant
      ? firstAssistant.content.slice(0, 160).replace(/\n/g, " ") + "…"
      : "Discovery session",
    messages,
    documentTitles: documents.map((d) => d.title),
    meta: { team, category },
  };
}

export function buildTypedSession(
  type: SessionType,
  label: string,
  messages: Message[],
  documents: GeneratedDocument[],
  meta?: StoredSession["meta"]
): StoredSession {
  const firstAssistant = messages.find((m) => m.role === "assistant");
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    label,
    date: new Date().toISOString(),
    summary: firstAssistant
      ? firstAssistant.content.slice(0, 160).replace(/\n/g, " ") + "…"
      : label,
    messages,
    documentTitles: documents.map((d) => d.title),
    meta,
  };
}
