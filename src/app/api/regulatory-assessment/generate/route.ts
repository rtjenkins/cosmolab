import Anthropic from "@anthropic-ai/sdk";
import { buildRegulatoryAssessmentDocPrompt, Message } from "@/lib/prompts";

export const maxDuration = 60;
const client = new Anthropic();

async function generateDocPair(
  systemPrompt: string,
  conversationText: string,
  doc1: string,
  doc2: string
): Promise<Array<{ title: string; sections: Array<{ heading: string; content: string }> }>> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{
      role: "user",
      content: `${conversationText}\n\nGenerate ONLY these 2 documents as JSON {"documents": [...]}: "${doc1}" and "${doc2}". Do not include any other documents.`,
    }],
  });
  const rawText = response.content[0].type === "text" ? response.content[0].text : "";
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON found for ${doc1} / ${doc2}`);
  return JSON.parse(match[0]).documents ?? [];
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] };

    const systemPrompt = buildRegulatoryAssessmentDocPrompt();
    const conversationText = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    // Run 2 parallel calls — each generates 2 documents (~25s each vs ~80s for all 4)
    const [pair1, pair2] = await Promise.all([
      generateDocPair(systemPrompt, conversationText,
        "Regulatory Maturity Assessment",
        "Compliance Modernization Roadmap"),
      generateDocPair(systemPrompt, conversationText,
        "Quality System Gap Analysis",
        "Market Expansion Regulatory Playbook"),
    ]);

    return Response.json({ documents: [...pair1, ...pair2] });
  } catch (error) {
    console.error("Regulatory assessment generate error:", error);
    return Response.json({ error: "Failed to generate regulatory assessment documents" }, { status: 500 });
  }
}
