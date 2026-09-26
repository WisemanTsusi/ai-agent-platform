import { describe, expect, it } from "vitest";
import { ToolRegistry } from "../src/tools/registry";

describe("tool authorization", () => {
  it("rejects a tool when the required permission is missing", async () => {
    const registry = new ToolRegistry();
    registry.register({
      name: "admin_only",
      description: "Administrative tool",
      inputSchema: {},
      permissions: ["agent.admin"],
      async execute() { return { ok: true }; },
    });

    await expect(registry.execute("admin_only", {}, {
      userId: "u", tenantId: "t", sessionId: "s", roles: ["agent.user"],
    })).rejects.toThrow("Missing permission");
  });
});
