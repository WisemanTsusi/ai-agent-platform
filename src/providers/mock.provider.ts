import { ModelProvider, ModelResponse } from "../types";

/**
 * Deterministic provider used for local development and tests.
 * Replace this adapter with an approved model SDK without changing agent orchestration.
 */
export class MockModelProvider implements ModelProvider {
  async complete(input: Parameters<ModelProvider["complete"]>[0]): Promise<ModelResponse> {
    const last = input.messages[input.messages.length - 1];
    if (!last) return { message: "No input provided.", finishReason: "stop" };

    const match = last.content.match(/^\/tool\s+([\w-]+)\s+(.*)$/s);
    if (match) {
      return {
        toolCalls: [{ id: `call_${Date.now()}`, name: match[1], input: JSON.parse(match[2]) }],
        finishReason: "tool_calls",
      };
    }

    return {
      message: `Reference agent response: ${last.content}`,
      finishReason: "stop",
    };
  }
}
