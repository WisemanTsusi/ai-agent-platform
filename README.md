# 🤖 AI Agent Platform

> A generic, production-oriented reference implementation for building **tool-using AI agents** with provider abstraction, memory, authorization, tenant context, step controls and API orchestration.

[![CI](https://github.com/WisemanTsusi/ai-agent-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/WisemanTsusi/ai-agent-platform/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-black?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

## 🎯 Purpose

This repository demonstrates the core engineering patterns behind an enterprise-grade agent runtime without embedding proprietary product code or depending on a commercial model provider.

## 🧩 Capabilities

- 🤖 Agent orchestration loop
- 🔌 Model-provider abstraction
- 🛠️ Tool registry and tool execution
- 🔐 Tool-level authorization
- 🧠 Session memory abstraction
- 🏢 Tenant-aware execution context
- 🧭 Maximum-step guardrails
- 📡 REST API
- 🧪 Deterministic tests
- 🐳 Docker deployment
- ⚙️ GitHub Actions CI

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │ Web / Mobile /   │
                    │ API Clients       │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ REST API         │
                    └────────┬─────────┘
                             ↓
                    ┌──────────────────┐
                    │ Agent Runtime    │
                    └──────┬───┬───────┘
                           │   │
                ┌──────────┘   └──────────┐
                ↓                         ↓
        ┌──────────────┐          ┌──────────────┐
        │ Model        │          │ Tool         │
        │ Provider     │          │ Registry     │
        └──────────────┘          └──────┬───────┘
                                         ↓
                                  ┌──────────────┐
                                  │ Authorization│
                                  └──────────────┘
                           
                    ┌──────────────────┐
                    │ Memory Store     │
                    └──────────────────┘
```

See [`docs/architecture.md`](docs/architecture.md) for design notes.

## 🔐 Authorization

Tools declare required permissions:

```typescript
permissions: ["agent.admin"]
```

The runtime checks the authenticated execution context before invoking a tool. This keeps the model from becoming the authority for what an agent is allowed to do.

## 🧠 Memory

The agent depends on a `MemoryStore` interface. The repository ships with an in-memory implementation for simplicity.

Production implementations can replace it with a durable store and, where appropriate, a vector retrieval layer without changing the orchestration contract.

## 🔌 Provider abstraction

The `ModelProvider` interface isolates model-specific SDKs from the agent runtime:

```typescript
interface ModelProvider {
  complete(input: {
    model: string;
    messages: Message[];
    tools: ToolDefinition[];
    context: AgentContext;
  }): Promise<ModelResponse>;
}
```

The included mock provider makes the repository runnable without API keys. A real provider adapter can be added behind this interface.

## 🛠️ Built-in tools

| Tool | Purpose | Permission |
|---|---|---|
| `calculator` | constrained arithmetic | none |
| `tenant_context` | expose authenticated execution context | none |

The calculator is deliberately constrained to arithmetic characters. Do not generalize the `Function` implementation into arbitrary code execution.

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/WisemanTsusi/ai-agent-platform.git
cd ai-agent-platform
```

### 2. Install

```bash
npm install
```

### 3. Configure

```bash
cp .env.example .env
```

### 4. Run tests

```bash
npm test
```

### 5. Start development

```bash
npm run dev
```

API: `http://localhost:3000`

## 🔌 API

### Health

```http
GET /health
```

### Tools

```http
GET /api/tools
```

### Run an agent

```http
POST /api/agent/run
Content-Type: application/json

{
  "input": "hello",
  "userId": "user-001",
  "tenantId": "tenant-001",
  "sessionId": "session-001",
  "roles": ["agent.user"]
}
```

To exercise the deterministic tool-calling path:

```json
{
  "input": "/tool calculator {\"expression\":\"10 * 5 + 2\"}",
  "userId": "user-001",
  "tenantId": "tenant-001",
  "sessionId": "session-001",
  "roles": ["agent.user"]
}
```

## 🐳 Docker

```bash
docker compose up --build
```

## 🧪 Engineering roadmap

- [x] Agent runtime
- [x] Tool registry
- [x] Tool authorization
- [x] Memory abstraction
- [x] Tenant context
- [x] Provider abstraction
- [x] Tests and CI
- [ ] Real model provider adapter
- [ ] Streaming responses
- [ ] Durable conversation memory
- [ ] Retrieval-augmented generation
- [ ] Tool approval workflows
- [ ] Agent-to-agent orchestration
- [ ] Usage metering and cost controls
- [ ] OpenTelemetry
- [ ] Distributed job execution
- [ ] Evaluation harness
- [ ] Prompt/version registry

## 📚 Learning objectives

**AI Engineering → Agent Runtime → Tools → Authorization → Memory → APIs → Cloud Operations**

## ⚠️ Disclaimer

This is a generic professional reference implementation. It does not contain proprietary Ceribro™, Genius Geeks, Pochette™ or other commercial platform source code.

For production security requirements, see [`docs/security.md`](docs/security.md).

## 📄 License

MIT
