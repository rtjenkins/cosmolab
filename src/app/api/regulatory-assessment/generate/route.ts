import Anthropic from "@anthropic-ai/sdk";
import { buildRegulatoryAssessmentDocPrompt, Message } from "@/lib/prompts";

export const maxDuration = 60;
const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] };

    const systemPrompt = buildRegulatoryAssessmentDocPrompt();
    const conversationText = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: `Here is the regulatory and quality assessment conversation:\n\n${conversationText}\n\nGenerate the regulatory transformation documents as JSON.` }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    return Response.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Regulatory assessment generate error:", error);
    return Response.json({ error: "Failed to generate regulatory assessment documents" }, { status: 500 });
  }
}
