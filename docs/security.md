# 🔐 Security

This repository is a reference implementation, not a turnkey production deployment.

Before production use, add:

- OAuth 2.0 / OpenID Connect authentication
- short-lived access tokens and secure refresh-token rotation
- tenant isolation at service and database layers
- per-tool authorization and approval workflows for high-impact actions
- secret management through a cloud secret manager
- prompt-injection defenses and untrusted-content boundaries
- model/provider allowlists
- input/output filtering and data-loss prevention
- rate limits, quotas and spend controls
- structured audit logs and distributed tracing
- encrypted storage and transport
- human approval for irreversible or financial actions
