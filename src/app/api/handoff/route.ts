import Anthropic from "@anthropic-ai/sdk";
import { buildHandoffPrompt, HandoffKey, Message } from "@/lib/prompts";
import { ProductCategory } from "@/lib/teams";

export const maxDuration = 60;

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { handoffKey, messages, category } = (await request.json()) as {
      handoffKey: HandoffKey;
      messages: Message[];
      category: ProductCategory;
    };

    const systemPrompt = buildHandoffPrompt(handoffKey, category);

    const conversationText = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Here is the discovery session conversation:\n\n${conversationText}\n\nGenerate the pre-filled handoff document as JSON.`,
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
    console.error("Handoff API error:", error);
    return Response.json(
      { error: "Failed to generate handoff document" },
      { status: 500 }
    );
  }
}
