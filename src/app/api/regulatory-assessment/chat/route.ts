import Anthropic from "@anthropic-ai/sdk";
import { buildRegulatoryAssessmentPrompt, Message } from "@/lib/prompts";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] };

    const systemPrompt = buildRegulatoryAssessmentPrompt();

    const apiMessages =
      messages.length === 0
        ? [{ role: "user" as const, content: "Begin the regulatory and quality assessment." }]
        : messages.map((m) => ({ role: m.role, content: m.content }));

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (error) {
    console.error("Regulatory assessment chat error:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
