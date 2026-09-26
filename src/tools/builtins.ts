import { z } from "zod";
import { ToolDefinition } from "../types";

const calculatorInput = z.object({
  expression: z.string().min(1).max(200),
});

export const calculatorTool: ToolDefinition = {
  name: "calculator",
  description: "Evaluate a basic arithmetic expression using numbers and operators only.",
  inputSchema: { type: "object", properties: { expression: { type: "string" } }, required: ["expression"] },
  permissions: [],
  async execute(input) {
    const { expression } = calculatorInput.parse(input);
    if (!/^[0-9+\-*/().%\s]+$/.test(expression)) throw new Error("Expression contains unsupported characters");
    // Deliberately constrained reference implementation; do not use eval for arbitrary production input.
    const result = Function(`"use strict"; return (${expression})`)();
    if (typeof result !== "number" || !Number.isFinite(result)) throw new Error("Invalid calculation");
    return { result };
  },
};

export const tenantContextTool: ToolDefinition = {
  name: "tenant_context",
  description: "Return the authenticated tenant and user context available to the agent.",
  inputSchema: { type: "object", properties: {} },
  permissions: [],
  async execute(_input, context) {
    return { userId: context.userId, tenantId: context.tenantId, sessionId: context.sessionId, roles: context.roles };
  },
};
