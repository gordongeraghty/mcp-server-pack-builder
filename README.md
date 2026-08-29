# MCP Server Pack Builder & Tool Scaffolder

A modular TypeScript toolkit and CLI for rapidly scaffolding Anthropic **Model Context Protocol (MCP)** servers, generating strict JSON tool schemas, compiling `@modelcontextprotocol/sdk` TypeScript boilerplate, and configuring `claude_desktop_config.json`.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Protocol-purple.svg)](https://modelcontextprotocol.io/)

---

## Why This Exists

Anthropic's Model Context Protocol (MCP) provides an open standard for connecting AI assistants (like Claude Desktop, IDE extensions, and autonomous agents) to external data sources and execution tools.

Writing production MCP servers requires boilerplate:
1. Constructing valid JSON Schema tool input definitions with required parameter validation.
2. Managing protocol lifecycle events (`ListToolsRequestSchema`, `CallToolRequestSchema`).
3. Configuring local process transports (`stdio`) or remote microservice transports (`sse`).
4. Writing configuration snippets for `claude_desktop_config.json`.

This package automates MCP server scaffolding with fully typed TypeScript definitions.

---

## Architecture Flow

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 260" width="100%" height="260" role="img" aria-labelledby="mcp-diag-title mcp-diag-desc" style="background:#0f172a; border-radius:8px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <title id="mcp-diag-title">Model Context Protocol Architecture Flow</title>
  <desc id="mcp-diag-desc">Diagram showing Claude Desktop client sending stdio tool calls to the MCP Server, which executes local handler functions.</desc>
  <defs>
    <linearGradient id="mcp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>

  <!-- Claude Client -->
  <rect x="30" y="80" width="200" height="100" rx="8" fill="#1e293b" stroke="#c084fc" stroke-width="2"/>
  <text x="130" y="115" fill="#f8fafc" font-size="14" font-weight="600" text-anchor="middle">Claude / AI Agent</text>
  <text x="130" y="138" fill="#94a3b8" font-size="12" text-anchor="middle">Client Application</text>
  <text x="130" y="158" fill="#c084fc" font-size="11" font-family="monospace" text-anchor="middle">claude_desktop_config</text>

  <!-- Arrow 1 -> 2 -->
  <path d="M 230 130 L 300 130" stroke="#c084fc" stroke-width="2" fill="none"/>

  <!-- MCP Protocol Transport -->
  <rect x="310" y="80" width="180" height="100" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="400" y="115" fill="#f8fafc" font-size="14" font-weight="600" text-anchor="middle">MCP Protocol</text>
  <text x="400" y="138" fill="#94a3b8" font-size="12" text-anchor="middle">JSON-RPC 2.0</text>
  <text x="400" y="158" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">stdio / SSE Transport</text>

  <!-- Arrow 2 -> 3 -->
  <path d="M 490 130 L 560 130" stroke="#38bdf8" stroke-width="2" fill="none"/>

  <!-- Generated MCP Server -->
  <rect x="570" y="80" width="200" height="100" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
  <text x="670" y="115" fill="#f8fafc" font-size="14" font-weight="600" text-anchor="middle">Custom MCP Server</text>
  <text x="670" y="138" fill="#94a3b8" font-size="12" text-anchor="middle">Typed Tool Handlers</text>
  <text x="670" y="158" fill="#34d399" font-size="11" font-family="monospace" text-anchor="middle">@modelcontextprotocol/sdk</text>
</svg>

---

## Installation & Usage

```bash
# Clone repository
git clone https://github.com/gordongeraghty/mcp-server-pack-builder.git
cd mcp-server-pack-builder

# Run CLI scaffold generator
node src/cli.ts
```

---

## Programmatic TypeScript API

```typescript
import { generateMcpServerCode, generateClaudeDesktopConfig } from 'mcp-server-pack-builder'

const config = {
  serverName: 'marketing-analytics-mcp',
  serverVersion: '1.0.0',
  transportType: 'stdio' as const,
  tools: [
    {
      id: 't_gaql',
      name: 'query_google_ads_gaql',
      description: 'Executes a Google Ads Query Language statement.',
      parameters: [
        { name: 'query', type: 'string' as const, description: 'GAQL Query', required: true },
        { name: 'customerId', type: 'string' as const, description: 'Google Ads Account ID', required: true },
      ],
    },
  ],
}

// 1. Generate full TypeScript server implementation
const serverCode = generateMcpServerCode(config)

// 2. Generate Claude Desktop configuration JSON
const claudeConfig = generateClaudeDesktopConfig(config)
```

---

## Limitations

- Generated server code targets `@modelcontextprotocol/sdk` v0.5.0+.
- Tool execution logic inside generated `switch(name)` cases requires developers to implement their specific external API or database credentials.

---

## Related Tools

- [Hosted MCP Server Pack Builder](https://gordongeraghty.com/resources/ai-engineering/mcp-server-pack-builder) — Interactive web tool builder with tabbed schema preview.
- [RAG Chunking Simulator](https://gordongeraghty.com/resources/ai-engineering/rag-chunking-simulator) — Token boundary and vector DB capacity planner.

---

## Licence

Licensed under the [MIT License](LICENSE).
