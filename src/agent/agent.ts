import { config } from "../config";
import { MemoryStore } from "../memory/memory";
import { authorizeTool } from "../policy/authorization";
import { ModelProvider, AgentContext, AgentRunResult, Message } from "../types";
import { ToolRegistry } from "../tools/registry";

export class Agent {
  constructor(
    private readonly provider: ModelProvider,
    private readonly memory: MemoryStore,
    private readonly tools: ToolRegistry,
  ) {}

  async run(input: string, context: AgentContext, model = config.defaultModel): Promise<AgentRunResult> {
    await this.memory.append(context.sessionId, { role: "user", content: input });
    let steps = 0;
    let toolCalls = 0;

    while (steps < config.maxSteps) {
      steps += 1;
      const messages = await this.memory.get(context.sessionId);
      const response = await this.provider.complete({ model, messages, tools: this.tools.list(), context });

      if (response.finishReason === "stop") {
        const output = response.message ?? "";
        await this.memory.append(context.sessionId, { role: "assistant", content: output });
        return { sessionId: context.sessionId, output, steps, toolCalls };
      }

      for (const call of response.toolCalls ?? []) {
        const tool = this.tools.list().find((candidate) => candidate.name === call.name);
        if (!tool) throw new Error(`Unknown tool: ${call.name}`);
        authorizeTool(tool, context);
        const result = await this.tools.execute(call.name, call.input, context);
        toolCalls += 1;
        const toolMessage: Message = {
          role: "tool",
          name: call.name,
          toolCallId: call.id,
          content: JSON.stringify(result),
        };
        await this.memory.append(context.sessionId, toolMessage);
      }
    }

    throw new Error(`Agent exceeded maximum step count (${config.maxSteps})`);
  }
}
