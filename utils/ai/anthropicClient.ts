import Anthropic from "@anthropic-ai/sdk";

const anthropicClient = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export const AI_FEATURES_CONFIGURED = anthropicClient !== null;

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI features are not configured: ANTHROPIC_API_KEY is not set.");
    this.name = "AiNotConfiguredError";
  }
}

const DEFAULT_MODEL = "claude-sonnet-4-5";

interface CompleteParams {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
  model?: string;
}

// Thin wrapper around a single non-streaming completion. Every caller in
// this codebase needs exactly this shape (system prompt + turn history in,
// plain text out) — a streaming API isn't used anywhere yet, so this
// deliberately doesn't expose one.
export async function completeText({ system, messages, maxTokens = 1024, model = DEFAULT_MODEL }: CompleteParams): Promise<string> {
  if (!anthropicClient) throw new AiNotConfiguredError();

  const response = await anthropicClient.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Anthropic response contained no text content.");
  }
  return textBlock.text;
}
