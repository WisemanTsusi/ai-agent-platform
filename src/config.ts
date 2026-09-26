import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  maxSteps: Number(process.env.AGENT_MAX_STEPS ?? 8),
  defaultModel: process.env.AGENT_DEFAULT_MODEL ?? "reference-model",
};
