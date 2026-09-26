import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Agent } from "../agent/agent";
import { InMemoryStore } from "../memory/memory";
import { MockModelProvider } from "../providers/mock.provider";
import { ToolRegistry } from "../tools/registry";
import { calculatorTool, tenantContextTool } from "../tools/builtins";
import { z } from "zod";

export function createApp() {
  const memory = new InMemoryStore();
  const tools = new ToolRegistry();
  tools.register(calculatorTool);
  tools.register(tenantContextTool);
  const agent = new Agent(new MockModelProvider(), memory, tools);

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "256kb" }));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/tools", (_req, res) => res.json(tools.list().map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))));

  app.post("/api/agent/run", async (req, res, next) => {
    try {
      const body = z.object({
        input: z.string().min(1).max(20_000),
        sessionId: z.string().min(1).max(128).default(() => crypto.randomUUID()),
        userId: z.string().min(1).max(128),
        tenantId: z.string().min(1).max(128),
        roles: z.array(z.string()).default(["agent.user"]),
        model: z.string().optional(),
      }).parse(req.body);

      const result = await agent.run(body.input, {
        userId: body.userId,
        tenantId: body.tenantId,
        sessionId: body.sessionId,
        roles: body.roles,
      }, body.model);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : "Internal server error";
    res.status(400).json({ error: message });
  });

  return app;
}
