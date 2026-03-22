import Anthropic from "@anthropic-ai/sdk";
import { buildClientPortalDocPrompt, Message } from "@/lib/prompts";
import { ProductCategory } from "@/lib/teams";

export const maxDuration = 120;
const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, category } = (await request.json()) as {
      messages: Message[];
      category: ProductCategory;
    };

    const systemPrompt = buildClientPortalDocPrompt(category);
    const conversationText = messages
      .map((m) => `${m.role === "user" ? "Brand" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: "user", content: `Here is the brand inquiry conversation:\n\n${conversationText}\n\nGenerate the Client Project Brief as JSON.` }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    return Response.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Portal generate error:", error);
    return Response.json({ error: "Failed to generate project brief" }, { status: 500 });
  }
}
