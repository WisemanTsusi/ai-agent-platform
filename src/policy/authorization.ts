import { AgentContext, ToolDefinition } from "../types";

export class AuthorizationError extends Error {
  constructor(message = "Tool execution is not authorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function canExecuteTool(tool: ToolDefinition, context: AgentContext): boolean {
  if (tool.permissions.length === 0) return true;
  return tool.permissions.some((permission) => context.roles.includes(permission));
}

export function authorizeTool(tool: ToolDefinition, context: AgentContext): void {
  if (!canExecuteTool(tool, context)) {
    throw new AuthorizationError(`Missing permission for tool: ${tool.name}`);
  }
}
