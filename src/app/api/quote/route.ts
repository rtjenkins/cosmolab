import Anthropic from "@anthropic-ai/sdk";
import { buildQuotePrompt, Message } from "@/lib/prompts";
import { TeamId, ProductCategory } from "@/lib/teams";

export const maxDuration = 60;
const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, team, category } = (await request.json()) as {
      messages: Message[];
      team: TeamId;
      category: ProductCategory;
    };

    const systemPrompt = buildQuotePrompt(team, category);
    const conversationText = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: `Here is the discovery session:\n\n${conversationText}\n\nGenerate the indicative quote as JSON.` }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    return Response.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Quote API error:", error);
    return Response.json({ error: "Failed to generate quote" }, { status: 500 });
  }
}
