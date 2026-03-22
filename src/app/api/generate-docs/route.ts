import Anthropic from "@anthropic-ai/sdk";
import { buildDocumentSystemPrompt, Message } from "@/lib/prompts";
import { TeamId, ProductCategory } from "@/lib/teams";

export const maxDuration = 60; // allow up to 2 minutes for document generation

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, team, category } = (await request.json()) as {
      messages: Message[];
      team: TeamId;
      category: ProductCategory;
    };

    const systemPrompt = buildDocumentSystemPrompt(team, category);

    // Build a summary prompt from the conversation
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
          content: `Here is the complete discovery conversation:\n\n${conversationText}\n\nGenerate all required documents as JSON.`,
        },
      ],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const documents = JSON.parse(jsonMatch[0]);
    return Response.json(documents);
  } catch (error) {
    console.error("Generate docs API error:", error);
    return Response.json({ error: "Failed to generate documents" }, { status: 500 });
  }
}
