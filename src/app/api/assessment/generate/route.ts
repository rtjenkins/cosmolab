import Anthropic from "@anthropic-ai/sdk";
import { buildWorkflowAssessmentDocPrompt, Message } from "@/lib/prompts";

export const maxDuration = 60;

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] };

    const systemPrompt = buildWorkflowAssessmentDocPrompt();

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
          content: `Here is the complete workflow assessment conversation:\n\n${conversationText}\n\nGenerate all four assessment documents as JSON.`,
        },
      ],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const documents = JSON.parse(jsonMatch[0]);
    return Response.json(documents);
  } catch (error) {
    console.error("Assessment generate API error:", error);
    return Response.json(
      { error: "Failed to generate assessment documents" },
      { status: 500 }
    );
  }
}
