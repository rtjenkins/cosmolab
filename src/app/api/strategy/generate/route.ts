import Anthropic from "@anthropic-ai/sdk";
import { buildStrategySessionDocPrompt, Message } from "@/lib/prompts";

export const maxDuration = 120;

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] };

    const systemPrompt = buildStrategySessionDocPrompt();

    const conversationText = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Here is the complete strategy session conversation:\n\n${conversationText}\n\nGenerate all four strategic assessment documents as JSON.`,
        },
      ],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const documents = JSON.parse(jsonMatch[0]);
    return Response.json(documents);
  } catch (error) {
    console.error("Strategy generate API error:", error);
    return Response.json(
      { error: "Failed to generate strategy documents" },
      { status: 500 }
    );
  }
}
