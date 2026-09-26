# 🏗️ Architecture

```text
Client
  ↓
REST API
  ↓
Agent Orchestrator
  ├── Model Provider Adapter
  ├── Tool Registry → Tool Authorization
  ├── Memory Store
  └── Run / Step Controls
```

## Design principles

- Provider-neutral model integration.
- Explicit tool registry rather than arbitrary code execution.
- Authorization before every tool invocation.
- Tenant and user context travels with every agent run.
- Memory is abstracted behind an interface so Redis/PostgreSQL/vector storage can replace the in-memory adapter.
- Deterministic mock provider keeps the repository runnable without external AI credentials.
