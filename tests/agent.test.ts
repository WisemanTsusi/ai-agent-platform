import { describe, expect, it } from "vitest";
import { Agent } from "../src/agent/agent";
import { InMemoryStore } from "../src/memory/memory";
import { MockModelProvider } from "../src/providers/mock.provider";
import { ToolRegistry } from "../src/tools/registry";
import { calculatorTool, tenantContextTool } from "../src/tools/builtins";

describe("Agent", () => {
  function create() {
    const registry = new ToolRegistry();
    registry.register(calculatorTool);
    registry.register(tenantContextTool);
    return new Agent(new MockModelProvider(), new InMemoryStore(), registry);
  }

  it("returns a provider response", async () => {
    const result = await create().run("hello", {
      userId: "u1", tenantId: "t1", sessionId: "s1", roles: ["agent.user"],
    });
    expect(result.output).toContain("hello");
  });

  it("executes an authorized tool", async () => {
    const result = await create().run('/tool calculator {"expression":"2 + 3 * 4"}', {
      userId: "u1", tenantId: "t1", sessionId: "s2", roles: ["agent.user"],
    });
    expect(result.toolCalls).toBe(1);
  });
});
