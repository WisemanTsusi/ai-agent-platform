export type Role = "user" | "assistant" | "tool";

export interface Message {
  role: Role;
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  permissions: string[];
  execute(input: unknown, context: AgentContext): Promise<unknown>;
}

export interface AgentContext {
  userId: string;
  tenantId: string;
  sessionId: string;
  roles: string[];
  metadata?: Record<string, unknown>;
}

export interface ModelToolCall {
  id: string;
  name: string;
  input: unknown;
}

export interface ModelResponse {
  message?: string;
  toolCalls?: ModelToolCall[];
  finishReason: "stop" | "tool_calls";
}

export interface ModelProvider {
  complete(input: {
    model: string;
    messages: Message[];
    tools: ToolDefinition[];
    context: AgentContext;
  }): Promise<ModelResponse>;
}

export interface AgentRunResult {
  sessionId: string;
  output: string;
  steps: number;
  toolCalls: number;
}
