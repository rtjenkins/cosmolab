import Anthropic from "@anthropic-ai/sdk";
import { buildClientPortalPrompt, Message } from "@/lib/prompts";
import { ProductCategory } from "@/lib/teams";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, category } = (await request.json()) as {
      messages: Message[];
      category: ProductCategory;
    };

    const systemPrompt = buildClientPortalPrompt(category);

    const apiMessages =
      messages.length === 0
        ? [{ role: "user" as const, content: "Begin the intake session." }]
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
    console.error("Portal chat error:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
